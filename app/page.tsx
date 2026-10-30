"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Product = { id: string; img: string; price: number; oldPrice: number; owner_email?: string; };

export default function FullApp(){
const [loggedIn, setLoggedIn] = useState(false);
const [view, setView] = useState("accounts");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [authMode, setAuthMode] = useState("login");
const [err, setErr] = useState("");

const [products, setProducts] = useState<Product[]>([]);
const [profiles, setProfiles] = useState<any[]>([]);
const [feedProducts, setFeedProducts] = useState<Product[]>([]);

const [avatarPreview, setAvatarPreview] = useState("https://i.pravatar.cc/200?img=12");
const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
const [tempPrice, setTempPrice] = useState("");
const avatarInputRef = useRef<HTMLInputElement>(null);
const productInputRef = useRef<HTMLInputElement>(null);
const [activeProductId, setActiveProductId] = useState<string | null>(null);

const totalWorth = products.reduce((s,p)=> s + Number(p.price), 0);

const loadFeed = async ()=>{
  const { data: profs } = await supabase.from("profiles").select("*").order("net_worth", {ascending:false}).limit(50);
  if(profs) setProfiles(profs.map((p:any)=>({ 
    id: p.id, 
    email: p.handle,
    handle: p.handle,
    name: p.handle?.replace('@',''),
    avatar: p.avatar_url || "https://i.pravatar.cc/200?img=12",
    total_worth: p.net_worth || 0
  })));
  const { data: allProd } = await supabase.from("products").select("*").order("created_at",{ascending:false}).limit(50);
  if(allProd) setFeedProducts(allProd.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price, owner_email:p.owner_email})));
};

useEffect(()=>{
  const session = localStorage.getItem("im_session");
  if(session){ setEmail(session); setLoggedIn(true); loadMyData(session); }
  loadFeed();
},[]);

const loadMyData = async (em:string)=>{
  const { data } = await supabase.from("products").select("*").eq("owner_email", em).order("created_at", {ascending:false});
  if(data) setProducts(data.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price})));
  const handle = "@" + em.split("@")[0].toLowerCase();
  const { data: prof } = await supabase.from("profiles").select("*").eq("handle", handle).maybeSingle();
  if(prof?.avatar_url){
    setAvatarPreview(prof.avatar_url);
  }
};

const syncProfile = async (em:string, worth:number, av:string)=>{
  const handle = "@" + em.split("@")[0].toLowerCase();
  const { data: existing } = await supabase.from("profiles").select("id").eq("handle", handle).maybeSingle();
  if(existing){
    await supabase.from("profiles").update({ avatar_url: av, net_worth: worth }).eq("id", existing.id);
  } else {
    await supabase.from("profiles").insert({ handle: handle, display_name: em.split("@")[0], avatar_url: av, net_worth: worth });
  }
};

const doLogin = async ()=>{
  setErr("");
  if(!email.includes("@") || password.length < 3){ setErr("Valid email + 3 chars"); return; }
  
  const handle = "@" + email.split("@")[0].toLowerCase().trim();
  const key = `im_user_${email}`;
  const saved = localStorage.getItem(key);

  // Always check Supabase for real account existence
  const { data: existingProfile } = await supabase.from("profiles").select("id").eq("handle", handle).maybeSingle();

  if(authMode==="signup"){
    // If exists in phone OR in Supabase -> don't create again
    if(saved || existingProfile){
      setErr("Account already exists - please LOGIN"); 
      setAuthMode("login"); 
      return; 
    }
    // New account
    localStorage.setItem(key, password);
    localStorage.setItem("im_session", email);
    await syncProfile(email, 0, avatarPreview);
    setLoggedIn(true); 
    await loadMyData(email);
    await loadFeed();
    
  } else {
    // LOGIN MODE
    if(saved){
      // Has local password, check it
      if(saved!==password){ setErr("Wrong password"); return; }
    } else {
      // No local password (reinstall / new phone) - but check if profile exists in Supabase
      if(!existingProfile){ 
        setErr("No account found - please SIGN UP"); 
        setAuthMode("signup");
        return; 
      }
      // Profile exists in cloud, let them in and recreate local password
      localStorage.setItem(key, password);
    }
    
    localStorage.setItem("im_session", email);
    await loadMyData(email);
    setLoggedIn(true); 
    await loadFeed();
  }
};

const handleAvatarChange = async (e:any)=>{
  const file = e.target.files?.[0]; if(!file) return;
  const tempUrl = URL.createObjectURL(file);
  setAvatarPreview(tempUrl);
  try {
    const safeEmail = email.replace(/[^a-z0-9]/gi, '_');
    const fileName = `${safeEmail}/${Date.now()}.jpg`;
    const { error } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true, contentType: file.type });
    if(error) throw error;
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    const publicUrl = data.publicUrl + `?t=${Date.now()}`;
    setAvatarPreview(publicUrl);
    await syncProfile(email, totalWorth, publicUrl);
    await loadFeed();
  } catch(err:any){
    alert("Avatar upload failed: " + err.message);
  }
};

// FIXED GRID: Upload to storage, not base64
const handleProductImageChange = async (e:any)=>{
  const file = e.target.files?.[0]; if(!file || !activeProductId) return;
  try {
    const safeEmail = email.replace(/[^a-z0-9]/gi, '_');
    const fileName = `${safeEmail}/product_${activeProductId}_${Date.now()}.jpg`;
    // Use avatars bucket too, so you don't need new bucket
    const { error } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true, contentType: file.type });
    if(error) throw error;
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    const publicUrl = data.publicUrl + `?t=${Date.now()}`;
    setProducts(prev => prev.map(p=> p.id===activeProductId ? {...p, img:publicUrl} : p));
    await supabase.from("products").update({ img: publicUrl }).eq("id", activeProductId);
    await loadFeed();
  } catch(err:any){
    alert("Product image failed: " + err.message);
  }
};

const addProduct = async ()=>{
  const newId = Date.now().toString();
  const newItem:Product = { id: newId, img:"https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400", price:19.99, oldPrice:59.99 };
  setProducts([newItem, ...products]);
  const { data } = await supabase.from("products").insert({ owner_email: email, img: newItem.img, price: newItem.price, old_price: newItem.oldPrice }).select().single();
  if(data) setProducts(prev => prev.map(p=> p.id===newId ? {...p, id: data.id} : p));
  await loadFeed();
};

const updatePrice = async (id:string)=>{
  const num = parseFloat(tempPrice); if(isNaN(num)) { setEditingPriceId(null); return; }
  setProducts(prev => prev.map(p=> p.id===id ? {...p, price:num} : p));
  await supabase.from("products").update({ price: num }).eq("id", id);
  setEditingPriceId(null); 
  loadFeed();
};

if(!loggedIn){
return(
<div style={{minHeight:"100vh", background:"black", display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"80px", padding:"20px"}}>
<h1 style={{margin:0, fontSize:"56px", fontWeight:"900"}}><span style={{color:"#D4AF37"}}>$</span><span style={{color:"white"}}>IM</span></h1>
<div style={{color:"#D4AF37", fontSize:"32px", fontWeight:"900", letterSpacing:"6px"}}>WORTH</div>
<div style={{width:"100%", maxWidth:"360px", marginTop:"40px", border:"1px solid #333", borderRadius:"24px", background:"#0a0a0a", padding:"24px"}}>
{err && <div style={{color:"#f87171", fontSize:"12px", marginBottom:"12px", textAlign:"center"}}>{err}</div>}
<input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%", background:"#141414", border:"1px solid #222", color:"white", padding:"14px", borderRadius:"12px", marginBottom:"12px"}}/>
<input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:"100%", background:"#141414", border:"1px solid #222", color:"white", padding:"14px", borderRadius:"12px", marginBottom:"20px"}}/>
<button onClick={doLogin} style={{width:"100%", background:"#D4AF37", color:"black", fontWeight:"900", padding:"14px", borderRadius:"12px", border:"none"}}>{authMode==="signup"?"SIGN UP →":"LOGIN →"}</button>
<div style={{textAlign:"center", color:"#666", fontSize:"13px", marginTop:"16px"}} onClick={()=>setAuthMode(authMode==="signup"?"login":"signup")}>{authMode==="signup"?"Have account? Login":"No account? Sign Up"}</div>
</div>
</div>
);
}

if(view==="feed"){
return(
<div style={{minHeight:"100vh", background:"black", color:"white", maxWidth:"480px", margin:"0 auto", paddingBottom:"80px"}}>
<div style={{padding:"15px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #222"}}><h2 style={{color:"#D4AF37", margin:0}}>Live Feed 🌍</h2><div onClick={loadFeed} style={{color:"#D4AF37", cursor:"pointer"}}>↻ Refresh</div></div>
<div style={{padding:"15px"}}>
{feedProducts.map((p:any)=>(
<div key={p.id} style={{display:"flex", gap:"10px", background:"#111", padding:"12px", borderRadius:"12px", marginBottom:"8px", border:"1px solid #222"}}>
<img src={p.img} style={{width:"60px", height:"60px", borderRadius:"8px", objectFit:"cover"}}/>
<div style={{flex:1}}><div style={{fontWeight:"bold", color:"#D4AF37"}}>${p.price}</div><div style={{fontSize:"11px", color:"#888"}}>{p.owner_email}</div></div>
</div>
))}
</div>
<div style={{position:"fixed", bottom:0, left:0, right:0, maxWidth:"480px", margin:"0 auto", background:"black", borderTop:"1px solid #D4AF37", display:"flex", justifyContent:"space-around", padding:"10px"}}>
<div onClick={()=>setView("accounts")} style={{color:"#888", cursor:"pointer"}}>👤 Accounts</div>
<div onClick={()=>setView("feed")} style={{color:"#D4AF37", fontWeight:"bold", cursor:"pointer"}}>🌍 Feed</div>
<div onClick={()=>setView("profile")} style={{color:"#888", cursor:"pointer"}}>💎 Profile</div>
</div>
</div>
);
}

if(view==="profile"){
return(
<div style={{minHeight:"100vh", background:"black", color:"white", maxWidth:"480px", margin:"0 auto", paddingBottom:"90px"}}>
<input ref={avatarInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatarChange}/>
<input ref={productInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleProductImageChange}/>
<div style={{display:"flex", alignItems:"center", gap:"10px", padding:"15px", borderBottom:"1px solid #222"}}><div onClick={()=>setView("accounts")} style={{cursor:"pointer"}}>←</div><div style={{color:"#D4AF37", fontWeight:"bold"}}>{email}</div></div>
<div style={{padding:"20px", textAlign:"center"}}>
<img src={avatarPreview} onClick={()=>avatarInputRef.current?.click()} style={{width:"90px", height:"90px", borderRadius:"50%", border:"2px solid #D4AF37", cursor:"pointer", objectFit:"cover"}}/>
<div style={{color:"#D4AF37", fontWeight:"bold", fontSize:"20px", marginTop:"10px"}}>{email.split("@")[0]}</div>
<div style={{color:"#666", fontSize:"11px", marginTop:"5px"}}>Tap pic to change</div>
</div>
<div style={{margin:"0 15px", border:"1px solid #D4AF37", borderRadius:"12px", padding:"14px", display:"flex", justifyContent:"space-between"}}>
<div><div style={{color:"#888", fontSize:"10px"}}>TOTAL NET WORTH</div><div style={{color:"#D4AF37", fontWeight:"900", fontSize:"22px"}}>$ {totalWorth.toFixed(2)}</div></div>
<div style={{color:"#00A651", fontSize:"12px"}}>Synced ✓</div>
</div>
<div style={{padding:"12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px"}}>
{products.map((p)=>(
<div key={p.id} style={{background:"#111", borderRadius:"14px", overflow:"hidden", border:"1px solid #2a2a2a", position:"relative"}}>
<img src={p.img} onClick={()=>{setActiveProductId(p.id); productInputRef.current?.click();}} style={{width:"100%", height:"120px", objectFit:"cover", cursor:"pointer"}}/>
<div style={{padding:"8px"}}>
{editingPriceId===p.id ? (
<div style={{display:"flex", gap:"4px"}}><input value={tempPrice} onChange={e=>setTempPrice(e.target.value)} autoFocus type="number" style={{width:"70px", background:"#222", border:"1px solid #D4AF37", color:"white", borderRadius:"6px", padding:"4px"}}/><button onClick={()=>updatePrice(p.id)} style={{background:"#D4AF37", border:"none", borderRadius:"6px", padding:"4px 8px"}}>OK</button></div>
) : (
<div onClick={()=>{setEditingPriceId(p.id); setTempPrice(p.price.toString());}} style={{fontWeight:"900", cursor:"pointer"}}>$ {Number(p.price).toFixed(2)} ✏️</div>
)}
</div>
<button onClick={async()=>{setProducts(products.filter(x=>x.id!==p.id)); await supabase.from("products").delete().eq("id", p.id); loadFeed();}} style={{position:"absolute", top:"6px", left:"6px", background:"rgba(255,0,0,0.7)", border:"none", color:"white", borderRadius:"50%", width:"20px", height:"20px"}}>×</button>
</div>
))}
<div onClick={addProduct} style={{background:"#0a0a0a", border:"2px dashed #D4AF37", borderRadius:"14px", height:"120px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer"}}>+ Add</div>
</div>
<div style={{position:"fixed", bottom:0, left:0, right:0, maxWidth:"480px", margin:"0 auto", background:"black", borderTop:"1px solid #D4AF37", display:"flex", justifyContent:"space-around", padding:"10px"}}>
<div onClick={()=>setView("accounts")} style={{color:"#888"}}>👤 Accounts</div>
<div onClick={()=>setView("feed")} style={{color:"#888"}}>🌍 Feed</div>
<div onClick={()=>setView("profile")} style={{color:"#D4AF37", fontWeight:"bold"}}>💎 Profile</div>
</div>
</div>
);
}

return(
<div style={{minHeight:"100vh", background:"black", color:"white", maxWidth:"480px", margin:"0 auto", paddingBottom:"80px"}}>
<div style={{padding:"15px"}}><h2 style={{color:"#D4AF37", margin:0}}>Accounts • Live: {profiles.length} users</h2></div>
<div style={{padding:"15px"}}>
{profiles.map((u:any)=>(
<div key={u.email} onClick={()=>{setEmail(u.handle.replace('@','')+'@gmail.com'); setView("profile"); loadMyData(u.handle.replace('@','')+'@gmail.com');}} style={{display:"flex", gap:"10px", background:"#111", padding:"12px", borderRadius:"12px", marginBottom:"10px", border:"1px solid #333", cursor:"pointer"}}>
<img src={u.avatar} style={{width:"44px", height:"44px", borderRadius:"50%", objectFit:"cover"}}/>
<div style={{flex:1}}><div style={{fontWeight:"bold"}}>{u.name}</div><div style={{fontSize:"11px", color:"#888"}}>{u.handle}</div></div>
<div style={{color:"#D4AF37", fontWeight:"bold"}}>${Number(u.total_worth||0).toFixed(2)}</div>
</div>
))}
</div>
<div style={{position:"fixed", bottom:0, left:0, right:0, maxWidth:"480px", margin:"0 auto", background:"black", borderTop:"1px solid #D4AF37", display:"flex", justifyContent:"space-around", padding:"10px"}}>
<div onClick={()=>setView("accounts")} style={{color:"#D4AF37", fontWeight:"bold"}}>👤 Accounts</div>
<div onClick={()=>setView("feed")} style={{color:"#888", cursor:"pointer"}}>🌍 Feed</div>
<div onClick={()=>setView("profile")} style={{color:"#888", cursor:"pointer"}}>💎 Profile</div>
<div onClick={()=>{localStorage.removeItem("im_session"); setLoggedIn(false);}} style={{color:"#888"}}>Logout</div>
</div>
</div>
);
}
