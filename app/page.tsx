"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
type Product = { id: string; img: string; price: number; oldPrice: number; owner_email?: string; title?: string; };

const casinoStyles = `
@keyframes floatCash {
  0% { transform: translateY(100vh) rotate(0deg) scale(0.5); opacity:0; }
  10% { opacity:1; }
  90% { opacity:1; }
  100% { transform: translateY(-100px) rotate(360deg) scale(1.2); opacity:0; }
}
@keyframes glowPulse {
  0%,100% { text-shadow: 0 0 10px #D4AF37, 0 0 20px #D4AF37, 0 0 40px #D4AF37; transform: scale(1); }
  50% { text-shadow: 0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 60px #FFD700; transform: scale(1.05); }
}
@keyframes goldShine {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes slotSpin {
  0% { transform: translateY(5px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(5px); }
}
@keyframes bgMove {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
}
.floating-cash {
  position: fixed;
  font-size: 24px;
  font-weight: 900;
  color: #D4AF37;
  text-shadow: 0 0 10px #FFD700;
  animation: floatCash linear infinite;
  pointer-events: none;
  z-index: 1;
}
.casino-glow {
  animation: glowPulse 2s ease-in-out infinite;
}
.gold-text {
  background: linear-gradient(90deg, #D4AF37 0%, #FFD700 25%, #FFF 50%, #FFD700 75%, #D4AF37 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: goldShine 3s linear infinite;
}
.slot-number {
  animation: slotSpin 0.8s ease-in-out infinite;
  display: inline-block;
}
`;

function WatermarkHeader({ avatarPreview, totalWorth, onAvatarClick, myHandle, userLocation, userLat, userLng, streetAddress, suburb, city, payLink, payHandle, payMethod }: any) {
  const handlePayMe = () => {
    if (payLink && payLink.startsWith("http")) { window.open(payLink, '_blank'); return; }
    if (payHandle) { window.open(`https://pay.capitecbank.co.za/${payHandle}`, '_blank'); return; }
    alert("Setup Pay Me in Edit Profile!");
  };
  const handleVisitMe = () => {
    const finalAddress = streetAddress && suburb ? `${streetAddress}, ${suburb}, ${city}` : userLocation;
    if (userLat && userLng) { window.location.href = `geo:${userLat},${userLng}?q=${userLat},${userLng}(${encodeURIComponent(finalAddress || myHandle)})`; }
    else if (finalAddress) { window.location.href = `geo:0,0?q=${encodeURIComponent(finalAddress)}`; }
  };
  return (
    <div style={{background:"radial-gradient(ellipse at center, #1a1a00 0%, #000 70%)", padding:"10px", border:"2px solid #D4AF37", borderRadius:"20px", margin:"10px", boxShadow:"0 0 30px rgba(212,175,55,0.4), inset 0 0 20px rgba(212,175,55,0.1)", position:"relative", overflow:"hidden"}}>
      <div style={{position:"absolute", inset:0, background:"linear-gradient(45deg, transparent 30%, rgba(212,175,55,0.1) 50%, transparent 70%)", animation:"goldShine 2s infinite"}}></div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", position:"relative", zIndex:2}}>
        <div style={{textAlign:"center"}}>
          <img src="/sim_banc.png" onClick={handlePayMe} style={{width:"85px", height:"85px", objectFit:"contain", cursor:"pointer", filter:"drop-shadow(0 0 10px gold)"}} alt="banc"/>
          <div onClick={handlePayMe} style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px", cursor:"pointer", background:"rgba(212,175,55,0.2)", boxShadow:"0 0 10px gold"}}>Pay Me</div>
        </div>
        <div style={{textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center"}}>
          <div style={{background:"black", border:"1px solid gold", color:"gold", fontSize:"8px", padding:"3px 8px", borderRadius:"20px", fontWeight:"900", marginBottom:"6px", boxShadow:"0 0 10px gold"}}>SIM Worth</div>
          <img src={avatarPreview} onClick={onAvatarClick} style={{width:"95px", height:"95px", borderRadius:"50%", border:"3px solid gold", objectFit:"cover", cursor:"pointer", boxShadow:"0 0 20px gold, 0 0 40px rgba(212,175,55,0.5)"}} alt="avatar"/>
        </div>
        <div style={{textAlign:"center"}}>
          <img src="/sim_maps.png" onClick={handleVisitMe} style={{width:"85px", height:"85px", objectFit:"contain", cursor:"pointer", filter:"drop-shadow(0 0 10px gold)"}} alt="maps"/>
          <div onClick={handleVisitMe} style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px", cursor:"pointer", background:"rgba(212,175,55,0.2)"}}>Visit Me</div>
        </div>
      </div>
      <div style={{textAlign:"center", marginTop:"10px", position:"relative", zIndex:2}}><div className="casino-glow" style={{color:"gold", fontWeight:"900", fontSize:"16px"}}>@{myHandle}</div></div>
      <div style={{marginTop:"12px", border:"2px solid gold", borderRadius:"14px", padding:"12px", display:"flex", justifyContent:"center", alignItems:"center", background:"radial-gradient(circle, #1a1a00, #000)", boxShadow:"inset 0 0 20px rgba(212,175,55,0.3), 0 0 20px rgba(212,175,55,0.2)", position:"relative", zIndex:2}}>
        <div style={{textAlign:"center"}}><div style={{color:"#888", fontSize:"10px", letterSpacing:"2px"}}>💎 SIM WORTH JACKPOT 💎</div><div className="gold-text" style={{fontWeight:"900", fontSize:"32px"}}>$ {totalWorth.toFixed(2)}</div></div>
      </div>
    </div>
  );
}

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
const [messages, setMessages] = useState<any[]>([]);
const [avatarPreview, setAvatarPreview] = useState("https://i.pravatar.cc/200?img=12");
const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
const [tempPrice, setTempPrice] = useState("");
const [tempTitle, setTempTitle] = useState("");
const avatarInputRef = useRef<HTMLInputElement>(null);
const productInputRef = useRef<HTMLInputElement>(null);
const chatImageRef = useRef<HTMLInputElement>(null);
const [activeProductId, setActiveProductId] = useState<string | null>(null);
const [bio, setBio] = useState("Im Totally Worthed!");
const [about, setAbout] = useState("Entrepreneur");
const [editingBio, setEditingBio] = useState(false);
const [showImageModal, setShowImageModal] = useState(false);
const [modalImage, setModalImage] = useState("");
const [modalInfo, setModalInfo] = useState<any>(null);
const [offerAmount, setOfferAmount] = useState("");
const [payMethod, setPayMethod] = useState("capitec");
const [payHandle, setPayHandle] = useState("");
const [payLink, setPayLink] = useState("");
const [userLocation, setUserLocation] = useState("");
const [userLat, setUserLat] = useState("");
const [userLng, setUserLng] = useState("");
const [streetAddress, setStreetAddress] = useState("");
const [suburb, setSuburb] = useState("");
const [city, setCity] = useState("Uptize");
const [myId, setMyId] = useState("");
const [chatUser, setChatUser] = useState<any>(null);
const [chatText, setChatText] = useState("");
const [showChat, setShowChat] = useState(false);

const totalWorth = products.reduce((s,p)=> s + Number(p.price), 0);
const myHandle = "@" + email.split("@")[0].toLowerCase().trim();

const openInSimMaps = (lat?:string, lng?:string, address?:string) => {
  let geoUrl = ""; if(lat && lng && lat.trim() !== ""){ geoUrl = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(address || userLocation || "My Location")})`; }
  else if(address){ geoUrl = `geo:0,0?q=${encodeURIComponent(address)}`; } else { alert("Add address first bro!"); return; }
  window.location.href = geoUrl;
};

const loadFeed = async ()=>{
  const { data: profs } = await supabase.from("profiles").select("*").order("net_worth", {ascending:false}).limit(100);
  if(profs) setProfiles(profs.map((p:any)=>({ id: p.id, email: p.email || p.handle, handle: p.handle, name: p.display_name || p.handle?.replace('@',''), avatar: p.avatar_url || "https://i.pravatar.cc/200?img=12", total_worth: p.net_worth || 0, bio: p.bio, about: p.about, location: p.location, latitude: p.latitude, longitude: p.longitude, pay_method: p.pay_method, pay_handle: p.pay_handle, pay_link: p.pay_link })));
  const { data: allProd } = await supabase.from("products").select("*").order("created_at",{ascending:false}).limit(100);
  if(allProd) setFeedProducts(allProd.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price, owner_email:p.owner_email, title:p.title || "My Item"})));
  const { data: fl } = await supabase.from("follows").select("*"); if(fl) setFollows(fl);
  const { data: of } = await supabase.from("offers").select("*").order("created_at",{ascending:false}); if(of) setOffers(of);
  const { data: ms } = await supabase.from("messages").select("*").order("created_at",{ascending:true}).limit(200); if(ms) setMessages(ms);
};

useEffect(()=>{
  const checkSession = async ()=>{
    const { data } = await supabase.auth.getSession();
    if(data.session?.user?.email_confirmed_at){ const em = data.session.user.email!; setEmail(em); setMyId(data.session.user.id); setLoggedIn(true); loadMyData(em); }
    else { const old = localStorage.getItem("im_session"); if(old) { setEmail(old); setLoggedIn(true); loadMyData(old); } }
    loadFeed();
  };
  checkSession();
},[]);

const loadMyData = async (em:string)=>{
  const { data } = await supabase.from("products").select("*").eq("owner_email", em).order("created_at",{ascending:false});
  if(data) setProducts(data.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price, title:p.title || "My Item"})));
  const handle = "@" + em.split("@")[0].toLowerCase().trim();
  const { data: prof } = await supabase.from("profiles").select("*").eq("handle", handle).maybeSingle();
  if(prof){ if(prof.avatar_url) setAvatarPreview(prof.avatar_url); if(prof.bio) setBio(prof.bio); if(prof.about) setAbout(prof.about); if(prof.pay_method) setPayMethod(prof.pay_method); if(prof.pay_handle) setPayHandle(prof.pay_handle); if(prof.pay_link) setPayLink(prof.pay_link); if(prof.location) { setUserLocation(prof.location); const parts = prof.location.split(','); if(parts.length >= 2){ setStreetAddress(parts[0].trim()); setSuburb(parts[1].trim()); if(parts[2]) setCity(parts[2].trim()); } } if(prof.latitude) setUserLat(prof.latitude.toString()); if(prof.longitude) setUserLng(prof.longitude.toString()); if(prof.id) setMyId(prof.id); }
};

const loadPublicUser = async (user:any)=>{
  setSelectedUser(user); const { data } = await supabase.from("products").select("*").eq("owner_email", user.email).order("created_at",{ascending:false});
  if(data) setSelectedUserProducts(data.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price, title:p.title || "My Item"}))); setView("publicProfile");
};

const syncProfile = async (em:string, worth:number, av:string)=>{
  if(!em || !em.includes("@")) return; const handle = "@" + em.split("@")[0].toLowerCase().trim(); if(handle === "@" || handle.length < 3) return;
  const fullAddr = streetAddress && suburb ? `${streetAddress}, ${suburb}, ${city}` : userLocation;
  const { data: existing } = await supabase.from("profiles").select("id").eq("handle", handle).maybeSingle();
  if(existing){ await supabase.from("profiles").update({ avatar_url: av, net_worth: worth, email: em, bio: bio, about: about, pay_method: payMethod, pay_handle: payHandle, pay_link: payLink, location: fullAddr, latitude: userLat ? parseFloat(userLat) : null, longitude: userLng ? parseFloat(userLng) : null }).eq("id", existing.id); }
  else { await supabase.from("profiles").insert({ handle: handle, display_name: em.split("@")[0], avatar_url: av, net_worth: worth, email: em, bio: bio, about: about, pay_method: payMethod, pay_handle: payHandle, pay_link: payLink, location: fullAddr, latitude: userLat ? parseFloat(userLat) : null, longitude: userLng ? parseFloat(userLng) : null }); }
};

const saveBio = async ()=>{ const fullAddr = streetAddress && suburb ? `${streetAddress}, ${suburb}, ${city}` : userLocation; await supabase.from("profiles").update({ bio: bio, about: about, pay_method: payMethod, pay_handle: payHandle, pay_link: payLink, location: fullAddr, latitude: userLat ? parseFloat(userLat) : null, longitude: userLng ? parseFloat(userLng) : null }).eq("handle", myHandle); setEditingBio(false); loadFeed(); alert("Profile Saved ✓"); };

const doLogin = async ()=>{
  setErr(""); if(!email.includes("@") || password.length < 6){ setErr("Valid email + 6 chars"); return; }
  try {
    if(authMode==="signup"){
      const { data, error } = await supabase.auth.signUp({ email: email.trim().toLowerCase(), password: password, options: { data: { handle: "@" + email.split("@")[0].toLowerCase() } } });
      if(error) throw error; if(!data.session){ setErr("✅ Verification email sent! Check inbox & spam, then LOGIN."); setAuthMode("login"); return; }
      localStorage.setItem("im_session", email); await syncProfile(email, 0, avatarPreview); setLoggedIn(true); await loadMyData(email); await loadFeed();
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: password });
      if(error) throw error; if(!data.user?.email_confirmed_at){ setErr("⚠️ Email not verified."); await supabase.auth.signOut(); return; }
      localStorage.setItem("im_session", email); setMyId(data.user.id); await loadMyData(email); setLoggedIn(true); await loadFeed();
    }
  } catch(e:any){ setErr(e.message); }
};

const handleAvatarChange = async (e:any)=>{ const file = e.target.files?.[0]; if(!file) return; setAvatarPreview(URL.createObjectURL(file)); try { const safeEmail = email.replace(/[^a-z0-9]/gi, '_'); const fileName = `${safeEmail}/${Date.now()}.jpg`; await supabase.storage.from('avatars').upload(fileName, file, { upsert: true, contentType: file.type }); const { data } = supabase.storage.from('avatars').getPublicUrl(fileName); const publicUrl = data.publicUrl + `?t=${Date.now()}`; setAvatarPreview(publicUrl); await syncProfile(email, totalWorth, publicUrl); await loadFeed(); } catch(err:any){ alert("Upload failed: " + err.message); } };
const handleProductImageChange = async (e:any)=>{ const file = e.target.files?.[0]; if(!file || !activeProductId) return; try { const safeEmail = email.replace(/[^a-z0-9]/gi, '_'); const fileName = `${safeEmail}/product_${activeProductId}_${Date.now()}.jpg`; await supabase.storage.from('avatars').upload(fileName, file, { upsert: true, contentType: file.type }); const { data } = supabase.storage.from('avatars').getPublicUrl(fileName); const publicUrl = data.publicUrl + `?t=${Date.now()}`; setProducts(prev => prev.map(p=> p.id===activeProductId ? {...p, img:publicUrl} : p)); setSelectedUserProducts(prev => prev.map(p=> p.id===activeProductId ? {...p, img:publicUrl} : p)); if(modalInfo) setModalImage(publicUrl); await supabase.from("products").update({ img: publicUrl }).eq("id", activeProductId); await loadFeed(); } catch(err:any){ alert("Product image failed: " + err.message); } };
const handleChatImage = async (e:any)=>{ const file = e.target.files?.[0]; if(!file || !chatUser) return; try { const safeEmail = email.replace(/[^a-z0-9]/gi, '_'); const fileName = `${safeEmail}/chat_${Date.now()}.jpg`; await supabase.storage.from('avatars').upload(fileName, file, { upsert: true, contentType: file.type }); const { data } = supabase.storage.from('avatars').getPublicUrl(fileName); const publicUrl = data.publicUrl + `?t=${Date.now()}`; await supabase.from("messages").insert({ from_handle: myHandle, to_handle: chatUser.handle, image_url: publicUrl, text: "📷 Image" }); loadFeed(); } catch(err:any){ alert("Image failed: "+err); } };
const addProduct = async ()=>{ const newId = Date.now().toString(); const newItem:Product = { id: newId, img:"https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400", price:19.99, oldPrice:59.99, title:"My Item" }; setProducts([newItem, ...products]); const { data } = await supabase.from("products").insert({ owner_email: email, img: newItem.img, price: newItem.price, old_price: newItem.oldPrice, title: newItem.title }).select().single(); if(data) setProducts(prev => prev.map(p=> p.id===newId ? {...p, id: data.id} : p)); await loadFeed(); };
const updatePrice = async (id:string)=>{ const num = parseFloat(tempPrice); if(isNaN(num)) { setEditingPriceId(null); return; } setProducts(prev => prev.map(p=> p.id===id ? {...p, price:num} : p)); await supabase.from("products").update({ price: num }).eq("id", id); setEditingPriceId(null); loadFeed(); };
const updateTitle = async (id:string)=>{ if(!tempTitle.trim()) { setEditingTitleId(null); return; } setProducts(prev => prev.map(p=> p.id===id ? {...p, title:tempTitle} : p)); await supabase.from("products").update({ title: tempTitle }).eq("id", id); setEditingTitleId(null); loadFeed(); if(modalInfo && modalInfo.id===id) setModalInfo({...modalInfo, title: tempTitle}); };
const handleFollow = async (targetHandle:string)=>{ if(myHandle === targetHandle) return; const existing = follows.find(f=> f.follower_handle===myHandle && f.following_handle===targetHandle); if(existing){ setFollows(prev => prev.filter(f=> f.id !== existing.id)); await supabase.from("follows").delete().eq("id", existing.id); } else { const temp = { id: Date.now().toString(), follower_handle: myHandle, following_handle: targetHandle }; setFollows(prev => [...prev, temp]); const { data } = await supabase.from("follows").insert({ follower_handle: myHandle, following_handle: targetHandle }).select().single(); if(data){ setFollows(prev => prev.map(f=> f.id===temp.id ? data : f)); } } };
const placeOffer = async ()=>{ if(!offerAmount || !modalInfo) return; const amount = parseFloat(offerAmount); const toHandle = modalInfo.owner_handle || selectedUser?.handle; await supabase.from("offers").insert({ product_id: modalInfo.id, from_handle: myHandle, to_handle: toHandle, amount: amount, message: `Offer for ${modalInfo.title || 'item'}` }); alert(`Offer $${amount} sent to ${toHandle} ✓`); setOfferAmount(""); setShowImageModal(false); loadFeed(); };
const sendChatMessage = async ()=>{ if(!chatText.trim() || !chatUser) return; const msg = chatText; setChatText(""); setMessages(prev => [...prev, { id: Date.now().toString(), from_handle: myHandle, to_handle: chatUser.handle, text: msg, created_at: new Date().toISOString() }]); await supabase.from("messages").insert({ from_handle: myHandle, to_handle: chatUser.handle, text: msg }); loadFeed(); };
const openImageModal = (img:string, info:any=null)=>{ setModalImage(img); setModalInfo(info); setShowImageModal(true); setOfferAmount(""); };
const savePhoto = ()=>{ const link = document.createElement('a'); link.href = modalImage; link.download = `imworth-${Date.now()}.jpg`; link.target = "_blank"; link.click(); };
const filteredProfiles = profiles.filter(p=> p.handle.toLowerCase().includes(search.toLowerCase()) || p.name.toLowerCase().includes(search.toLowerCase()));
const myFollowers = follows.filter(f=> f.following_handle===myHandle).length;
const myOffers = offers.filter(o=> o.to_handle===myHandle);
const myOffersCount = myOffers.length;

if(!loggedIn){
return(
<div style={{minHeight:"100vh", background:"radial-gradient(ellipse at top, #1a1a00 0%, #000 100%)", display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"60px", padding:"20px", position:"relative", overflow:"hidden"}}>
<style>{casinoStyles}</style>
{[...Array(12)].map((_,i)=>(<div key={i} className="floating-cash" style={{left:`${i*8+2}%`, animationDelay:`${i*0.7}s`, animationDuration:`${4+i%3}s`}}>{["$","💵","💰","$"][i%4]}</div>))}
<h1 className="casino-glow" style={{margin:0, fontSize:"64px", fontWeight:"900"}}><span style={{color:"#D4AF37"}}>$</span><span style={{color:"white"}}>IM</span></h1>
<div className="gold-text" style={{fontSize:"36px", fontWeight:"900", letterSpacing:"8px"}}>WORTH</div>
<div style={{width:"100%", maxWidth:"360px", marginTop:"40px", border:"2px solid #D4AF37", borderRadius:"24px", background:"rgba(10,10,0,0.8)", padding:"24px", boxShadow:"0 0 40px rgba(212,175,55,0.3)"}}>
{err && <div style={{color:"#f87171", fontSize:"12px", marginBottom:"12px", textAlign:"center"}}>{err}</div>}
<input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%", background:"#141414", border:"1px solid #D4AF37", color:"white", padding:"14px", borderRadius:"12px", marginBottom:"12px"}}/>
<input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:"100%", background:"#141414", border:"1px solid #D4AF37", color:"white", padding:"14px", borderRadius:"12px", marginBottom:"20px"}}/>
<button onClick={doLogin} className="casino-glow" style={{width:"100%", background:"linear-gradient(90deg, #D4AF37, #FFD700)", color:"black", fontWeight:"900", padding:"14px", borderRadius:"12px", border:"none", fontSize:"16px"}}>{authMode==="signup"?"🎰 SIGN UP JACKPOT →":"💰 LOGIN →"}</button>
<div style={{textAlign:"center", color:"#D4AF37", fontSize:"13px", marginTop:"16px", cursor:"pointer"}} onClick={()=>setAuthMode(authMode==="signup"?"login":"signup")}>{authMode==="signup"?"Have account? Login":"No account? Sign Up - Win Big!"}</div>
</div>
</div>
);
}

return(
<div style={{minHeight:"100vh", background:"radial-gradient(ellipse at top, #1a1a00 0%, #0a0a00 30%, #000 100%)", color:"white", maxWidth:"480px", margin:"0 auto", paddingBottom:"80px", position:"relative", overflow:"hidden"}}>
<style>{casinoStyles}</style>
{/* FLOATING CASINO CASH BACKGROUND */}
{[...Array(15)].map((_,i)=>(<div key={i} className="floating-cash" style={{left:`${Math.random()*100}%`, animationDelay:`${Math.random()*5}s`, animationDuration:`${3+Math.random()*4}s`, fontSize:`${16+Math.random()*20}px`}}>{["$","💵","💰","$","💸"][i%5]}</div>))}

{/* 3D GRID BACKGROUND */}
<div style={{position:"fixed", inset:0, backgroundImage:`linear-gradient(rgba(212,175,55,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.05) 1px, transparent 1px)`, backgroundSize:"40px 40px", pointerEvents:"none", zIndex:0}}></div>

{showChat && chatUser && (
<div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"black", zIndex:10000, display:"flex", flexDirection:"column", maxWidth:"480px", margin:"0 auto"}}>
<div style={{padding:"12px", borderBottom:"2px solid #D4AF37", display:"flex", alignItems:"center", gap:"10px", background:"radial-gradient(circle, #1a1a00, #000)"}}>
<div onClick={()=>setShowChat(false)} style={{fontSize:"20px", cursor:"pointer"}}>←</div><img src={chatUser.avatar} style={{width:"36px", height:"36px", borderRadius:"50%", border:"1px solid gold"}}/><div style={{flex:1}}><div style={{fontWeight:"900"}}>{chatUser.handle}</div><div style={{fontSize:"11px", color:"#00ff88"}}>● Online - SIM Worth Chat</div></div>
<button onClick={()=> window.open(`https://wa.me/?text=Hi ${chatUser.handle} from SIM Worth!`, '_blank')} style={{background:"#25D366", color:"white", border:"none", padding:"6px 12px", borderRadius:"20px", fontWeight:"900", fontSize:"11px"}}>WhatsApp</button>
</div>
<div style={{flex:1, overflowY:"auto", padding:"12px", display:"flex", flexDirection:"column", gap:"8px"}}>
{messages.filter(m=> (m.from_handle===myHandle && m.to_handle===chatUser.handle) || (m.from_handle===chatUser.handle && m.to_handle===myHandle)).map((m:any)=>(
<div key={m.id} style={{alignSelf: m.from_handle===myHandle ? "flex-end" : "flex-start", background: m.from_handle===myHandle ? "linear-gradient(90deg, #D4AF37, #FFD700)" : "#222", color: m.from_handle===myHandle ? "black" : "white", padding:"10px 14px", borderRadius:"18px", maxWidth:"75%", fontWeight: m.from_handle===myHandle ? "700" : "400", boxShadow: m.from_handle===myHandle ? "0 0 15px gold" : "none"}}>
{m.image_url && <img src={m.image_url} style={{width:"100%", borderRadius:"10px", marginBottom:"6px"}}/>}<div>{m.text}</div>
</div>
))}
</div>
<div style={{padding:"10px", borderTop:"1px solid #D4AF37", display:"flex", gap:"8px", background:"#0a0a0a"}}>
<button onClick={()=>chatImageRef.current?.click()} style={{background:"#222", border:"1px solid gold", color:"white", padding:"10px", borderRadius:"12px"}}>📷</button>
<input value={chatText} onChange={e=>setChatText(e.target.value)} onKeyDown={e=> e.key==="Enter" && sendChatMessage()} placeholder={`Message ${chatUser.handle}...`} style={{flex:1, background:"#111", border:"1px solid #D4AF37", color:"white", padding:"12px", borderRadius:"24px"}}/>
<button onClick={sendChatMessage} style={{background:"linear-gradient(90deg, #D4AF37, #FFD700)", color:"black", fontWeight:"900", padding:"10px 18px", borderRadius:"24px", border:"none"}}>Send 💰</button>
</div>
<input ref={chatImageRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleChatImage}/>
</div>
)}

{showImageModal && (
<div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.97)", zIndex:9999, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px"}}>
<img src={modalImage} style={{maxWidth:"100%", maxHeight:"50vh", borderRadius:"12px", boxShadow:"0 0 40px gold"}}/>
<div style={{marginTop:"15px", background:"rgba(17,17,0,0.9)", padding:"12px", borderRadius:"12px", width:"100%", maxWidth:"400px", border:"2px solid gold"}}>
<div className="gold-text" style={{fontWeight:"bold", fontSize:"16px"}}>{modalInfo?.title || "Item"} - ${modalInfo?.price || ""}</div>
{modalInfo && (modalInfo.owner_email===email || modalInfo.isMine) ? (
<div style={{marginTop:"10px"}}><div style={{color:"gold", fontSize:"11px", fontWeight:"bold"}}>YOUR JACKPOT ITEM 🎰</div></div>
) : (
<div style={{marginTop:"10px"}}><div style={{color:"gold", fontSize:"11px", fontWeight:"bold"}}>PLACE BID - WIN THIS 💰</div>
<div style={{display:"flex", gap:"6px", marginTop:"8px"}}><input value={offerAmount} onChange={e=>setOfferAmount(e.target.value)} type="number" placeholder="Your offer $" style={{flex:1, background:"#000", border:"2px solid gold", color:"white", padding:"10px", borderRadius:"8px"}}/><button onClick={placeOffer} style={{background:"linear-gradient(90deg, #D4AF37, #FFD700)", color:"black", fontWeight:"900", padding:"10px 16px", borderRadius:"8px", border:"none"}}>💰 Bid</button></div></div>
)}
</div>
<div style={{display:"flex", gap:"10px", marginTop:"15px"}}><button onClick={savePhoto} style={{background:"gold", color:"black", fontWeight:"900", padding:"10px 20px", borderRadius:"20px", border:"none"}}>⬇ Save</button><button onClick={()=>setShowImageModal(false)} style={{background:"#222", color:"white", padding:"10px 20px", borderRadius:"20px", border:"1px solid gold"}}>Close ✕</button></div>
</div>
)}
<input ref={avatarInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatarChange}/>
<input ref={productInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleProductImageChange}/>

{view==="offers" && (
<div style={{position:"relative", zIndex:2}}>
<div style={{padding:"15px", borderBottom:"2px solid gold", display:"flex", alignItems:"center", gap:"10px", background:"radial-gradient(circle, #1a1a00, #000)"}}>
<div onClick={()=>setView("profile")} style={{cursor:"pointer", fontSize:"20px"}}>←</div><div style={{flex:1}}><h2 className="gold-text" style={{margin:0, fontSize:"20px", fontWeight:"900"}}>💰 Offers Inbox JACKPOT 📥</h2><div style={{color:"#888", fontSize:"11px"}}>{myOffersCount} buyers want your items - DEAL!</div></div></div>
<div style={{padding:"12px"}}>
{myOffers.length===0 && <div style={{textAlign:"center", color:"#666", marginTop:"40px"}}>No offers yet bro! Add items to hit JACKPOT 💰🎰</div>}
{myOffers.map((o:any)=>{ const fromProfile = profiles.find(p=> p.handle===o.from_handle); return (
<div key={o.id} style={{background:"linear-gradient(145deg, #111, #0a0a00)", border:"2px solid gold", borderLeft:"6px solid gold", padding:"12px", borderRadius:"12px", marginBottom:"10px", boxShadow:"0 0 20px rgba(212,175,55,0.2)"}}>
<div style={{display:"flex", gap:"10px", alignItems:"center"}}><img src={fromProfile?.avatar || "https://i.pravatar.cc/200"} style={{width:"48px", height:"48px", borderRadius:"50%", border:"2px solid gold", boxShadow:"0 0 10px gold"}}/><div style={{flex:1}}><div style={{fontWeight:"900"}}>{o.from_handle} <span className="casino-glow" style={{color:"gold"}}>offered ${o.amount} 💵</span></div><div style={{fontSize:"11px", color:"#888"}}>{new Date(o.created_at).toLocaleDateString()}</div></div><div className="gold-text slot-number" style={{fontWeight:"900", fontSize:"18px"}}>${o.amount}</div></div>
<div style={{display:"flex", gap:"8px", marginTop:"10px"}}><button onClick={()=>{ setChatUser(fromProfile || {handle: o.from_handle, avatar: "https://i.pravatar.cc/200"}); setShowChat(true); }} style={{flex:1, background:"linear-gradient(90deg, #D4AF37, #FFD700)", color:"black", fontWeight:"900", padding:"10px", borderRadius:"8px", border:"none"}}>💬 Reply</button><button onClick={()=> window.open(`https://wa.me/?text=Hi ${o.from_handle}! Thanks for $${o.amount} on SIM Worth!`, '_blank')} style={{flex:1, background:"#25D366", color:"white", fontWeight:"900", padding:"10px", borderRadius:"8px", border:"none"}}>WhatsApp 📱</button></div>
</div> );})}
</div>
</div>
)}

{view==="publicProfile" && selectedUser && (
<div style={{position:"relative", zIndex:2}}>
<div style={{display:"flex", alignItems:"center", gap:"10px", padding:"15px", borderBottom:"1px solid gold"}}><div onClick={()=>setView("accounts")} style={{cursor:"pointer"}}>←</div><div className="gold-text" style={{fontWeight:"bold"}}>{selectedUser.handle}</div></div>
<div style={{padding:"20px", textAlign:"center"}}>
<img src={selectedUser.avatar} onClick={()=>openImageModal(selectedUser.avatar, {...selectedUser, isMine:false})} style={{width:"90px", height:"90px", borderRadius:"50%", border:"3px solid gold", objectFit:"cover", cursor:"pointer", boxShadow:"0 0 30px gold"}}/>
<div className="casino-glow" style={{color:"gold", fontWeight:"bold", fontSize:"20px", marginTop:"10px"}}>{selectedUser.name}</div>
<div style={{display:"flex", justifyContent:"center", gap:"20px", marginTop:"12px"}}><div><span style={{fontWeight:"900", color:"gold"}}>{follows.filter(f=>f.following_handle===selectedUser.handle).length}</span><span style={{color:"#888", fontSize:"12px"}}> Followers</span></div><div><span style={{fontWeight:"900"}}>{follows.filter(f=>f.follower_handle===selectedUser.handle).length}</span><span style={{color:"#888", fontSize:"12px"}}> Following</span></div></div>
<button onClick={(e)=>{ e.stopPropagation(); handleFollow(selectedUser.handle); }} style={{marginTop:"12px", background: follows.some(f=> f.follower_handle===myHandle && f.following_handle===selectedUser.handle) ? "#222" : "linear-gradient(90deg, #D4AF37, #FFD700)", color: follows.some(f=> f.follower_handle===myHandle && f.following_handle===selectedUser.handle) ? "white" : "black", fontWeight:"900", padding:"10px 24px", borderRadius:"20px", border:"none", cursor:"pointer", boxShadow:"0 0 15px gold"}}>{follows.some(f=> f.follower_handle===myHandle && f.following_handle===selectedUser.handle) ? "Following ✓" : "Follow + 🚀"}</button>
</div>
<div style={{padding:"12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px"}}>
{selectedUserProducts.map((p)=>(
<div key={p.id} onClick={()=>openImageModal(p.img, {id:p.id, img:p.img, price:p.price, title:p.title, owner_email:selectedUser.email, owner_handle:selectedUser.handle, isMine:false})} style={{background:"linear-gradient(145deg, #111, #0a0a00)", borderRadius:"14px", overflow:"hidden", border:"2px solid gold", cursor:"pointer", boxShadow:"0 0 15px rgba(212,175,55,0.2)"}}>
<img src={p.img} style={{width:"100%", height:"120px", objectFit:"cover"}}/><div style={{padding:"8px"}}><div style={{fontSize:"12px", fontWeight:"bold"}}>{p.title}</div><div className="gold-text slot-number" style={{fontWeight:"900"}}>${Number(p.price).toFixed(2)}</div></div>
</div>
))}
</div>
</div>
)}

{view==="feed" && (
<div style={{position:"relative", zIndex:2}}>
<div style={{padding:"15px", borderBottom:"2px solid gold", background:"radial-gradient(circle, #1a1a00, #000)"}}>
<h2 className="gold-text" style={{margin:0, fontWeight:"900"}}>🏆 SIM Worth 👑 INVESTORS 🏆</h2>
<div style={{color:"gold", fontSize:"11px", marginTop:"4px"}}>🎰 Live🔴Ranking🚀 Most Buyers💰 Highest Worth👑</div>
</div>
<div style={{padding:"12px"}}>
{profiles.map(p=>({ ...p, followersCount: follows.filter(f=> f.following_handle===p.handle).length })).sort((a:any,b:any)=> b.followersCount - a.followersCount || b.total_worth - a.total_worth).map((u:any, i:number)=>(
<div key={u.handle} onClick={()=>{ if(u.handle===myHandle){ setView("profile"); } else { loadPublicUser(u); } }} style={{ display:"flex", gap:"12px", background: i===0 ? "linear-gradient(145deg, #1a1a00, #2a2a00)" : "#0f0f0f", padding:"14px", borderRadius:"14px", marginBottom:"10px", border: i===0 ? "2px solid gold" : "1px solid #222", cursor:"pointer", alignItems:"center", boxShadow: i===0 ? "0 0 30px gold" : "none"}}>
<div style={{ width:"32px", height:"32px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background: i===0 ? "gold" : i===1 ? "#C0C0C0" : i===2 ? "#CD7F32" : "#222", color: i<=2 ? "black" : "white", fontWeight:"900", boxShadow: i===0 ? "0 0 15px gold" : "none"}}>{i===0 ? "👑" : `#${i+1}`}</div>
<img src={u.avatar} style={{width:"48px", height:"48px", borderRadius:"50%", border: i===0 ? "2px solid gold" : "1px solid #333"}}/>
<div style={{flex:1}}><div style={{fontWeight:"900", fontSize:"14px"}}>{u.name} {i===0 && "🎰 JACKPOT"}</div><div style={{fontSize:"11px", color:"#888"}}>{u.handle} • {u.followersCount} followers</div></div>
<div style={{textAlign:"right"}}><div className="gold-text slot-number" style={{fontWeight:"900", fontSize:"16px"}}>${Number(u.total_worth||0).toFixed(0)}</div><div style={{fontSize:"10px", color:"gold"}}>{u.followersCount} 👥</div></div>
</div>
))}
</div>
</div>
)}

{view==="profile" && (
<div style={{position:"relative", zIndex:2}}>
<WatermarkHeader avatarPreview={avatarPreview} totalWorth={totalWorth} myUserId={myId} myHandle={email?.split("@")[0] || "user"} userLocation={userLocation} userLat={userLat} userLng={userLng} streetAddress={streetAddress} suburb={suburb} city={city} payLink={payLink} payHandle={payHandle} payMethod={payMethod} onAvatarClick={()=>openImageModal(avatarPreview, {handle: email?.split("@")[0] || "user", bio: bio, isMine:true})} />
<div style={{margin:"0 15px", border:"2px solid gold", borderRadius:"12px", padding:"14px", background:"linear-gradient(145deg, #111, #0a0a00)", boxShadow:"0 0 20px rgba(212,175,55,0.2)"}}>
{editingBio ? (
<div>
<input value={bio} onChange={e=>setBio(e.target.value)} placeholder="Bio" style={{width:"100%", background:"#000", border:"1px solid gold", color:"white", padding:"10px", borderRadius:"8px", marginBottom:"8px"}}/>
<input value={about} onChange={e=>setAbout(e.target.value)} placeholder="About" style={{width:"100%", background:"#000", border:"1px solid gold", color:"white", padding:"10px", borderRadius:"8px", marginBottom:"12px"}}/>
<button onClick={saveBio} style={{background:"linear-gradient(90deg, #D4AF37, #FFD700)", color:"black", fontWeight:"900", padding:"12px", borderRadius:"8px", border:"none", width:"100%", boxShadow:"0 0 15px gold"}}>Save All ✓</button>
<button onClick={()=>setEditingBio(false)} style={{background:"#222", color:"white", padding:"8px", borderRadius:"8px", border:"1px solid gold", width:"100%", marginTop:"8px"}}>Cancel</button>
</div>
) : (
<div>
<div style={{display:"flex", justifyContent:"space-between"}}><div className="gold-text" style={{fontWeight:"bold", fontSize:"12px"}}>ABOUT ME 💎</div><div onClick={()=>setEditingBio(true)} style={{color:"gold", fontSize:"12px", cursor:"pointer", border:"1px solid gold", padding:"4px 10px", borderRadius:"12px", boxShadow:"0 0 10px gold"}}>Edit Profile ✏️</div></div>
<div style={{color:"white", fontSize:"13px", marginTop:"8px"}}>{bio}</div>
<div style={{color:"#888", fontSize:"11px"}}>{about}</div>
</div>
)}
<div style={{marginTop:"10px", borderTop:"1px solid gold", paddingTop:"10px", display:"flex", justifyContent:"space-between"}}>
<div><div style={{color:"#888", fontSize:"10px"}}>NET WORTH JACKPOT</div><div className="gold-text slot-number" style={{fontWeight:"900", fontSize:"24px"}}>$ {totalWorth.toFixed(2)}</div></div>
<div onClick={()=>setView("offers")} style={{cursor:"pointer", textAlign:"right", background: myOffersCount>0 ? "linear-gradient(90deg, #1a1a00, #2a2a00)" : "transparent", border: "2px solid gold", padding:"8px 14px", borderRadius:"10px", boxShadow: myOffersCount>0 ? "0 0 20px gold" : "none"}}>
<div style={{color:"#888", fontSize:"10px"}}>OFFERS RECEIVED {myOffersCount>0 && "🔴🎰"}</div>
<div className={myOffersCount>0 ? "casino-glow" : ""} style={{color: myOffersCount>0 ? "gold" : "white", fontWeight:"900", fontSize:"20px"}}>{myOffersCount} {myOffersCount>0 ? "→ View" : ""}</div>
</div>
</div>
</div>
<div style={{padding:"12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginTop:"10px"}}>
{products.map((p)=>(
<div key={p.id} style={{background:"linear-gradient(145deg, #111, #0a0a00)", borderRadius:"14px", overflow:"hidden", border:"2px solid gold", position:"relative", boxShadow:"0 0 15px rgba(212,175,55,0.15)"}}>
<img src={p.img} onClick={()=>openImageModal(p.img, {id:p.id, img:p.img, price:p.price, title:p.title, owner_email:email, isMine:true})} style={{width:"100%", height:"100px", objectFit:"cover", cursor:"pointer"}}/>
<div style={{padding:"6px"}}>
{editingTitleId===p.id ? (<div style={{display:"flex", gap:"4px"}}><input value={tempTitle} onChange={e=>setTempTitle(e.target.value)} autoFocus style={{width:"90px", background:"#000", border:"1px solid gold", color:"white", borderRadius:"6px", padding:"4px"}}/><button onClick={()=>updateTitle(p.id)} style={{background:"gold", border:"none", borderRadius:"6px", padding:"4px 6px"}}>OK</button></div>) : (<div onClick={()=>{setEditingTitleId(p.id); setTempTitle(p.title||"");}} style={{fontSize:"11px", fontWeight:"bold", cursor:"pointer"}}>{p.title} ✏️</div>)}
{editingPriceId===p.id ? (<div style={{display:"flex", gap:"4px", marginTop:"4px"}}><input value={tempPrice} onChange={e=>setTempPrice(e.target.value)} autoFocus type="number" style={{width:"60px", background:"#000", border:"1px solid gold", color:"white", borderRadius:"6px", padding:"4px"}}/><button onClick={()=>updatePrice(p.id)} style={{background:"gold", border:"none", borderRadius:"6px", padding:"4px 6px"}}>OK</button></div>) : (<div onClick={()=>{setEditingPriceId(p.id); setTempPrice(p.price.toString());}} className="gold-text" style={{fontWeight:"900", fontSize:"13px", cursor:"pointer"}}>$ {Number(p.price).toFixed(2)} ✏️</div>)}
</div>
<div style={{position:"absolute", top:"6px", right:"6px", display:"flex", gap:"4px"}}>
<button onClick={()=>{setActiveProductId(p.id); productInputRef.current?.click();}} style={{background:"rgba(0,0,0,0.8)", border:"1px solid gold", color:"white", borderRadius:"50%", width:"24px", height:"24px"}}>📷</button>
<button onClick={async()=>{setProducts(products.filter(x=>x.id!==p.id)); await supabase.from("products").delete().eq("id", p.id); loadFeed();}} style={{background:"rgba(255,0,0,0.8)", border:"none", color:"white", borderRadius:"50%", width:"20px", height:"20px"}}>×</button>
</div>
</div>
))}
<div onClick={addProduct} style={{background:"rgba(10,10,0,0.5)", border:"2px dashed gold", borderRadius:"14px", height:"120px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 0 15px rgba(212,175,55,0.2)"}}>+ Add JACKPOT</div>
</div>
</div>
)}

{view==="accounts" && (
<div style={{position:"relative", zIndex:2}}>
<div style={{padding:"15px"}}>
<h2 className="gold-text" style={{margin:0, fontWeight:"900"}}>$IM Worth List 🔍💰</h2>
<input placeholder="Search @username..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%", marginTop:"12px", background:"#111", border:"2px solid gold", color:"white", padding:"12px", borderRadius:"12px", boxShadow:"0 0 10px rgba(212,175,55,0.2)"}}/>
<div style={{marginTop:"10px", display:"flex", gap:"10px"}}>
<div style={{background:"#111", padding:"8px 12px", borderRadius:"20px", border:"1px solid gold", fontSize:"12px", boxShadow:"0 0 10px gold"}}>👥 {myFollowers} Followers LIVE</div>
<div onClick={()=>setView("offers")} style={{background: myOffersCount>0 ? "linear-gradient(90deg, #D4AF37, #FFD700)" : "#111", padding:"8px 12px", borderRadius:"20px", border:"1px solid gold", fontSize:"12px", color: myOffersCount>0 ? "black" : "gold", fontWeight:"900", cursor:"pointer"}}>💰 {myOffersCount} Offers {myOffersCount>0 ? "🔴" : ""}</div>
</div>
</div>
<div style={{padding:"15px"}}>
{filteredProfiles.map((u:any)=>(
<div key={u.handle} style={{display:"flex", gap:"10px", background: u.handle===myHandle ? "linear-gradient(145deg, #1a1a00, #000)" : "#111", padding:"12px", borderRadius:"12px", marginBottom:"10px", border: u.handle===myHandle ? "2px solid gold" : "1px solid #333", boxShadow: u.handle===myHandle ? "0 0 15px gold" : "none"}}>
<div style={{display:"flex", gap:"10px", flex:1, cursor:"pointer"}} onClick={()=>{ if(u.handle===myHandle){ setView("profile"); } else { loadPublicUser(u); } }}>
<img src={u.avatar} style={{width:"44px", height:"44px", borderRadius:"50%", border:"1px solid gold"}}/>
<div style={{flex:1}}><div style={{fontWeight:"bold"}}>{u.name} {u.handle===myHandle && "(You)"}</div><div style={{fontSize:"11px", color:"#888"}}>{u.handle} • {follows.filter(f=>f.following_handle===u.handle).length} followers</div></div>
<div className="gold-text" style={{fontWeight:"bold"}}>${Number(u.total_worth||0).toFixed(2)}</div>
</div>
{u.handle !== myHandle && (<button onClick={(e)=>{ e.stopPropagation(); handleFollow(u.handle); }} style={{background: follows.some(f=> f.follower_handle===myHandle && f.following_handle===u.handle) ? "#222" : "linear-gradient(90deg, #D4AF37, #FFD700)", color: follows.some(f=> f.follower_handle===myHandle && f.following_handle===u.handle) ? "#888" : "black", fontWeight:"900", padding:"6px 12px", borderRadius:"20px", border:"none", fontSize:"11px", height:"32px", alignSelf:"center", boxShadow:"0 0 10px gold"}}>{follows.some(f=> f.follower_handle===myHandle && f.following_handle===u.handle) ? "✓" : "+ Follow"}</button>)}
</div>
))}
</div>
</div>
)}

<div style={{position:"fixed", bottom:0, left:0, right:0, maxWidth:"480px", margin:"0 auto", background:"radial-gradient(circle, #1a1a00, #000)", borderTop:"2px solid gold", display:"flex", justifyContent:"space-around", padding:"10px", zIndex:10, boxShadow:"0 -5px 20px rgba(212,175,55,0.3)"}}>
<div onClick={()=>setView("accounts")} style={{color: view==="accounts" ? "gold" : "#888", cursor:"pointer", textShadow: view==="accounts" ? "0 0 10px gold" : "none"}}>👤 Search</div>
<div onClick={()=>setView("feed")} style={{color: view==="feed" ? "gold" : "#888", cursor:"pointer"}}>👑 Worth</div>
<div onClick={()=>setView("offers")} style={{color: view==="offers" ? "gold" : "#888", cursor:"pointer", position:"relative"}}>💰 Offers {myOffersCount>0 && <span style={{position:"absolute", top:"-6px", right:"-8px", background:"red", color:"white", fontSize:"9px", padding:"2px 5px", borderRadius:"10px", boxShadow:"0 0 10px red"}}>{myOffersCount}</span>}</div>
<div onClick={()=>setView("profile")} style={{color: view==="profile" ? "gold" : "#888", cursor:"pointer"}}>💎 Profile ({myFollowers})</div>
</div>
</div>
);
}
