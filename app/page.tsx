"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import WatermarkHeader from "./components/WatermarkHeader";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
type Product = { id: string; img: string; price: number; oldPrice: number; owner_email?: string; title?: string; };

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
const [offers, setOffers] = useState<any[]>([]);

const [avatarPreview, setAvatarPreview] = useState("https://i.pravatar.cc/200?img=12");
const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
const [tempPrice, setTempPrice] = useState("");
const [tempTitle, setTempTitle] = useState("");
const avatarInputRef = useRef<HTMLInputElement>(null);
const productInputRef = useRef<HTMLInputElement>(null);
const [activeProductId, setActiveProductId] = useState<string | null>(null);

const [bio, setBio] = useState("I'm Worth CEO 🚀");
const [about, setAbout] = useState("Entrepreneur");
const [editingBio, setEditingBio] = useState(false);
const [showImageModal, setShowImageModal] = useState(false);
const [modalImage, setModalImage] = useState("");
const [modalInfo, setModalInfo] = useState<any>(null);
const [offerAmount, setOfferAmount] = useState("");

const totalWorth = products.reduce((s,p)=> s + Number(p.price), 0);
const myHandle = "@" + email.split("@")[0].toLowerCase().trim();

const loadFeed = async ()=>{
  const { data: profs } = await supabase.from("profiles").select("*").order("net_worth", {ascending:false}).limit(100);
  if(profs) setProfiles(profs.map((p:any)=>({ 
    id: p.id, email: p.email || p.handle, handle: p.handle,
    name: p.display_name || p.handle?.replace('@',''),
    avatar: p.avatar_url || "https://i.pravatar.cc/200?img=12",
    total_worth: p.net_worth || 0, bio: p.bio, about: p.about
  })));
  const { data: allProd } = await supabase.from("products").select("*").order("created_at",{ascending:false}).limit(100);
  if(allProd) setFeedProducts(allProd.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price, owner_email:p.owner_email, title:p.title || "My Item"})));
  const { data: fl } = await supabase.from("follows").select("*");
  if(fl) setFollows(fl);
  const { data: of } = await supabase.from("offers").select("*").order("created_at",{ascending:false});
  if(of) setOffers(of);
};

useEffect(()=>{
  const checkSession = async ()=>{
    const { data } = await supabase.auth.getSession();
    if(data.session?.user?.email_confirmed_at){
      const em = data.session.user.email!;
      setEmail(em); setLoggedIn(true); loadMyData(em);
    } else {
      const old = localStorage.getItem("im_session");
      if(old) { setEmail(old); setLoggedIn(true); loadMyData(old); } // keep old accounts for now
    }
    loadFeed();
  };
  checkSession();
},[]);

const loadMyData = async (em:string)=>{
  const { data } = await supabase.from("products").select("*").eq("owner_email", em).order("created_at",{ascending:false});
  if(data) setProducts(data.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price, title:p.title || "My Item"})));
  const handle = "@" + em.split("@")[0].toLowerCase().trim();
  const { data: prof } = await supabase.from("profiles").select("*").eq("handle", handle).maybeSingle();
  if(prof){ if(prof.avatar_url) setAvatarPreview(prof.avatar_url); if(prof.bio) setBio(prof.bio); if(prof.about) setAbout(prof.about); }
};

const loadPublicUser = async (user:any)=>{
  setSelectedUser(user);
  const { data } = await supabase.from("products").select("*").eq("owner_email", user.email).order("created_at",{ascending:false});
  if(data) setSelectedUserProducts(data.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price, title:p.title || "My Item"})));
  setView("publicProfile");
};

const syncProfile = async (em:string, worth:number, av:string)=>{
  if(!em || !em.includes("@")) return;
  const handle = "@" + em.split("@")[0].toLowerCase().trim();
  if(handle === "@" || handle.length < 3) return;
  const { data: existing } = await supabase.from("profiles").select("id").eq("handle", handle).maybeSingle();
  if(existing){ await supabase.from("profiles").update({ avatar_url: av, net_worth: worth, email: em, bio: bio, about: about }).eq("id", existing.id); }
  else { await supabase.from("profiles").insert({ handle: handle, display_name: em.split("@")[0], avatar_url: av, net_worth: worth, email: em, bio: bio, about: about }); }
};

const saveBio = async ()=>{
  await supabase.from("profiles").update({ bio: bio, about: about }).eq("handle", myHandle);
  setEditingBio(false); loadFeed(); alert("Bio saved ✓");
};

const doLogin = async ()=>{
  setErr("");
  if(!email.includes("@") || password.length < 6){ setErr("Valid email + 6 chars password"); return; }

  try {
    if(authMode==="signup"){
      // REAL SIGNUP WITH EMAIL CONFIRMATION
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: { handle: "@" + email.split("@")[0].toLowerCase() }
        }
      });
      if(error) throw error;

      // If email confirmation is ON, Supabase returns no session
      if(!data.session){
        setErr("✅ Verification email sent! Check your inbox & spam to confirm, then LOGIN.");
        setAuthMode("login");
        return;
      }
      
      // If auto-confirm OFF (for testing), create profile
      localStorage.setItem("im_session", email);
      await syncProfile(email, 0, avatarPreview);
      setLoggedIn(true); await loadMyData(email); await loadFeed();
      
    } else {
      // REAL LOGIN - WILL FAIL IF NOT CONFIRMED
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });
      if(error) throw error;
      
      if(!data.user?.email_confirmed_at){
        setErr("⚠️ Email not verified. Check your inbox for confirmation link.");
        await supabase.auth.signOut();
        return;
      }

      localStorage.setItem("im_session", email);
      await loadMyData(email); 
      setLoggedIn(true); 
      await loadFeed();
    }
  } catch(e:any){
    setErr(e.message);
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
    setAvatarPreview(publicUrl); await syncProfile(email, totalWorth, publicUrl); await loadFeed();
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
    setSelectedUserProducts(prev => prev.map(p=> p.id===activeProductId ? {...p, img:publicUrl} : p));
    if(modalInfo) setModalImage(publicUrl);
    await supabase.from("products").update({ img: publicUrl }).eq("id", activeProductId);
    await loadFeed();
  } catch(err:any){ alert("Product image failed: " + err.message); }
};

const addProduct = async ()=>{
  const newId = Date.now().toString();
  const newItem:Product = { id: newId, img:"https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400", price:19.99, oldPrice:59.99, title:"My Item" };
  setProducts([newItem, ...products]);
  const { data } = await supabase.from("products").insert({ owner_email: email, img: newItem.img, price: newItem.price, old_price: newItem.oldPrice, title: newItem.title }).select().single();
  if(data) setProducts(prev => prev.map(p=> p.id===newId ? {...p, id: data.id} : p));
  await loadFeed();
};

const updatePrice = async (id:string)=>{
  const num = parseFloat(tempPrice); if(isNaN(num)) { setEditingPriceId(null); return; }
  setProducts(prev => prev.map(p=> p.id===id ? {...p, price:num} : p));
  await supabase.from("products").update({ price: num }).eq("id", id);
  setEditingPriceId(null); loadFeed();
};

const updateTitle = async (id:string)=>{
  if(!tempTitle.trim()) { setEditingTitleId(null); return; }
  setProducts(prev => prev.map(p=> p.id===id ? {...p, title:tempTitle} : p));
  await supabase.from("products").update({ title: tempTitle }).eq("id", id);
  setEditingTitleId(null); loadFeed();
  if(modalInfo && modalInfo.id===id) setModalInfo({...modalInfo, title: tempTitle});
};

const handleFollow = async (targetHandle:string)=>{
  if(myHandle === targetHandle) return;
  const existing = follows.find(f=> f.follower_handle===myHandle && f.following_handle===targetHandle);
  if(existing){ await supabase.from("follows").delete().eq("id", existing.id); }
  else { await supabase.from("follows").insert({ follower_handle: myHandle, following_handle: targetHandle }); }
  loadFeed();
};

const placeOffer = async ()=>{
  if(!offerAmount || !modalInfo) return;
  const amount = parseFloat(offerAmount);
  if(isNaN(amount)){ alert("Enter valid amount"); return; }
  const toHandle = modalInfo.owner_handle || selectedUser?.handle || feedProducts.find(p=> p.id===modalInfo.id)?.owner_email;
  await supabase.from("offers").insert({ 
    product_id: modalInfo.id, 
    from_handle: myHandle, 
    to_handle: toHandle, 
    amount: amount,
    message: `Offer for ${modalInfo.title || 'item'}`
  });
  alert(`Offer $${amount} sent to ${toHandle} ✓`);
  setOfferAmount(""); setShowImageModal(false); loadFeed();
};

const openImageModal = (img:string, info:any=null)=>{
  setModalImage(img); setModalInfo(info); setShowImageModal(true); setOfferAmount("");
};

const savePhoto = ()=>{
  const link = document.createElement('a'); link.href = modalImage; link.download = `imworth-${Date.now()}.jpg`; link.target = "_blank"; link.click();
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
{showImageModal && (
<div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.97)", zIndex:9999, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px", overflowY:"auto"}}>
<img src={modalImage} style={{maxWidth:"100%", maxHeight:"50vh", borderRadius:"12px", objectFit:"contain"}}/>
<div style={{marginTop:"15px", background:"#111", padding:"12px", borderRadius:"12px", width:"100%", maxWidth:"400px", border:"1px solid #333"}}>
<div style={{fontWeight:"bold", color:"#D4AF37"}}>{modalInfo?.title || "Item"} - ${modalInfo?.price || modalInfo?.total_worth || ""}</div>
<div style={{fontSize:"11px", color:"#888"}}>{modalInfo?.email || modalInfo?.handle || ""}</div>
{modalInfo && (modalInfo.owner_email===email || modalInfo.isMine) ? (
<div style={{marginTop:"10px"}}>
<div style={{color:"#D4AF37", fontSize:"11px", fontWeight:"bold"}}>YOUR ITEM - EDIT</div>
<div style={{display:"flex", gap:"6px", marginTop:"8px"}}>
<button onClick={()=>{ setActiveProductId(modalInfo.id); productInputRef.current?.click(); }} style={{background:"#222", color:"white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px"}}>📷 Change Photo</button>
<button onClick={()=>{ setEditingTitleId(modalInfo.id); setTempTitle(modalInfo.title||""); }} style={{background:"#222", color:"white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px"}}>✏️ Rename</button>
</div>
{offers.filter(o=> o.product_id===modalInfo.id).length>0 && (
<div style={{marginTop:"10px", background:"#0a0a0a", padding:"8px", borderRadius:"8px", border:"1px solid #D4AF37"}}>
<div style={{fontSize:"11px", color:"#D4AF37", fontWeight:"bold"}}>OFFERS ({offers.filter(o=>o.product_id===modalInfo.id).length})</div>
{offers.filter(o=>o.product_id===modalInfo.id).slice(0,3).map((o:any)=>(
<div key={o.id} style={{fontSize:"11px", color:"white", marginTop:"4px"}}>{o.from_handle} offered ${o.amount}</div>
))}
</div>
)}
</div>
) : (
<div style={{marginTop:"10px"}}>
<div style={{color:"#D4AF37", fontSize:"11px", fontWeight:"bold"}}>PLACE AN OFFER / BID</div>
<div style={{display:"flex", gap:"6px", marginTop:"8px"}}>
<input value={offerAmount} onChange={e=>setOfferAmount(e.target.value)} type="number" placeholder="Your offer $" style={{flex:1, background:"#222", border:"1px solid #D4AF37", color:"white", padding:"10px", borderRadius:"8px"}}/>
<button onClick={placeOffer} style={{background:"#D4AF37", color:"black", fontWeight:"900", padding:"10px 16px", borderRadius:"8px", border:"none"}}>💰 Offer</button>
</div>
<div style={{fontSize:"10px", color:"#666", marginTop:"6px"}}>Owner will see your bid</div>
</div>
)}
</div>
<div style={{display:"flex", gap:"10px", marginTop:"15px"}}>
<button onClick={savePhoto} style={{background:"#D4AF37", color:"black", fontWeight:"900", padding:"10px 20px", borderRadius:"20px", border:"none"}}>⬇ Save</button>
<button onClick={()=>setShowImageModal(false)} style={{background:"#222", color:"white", padding:"10px 20px", borderRadius:"20px", border:"1px solid #333"}}>Close ✕</button>
</div>
</div>
)}

<input ref={avatarInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatarChange}/>
<input ref={productInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleProductImageChange}/>

{view==="publicProfile" && selectedUser && (
<div>
<div style={{display:"flex", alignItems:"center", gap:"10px", padding:"15px", borderBottom:"1px solid #222"}}><div onClick={()=>setView("accounts")} style={{cursor:"pointer"}}>←</div><div style={{color:"#D4AF37", fontWeight:"bold"}}>{selectedUser.handle}</div></div>
<div style={{padding:"20px", textAlign:"center"}}>
<img src={selectedUser.avatar} onClick={()=>openImageModal(selectedUser.avatar, {...selectedUser, isMine:false})} style={{width:"90px", height:"90px", borderRadius:"50%", border:"2px solid #D4AF37", objectFit:"cover", cursor:"pointer"}}/>
<div style={{color:"#D4AF37", fontWeight:"bold", fontSize:"20px", marginTop:"10px"}}>{selectedUser.name}</div>
<div style={{display:"flex", justifyContent:"center", gap:"20px", marginTop:"12px"}}>
<div><span style={{fontWeight:"900"}}>{follows.filter(f=>f.following_handle===selectedUser.handle).length}</span><span style={{color:"#888", fontSize:"12px"}}> Followers</span></div>
<div><span style={{fontWeight:"900"}}>{follows.filter(f=>f.follower_handle===selectedUser.handle).length}</span><span style={{color:"#888", fontSize:"12px"}}> Following</span></div>
</div>
<button onClick={()=>handleFollow(selectedUser.handle)} style={{marginTop:"12px", background: follows.some(f=> f.follower_handle===myHandle && f.following_handle===selectedUser.handle) ? "#222" : "#D4AF37", color: follows.some(f=> f.follower_handle===myHandle && f.following_handle===selectedUser.handle) ? "white" : "black", fontWeight:"900", padding:"8px 20px", borderRadius:"20px", border:"none"}}>{follows.some(f=> f.follower_handle===myHandle && f.following_handle===selectedUser.handle) ? "Following ✓" : "Follow +"}</button>
</div>
<div style={{padding:"12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px"}}>
{selectedUserProducts.map((p)=>(
<div key={p.id} onClick={()=>openImageModal(p.img, {id:p.id, img:p.img, price:p.price, title:p.title, owner_email:selectedUser.email, owner_handle:selectedUser.handle, isMine:false})} style={{background:"#111", borderRadius:"14px", overflow:"hidden", border:"1px solid #2a2a2a", cursor:"pointer"}}>
<img src={p.img} style={{width:"100%", height:"120px", objectFit:"cover"}}/>
<div style={{padding:"8px"}}><div style={{fontSize:"12px", fontWeight:"bold", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{p.title}</div><div style={{fontWeight:"900", color:"#D4AF37"}}>${Number(p.price).toFixed(2)}</div></div>
</div>
))}
</div>
</div>
)}

{view==="feed" && (
<div>
<div style={{padding:"15px", borderBottom:"1px solid #222", background:"#0a0a0a"}}>
<h2 style={{color:"#D4AF37", margin:0, fontWeight:"900"}}>🏆 FORBES LIST • IM WORTH</h2>
<div style={{color:"#888", fontSize:"11px", marginTop:"4px"}}>Live ranking • Most followers on top → Highest worth</div>
<div style={{display:"flex", gap:"10px", marginTop:"10px"}}>
<div style={{background:"#111", padding:"6px 12px", borderRadius:"20px", border:"1px solid #D4AF37", fontSize:"11px"}}>👑 {profiles.length} Moguls</div>
<div onClick={loadFeed} style={{background:"#D4AF37", padding:"6px 12px", borderRadius:"20px", fontSize:"11px", color:"black", fontWeight:"900", cursor:"pointer"}}>↻ Refresh Rank</div>
</div>
</div>

<div style={{padding:"12px"}}>
{profiles.map(p=>({
  ...p,
  followersCount: follows.filter(f=> f.following_handle===p.handle).length,
  followingCount: follows.filter(f=> f.follower_handle===p.handle).length,
})).sort((a:any,b:any)=>{
  if(b.followersCount !== a.followersCount) return b.followersCount - a.followersCount;
  return b.total_worth - a.total_worth;
}).map((u:any, i:number)=>(
<div key={u.handle} onClick={()=>{ if(u.handle===myHandle){ setView("profile"); } else { loadPublicUser(u); } }} style={{
  display:"flex", gap:"12px", 
  background: i===0 ? "#1a1a00" : u.handle===myHandle ? "#111" : "#0f0f0f",
  padding:"14px", borderRadius:"14px", marginBottom:"10px", 
  border: i===0 ? "2px solid #D4AF37" : u.handle===myHandle ? "1px solid #D4AF37" : "1px solid #222",
  cursor:"pointer", alignItems:"center"
}}>
<div style={{
  width:"32px", height:"32px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
  background: i===0 ? "#D4AF37" : i===1 ? "#C0C0C0" : i===2 ? "#CD7F32" : "#222",
  color: i<=2 ? "black" : "white", fontWeight:"900", fontSize:"13px"
}}>
{i===0 ? "👑" : `#${i+1}`}
</div>

<img src={u.avatar} style={{width:"48px", height:"48px", borderRadius:"50%", objectFit:"cover", border: i===0 ? "2px solid #D4AF37" : "1px solid #333"}}/>

<div style={{flex:1}}>
<div style={{fontWeight:"900", fontSize:"14px"}}>{u.name} {u.handle===myHandle && "(You)"} {i===0 && "• TOP"}</div>
<div style={{fontSize:"11px", color:"#888"}}>{u.handle} • {u.followersCount} followers • {u.followingCount} following</div>
<div style={{fontSize:"10px", color: i<=2 ? "#D4AF37" : "#666", marginTop:"2px"}}>{u.bio?.substring(0,35) || "Building empire"}</div>
</div>

<div style={{textAlign:"right"}}>
<div style={{color:"#D4AF37", fontWeight:"900", fontSize:"15px"}}>${Number(u.total_worth||0).toFixed(0)}</div>
<div style={{fontSize:"10px", color:"#888"}}>WORTH</div>
<div style={{fontSize:"10px", color: u.followersCount>0 ? "#00ff88" : "#666", marginTop:"2px"}}>{u.followersCount} 👥</div>
</div>
</div>
))}
</div>

<div style={{padding:"0 15px 15px 15px"}}>
<div style={{background:"#111", border:"1px solid #222", borderRadius:"12px", padding:"12px"}}>
<div style={{color:"#D4AF37", fontSize:"12px", fontWeight:"bold"}}>HOW RANKING WORKS (Supabase Auto)</div>
<div style={{color:"#888", fontSize:"11px", marginTop:"6px", lineHeight:"1.4"}}>
1. Count followers from <code>follows</code> table<br/>
2. Sort: Most followers → Top<br/>
3. Tie-breaker: Highest $ worth → Higher<br/>
4. Updates LIVE every refresh
</div>
</div>
</div>
</div>
)}

{view==="profile" && (
<div>
<div style={{display:"flex", alignItems:"center", gap:"10px", padding:"15px", borderBottom:"1px solid #222"}}><div onClick={()=>setView("accounts")} style={{cursor:"pointer"}}>←</div><div style={{color:"#D4AF37", fontWeight:"bold"}}>My Profile (Private) • {myFollowers} Followers LIVE</div></div>
<div style={{padding:"20px", textAlign:"center"}}>
<img src={avatarPreview} onClick={()=>openImageModal(avatarPreview, {handle: myHandle, bio: bio, isMine:true})} style={{width:"90px", height:"90px", borderRadius:"50%", border:"2px solid #D4AF37", cursor:"pointer", objectFit:"cover"}}/>
<div style={{color:"#D4AF37", fontWeight:"bold", fontSize:"20px", marginTop:"10px"}}>{email.split("@")[0]}</div>
</div>
<div style={{margin:"0 15px", border:"1px solid #D4AF37", borderRadius:"12px", padding:"14px"}}>
{editingBio ? (
<div>
<input value={bio} onChange={e=>setBio(e.target.value)} placeholder="Bio" style={{width:"100%", background:"#222", border:"1px solid #333", color:"white", padding:"10px", borderRadius:"8px", marginBottom:"8px"}}/>
<input value={about} onChange={e=>setAbout(e.target.value)} placeholder="About" style={{width:"100%", background:"#222", border:"1px solid #333", color:"white", padding:"10px", borderRadius:"8px", marginBottom:"8px"}}/>
<button onClick={saveBio} style={{background:"#D4AF37", color:"black", fontWeight:"900", padding:"8px 16px", borderRadius:"8px", border:"none", marginRight:"8px"}}>Save</button>
<button onClick={()=>setEditingBio(false)} style={{background:"#222", color:"white", padding:"8px 16px", borderRadius:"8px", border:"1px solid #333"}}>Cancel</button>
</div>
) : (
<div>
<div style={{display:"flex", justifyContent:"space-between"}}><div style={{color:"#D4AF37", fontWeight:"bold", fontSize:"12px"}}>ABOUT ME</div><div onClick={()=>setEditingBio(true)} style={{color:"#D4AF37", fontSize:"12px", cursor:"pointer"}}>Edit ✏️</div></div>
<div style={{color:"white", fontSize:"13px", marginTop:"6px"}}>{bio}</div>
<div style={{color:"#888", fontSize:"11px"}}>{about}</div>
</div>
)}
<div style={{marginTop:"10px", borderTop:"1px solid #222", paddingTop:"10px", display:"flex", justifyContent:"space-between"}}>
<div><div style={{color:"#888", fontSize:"10px"}}>NET WORTH</div><div style={{color:"#D4AF37", fontWeight:"900", fontSize:"20px"}}>$ {totalWorth.toFixed(2)}</div></div>
<div><div style={{color:"#888", fontSize:"10px"}}>OFFERS RECEIVED</div><div style={{color:"white", fontWeight:"900"}}>{offers.filter(o=> o.to_handle===myHandle).length}</div></div>
</div>
</div>

<div style={{padding:"12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginTop:"10px"}}>
{products.map((p)=>(
<div key={p.id} style={{background:"#111", borderRadius:"14px", overflow:"hidden", border:"1px solid #2a2a2a", position:"relative"}}>
<img src={p.img} onClick={()=>openImageModal(p.img, {id:p.id, img:p.img, price:p.price, title:p.title, owner_email:email, isMine:true})} style={{width:"100%", height:"100px", objectFit:"cover", cursor:"pointer"}}/>
<div style={{padding:"6px"}}>
{editingTitleId===p.id ? (
<div style={{display:"flex", gap:"4px"}}><input value={tempTitle} onChange={e=>setTempTitle(e.target.value)} autoFocus style={{width:"90px", background:"#222", border:"1px solid #D4AF37", color:"white", borderRadius:"6px", padding:"4px", fontSize:"11px"}}/><button onClick={()=>updateTitle(p.id)} style={{background:"#D4AF37", border:"none", borderRadius:"6px", padding:"4px 6px", fontSize:"10px"}}>OK</button></div>
) : (
<div onClick={()=>{setEditingTitleId(p.id); setTempTitle(p.title||"");}} style={{fontSize:"11px", fontWeight:"bold", cursor:"pointer", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{p.title} ✏️</div>
)}
{editingPriceId===p.id ? (
<div style={{display:"flex", gap:"4px", marginTop:"4px"}}><input value={tempPrice} onChange={e=>setTempPrice(e.target.value)} autoFocus type="number" style={{width:"60px", background:"#222", border:"1px solid #D4AF37", color:"white", borderRadius:"6px", padding:"4px"}}/><button onClick={()=>updatePrice(p.id)} style={{background:"#D4AF37", border:"none", borderRadius:"6px", padding:"4px 6px"}}>OK</button></div>
) : (
<div onClick={()=>{setEditingPriceId(p.id); setTempPrice(p.price.toString());}} style={{fontWeight:"900", fontSize:"12px", color:"#D4AF37", cursor:"pointer"}}>$ {Number(p.price).toFixed(2)} ✏️</div>
)}
</div>
<div style={{position:"absolute", top:"6px", right:"6px", display:"flex", gap:"4px"}}>
<button onClick={()=>{setActiveProductId(p.id); productInputRef.current?.click();}} style={{background:"rgba(0,0,0,0.7)", border:"none", color:"white", borderRadius:"50%", width:"24px", height:"24px", fontSize:"12px"}}>📷</button>
<button onClick={async()=>{setProducts(products.filter(x=>x.id!==p.id)); await supabase.from("products").delete().eq("id", p.id); loadFeed();}} style={{background:"rgba(255,0,0,0.7)", border:"none", color:"white", borderRadius:"50%", width:"20px", height:"20px"}}>×</button>
</div>
{offers.filter(o=>o.product_id===p.id).length>0 && <div style={{position:"absolute", bottom:"50px", left:"6px", background:"#D4AF37", color:"black", fontSize:"9px", fontWeight:"900", padding:"2px 6px", borderRadius:"10px"}}>{offers.filter(o=>o.product_id===p.id).length} OFFERS</div>}
</div>
))}
<div onClick={addProduct} style={{background:"#0a0a0a", border:"2px dashed #D4AF37", borderRadius:"14px", height:"120px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer"}}>+ Add</div>
</div>
</div>
)}

{view==="accounts" && (
<div>
<div style={{padding:"15px"}}>
<h2 style={{color:"#D4AF37", margin:0}}>SIM WORTH Users 🔍</h2>
<input placeholder="Search @username..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%", marginTop:"12px", background:"#111", border:"1px solid #333", color:"white", padding:"12px", borderRadius:"12px"}}/>
<div style={{marginTop:"10px", display:"flex", gap:"10px"}}>
<div style={{background:"#111", padding:"8px 12px", borderRadius:"20px", border:"1px solid #333", fontSize:"12px"}}>👥 {myFollowers} Followers LIVE</div>
<div style={{background:"#111", padding:"8px 12px", borderRadius:"20px", border:"1px solid #D4AF37", fontSize:"12px", color:"#D4AF37"}}>💰 {offers.filter(o=>o.to_handle===myHandle).length} Offers</div>
</div>
</div>
<div style={{padding:"15px"}}>
{filteredProfiles.map((u:any)=>(
<div key={u.handle} onClick={()=>{ if(u.handle===myHandle){ setView("profile"); } else { loadPublicUser(u); } }} style={{display:"flex", gap:"10px", background: u.handle===myHandle ? "#1a1a0a" : "#111", padding:"12px", borderRadius:"12px", marginBottom:"10px", border: u.handle===myHandle ? "1px solid #D4AF37" : "1px solid #333", cursor:"pointer"}}>
<img src={u.avatar} style={{width:"44px", height:"44px", borderRadius:"50%", objectFit:"cover"}}/>
<div style={{flex:1}}><div style={{fontWeight:"bold"}}>{u.name} {u.handle===myHandle && "(You)"}</div><div style={{fontSize:"11px", color:"#888"}}>{u.handle} • {follows.filter(f=>f.following_handle===u.handle).length} followers</div></div>
<div style={{color:"#D4AF37", fontWeight:"bold"}}>${Number(u.total_worth||0).toFixed(2)}</div>
</div>
))}
</div>
</div>
)}

<div style={{position:"fixed", bottom:0, left:0, right:0, maxWidth:"480px", margin:"0 auto", background:"black", borderTop:"1px solid #D4AF37", display:"flex", justifyContent:"space-around", padding:"10px"}}>
<div onClick={()=>setView("accounts")} style={{color: view==="accounts" ? "#D4AF37" : "#888", cursor:"pointer"}}>👤 Search</div>
<div onClick={()=>setView("feed")} style={{color: view==="feed" ? "#D4AF37" : "#888", cursor:"pointer", fontWeight: view==="feed" ? "900" : "normal"}}>🏆 Forbes</div>
<div onClick={()=>setView("profile")} style={{color: view==="profile" ? "#D4AF37" : "#888", cursor:"pointer"}}>💎 Profile ({myFollowers})</div>
<div onClick={()=>{localStorage.removeItem("im_session"); setLoggedIn(false);}} style={{color:"#888", cursor:"pointer"}}>Logout</div>
</div>
</div>
);
}
