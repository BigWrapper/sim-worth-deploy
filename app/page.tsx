"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
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
const [search, setSearch] = useState("");
const [selectedUser, setSelectedUser] = useState<any>(null);
const [selectedUserProducts, setSelectedUserProducts] = useState<Product[]>([]);
const [follows, setFollows] = useState<any[]>([]);

const [avatarPreview, setAvatarPreview] = useState("https://i.pravatar.cc/200?img=12");
const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
const [tempPrice, setTempPrice] = useState("");
const avatarInputRef = useRef<HTMLInputElement>(null);
const productInputRef = useRef<HTMLInputElement>(null);
const [activeProductId, setActiveProductId] = useState<string | null>(null);

// NEW: Bio + Modals
const [bio, setBio] = useState("I'm Worth CEO 🚀");
const [about, setAbout] = useState("Entrepreneur • Building my net worth on IM WORTH");
const [editingBio, setEditingBio] = useState(false);
const [showImageModal, setShowImageModal] = useState(false);
const [modalImage, setModalImage] = useState("");
const [modalInfo, setModalInfo] = useState<any>(null);

const totalWorth = products.reduce((s,p)=> s + Number(p.price), 0);
const myHandle = "@" + email.split("@")[0].toLowerCase().trim();

const loadFeed = async ()=>{
  const { data: profs } = await supabase.from("profiles").select("*").order("net_worth", {ascending:false}).limit(100);
  if(profs) setProfiles(profs.map((p:any)=>({ 
    id: p.id, email: p.email || p.handle, handle: p.handle,
    name: p.display_name || p.handle?.replace('@',''),
    avatar: p.avatar_url || "https://i.pravatar.cc/200?img=12",
    total_worth: p.net_worth || 0,
    bio: p.bio || "I'm Worth CEO 🚀",
    about: p.about || "Entrepreneur",
    location: p.location || "South Africa"
  })));
  const { data: allProd } = await supabase.from("products").select("*").order("created_at",{ascending:false}).limit(100);
  if(allProd) setFeedProducts(allProd.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price, owner_email:p.owner_email})));
  const { data: fl } = await supabase.from("follows").select("*");
  if(fl) setFollows(fl);
};

useEffect(()=>{
  const session = localStorage.getItem("im_session");
  if(session){ setEmail(session); setLoggedIn(true); loadMyData(session); }
  loadFeed();
},[]);

const loadMyData = async (em:string)=>{
  const { data } = await supabase.from("products").select("*").eq("owner_email", em).order("created_at",{ascending:false});
  if(data) setProducts(data.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price})));
  const handle = "@" + em.split("@")[0].toLowerCase().trim();
  const { data: prof } = await supabase.from("profiles").select("*").eq("handle", handle).maybeSingle();
  if(prof){ 
    if(prof.avatar_url) setAvatarPreview(prof.avatar_url);
    if(prof.bio) setBio(prof.bio);
    if(prof.about) setAbout(prof.about);
  }
};

const loadPublicUser = async (user:any)=>{
  setSelectedUser(user);
  const { data } = await supabase.from("products").select("*").eq("owner_email", user.email).order("created_at",{ascending:false});
  if(data) setSelectedUserProducts(data.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price})));
  setView("publicProfile");
};

const syncProfile = async (em:string, worth:number, av:string)=>{
  if(!em || !em.includes("@")) return;
  const handle = "@" + em.split("@")[0].toLowerCase().trim();
  if(handle === "@" || handle.length < 3) return;
  const { data: existing } = await supabase.from("profiles").select("id").eq("handle", handle).maybeSingle();
  if(existing){
    await supabase.from("profiles").update({ avatar_url: av, net_worth: worth, email: em, bio: bio, about: about }).eq("id", existing.id);
  } else {
    await supabase.from("profiles").insert({ handle: handle, display_name: em.split("@")[0], avatar_url: av, net_worth: worth, email: em, bio: bio, about: about });
  }
};

const saveBio = async ()=>{
  await supabase.from("profiles").update({ bio: bio, about: about }).eq("handle", myHandle);
  setEditingBio(false);
  loadFeed();
  alert("Bio saved ✓");
};

const doLogin = async ()=>{
  setErr("");
  if(!email.includes("@") || password.length < 3){ setErr("Valid email + 3 chars"); return; }
  const handle = "@" + email.split("@")[0].toLowerCase().trim();
  const key = `im_user_${email}`;
  const saved = localStorage.getItem(key);
  const { data: existingProfile } = await supabase.from("profiles").select("id").eq("handle", handle).maybeSingle();
  if(authMode==="signup"){
    if(saved || existingProfile){ setErr("Account exists - LOGIN"); setAuthMode("login"); return; }
    localStorage.setItem(key, password);
    localStorage.setItem("im_session", email);
    await syncProfile(email, 0, avatarPreview);
    setLoggedIn(true); await loadMyData(email); await loadFeed();
  } else {
    if(saved){ if(saved!==password){ setErr("Wrong password"); return; } }
    else { if(!existingProfile){ setErr("No account - SIGN UP"); setAuthMode("signup"); return; } localStorage.setItem(key, password); }
    localStorage.setItem("im_session", email);
    await loadMyData(email); setLoggedIn(true); await loadFeed();
  }
};

const handleAvatarChange = async (e:any)=>{
  const file = e.target.files?.[0]; if(!file) return;
  setAvatarPreview(URL.createObjectURL(file));
  try {
    const safeEmail = email.replace(/[^a-z0-9]/gi, '_');
    const fileName = `${safeEmail}/${Date.now()}.jpg`;
    await supabase.storage.from('avatars').upload(fileName, file, { upsert: true, contentType: file.type });
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    const publicUrl = data.publicUrl + `?t=${Date.now()}`;
    setAvatarPreview(publicUrl);
    await syncProfile(email, totalWorth, publicUrl);
    await loadFeed();
  } catch(err:any){ alert("Upload failed: " + err.message); }
};

const handleProductImageChange = async (e:any)=>{
  const file = e.target.files?.[0]; if(!file || !activeProductId) return;
  try {
    const safeEmail = email.replace(/[^a-z0-9]/gi, '_');
    const fileName = `${safeEmail}/product_${activeProductId}_${Date.now()}.jpg`;
    await supabase.storage.from('avatars').upload(fileName, file, { upsert: true, contentType: file.type });
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    const publicUrl = data.publicUrl + `?t=${Date.now()}`;
    setProducts(prev => prev.map(p=> p.id===activeProductId ? {...p, img:publicUrl} : p));
    await supabase.from("products").update({ img: publicUrl }).eq("id", activeProductId);
    await loadFeed();
  } catch(err:any){ alert("Product image failed: " + err.message); }
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
  setEditingPriceId(null); loadFeed();
};

const handleFollow = async (targetHandle:string)=>{
  if(myHandle === targetHandle) return;
  const existing = follows.find(f=> f.follower_handle===myHandle && f.following_handle===targetHandle);
  if(existing){ await supabase.from("follows").delete().eq("id", existing.id); }
  else { await supabase.from("follows").insert({ follower_handle: myHandle, following_handle: targetHandle }); }
  loadFeed();
};

const openImageModal = (img:string, info:any=null)=>{
  setModalImage(img);
  setModalInfo(info);
  setShowImageModal(true);
};

const savePhoto = ()=>{
  const link = document.createElement('a');
  link.href = modalImage;
  link.download = `imworth-${Date.now()}.jpg`;
  link.target = "_blank";
  link.click();
};

const filteredProfiles = profiles.filter(p=> p.handle.toLowerCase().includes(search.toLowerCase()) || p.name.toLowerCase().includes(search.toLowerCase()));
const myFollowers = follows.filter(f=> f.following_handle===myHandle).length;
const myFollowing = follows.filter(f=> f.follower_handle===myHandle).length;

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

return(
<div style={{minHeight:"100vh", background:"black", color:"white", maxWidth:"480px", margin:"0 auto", paddingBottom:"80px"}}>
{/* IMAGE MODAL */}
{showImageModal && (
<div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.95)", zIndex:9999, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px"}}>
<img src={modalImage} style={{maxWidth:"100%", maxHeight:"70vh", borderRadius:"12px", objectFit:"contain"}}/>
{modalInfo && (
<div style={{marginTop:"15px", background:"#111", padding:"12px", borderRadius:"12px", width:"100%", maxWidth:"400px", border:"1px solid #333"}}>
<div style={{fontWeight:"bold", color:"#D4AF37"}}>{modalInfo.price ? `$ ${modalInfo.price}` : modalInfo.handle}</div>
<div style={{fontSize:"12px", color:"#888", marginTop:"4px"}}>{modalInfo.email || modalInfo.about || ""}</div>
{modalInfo.bio && <div style={{fontSize:"12px", color:"white", marginTop:"6px"}}>{modalInfo.bio}</div>}
</div>
)}
<div style={{display:"flex", gap:"10px", marginTop:"20px"}}>
<button onClick={savePhoto} style={{background:"#D4AF37", color:"black", fontWeight:"900", padding:"10px 20px", borderRadius:"20px", border:"none"}}>⬇ Save Photo</button>
<button onClick={()=>setShowImageModal(false)} style={{background:"#222", color:"white", padding:"10px 20px", borderRadius:"20px", border:"1px solid #333"}}>Close ✕</button>
</div>
</div>
)}

{view==="publicProfile" && selectedUser && (
<div>
<div style={{display:"flex", alignItems:"center", gap:"10px", padding:"15px", borderBottom:"1px solid #222"}}><div onClick={()=>setView("accounts")} style={{cursor:"pointer"}}>←</div><div style={{color:"#D4AF37", fontWeight:"bold"}}>{selectedUser.handle}</div></div>
<div style={{padding:"20px", textAlign:"center"}}>
<img src={selectedUser.avatar} onClick={()=>openImageModal(selectedUser.avatar, selectedUser)} style={{width:"90px", height:"90px", borderRadius:"50%", border:"2px solid #D4AF37", objectFit:"cover", cursor:"pointer"}}/>
<div style={{color:"#D4AF37", fontWeight:"bold", fontSize:"20px", marginTop:"10px"}}>{selectedUser.name}</div>
<div style={{color:"white", fontSize:"13px", marginTop:"6px"}}>{selectedUser.bio}</div>
<div style={{color:"#888", fontSize:"11px", marginTop:"4px"}}>{selectedUser.about} • {selectedUser.location}</div>
<div style={{display:"flex", justifyContent:"center", gap:"20px", marginTop:"12px"}}>
<div><span style={{fontWeight:"900", color:"white"}}>{follows.filter(f=>f.following_handle===selectedUser.handle).length}</span><span style={{color:"#888", fontSize:"12px"}}> Followers</span></div>
<div><span style={{fontWeight:"900", color:"white"}}>{follows.filter(f=>f.follower_handle===selectedUser.handle).length}</span><span style={{color:"#888", fontSize:"12px"}}> Following</span></div>
<div><span style={{fontWeight:"900", color:"#D4AF37"}}>${selectedUser.total_worth.toFixed(2)}</span><span style={{color:"#888", fontSize:"12px"}}> Worth</span></div>
</div>
<button onClick={()=>handleFollow(selectedUser.handle)} style={{marginTop:"12px", background: follows.some(f=> f.follower_handle===myHandle && f.following_handle===selectedUser.handle) ? "#222" : "#D4AF37", color: follows.some(f=> f.follower_handle===myHandle && f.following_handle===selectedUser.handle) ? "white" : "black", fontWeight:"900", padding:"8px 20px", borderRadius:"20px", border:"none"}}>{follows.some(f=> f.follower_handle===myHandle && f.following_handle===selectedUser.handle) ? "Following ✓" : "Follow +"}</button>
<div style={{marginTop:"15px", background:"#111", border:"1px solid #222", borderRadius:"12px", padding:"12px", textAlign:"left"}}>
<div style={{color:"#D4AF37", fontWeight:"bold", fontSize:"12px"}}>ABOUT</div>
<div style={{color:"white", fontSize:"12px", marginTop:"6px"}}>{selectedUser.about}</div>
<div style={{color:"#888", fontSize:"11px", marginTop:"4px"}}>{selectedUser.bio}</div>
</div>
</div>
<div style={{padding:"12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px"}}>
{selectedUserProducts.map((p)=>(
<div key={p.id} onClick={()=>openImageModal(p.img, {price: p.price, email: selectedUser.handle, about: `Owner: ${selectedUser.handle}`})} style={{background:"#111", borderRadius:"14px", overflow:"hidden", border:"1px solid #2a2a2a", cursor:"pointer"}}>
<img src={p.img} style={{width:"100%", height:"120px", objectFit:"cover"}}/>
<div style={{padding:"8px", fontWeight:"900"}}>$ {Number(p.price).toFixed(2)}</div>
</div>
))}
</div>
</div>
)}

{view==="feed" && (
<div>
<div style={{padding:"15px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #222"}}><h2 style={{color:"#D4AF37", margin:0}}>Live Feed 🌍</h2><div onClick={loadFeed} style={{color:"#D4AF37", cursor:"pointer"}}>↻</div></div>
<div style={{padding:"15px"}}>
{feedProducts.map((p:any)=>(
<div key={p.id} onClick={()=>openImageModal(p.img, {price: p.price, email: p.owner_email})} style={{display:"flex", gap:"10px", background:"#111", padding:"12px", borderRadius:"12px", marginBottom:"8px", border:"1px solid #222", cursor:"pointer"}}>
<img src={p.img} style={{width:"60px", height:"60px", borderRadius:"8px", objectFit:"cover"}}/>
<div style={{flex:1}}><div style={{fontWeight:"bold", color:"#D4AF37"}}>${p.price}</div><div style={{fontSize:"11px", color:"#888"}}>{p.owner_email}</div></div>
</div>
))}
</div>
</div>
)}

{view==="profile" && (
<div>
<input ref={avatarInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatarChange}/>
<input ref={productInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleProductImageChange}/>
<div style={{display:"flex", alignItems:"center", gap:"10px", padding:"15px", borderBottom:"1px solid #222"}}><div onClick={()=>setView("accounts")} style={{cursor:"pointer"}}>←</div><div style={{color:"#D4AF37", fontWeight:"bold"}}>My Profile (Private)</div></div>
<div style={{padding:"20px", textAlign:"center"}}>
<img src={avatarPreview} onClick={()=>openImageModal(avatarPreview, {handle: myHandle, bio: bio, about: about})} style={{width:"90px", height:"90px", borderRadius:"50%", border:"2px solid #D4AF37", cursor:"pointer", objectFit:"cover"}}/>
<div style={{color:"#D4AF37", fontWeight:"bold", fontSize:"20px", marginTop:"10px"}}>{email.split("@")[0]}</div>
<div style={{display:"flex", justifyContent:"center", gap:"20px", marginTop:"10px"}}>
<div style={{background:"#111", padding:"8px 14px", borderRadius:"20px", border:"1px solid #333"}}><span style={{fontWeight:"900", color:"white"}}>{myFollowers}</span><span style={{color:"#888", fontSize:"12px"}}> Followers LIVE</span></div>
<div style={{background:"#111", padding:"8px 14px", borderRadius:"20px", border:"1px solid #333"}}><span style={{fontWeight:"900", color:"white"}}>{myFollowing}</span><span style={{color:"#888", fontSize:"12px"}}> Following</span></div>
</div>
<div style={{color:"#00A651", fontSize:"11px", marginTop:"8px"}}>Tap pic for full view • Followers update live</div>
</div>

<div style={{margin:"0 15px", border:"1px solid #D4AF37", borderRadius:"12px", padding:"14px"}}>
{editingBio ? (
<div>
<input value={bio} onChange={e=>setBio(e.target.value)} placeholder="Your bio" style={{width:"100%", background:"#222", border:"1px solid #333", color:"white", padding:"10px", borderRadius:"8px", marginBottom:"8px"}}/>
<input value={about} onChange={e=>setAbout(e.target.value)} placeholder="About you" style={{width:"100%", background:"#222", border:"1px solid #333", color:"white", padding:"10px", borderRadius:"8px", marginBottom:"8px"}}/>
<button onClick={saveBio} style={{background:"#D4AF37", color:"black", fontWeight:"900", padding:"8px 16px", borderRadius:"8px", border:"none", marginRight:"8px"}}>Save Bio ✓</button>
<button onClick={()=>setEditingBio(false)} style={{background:"#222", color:"white", padding:"8px 16px", borderRadius:"8px", border:"1px solid #333"}}>Cancel</button>
</div>
) : (
<div>
<div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}><div style={{color:"#D4AF37", fontWeight:"bold", fontSize:"12px"}}>ABOUT ME</div><div onClick={()=>setEditingBio(true)} style={{color:"#D4AF37", fontSize:"12px", cursor:"pointer"}}>Edit ✏️</div></div>
<div style={{color:"white", fontSize:"13px", marginTop:"8px"}}>{bio}</div>
<div style={{color:"#888", fontSize:"11px", marginTop:"4px"}}>{about}</div>
</div>
)}
<div style={{marginTop:"12px", display:"flex", justifyContent:"space-between", borderTop:"1px solid #222", paddingTop:"10px"}}>
<div><div style={{color:"#888", fontSize:"10px"}}>TOTAL NET WORTH</div><div style={{color:"#D4AF37", fontWeight:"900", fontSize:"20px"}}>$ {totalWorth.toFixed(2)}</div></div>
<div style={{textAlign:"right"}}><div style={{color:"#888", fontSize:"10px"}}>LOCATION</div><div style={{color:"white", fontSize:"12px"}}>South Africa</div></div>
</div>
</div>

<div style={{padding:"12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginTop:"10px"}}>
{products.map((p)=>(
<div key={p.id} style={{background:"#111", borderRadius:"14px", overflow:"hidden", border:"1px solid #2a2a2a", position:"relative"}}>
<img src={p.img} onClick={()=>openImageModal(p.img, {price: p.price, email: email})} style={{width:"100%", height:"120px", objectFit:"cover", cursor:"pointer"}}/>
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
<div onClick={addProduct} style={{background:"#0a0a0a", border:"2px dashed #D4AF37", borderRadius:"14px", height:"120px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer"}}>+ Add Item</div>
</div>
</div>
)}

{view==="accounts" && (
<div>
<div style={{padding:"15px"}}>
<h2 style={{color:"#D4AF37", margin:0}}>SIM WORTH Users 🔍</h2>
<input placeholder="Search @username..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%", marginTop:"12px", background:"#111", border:"1px solid #333", color:"white", padding:"12px", borderRadius:"12px"}}/>
<div style={{marginTop:"10px", display:"flex", gap:"10px"}}>
<div style={{background:"#111", padding:"8px 12px", borderRadius:"20px", border:"1px solid #333", fontSize:"12px"}}>👥 {myFollowers} Followers (live)</div>
<div style={{background:"#111", padding:"8px 12px", borderRadius:"20px", border:"1px solid #333", fontSize:"12px"}}>🔍 {filteredProfiles.length} Users</div>
</div>
</div>
<div style={{padding:"15px"}}>
{filteredProfiles.map((u:any)=>(
<div key={u.handle} onClick={()=>{ if(u.handle===myHandle){ setView("profile"); } else { loadPublicUser(u); } }} style={{display:"flex", gap:"10px", background: u.handle===myHandle ? "#1a1a0a" : "#111", padding:"12px", borderRadius:"12px", marginBottom:"10px", border: u.handle===myHandle ? "1px solid #D4AF37" : "1px solid #333", cursor:"pointer"}}>
<img src={u.avatar} style={{width:"44px", height:"44px", borderRadius:"50%", objectFit:"cover"}}/>
<div style={{flex:1}}><div style={{fontWeight:"bold"}}>{u.name} {u.handle===myHandle && "(You)"}</div><div style={{fontSize:"11px", color:"#888"}}>{u.handle} • {follows.filter(f=>f.following_handle===u.handle).length} followers • {u.bio?.substring(0,30)}</div></div>
<div style={{color:"#D4AF37", fontWeight:"bold"}}>${Number(u.total_worth||0).toFixed(2)}</div>
</div>
))}
</div>
</div>
)}

<div style={{position:"fixed", bottom:0, left:0, right:0, maxWidth:"480px", margin:"0 auto", background:"black", borderTop:"1px solid #D4AF37", display:"flex", justifyContent:"space-around", padding:"10px"}}>
<div onClick={()=>setView("accounts")} style={{color: view==="accounts" ? "#D4AF37" : "#888", fontWeight: view==="accounts" ? "bold" : "normal", cursor:"pointer"}}>👤 Search</div>
<div onClick={()=>setView("feed")} style={{color: view==="feed" ? "#D4AF37" : "#888", fontWeight: view==="feed" ? "bold" : "normal", cursor:"pointer"}}>🌍 Feed</div>
<div onClick={()=>setView("profile")} style={{color: view==="profile" ? "#D4AF37" : "#888", fontWeight: view==="profile" ? "bold" : "normal", cursor:"pointer"}}>💎 Profile ({myFollowers})</div>
<div onClick={()=>{localStorage.removeItem("im_session"); setLoggedIn(false);}} style={{color:"#888", cursor:"pointer"}}>Logout</div>
</div>
</div>
);
}
