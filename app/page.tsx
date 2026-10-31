"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
type Product = { id: string; img: string; price: number; oldPrice: number; owner_email?: string; title?: string; status?: string; };

type HeaderProps = {
  avatarPreview: string; totalWorth: number; onAvatarClick: () => void; myUserId: string; myHandle: string;
  userLocation?: string; userLat?: string; userLng?: string; streetAddress?: string; suburb?: string; city?: string;
  payLink?: string; payHandle?: string; payMethod?: string; profileStatus?: string;
};

function WatermarkHeader({ avatarPreview, totalWorth, onAvatarClick, myHandle, userLocation, userLat, userLng, streetAddress, suburb, city, payLink, payHandle, payMethod, profileStatus }: HeaderProps) {
  const handlePayMe = () => {
    if (payLink && payLink.startsWith("http")) { window.open(payLink, '_blank'); return; }
    if (payHandle) { window.open(`https://pay.capitecbank.co.za/${payHandle}`, '_blank'); return; }
    alert("Go to Edit Profile > Setup Pay Me!");
  };
  const handleVisitMe = () => {
    const finalAddress = streetAddress && suburb ? `${streetAddress}, ${suburb}, ${city}` : userLocation;
    if (userLat && userLng) { window.location.href = `geo:${userLat},${userLng}?q=${userLat},${userLng}(${encodeURIComponent(finalAddress || myHandle)})`; }
    else if (finalAddress) { window.location.href = `geo:0,0?q=${encodeURIComponent(finalAddress)}`; }
  };
  const getProfileBadge = (status?:string)=>{
    if(status==="sold") return { text:"SOLD OUT 🔴", color:"#ff4444", bg:"#ff4444" };
    if(status==="not_for_sale") return { text:"NOT FOR SALE 💎", color:"white", bg:"#555" };
    return { text:"FOR SALE ✅", color:"black", bg:"#00ff88" };
  };
  const badge = getProfileBadge(profileStatus);
  return (
    <div style={{background:"black", padding:"10px"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
        <div style={{textAlign:"center"}}>
          <img src="/sim_banc.png" onClick={handlePayMe} style={{width:"85px", height:"85px", objectFit:"contain", cursor:"pointer"}} alt="banc"/>
          <div onClick={handlePayMe} style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px", cursor:"pointer", background: payHandle || payLink ? "#1a1a00" : "black"}}>Pay Me</div>
        </div>
        <div style={{textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", position:"relative"}}>
          <div style={{background:"black", border:"1px solid gold", color:"gold", fontSize:"8px", padding:"3px 8px", borderRadius:"20px", fontWeight:"900", marginBottom:"6px"}}>$IM Worth</div>
          <div style={{position:"relative"}}>
            <img src={avatarPreview} onClick={onAvatarClick} style={{width:"95px", height:"95px", borderRadius:"50%", border:"3px solid gold", objectFit:"cover", cursor:"pointer", filter: profileStatus==="sold" ? "grayscale(60%)" : "none"}} alt="avatar"/>
            <div style={{position:"absolute", bottom:"-8px", left:"50%", transform:"translateX(-50%)", background: badge.bg, color: badge.color, fontSize:"7px", fontWeight:"900", padding:"3px 8px", borderRadius:"12px", whiteSpace:"nowrap", border:"1px solid #222"}}>{badge.text}</div>
          </div>
        </div>
        <div style={{textAlign:"center"}}>
          <img src="/sim_maps.png" onClick={handleVisitMe} style={{width:"85px", height:"85px", objectFit:"contain", cursor:"pointer"}} alt="maps"/>
          <div onClick={handleVisitMe} style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px", cursor:"pointer", background: userLocation || streetAddress ? "#1a1a00" : "black"}}>Visit Me</div>
        </div>
      </div>
      <div style={{textAlign:"center", marginTop:"16px"}}><div style={{color:"gold", fontWeight:"900", fontSize:"16px"}}>@{myHandle}</div>
      {(streetAddress || userLocation) && <div style={{color:"#888", fontSize:"10px", marginTop:"2px"}}>📍 {streetAddress ? `${streetAddress}, ${suburb}` : userLocation}</div>}
      </div>
      <div style={{marginTop:"12px", border:"1px solid gold", borderRadius:"14px", padding:"10px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{flex:1, textAlign:"center"}}><div style={{color:"#888", fontSize:"10px"}}>$IM WORTH</div><div style={{color:"gold", fontWeight:"900", fontSize:"26px"}}>$ {totalWorth.toFixed(2)}</div></div>
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
const [marketSearch, setMarketSearch] = useState("");
const [searchTab, setSearchTab] = useState("market");
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
const [offersTab, setOffersTab] = useState("received");
const [modalEditingTitle, setModalEditingTitle] = useState(false);
const [profileStatus, setProfileStatus] = useState("for_sale");

const totalWorth = products.reduce((s,p)=> s + Number(p.price), 0);
const myHandle = "@" + email.split("@")[0].toLowerCase().trim();

const openInSimMaps = (lat?:string, lng?:string, address?:string) => {
  let geoUrl = ""; if(lat && lng && lat.trim() !== "" && lng.trim() !== ""){ geoUrl = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(address || userLocation || "My Location")})`; } else if(address){ geoUrl = `geo:0,0?q=${encodeURIComponent(address)}`; } else { alert("Add address first bro!"); return; } window.location.href = geoUrl;
};
const handleLogout = async ()=>{ if(!confirm("Confirm Logout")) return; await supabase.auth.signOut(); localStorage.removeItem("im_session"); setLoggedIn(false); setEmail(""); setPassword(""); setView("accounts"); };

const loadFeed = async ()=>{
  const { data: profs } = await supabase.from("profiles").select("*").order("net_worth", {ascending:false}).limit(100);
  if(profs) setProfiles(profs.map((p:any)=>({ id: p.id, email: p.email || p.handle, handle: p.handle, name: p.display_name || p.handle?.replace('@',''), avatar: p.avatar_url || "https://i.pravatar.cc/200?img=12", total_worth: p.net_worth || 0, bio: p.bio, about: p.about, location: p.location, latitude: p.latitude, longitude: p.longitude, pay_method: p.pay_method, pay_handle: p.pay_handle, pay_link: p.pay_link, profile_status: p.profile_status || "for_sale" })));
  const { data: allProd } = await supabase.from("products").select("*").order("created_at",{ascending:false}).limit(100);
  if(allProd) setFeedProducts(allProd.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price, owner_email:p.owner_email, title:p.title || "My Item", status: p.status || "for_sale"})));
  const { data: fl } = await supabase.from("follows").select("*"); if(fl) setFollows(fl);
  const { data: of } = await supabase.from("offers").select("*").order("created_at",{ascending:false}); if(of) setOffers(of);
  const { data: ms } = await supabase.from("messages").select("*").order("created_at",{ascending:true}).limit(500); if(ms) setMessages(ms);
};

useEffect(()=>{
  const checkSession = async ()=>{
    const { data } = await supabase.auth.getSession();
    if(data.session?.user?.email_confirmed_at){ const em = data.session.user.email!; setEmail(em); setMyId(data.session.user.id); setLoggedIn(true); loadMyData(em); }
    else { const old = localStorage.getItem("im_session"); if(old) { setEmail(old); setLoggedIn(true); loadMyData(old); } }
    loadFeed();
  };
  checkSession();
  const channel = supabase.channel('live-messages').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, ()=>{ loadFeed(); }).on('postgres_changes', { event: '*', schema: 'public', table: 'offers' }, ()=>{ loadFeed(); }).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products' }, ()=>{ loadFeed(); }).subscribe();
  return ()=>{ supabase.removeChannel(channel); };
},[]);

const loadMyData = async (em:string)=>{
  const { data } = await supabase.from("products").select("*").eq("owner_email", em).order("created_at",{ascending:false});
  if(data) setProducts(data.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price, title:p.title || "My Item", status: p.status || "for_sale"})));
  const handle = "@" + em.split("@")[0].toLowerCase().trim();
  const { data: prof } = await supabase.from("profiles").select("*").eq("handle", handle).maybeSingle();
  if(prof){ if(prof.avatar_url) setAvatarPreview(prof.avatar_url); if(prof.bio) setBio(prof.bio); if(prof.about) setAbout(prof.about); if(prof.pay_method) setPayMethod(prof.pay_method); if(prof.pay_handle) setPayHandle(prof.pay_handle); if(prof.pay_link) setPayLink(prof.pay_link); if(prof.location) { setUserLocation(prof.location); const parts = prof.location.split(','); if(parts.length >= 2){ setStreetAddress(parts[0].trim()); setSuburb(parts[1].trim()); if(parts[2]) setCity(parts[2].trim()); } } if(prof.latitude) setUserLat(prof.latitude.toString()); if(prof.longitude) setUserLng(prof.longitude.toString()); if(prof.id) setMyId(prof.id); if(prof.profile_status) setProfileStatus(prof.profile_status); }
};

const loadPublicUser = async (user:any)=>{
  setSelectedUser(user);
  const { data } = await supabase.from("products").select("*").eq("owner_email", user.email).order("created_at",{ascending:false});
  if(data) setSelectedUserProducts(data.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price, title:p.title || "My Item", status: p.status || "for_sale"})));
  setView("publicProfile");
};

const syncProfile = async (em:string, worth:number, av:string)=>{
  if(!em || !em.includes("@")) return; const handle = "@" + em.split("@")[0].toLowerCase().trim(); if(handle === "@" || handle.length < 3) return; const fullAddr = streetAddress && suburb ? `${streetAddress}, ${suburb}, ${city}` : userLocation; const { data: existing } = await supabase.from("profiles").select("id").eq("handle", handle).maybeSingle(); if(existing){ await supabase.from("profiles").update({ avatar_url: av, net_worth: worth, email: em, bio: bio, about: about, pay_method: payMethod, pay_handle: payHandle, pay_link: payLink, location: fullAddr, latitude: userLat ? parseFloat(userLat) : null, longitude: userLng ? parseFloat(userLng) : null, profile_status: profileStatus }).eq("id", existing.id); } else { await supabase.from("profiles").insert({ handle: handle, display_name: em.split("@")[0], avatar_url: av, net_worth: worth, email: em, bio: bio, about: about, pay_method: payMethod, pay_handle: payHandle, pay_link: payLink, location: fullAddr, latitude: userLat ? parseFloat(userLat) : null, longitude: userLng ? parseFloat(userLng) : null, profile_status: profileStatus }); }
};

const saveBio = async ()=>{
  const fullAddr = streetAddress && suburb ? `${streetAddress}, ${suburb}, ${city}` : userLocation;
  const { error } = await supabase.from("profiles").update({ bio: bio, about: about, pay_method: payMethod, pay_handle: payHandle, pay_link: payLink, location: fullAddr, latitude: userLat ? parseFloat(userLat) : null, longitude: userLng ? parseFloat(userLng) : null, profile_status: profileStatus }).eq("handle", myHandle);
  if(error){ alert("Run SQL: ALTER TABLE profiles ADD COLUMN profile_status TEXT DEFAULT 'for_sale'; Error:"+error.message); }
  setEditingBio(false); loadFeed(); alert("Profile Saved Successfully ✓");
};

const doLogin = async ()=>{
  setErr(""); if(!email.includes("@") || password.length < 6){ setErr("Valid email + 6 chars password"); return; }
  try {
    if(authMode==="signup"){
      const { data, error } = await supabase.auth.signUp({ email: email.trim().toLowerCase(), password: password, options: { data: { handle: "@" + email.split("@")[0].toLowerCase() } } });
      if(error) throw error; if(!data.session){ setErr("✅ Verification email sent! Check your inbox & spam to confirm, then LOGIN."); setAuthMode("login"); return; }
      localStorage.setItem("im_session", email); await syncProfile(email, 0, avatarPreview); setLoggedIn(true); await loadMyData(email); await loadFeed();
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: password });
      if(error) throw error; if(!data.user?.email_confirmed_at){ setErr("⚠️ Email not verified."); await supabase.auth.signOut(); return; }
      localStorage.setItem("im_session", email); setMyId(data.user.id); await loadMyData(email); setLoggedIn(true); await loadFeed();
    }
  } catch(e:any){ setErr(e.message); }
};

const handleAvatarChange = async (e:any)=>{
  const file = e.target.files?.[0]; if(!file) return; setAvatarPreview(URL.createObjectURL(file));
  try { const safeEmail = email.replace(/[^a-z0-9]/gi, '_'); const fileName = `${safeEmail}/${Date.now()}.jpg`; await supabase.storage.from('avatars').upload(fileName, file, { upsert: true, contentType: file.type }); const { data } = supabase.storage.from('avatars').getPublicUrl(fileName); const publicUrl = data.publicUrl + `?t=${Date.now()}`; setAvatarPreview(publicUrl); await syncProfile(email, totalWorth, publicUrl); await loadFeed(); } catch(err:any){ alert("Upload failed: " + err.message); }
};

const handleProductImageChange = async (e:any)=>{
  const file = e.target.files?.[0]; if(!file || !activeProductId) return;
  try { const safeEmail = email.replace(/[^a-z0-9]/gi, '_'); const fileName = `${safeEmail}/product_${activeProductId}_${Date.now()}.jpg`; await supabase.storage.from('avatars').upload(fileName, file, { upsert: true, contentType: file.type }); const { data } = supabase.storage.from('avatars').getPublicUrl(fileName); const publicUrl = data.publicUrl + `?t=${Date.now()}`; setProducts(prev => prev.map(p=> p.id===activeProductId ? {...p, img:publicUrl} : p)); setSelectedUserProducts(prev => prev.map(p=> p.id===activeProductId ? {...p, img:publicUrl} : p)); if(modalInfo) setModalImage(publicUrl); await supabase.from("products").update({ img: publicUrl }).eq("id", activeProductId); await loadFeed(); } catch(err:any){ alert("Product image failed: " + err.message); }
};

const handleChatImage = async (e:any)=>{
  const file = e.target.files?.[0]; if(!file || !chatUser) return;
  try { const safeEmail = email.replace(/[^a-z0-9]/gi, '_'); const fileName = `${safeEmail}/chat_${Date.now()}.jpg`; await supabase.storage.from('avatars').upload(fileName, file, { upsert: true, contentType: file.type }); const { data } = supabase.storage.from('avatars').getPublicUrl(fileName); const publicUrl = data.publicUrl + `?t=${Date.now()}`; await supabase.from("messages").insert({ from_handle: myHandle, to_handle: chatUser.handle, image_url: publicUrl, text: "📷 Image" }); } catch(err:any){ alert("Image failed: "+err); }
};

const addProduct = async ()=>{
  const newId = Date.now().toString(); const newItem:Product = { id: newId, img:"https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400", price:19.99, oldPrice:59.99, title:"My Item", status:"for_sale" }; setProducts([newItem, ...products]); const { data } = await supabase.from("products").insert({ owner_email: email, img: newItem.img, price: newItem.price, old_price: newItem.oldPrice, title: newItem.title, status:"for_sale" }).select().single(); if(data) setProducts(prev => prev.map(p=> p.id===newId ? {...p, id: data.id} : p)); await loadFeed();
};

const setProductStatus = async (id:string, newStatus:string)=>{
  setProducts(prev => prev.map(p=> p.id===id ? {...p, status:newStatus} : p));
  setSelectedUserProducts(prev => prev.map(p=> p.id===id ? {...p, status:newStatus} : p));
  if(modalInfo && modalInfo.id===id) setModalInfo({...modalInfo, status: newStatus});
  const { error } = await supabase.from("products").update({ status: newStatus }).eq("id", id);
  if(error){ alert("⚠️ Run SQL: ALTER TABLE products ADD COLUMN status TEXT DEFAULT 'for_sale'; Error: "+error.message); loadFeed(); }
};

const setProfileStatusDirect = async (newStatus:string)=>{
  setProfileStatus(newStatus);
  const { error } = await supabase.from("profiles").update({ profile_status: newStatus }).eq("handle", myHandle);
  if(error){ alert("Run SQL: ALTER TABLE profiles ADD COLUMN profile_status TEXT; "+error.message); }
  loadFeed();
};

const deleteOffer = async (offerId:string)=>{ if(!confirm("Delete this offer bro?")) return; setOffers(prev => prev.filter(o=> o.id!==offerId)); await supabase.from("offers").delete().eq("id", offerId); };
const deleteChat = async (otherHandle:string)=>{ if(!confirm(`Delete ALL messages with ${otherHandle}?`)) return; setMessages(prev => prev.filter(m=> !((m.from_handle===myHandle && m.to_handle===otherHandle) || (m.from_handle===otherHandle && m.to_handle===myHandle)))); await supabase.from("messages").delete().or(`and(from_handle.eq.${myHandle},to_handle.eq.${otherHandle}),and(from_handle.eq.${otherHandle},to_handle.eq.${myHandle})`); };
const deleteMessage = async (msgId:string)=>{ if(!confirm("Delete this message?")) return; setMessages(prev => prev.filter(m=> m.id!==msgId)); await supabase.from("messages").delete().eq("id", msgId); };

const updatePrice = async (id:string)=>{ const num = parseFloat(tempPrice); if(isNaN(num)) { setEditingPriceId(null); return; } setProducts(prev => prev.map(p=> p.id===id ? {...p, price:num} : p)); await supabase.from("products").update({ price: num }).eq("id", id); setEditingPriceId(null); loadFeed(); };
const updateTitle = async (id:string)=>{
  if(!tempTitle.trim()) { setEditingTitleId(null); setModalEditingTitle(false); return; }
  setProducts(prev => prev.map(p=> p.id===id ? {...p, title:tempTitle} : p));
  setSelectedUserProducts(prev => prev.map(p=> p.id===id ? {...p, title:tempTitle} : p));
  await supabase.from("products").update({ title: tempTitle }).eq("id", id);
  setEditingTitleId(null); setModalEditingTitle(false); loadFeed();
  if(modalInfo && modalInfo.id===id) setModalInfo({...modalInfo, title: tempTitle});
};

const handleFollow = async (targetHandle:string)=>{
  if(myHandle === targetHandle) { alert("Can't follow yourself bro!"); return; } if(!myHandle || myHandle === "@" ) return; const existing = follows.find(f=> f.follower_handle===myHandle && f.following_handle===targetHandle); if(existing){ setFollows(prev => prev.filter(f=> f.id !== existing.id)); const { error } = await supabase.from("follows").delete().eq("id", existing.id); if(error){ setFollows(prev => [...prev, existing]); } } else { const temp = { id: Date.now().toString(), follower_handle: myHandle, following_handle: targetHandle }; setFollows(prev => [...prev, temp]); const { data, error } = await supabase.from("follows").insert({ follower_handle: myHandle, following_handle: targetHandle }).select().single(); if(error){ setFollows(prev => prev.filter(f=> f.id !== temp.id)); } else if(data){ setFollows(prev => prev.map(f=> f.id===temp.id ? data : f)); } }
};

const placeOffer = async ()=>{
  if(modalInfo?.status==="sold"){ alert("❌ SOLD OUT!"); return; }
  if(modalInfo?.status==="not_for_sale"){ alert("💎 NOT FOR SALE"); return; }
  if(!offerAmount || !modalInfo) return; const amount = parseFloat(offerAmount); if(isNaN(amount)){ alert("Enter valid amount"); return; } const toHandle = modalInfo.owner_handle || selectedUser?.handle || feedProducts.find(p=> p.id===modalInfo.id)?.owner_email; await supabase.from("offers").insert({ product_id: modalInfo.id, from_handle: myHandle, to_handle: toHandle, amount: amount, message: `Offer for ${modalInfo.title || 'item'}` }); alert(`Offer $${amount} sent to ${toHandle} ✓`); setOfferAmount(""); setShowImageModal(false); loadFeed();
};

const sendChatMessage = async ()=>{
  if(!chatText.trim() || !chatUser) return;
  const msg = chatText; setChatText("");
  setMessages(prev => [...prev, { id: Date.now().toString(), from_handle: myHandle, to_handle: chatUser.handle, text: msg, created_at: new Date().toISOString() }]);
  await supabase.from("messages").insert({ from_handle: myHandle, to_handle: chatUser.handle, text: msg });
};

const openImageModal = (img:string, info:any=null)=>{ setModalImage(img); setModalInfo(info); setShowImageModal(true); setOfferAmount(""); setModalEditingTitle(false); setTempTitle(info?.title || ""); };
const savePhoto = ()=>{ const link = document.createElement('a'); link.href = modalImage; link.download = `imworth-${Date.now()}.jpg`; link.target = "_blank"; link.click(); };
const filteredProfiles = profiles.filter(p=> p.handle.toLowerCase().includes(search.toLowerCase()) || p.name.toLowerCase().includes(search.toLowerCase()));
const myFollowers = follows.filter(f=> f.following_handle===myHandle).length;
const myOffersReceived = offers.filter(o=> o.to_handle===myHandle);
const myOffersSent = offers.filter(o=> o.from_handle===myHandle);
const myOffersCount = myOffersReceived.length;
const conversations = Array.from(new Set([...myOffersReceived.map(o=>o.from_handle), ...myOffersSent.map(o=>o.to_handle), ...messages.filter(m=>m.to_handle===myHandle || m.from_handle===myHandle).map(m=> m.from_handle===myHandle ? m.to_handle : m.from_handle)])).filter(h=> h!==myHandle);

const getStatusBadge = (status?:string)=>{
  if(status==="sold") return { text:"SOLD OUT 🔴", color:"#ff4444", bg:"rgba(255,68,68,0.9)" };
  if(status==="not_for_sale") return { text:"NOT FOR SALE 💎", color:"#888", bg:"rgba(0,0,0,0.85)" };
  return { text:"FOR SALE ✅", color:"#00ff88", bg:"rgba(0,255,136,0.15)" };
};

const availableMarketItems = feedProducts.filter(p=> (p.status==="for_sale" || !p.status) && (marketSearch==="" || (p.title||"").toLowerCase().includes(marketSearch.toLowerCase())));

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
{showChat && chatUser && (
<div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"black", zIndex:10000, display:"flex", flexDirection:"column", maxWidth:"480px", margin:"0 auto"}}>
<div style={{padding:"12px", borderBottom:"1px solid #222", display:"flex", alignItems:"center", gap:"10px", background:"#0a0a0a"}}>
<div onClick={()=>setShowChat(false)} style={{fontSize:"20px", cursor:"pointer"}}>←</div>
<img src={chatUser.avatar} style={{width:"36px", height:"36px", borderRadius:"50%"}}/>
<div style={{flex:1}}><div style={{fontWeight:"900", fontSize:"14px"}}>{chatUser.handle}</div><div style={{fontSize:"11px", color:"#00ff88"}}>● Online - Live ✓</div></div>
<button onClick={()=> window.open(`https://wa.me/?text=Hi ${chatUser.handle} from $IM Worth!`, '_blank')} style={{background:"#25D366", color:"white", border:"none", padding:"6px 12px", borderRadius:"20px", fontWeight:"900", fontSize:"11px"}}>WhatsApp</button>
</div>
<div style={{flex:1, overflowY:"auto", padding:"12px", display:"flex", flexDirection:"column", gap:"8px"}}>
{offers.filter(o=> (o.from_handle===myHandle && o.to_handle===chatUser.handle) || (o.from_handle===chatUser.handle && o.to_handle===myHandle)).map((o:any)=>(
<div key={o.id} style={{alignSelf:"center", background:"#1a1a00", border:"1px solid #D4AF37", color:"#D4AF37", padding:"6px 12px", borderRadius:"20px", fontSize:"11px", fontWeight:"900"}}>💰 Offer ${o.amount} from {o.from_handle} → {o.to_handle}</div>
))}
{messages.filter(m=> (m.from_handle===myHandle && m.to_handle===chatUser.handle) || (m.from_handle===chatUser.handle && m.to_handle===myHandle)).map((m:any)=>(
<div key={m.id} style={{alignSelf: m.from_handle===myHandle ? "flex-end" : "flex-start", background: m.from_handle===myHandle ? "#D4AF37" : "#222", color: m.from_handle===myHandle ? "black" : "white", padding:"10px 14px", borderRadius: m.from_handle===myHandle ? "18px 18px 4px 18px" : "18px 18px 18px 4px", maxWidth:"75%", fontSize:"13px"}}>
{m.image_url && <img src={m.image_url} style={{width:"100%", borderRadius:"10px", marginBottom:"6px"}}/>}
<div>{m.text}</div>
<div style={{fontSize:"9px", opacity:0.6, marginTop:"4px", display:"flex", justifyContent:"space-between", gap:"8px"}}><span>{new Date(m.created_at).toLocaleTimeString()}</span>{m.from_handle===myHandle && <span onClick={()=>deleteMessage(m.id)} style={{color:"#ff4444", fontWeight:"900", cursor:"pointer"}}>🗑️ Delete</span>}</div>
</div>
))}
</div>
<div style={{padding:"10px", borderTop:"1px solid #222", display:"flex", gap:"8px", background:"#0a0a0a"}}>
<button onClick={()=>chatImageRef.current?.click()} style={{background:"#222", border:"1px solid #333", color:"white", padding:"10px", borderRadius:"12px"}}>📷</button>
<input value={chatText} onChange={e=>setChatText(e.target.value)} onKeyDown={e=> e.key==="Enter" && sendChatMessage()} placeholder={`Message ${chatUser.handle}...`} style={{flex:1, background:"#111", border:"1px solid #333", color:"white", padding:"12px", borderRadius:"24px"}}/>
<button onClick={sendChatMessage} style={{background:"#D4AF37", color:"black", fontWeight:"900", padding:"10px 18px", borderRadius:"24px", border:"none"}}>Send</button>
</div>
<input ref={chatImageRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleChatImage}/>
</div>
)}

{showImageModal && (
<div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.97)", zIndex:9999, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px", overflowY:"auto"}}>
<img src={modalImage} style={{maxWidth:"100%", maxHeight:"50vh", borderRadius:"12px", objectFit:"contain"}}/>
<div style={{marginTop:"15px", background:"#111", padding:"12px", borderRadius:"12px", width:"100%", maxWidth:"400px", border:"1px solid #333"}}>
{modalInfo?.id ? (
<>
<div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
{modalEditingTitle ? (
<div style={{display:"flex", gap:"6px", flex:1}}>
<input value={tempTitle} onChange={e=>setTempTitle(e.target.value)} autoFocus style={{flex:1, background:"#222", border:"1px solid #D4AF37", color:"white", padding:"8px", borderRadius:"8px"}}/>
<button onClick={()=>updateTitle(modalInfo.id)} style={{background:"#D4AF37", color:"black", fontWeight:"900", padding:"8px 12px", borderRadius:"8px", border:"none"}}>Save</button>
<button onClick={()=>setModalEditingTitle(false)} style={{background:"#222", color:"white", padding:"8px 12px", borderRadius:"8px", border:"1px solid #333"}}>Cancel</button>
</div>
) : (
<>
<div style={{fontWeight:"bold", color:"#D4AF37"}}>{modalInfo?.title || "Item"} - ${modalInfo?.price || ""}</div>
<div style={{background: getStatusBadge(modalInfo?.status).bg, color: getStatusBadge(modalInfo?.status).color, fontSize:"10px", fontWeight:"900", padding:"4px 8px", borderRadius:"12px", border:"1px solid currentColor"}}>{getStatusBadge(modalInfo?.status).text}</div>
</>
)}
</div>
<div style={{fontSize:"11px", color:"#888", marginTop:"4px"}}>{modalInfo?.email || modalInfo?.handle || modalInfo?.owner_handle || ""}</div>
{modalInfo && (modalInfo.owner_email===email || modalInfo.isMine) ? (
<div style={{marginTop:"10px"}}>
<div style={{color:"#D4AF37", fontSize:"11px", fontWeight:"bold"}}>YOUR ITEM - EDIT</div>
<div style={{display:"flex", gap:"6px", marginTop:"8px", flexWrap:"wrap"}}>
<button onClick={()=> setProductStatus(modalInfo.id, "for_sale")} style={{background: (modalInfo.status==="for_sale" || !modalInfo.status) ? "#00ff88" : "#222", color: (modalInfo.status==="for_sale" || !modalInfo.status) ? "black" : "white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px", fontWeight:"900", fontSize:"11px"}}>✅ For Sale</button>
<button onClick={()=> setProductStatus(modalInfo.id, "sold")} style={{background: modalInfo.status==="sold" ? "#ff4444" : "#222", color:"white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px", fontWeight:"900", fontSize:"11px"}}>🔴 Sold Out</button>
<button onClick={()=> setProductStatus(modalInfo.id, "not_for_sale")} style={{background: modalInfo.status==="not_for_sale" ? "#888" : "#222", color:"white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px", fontWeight:"900", fontSize:"11px"}}>💎 Not For Sale</button>
</div>
<div style={{display:"flex", gap:"6px", marginTop:"8px"}}>
<button onClick={()=>{ setActiveProductId(modalInfo.id); productInputRef.current?.click(); }} style={{background:"#222", color:"white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px"}}>📷 Change Photo</button>
<button onClick={()=>{ setTempTitle(modalInfo.title||""); setModalEditingTitle(true); }} style={{background:"#D4AF37", color:"black", fontWeight:"900", border:"1px solid #D4AF37", padding:"8px 12px", borderRadius:"8px"}}>✏️ Rename</button>
</div>
</div>
) : (
<div style={{marginTop:"10px"}}>
{modalInfo?.status==="sold" ? <div style={{background:"#ff4444", color:"white", padding:"10px", borderRadius:"8px", textAlign:"center", fontWeight:"900"}}>🔴 SOLD OUT</div>
: modalInfo?.status==="not_for_sale" ? <div style={{background:"#333", color:"#888", padding:"10px", borderRadius:"8px", textAlign:"center", fontWeight:"900"}}>💎 NOT FOR SALE</div>
: <div><div style={{color:"#D4AF37", fontSize:"11px", fontWeight:"bold"}}>PLACE AN OFFER</div><div style={{display:"flex", gap:"6px", marginTop:"8px"}}><input value={offerAmount} onChange={e=>setOfferAmount(e.target.value)} type="number" placeholder="Your offer $" style={{flex:1, background:"#222", border:"1px solid #D4AF37", color:"white", padding:"10px", borderRadius:"8px"}}/><button onClick={placeOffer} style={{background:"#D4AF37", color:"black", fontWeight:"900", padding:"10px 16px", borderRadius:"8px", border:"none"}}>💰 Offer</button></div></div>}
</div>
)}
</>
) : (
<div style={{textAlign:"center"}}>
<div style={{fontWeight:"bold", color:"#D4AF37", fontSize:"16px"}}>{modalInfo?.handle || "Profile Photo"} - <span style={{color: getStatusBadge(modalInfo?.profile_status || profileStatus).color}}>{getStatusBadge(modalInfo?.profile_status || profileStatus).text}</span></div>
<div style={{fontSize:"11px", color:"#888", marginTop:"4px"}}>{modalInfo?.bio || ""}</div>
</div>
)}
</div>
<div style={{display:"flex", gap:"10px", marginTop:"15px"}}>
<button onClick={savePhoto} style={{background:"#D4AF37", color:"black", fontWeight:"900", padding:"10px 20px", borderRadius:"20px", border:"none"}}>Download⬇️</button>
<button onClick={()=>setShowImageModal(false)} style={{background:"#222", color:"white", padding:"10px 20px", borderRadius:"20px", border:"1px solid #333"}}>Close❌</button>
</div>
</div>
)}
<input ref={avatarInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatarChange}/>
<input ref={productInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleProductImageChange}/>

{view==="offers" && (
<div>
<div style={{padding:"15px", borderBottom:"1px solid #222", display:"flex", alignItems:"center", gap:"10px"}}>
<div onClick={()=>setView("profile")} style={{cursor:"pointer", fontSize:"20px"}}>←</div>
<div style={{flex:1}}><h2 style={{color:"#D4AF37", margin:0, fontSize:"18px"}}>Chat offline via ᛒluetooth!</h2><div style={{color:"#888", fontSize:"11px"}}>{conversations.length} chats • {myOffersCount} offers received • Live</div></div>
<div onClick={loadFeed} style={{background:"#D4AF37", padding:"6px 12px", borderRadius:"20px", fontSize:"11px", color:"black", fontWeight:"900", cursor:"pointer"}}>↻ Refresh</div>
</div>
<div style={{display:"flex", padding:"10px", gap:"8px"}}>
<button onClick={()=>setOffersTab("received")} style={{flex:1, background: offersTab==="received" ? "#D4AF37" : "#111", color: offersTab==="received" ? "black" : "white", padding:"8px", borderRadius:"20px", border:"1px solid #D4AF37", fontWeight:"900", fontSize:"12px"}}>Received ({myOffersReceived.length})</button>
<button onClick={()=>setOffersTab("sent")} style={{flex:1, background: offersTab==="sent" ? "#D4AF37" : "#111", color: offersTab==="sent" ? "black" : "white", padding:"8px", borderRadius:"20px", border:"1px solid #333", fontWeight:"900", fontSize:"12px"}}>Sent ({myOffersSent.length})</button>
<button onClick={()=>setOffersTab("chats")} style={{flex:1, background: offersTab==="chats" ? "#D4AF37" : "#111", color: offersTab==="chats" ? "black" : "white", padding:"8px", borderRadius:"20px", border:"1px solid #333", fontWeight:"900", fontSize:"12px"}}>Chats ({conversations.length})</button>
</div>
<div style={{padding:"12px"}}>
{offersTab==="chats" && (
<div>
{conversations.length===0 && <div style={{textAlign:"center", color:"#666", marginTop:"40px"}}>No chats yet! Make an offer to start 💬</div>}
{conversations.map((handle:any)=>{
  const prof = profiles.find(p=> p.handle===handle);
  const lastMsg = [...messages].reverse().find(m=> (m.from_handle===handle && m.to_handle===myHandle) || (m.from_handle===myHandle && m.to_handle===handle));
  const lastOffer = [...offers].reverse().find(o=> (o.from_handle===handle && o.to_handle===myHandle) || (o.from_handle===myHandle && o.to_handle===handle));
  return (
  <div key={handle} style={{background:"#111", border:"1px solid #2a2a2a", padding:"12px", borderRadius:"12px", marginBottom:"10px", display:"flex", gap:"10px", alignItems:"center", position:"relative"}}>
    <div onClick={()=>{ setChatUser(prof || {handle: handle, avatar: "https://i.pravatar.cc/200"}); setShowChat(true); }} style={{display:"flex", gap:"10px", alignItems:"center", flex:1, cursor:"pointer"}}>
      <img src={prof?.avatar || "https://i.pravatar.cc/200"} style={{width:"48px", height:"48px", borderRadius:"50%", border:"1px solid #D4AF37"}}/>
      <div style={{flex:1}}><div style={{fontWeight:"900", fontSize:"14px"}}>{handle}</div><div style={{fontSize:"12px", color:"#888", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"180px"}}>{lastMsg ? lastMsg.text : lastOffer ? `💰 Offer $${lastOffer.amount}` : "No messages yet"}</div></div>
      <div style={{color:"#D4AF37", fontSize:"12px"}}>💬 Open</div>
    </div>
    <div onClick={()=>deleteChat(handle)} style={{background:"#222", border:"1px solid #ff4444", color:"#ff4444", padding:"6px 10px", borderRadius:"20px", fontSize:"12px", fontWeight:"900", cursor:"pointer"}}>🗑️</div>
  </div>
  );
})}
</div>
)}
{offersTab==="received" && myOffersReceived.map((o:any)=>{
  const fromProfile = profiles.find(p=> p.handle===o.from_handle);
  return (
  <div key={o.id} style={{background:"#111", border:"1px solid #2a2a2a", borderLeft:"4px solid #D4AF37", padding:"12px", borderRadius:"12px", marginBottom:"10px", position:"relative"}}>
    <div onClick={()=>deleteOffer(o.id)} style={{position:"absolute", top:"8px", right:"8px", background:"#ff4444", color:"white", width:"24px", height:"24px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:"900", cursor:"pointer"}}>✕</div>
    <div style={{display:"flex", gap:"10px", alignItems:"center"}}>
      <img src={fromProfile?.avatar || "https://i.pravatar.cc/200"} style={{width:"48px", height:"48px", borderRadius:"50%"}}/>
      <div style={{flex:1, paddingRight:"30px"}}><div style={{fontWeight:"900"}}>{o.from_handle} offered <span style={{color:"#D4AF37"}}>${o.amount}</span></div></div>
      <div style={{color:"#D4AF37", fontWeight:"900"}}>${o.amount}</div>
    </div>
    <div style={{display:"flex", gap:"8px", marginTop:"10px"}}>
      <button onClick={()=>{ setChatUser(fromProfile || {handle: o.from_handle, avatar: "https://i.pravatar.cc/200"}); setShowChat(true); }} style={{flex:1, background:"#D4AF37", color:"black", fontWeight:"900", padding:"10px", borderRadius:"8px", border:"none"}}>💬 Reply</button>
      <button onClick={()=>deleteOffer(o.id)} style={{background:"#222", border:"1px solid #ff4444", color:"#ff4444", fontWeight:"900", padding:"10px 12px", borderRadius:"8px"}}>🗑️</button>
    </div>
  </div>
  );
})}
{offersTab==="sent" && myOffersSent.map((o:any)=>{
  const toProfile = profiles.find(p=> p.handle===o.to_handle);
  return (
  <div key={o.id} style={{background:"#111", border:"1px solid #2a2a2a", borderLeft:"4px solid #00ff88", padding:"12px", borderRadius:"12px", marginBottom:"10px", position:"relative"}}>
    <div onClick={()=>deleteOffer(o.id)} style={{position:"absolute", top:"8px", right:"8px", background:"#ff4444", color:"white", width:"24px", height:"24px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:"900", cursor:"pointer"}}>✕</div>
    <div style={{display:"flex", gap:"10px", alignItems:"center"}}>
      <img src={toProfile?.avatar || "https://i.pravatar.cc/200"} style={{width:"48px", height:"48px", borderRadius:"50%"}}/>
      <div style={{flex:1, paddingRight:"30px"}}><div style={{fontWeight:"900"}}>You → {o.to_handle} <span style={{color:"#D4AF37"}}>${o.amount}</span></div></div>
      <div style={{color:"#D4AF37", fontWeight:"900"}}>${o.amount}</div>
    </div>
    <div style={{display:"flex", gap:"8px", marginTop:"10px"}}>
      <button onClick={()=>{ setChatUser(toProfile || {handle: o.to_handle, avatar: "https://i.pravatar.cc/200"}); setShowChat(true); }} style={{flex:1, background:"#222", border:"1px solid #D4AF37", color:"#D4AF37", fontWeight:"900", padding:"10px", borderRadius:"8px"}}>💬 Open Chat</button>
      <button onClick={()=>deleteOffer(o.id)} style={{background:"#222", border:"1px solid #ff4444", color:"#ff4444", fontWeight:"900", padding:"10px 12px", borderRadius:"8px"}}>🗑️ Delete</button>
    </div>
  </div>
  );
})}
</div>
</div>
)}

{view==="publicProfile" && selectedUser && (
<div>
<div style={{display:"flex", alignItems:"center", gap:"10px", padding:"15px", borderBottom:"1px solid #222"}}><div onClick={()=>setView("accounts")} style={{cursor:"pointer"}}>←</div><div style={{color:"#D4AF37", fontWeight:"bold"}}>{selectedUser.handle}</div><div style={{marginLeft:"8px", background: getStatusBadge(selectedUser.profile_status).bg, color: getStatusBadge(selectedUser.profile_status).color, fontSize:"9px", fontWeight:"900", padding:"4px 8px", borderRadius:"12px"}}>{getStatusBadge(selectedUser.profile_status).text}</div></div>
<div style={{padding:"20px", textAlign:"center"}}>
<div style={{position:"relative", display:"inline-block"}}>
<img src={selectedUser.avatar} onClick={()=>openImageModal(selectedUser.avatar, {...selectedUser, isMine:false})} style={{width:"90px", height:"90px", borderRadius:"50%", border:"2px solid #D4AF37", objectFit:"cover", cursor:"pointer", filter: selectedUser.profile_status==="sold" ? "grayscale(80%)" : "none"}}/>
<div style={{position:"absolute", bottom:"-6px", left:"50%", transform:"translateX(-50%)", background: getStatusBadge(selectedUser.profile_status).bg, color: getStatusBadge(selectedUser.profile_status).color, fontSize:"7px", fontWeight:"900", padding:"3px 8px", borderRadius:"12px", whiteSpace:"nowrap"}}>{getStatusBadge(selectedUser.profile_status).text}</div>
</div>
<div style={{color:"#D4AF37", fontWeight:"bold", fontSize:"20px", marginTop:"12px"}}>{selectedUser.name}</div>
<div style={{display:"flex", justifyContent:"center", gap:"20px", marginTop:"12px"}}>
<div><span style={{fontWeight:"900"}}>{follows.filter(f=>f.following_handle===selectedUser.handle).length}</span><span style={{color:"#888", fontSize:"12px"}}> Followers</span></div>
<div><span style={{fontWeight:"900"}}>{follows.filter(f=>f.follower_handle===selectedUser.handle).length}</span><span style={{color:"#888", fontSize:"12px"}}> Following</span></div>
</div>
<button onClick={(e)=>{ e.stopPropagation(); handleFollow(selectedUser.handle); }} style={{marginTop:"12px", background: follows.some(f=> f.follower_handle===myHandle && f.following_handle===selectedUser.handle) ? "#222" : "#D4AF37", color: follows.some(f=> f.follower_handle===myHandle && f.following_handle===selectedUser.handle) ? "white" : "black", fontWeight:"900", padding:"10px 24px", borderRadius:"20px", border: follows.some(f=> f.follower_handle===myHandle && f.following_handle===selectedUser.handle) ? "1px solid #333" : "none", cursor:"pointer"}}>{follows.some(f=> f.follower_handle===myHandle && f.following_handle===selectedUser.handle) ? "Following ✓" : "Follow + 🚀"}</button>
<div style={{display:"flex", gap:"10px", justifyContent:"center", marginTop:"14px", flexWrap:"wrap"}}>
{(selectedUser.pay_link || selectedUser.pay_handle) && (<button onClick={()=> window.open(selectedUser.pay_link || `https://pay.capitecbank.co.za/${selectedUser.pay_handle}`, '_blank')} style={{background:"#D4AF37", color:"black", fontWeight:"900", padding:"10px 18px", borderRadius:"20px", border:"none"}}>💰 Pay Me</button>)}
{(selectedUser.location || selectedUser.latitude) && (<button onClick={()=> openInSimMaps(selectedUser.latitude?.toString(), selectedUser.longitude?.toString(), selectedUser.location)} style={{background:"#0a84ff", color:"white", fontWeight:"900", padding:"10px 18px", borderRadius:"20px", border:"none"}}>🗺️ Visit Me</button>)}
</div>
{selectedUser.location && <div style={{color:"#888", fontSize:"11px", marginTop:"8px"}}>📍 {selectedUser.location}</div>}
</div>
<div style={{padding:"12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px"}}>
{selectedUserProducts.map((p)=>(
<div key={p.id} onClick={()=>openImageModal(p.img, {id:p.id, img:p.img, price:p.price, title:p.title, owner_email:selectedUser.email, owner_handle:selectedUser.handle, isMine:false, status:p.status})} style={{background:"#111", borderRadius:"14px", overflow:"hidden", border: p.status==="sold" ? "1px solid #ff4444" : p.status==="not_for_sale" ? "1px solid #444" : "1px solid #2a2a2a", cursor:"pointer", position:"relative", opacity: p.status==="sold" || p.status==="not_for_sale" ? 0.7 : 1}}>
<div style={{position:"relative"}}>
<img src={p.img} style={{width:"100%", height:"120px", objectFit:"cover", filter: p.status==="sold" ? "grayscale(80%)" : "none"}}/>
<div style={{position:"absolute", top:"6px", left:"6px", background: getStatusBadge(p.status).bg, color: getStatusBadge(p.status).color, fontSize:"8px", fontWeight:"900", padding:"3px 6px", borderRadius:"10px", border:"1px solid currentColor"}}>{getStatusBadge(p.status).text}</div>
{p.status==="sold" && <div style={{position:"absolute", inset:0, background:"rgba(255,0,0,0.15)", display:"flex", alignItems:"center", justifyContent:"center"}}><div style={{background:"#ff4444", color:"white", fontWeight:"900", padding:"4px 10px", borderRadius:"20px", fontSize:"12px", transform:"rotate(-15deg)"}}>SOLD</div></div>}
{p.status==="not_for_sale" && <div style={{position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center"}}><div style={{background:"#222", color:"#888", border:"1px solid #555", fontWeight:"900", padding:"4px 10px", borderRadius:"20px", fontSize:"10px"}}>NOT FOR SALE</div></div>}
</div>
<div style={{padding:"8px"}}><div style={{fontSize:"12px", fontWeight:"bold", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{p.title}</div><div style={{fontWeight:"900", color: p.status==="sold" ? "#ff4444" : p.status==="not_for_sale" ? "#888" : "#D4AF37"}}>${Number(p.price).toFixed(2)}</div></div>
</div>
))}
</div>
</div>
)}

{view==="feed" && (
<div>
<div style={{padding:"15px", borderBottom:"1px solid #222", background:"#0a0a0a"}}>
<h2 style={{color:"#D4AF37", margin:0, fontWeight:"900"}}>🏆 $IM Worth 👑 Investor$ 🏆</h2>
<div onClick={loadFeed} style={{background:"#D4AF37", padding:"6px 12px", borderRadius:"20px", fontSize:"11px", color:"black", fontWeight:"900", cursor:"pointer", display:"inline-block", marginTop:"8px"}}>↻ Refresh</div>
</div>
<div style={{padding:"12px"}}>
{profiles.map(p=>({ ...p, followersCount: follows.filter(f=> f.following_handle===p.handle).length })).sort((a:any,b:any)=> b.followersCount - a.followersCount).map((u:any, i:number)=>(
<div key={u.handle} onClick={()=>{ if(u.handle===myHandle){ setView("profile"); } else { loadPublicUser(u); } }} style={{ display:"flex", gap:"12px", background:"#0f0f0f", padding:"14px", borderRadius:"14px", marginBottom:"10px", border:"1px solid #222", cursor:"pointer", alignItems:"center"}}>
<div style={{ width:"32px", height:"32px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background: i===0 ? "#D4AF37" : "#222", color: i===0 ? "black" : "white", fontWeight:"900"}}>{i===0 ? "👑" : `#${i+1}`}</div>
<img src={u.avatar} style={{width:"48px", height:"48px", borderRadius:"50%"}}/>
<div style={{flex:1}}><div style={{fontWeight:"900", display:"flex", gap:"6px", alignItems:"center"}}>{u.name} <span style={{background: getStatusBadge(u.profile_status).bg, color: getStatusBadge(u.profile_status).color, fontSize:"7px", padding:"2px 5px", borderRadius:"10px"}}>{getStatusBadge(u.profile_status).text}</span></div><div style={{fontSize:"11px", color:"#888"}}>{u.handle} • {u.followersCount} followers</div></div>
<div style={{color:"#D4AF37", fontWeight:"900"}}>${Number(u.total_worth||0).toFixed(0)}</div>
</div>
))}
</div>
</div>
)}

{view==="profile" && (
<div>
<WatermarkHeader avatarPreview={avatarPreview} totalWorth={totalWorth} myUserId={myId} myHandle={email?.split("@")[0] || "user"} userLocation={userLocation} userLat={userLat} userLng={userLng} streetAddress={streetAddress} suburb={suburb} city={city} payLink={payLink} payHandle={payHandle} payMethod={payMethod} profileStatus={profileStatus} onAvatarClick={()=>openImageModal(avatarPreview, {handle: email?.split("@")[0] || "user", bio: bio, isMine:true, profile_status: profileStatus})} />
<div style={{margin:"0 15px", border:"1px solid #D4AF37", borderRadius:"12px", padding:"14px"}}>
{editingBio ? (
<div>
<input value={bio} onChange={e=>setBio(e.target.value)} placeholder="Bio" style={{width:"100%", background:"#222", border:"1px solid #333", color:"white", padding:"10px", borderRadius:"8px", marginBottom:"8px"}}/>
<input value={about} onChange={e=>setAbout(e.target.value)} placeholder="About" style={{width:"100%", background:"#222", border:"1px solid #333", color:"white", padding:"10px", borderRadius:"8px", marginBottom:"12px"}}/>

<div style={{border:"2px solid #00ff88", borderRadius:"12px", padding:"12px", marginBottom:"12px", background:"#0a1a0f"}}>
<div style={{color:"#00ff88", fontWeight:"900", fontSize:"13px", marginBottom:"10px"}}>💎 PROFILE STATUS</div>
<div style={{display:"flex", gap:"6px", flexWrap:"wrap"}}>
<button onClick={()=>setProfileStatus("for_sale")} style={{background: profileStatus==="for_sale" ? "#00ff88" : "#222", color: profileStatus==="for_sale" ? "black" : "white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px", fontWeight:"900", fontSize:"11px"}}>✅ For Sale</button>
<button onClick={()=>setProfileStatus("sold")} style={{background: profileStatus==="sold" ? "#ff4444" : "#222", color:"white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px", fontWeight:"900", fontSize:"11px"}}>🔴 Sold Out</button>
<button onClick={()=>setProfileStatus("not_for_sale")} style={{background: profileStatus==="not_for_sale" ? "#888" : "#222", color:"white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px", fontWeight:"900", fontSize:"11px"}}>💎 Not For Sale</button>
</div>
</div>

<div style={{border:"1px solid #333", borderRadius:"10px", padding:"10px", marginBottom:"10px", background:"#0a0a0a"}}>
<div style={{color:"#D4AF37", fontWeight:"900", fontSize:"12px", marginBottom:"8px"}}>💰 Pay Me Setup - $IM ₿an€</div>
<select value={payMethod} onChange={e=>setPayMethod(e.target.value)} style={{width:"100%", background:"black", color:"white", border:"1px solid #444", padding:"8px", borderRadius:"8px", marginBottom:"8px"}}>
<option value="capitec">Capitec</option><option value="payshap">PayShap</option><option value="bank">EFT</option><option value="paypal">FNB</option><option value="custom">Custom Link</option>
</select>
<input value={payHandle} onChange={e=>setPayHandle(e.target.value)} placeholder="PayShap 082... or Capitec ID" style={{width:"100%", background:"black", color:"white", border:"1px solid #444", padding:"8px", borderRadius:"8px", marginBottom:"8px"}}/>
<input value={payLink} onChange={e=>setPayLink(e.target.value)} placeholder="Direct link https://..." style={{width:"100%", background:"black", color:"white", border:"1px solid #444", padding:"8px", borderRadius:"8px"}}/>
</div>
<div style={{border:"2px solid #D4AF37", borderRadius:"12px", padding:"12px", marginBottom:"12px", background:"#111"}}>
<div style={{color:"#D4AF37", fontWeight:"900", fontSize:"13px", marginBottom:"10px"}}>📍 Visit Me Setup - SIM MAPS</div>
<input value={streetAddress} onChange={e=>setStreetAddress(e.target.value)} placeholder="Street Address" style={{width:"100%", background:"black", color:"white", border:"1px solid #D4AF37", padding:"10px", borderRadius:"8px", marginBottom:"8px"}}/>
<input value={suburb} onChange={e=>setSuburb(e.target.value)} placeholder="Suburb" style={{width:"100%", background:"black", color:"white", border:"1px solid #D4AF37", padding:"10px", borderRadius:"8px", marginBottom:"8px"}}/>
<input value={city} onChange={e=>setCity(e.target.value)} placeholder="City" style={{width:"100%", background:"black", color:"white", border:"1px solid #444", padding:"10px", borderRadius:"8px", marginBottom:"8px"}}/>
<div style={{display:"flex", gap:"8px", marginBottom:"8px"}}>
<input value={userLat} onChange={e=>setUserLat(e.target.value)} placeholder="Lat" style={{flex:1, background:"black", color:"white", border:"1px solid #444", padding:"8px", borderRadius:"8px"}}/>
<input value={userLng} onChange={e=>setUserLng(e.target.value)} placeholder="Lng" style={{flex:1, background:"black", color:"white", border:"1px solid #444", padding:"8px", borderRadius:"8px"}}/>
</div>
<button onClick={()=>{ navigator.geolocation.getCurrentPosition(p=>{ setUserLat(p.coords.latitude.toString()); setUserLng(p.coords.longitude.toString()); alert(`Location captured!`); }); }} style={{width:"100%", background:"#222", border:"1px solid #D4AF37", color:"#D4AF37", padding:"10px", borderRadius:"8px", fontWeight:"900", marginBottom:"8px"}}>📍 Get Current Location (GPS)</button>
</div>
<button onClick={saveBio} style={{background:"#D4AF37", color:"black", fontWeight:"900", padding:"12px 16px", borderRadius:"8px", border:"none", width:"100%"}}>Save All ✓</button>
<button onClick={()=>setEditingBio(false)} style={{background:"#222", color:"white", padding:"8px 16px", borderRadius:"8px", border:"1px solid #333", width:"100%", marginTop:"8px"}}>Cancel</button>
</div>
) : (
<div>
<div style={{display:"flex", justifyContent:"space-between"}}><div style={{color:"#D4AF37", fontWeight:"bold", fontSize:"12px"}}>ABOUT ME</div><div style={{display:"flex", gap:"8px"}}><div onClick={()=>setEditingBio(true)} style={{color:"#D4AF37", fontSize:"12px", cursor:"pointer", border:"1px solid #D4AF37", padding:"4px 10px", borderRadius:"12px"}}>Edit Profile ✏️</div><div onClick={handleLogout} style={{color:"#ff4444", fontSize:"12px", cursor:"pointer", border:"1px solid #ff4444", padding:"4px 10px", borderRadius:"12px"}}>Logout ⎋</div></div></div>
<div style={{color:"white", fontSize:"13px", marginTop:"8px"}}>{bio}</div>
<div style={{color:"#888", fontSize:"11px"}}>{about}</div>
<div style={{display:"flex", gap:"6px", marginTop:"10px"}}>
<button onClick={()=>setProfileStatusDirect("for_sale")} style={{background: profileStatus==="for_sale" ? "#00ff88" : "#222", color: profileStatus==="for_sale" ? "black" : "white", border:"none", borderRadius:"6px", padding:"4px 8px", fontSize:"9px", fontWeight:"900"}}>Sale</button>
<button onClick={()=>setProfileStatusDirect("sold")} style={{background: profileStatus==="sold" ? "#ff4444" : "#222", color:"white", border:"none", borderRadius:"6px", padding:"4px 8px", fontSize:"9px", fontWeight:"900"}}>Sold</button>
<button onClick={()=>setProfileStatusDirect("not_for_sale")} style={{background: profileStatus==="not_for_sale" ? "#555" : "#222", color:"white", border:"none", borderRadius:"6px", padding:"4px 8px", fontSize:"9px", fontWeight:"900"}}>Not Sale</button>
</div>
</div>
)}
<div style={{marginTop:"10px", borderTop:"1px solid #222", paddingTop:"10px", display:"flex", justifyContent:"space-between"}}>
<div><div style={{color:"#888", fontSize:"10px"}}>NET WORTH</div><div style={{color:"#D4AF37", fontWeight:"900", fontSize:"20px"}}>$ {totalWorth.toFixed(2)}</div></div>
<div onClick={()=>setView("offers")} style={{cursor:"pointer", textAlign:"right", background: myOffersCount>0 ? "#1a1a00" : "transparent", border:"1px solid #D4AF37", padding:"6px 12px", borderRadius:"10px"}}>
<div style={{color:"#888", fontSize:"10px"}}>OFFERS RECEIVED {myOffersCount>0 && "🟢"}</div>
<div style={{color:"#D4AF37", fontWeight:"900", fontSize:"18px"}}>{myOffersCount} → View</div>
</div>
</div>
</div>
<div style={{padding:"12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginTop:"10px"}}>
{products.map((p)=>(
<div key={p.id} style={{background:"#111", borderRadius:"14px", overflow:"hidden", border: p.status==="sold" ? "1px solid #ff4444" : p.status==="not_for_sale" ? "1px solid #555" : "1px solid #2a2a2a", position:"relative"}}>
<div style={{position:"relative"}}>
<img src={p.img} onClick={()=>openImageModal(p.img, {id:p.id, img:p.img, price:p.price, title:p.title, owner_email:email, isMine:true, status:p.status})} style={{width:"100%", height:"100px", objectFit:"cover", cursor:"pointer", filter: p.status==="sold" ? "grayscale(60%)" : "none"}}/>
<div style={{position:"absolute", top:"6px", left:"6px", background: getStatusBadge(p.status).bg, color: getStatusBadge(p.status).color, fontSize:"7px", fontWeight:"900", padding:"2px 5px", borderRadius:"10px", border:"1px solid currentColor"}}>{getStatusBadge(p.status).text}</div>
</div>
<div style={{padding:"6px"}}>
{editingTitleId===p.id ? (<div style={{display:"flex", gap:"4px"}}><input value={tempTitle} onChange={e=>setTempTitle(e.target.value)} autoFocus style={{width:"90px", background:"#222", border:"1px solid #D4AF37", color:"white", borderRadius:"6px", padding:"4px"}}/><button onClick={()=>updateTitle(p.id)} style={{background:"#D4AF37", border:"none", borderRadius:"6px", padding:"4px 6px"}}>OK</button></div>) : (<div onClick={()=>{setEditingTitleId(p.id); setTempTitle(p.title||"");}} style={{fontSize:"11px", fontWeight:"bold", cursor:"pointer"}}>{p.title} ✏️</div>)}
{editingPriceId===p.id ? (<div style={{display:"flex", gap:"4px"}}><input value={tempPrice} onChange={e=>setTempPrice(e.target.value)} autoFocus type="number" style={{width:"60px", background:"#222", border:"1px solid #D4AF37", color:"white", borderRadius:"6px", padding:"4px"}}/><button onClick={()=>updatePrice(p.id)} style={{background:"#D4AF37", border:"none", borderRadius:"6px", padding:"4px 6px"}}>OK</button></div>) : (<div onClick={()=>{setEditingPriceId(p.id); setTempPrice(p.price.toString());}} style={{fontWeight:"900", fontSize:"12px", color: p.status==="sold" ? "#ff4444" : p.status==="not_for_sale" ? "#888" : "#D4AF37", cursor:"pointer"}}>$ {Number(p.price).toFixed(2)} ✏️</div>)}
<div style={{display:"flex", gap:"3px", marginTop:"6px"}}>
<button onClick={()=>setProductStatus(p.id, "for_sale")} style={{flex:1, background: p.status==="for_sale" || !p.status ? "#00ff88" : "#222", color: p.status==="for_sale" || !p.status ? "black" : "white", border:"none", borderRadius:"6px", padding:"4px 2px", fontSize:"8px", fontWeight:"900"}}>Sale</button>
<button onClick={()=>setProductStatus(p.id, "sold")} style={{flex:1, background: p.status==="sold" ? "#ff4444" : "#222", color:"white", border:"none", borderRadius:"6px", padding:"4px 2px", fontSize:"8px", fontWeight:"900"}}>Sold</button>
<button onClick={()=>setProductStatus(p.id, "not_for_sale")} style={{flex:1, background: p.status==="not_for_sale" ? "#555" : "#222", color:"white", border:"none", borderRadius:"6px", padding:"4px 2px", fontSize:"8px", fontWeight:"900"}}>Not Sale</button>
</div>
</div>
<div style={{position:"absolute", top:"6px", right:"6px", display:"flex", gap:"4px"}}>
<button onClick={()=>{setActiveProductId(p.id); productInputRef.current?.click();}} style={{background:"rgba(0,0,0,0.7)", border:"none", color:"white", borderRadius:"50%", width:"24px", height:"24px"}}>📷</button>
<button onClick={async()=>{setProducts(products.filter(x=>x.id!==p.id)); await supabase.from("products").delete().eq("id", p.id); loadFeed();}} style={{background:"rgba(255,0,0,0.7)", border:"none", color:"white", borderRadius:"50%", width:"20px", height:"20px"}}>×</button>
</div>
</div>
))}
<div onClick={addProduct} style={{background:"#0a0a0a", border:"2px dashed #D4AF37", borderRadius:"14px", height:"150px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer"}}>+ Add</div>
</div>
</div>
)}
{view==="accounts" && (
<div>
<div style={{padding:"15px", borderBottom:"1px solid #222"}}>
<h2 style={{color:"#D4AF37", margin:0, fontWeight:"900"}}>$IM Worth $tore 🛒 Available 🟢</h2>
<input placeholder="🔍 Search items by name..." value={marketSearch} onChange={e=>setMarketSearch(e.target.value)} style={{width:"100%", marginTop:"12px", background:"#111", border:"1px solid #D4AF37", color:"white", padding:"12px", borderRadius:"12px"}}/>
<div style={{marginTop:"12px", display:"flex", gap:"8px"}}>
<button onClick={()=>setSearchTab("market")} style={{flex:1, background: searchTab==="market" ? "#D4AF37" : "#111", color: searchTab==="market" ? "black" : "white", padding:"8px", borderRadius:"20px", border:"1px solid #D4AF37", fontWeight:"900", fontSize:"12px"}}>🛒 Sell List ({availableMarketItems.length})</button>
<button onClick={()=>setSearchTab("users")} style={{flex:1, background: searchTab==="users" ? "#D4AF37" : "#111", color: searchTab==="users" ? "black" : "white", padding:"8px", borderRadius:"20px", border:"1px solid #333", fontWeight:"900", fontSize:"12px"}}>💰 Buyers ({filteredProfiles.length})</button>
</div>
</div>
{searchTab==="market" && (
<div style={{padding:"12px"}}>
<div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
{availableMarketItems.map((p:any)=>{
  const owner = profiles.find(pr=> pr.email===p.owner_email);
  return (
  <div key={p.id} onClick={()=>{ const ownerProfile = profiles.find(pr=> pr.email===p.owner_email); const ownerHandle = ownerProfile?.handle || p.owner_email; openImageModal(p.img, {id:p.id, img:p.img, price:p.price, title:p.title, owner_email:p.owner_email, owner_handle: ownerHandle, isMine: p.owner_email===email, status:p.status}); }} style={{background:"#111", borderRadius:"14px", overflow:"hidden", border:"1px solid #2a2a2a", cursor:"pointer"}}>
    <div style={{position:"relative"}}><img src={p.img} style={{width:"100%", height:"130px", objectFit:"cover"}}/><div style={{position:"absolute", bottom:"6px", left:"6px", background:"rgba(0,0,0,0.7)", color:"#D4AF37", fontSize:"10px", fontWeight:"900", padding:"3px 6px", borderRadius:"10px"}}>${Number(p.price).toFixed(2)}</div></div>
    <div style={{padding:"8px"}}><div style={{fontSize:"12px", fontWeight:"bold", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{p.title}</div><div style={{fontSize:"10px", color:"#888"}}>{owner ? owner.handle : p.owner_email?.split("@")[0]}</div></div>
  </div>
  );
})}
</div>
</div>
)}
{searchTab==="users" && (
<div style={{padding:"15px"}}>
<input placeholder="Search @username..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%", background:"#111", border:"1px solid #333", color:"white", padding:"12px", borderRadius:"12px", marginBottom:"12px"}}/>
{filteredProfiles.map((u:any)=>(
<div key={u.handle} style={{display:"flex", gap:"10px", background: u.handle===myHandle ? "#1a1a0a" : "#111", padding:"12px", borderRadius:"12px", marginBottom:"10px", border: u.handle===myHandle ? "1px solid #D4AF37" : "1px solid #333"}}>
<div style={{display:"flex", gap:"10px", flex:1, cursor:"pointer"}} onClick={()=>{ if(u.handle===myHandle){ setView("profile"); } else { loadPublicUser(u); } }}>
<img src={u.avatar} style={{width:"44px", height:"44px", borderRadius:"50%"}}/>
<div style={{flex:1}}><div style={{fontWeight:"bold"}}>{u.name} {u.handle===myHandle && "(You)"}</div><div style={{fontSize:"11px", color:"#888"}}>{u.handle} • {follows.filter(f=>f.following_handle===u.handle).length} followers</div></div>
<div style={{color:"#D4AF37", fontWeight:"bold"}}>${Number(u.total_worth||0).toFixed(2)}</div>
</div>
{u.handle !== myHandle && (<button onClick={(e)=>{ e.stopPropagation(); handleFollow(u.handle); }} style={{background: follows.some(f=> f.follower_handle===myHandle && f.following_handle===u.handle) ? "#222" : "#D4AF37", color: "black", fontWeight:"900", padding:"6px 12px", borderRadius:"20px", border:"none", fontSize:"11px"}}>{follows.some(f=> f.follower_handle===myHandle && f.following_handle===u.handle) ? "✓" : "+ Follow"}</button>)}
</div>
))}
</div>
)}
</div>
)}
<div style={{position:"fixed", bottom:0, left:0, right:0, maxWidth:"480px", margin:"0 auto", background:"black", borderTop:"1px solid #D4AF37", display:"flex", justifyContent:"space-around", padding:"10px"}}>
<div onClick={()=>setView("accounts")} style={{color: view==="accounts" ? "#D4AF37" : "#888", cursor:"pointer"}}>🛒 $hop</div>
<div onClick={()=>setView("feed")} style={{color: view==="feed" ? "#D4AF37" : "#888", cursor:"pointer"}}>👑 Worth</div>
<div onClick={()=>setView("offers")} style={{color: view==="offers" ? "#D4AF37" : "#888", cursor:"pointer", position:"relative"}}>💬 Inbox {myOffersCount>0 && <span style={{position:"absolute", top:"-6px", right:"-8px", background:"red", color:"white", fontSize:"9px", padding:"2px 5px", borderRadius:"10px"}}>{myOffersCount}</span>}</div>
<div onClick={()=>setView("profile")} style={{color: view==="profile" ? "#D4AF37" : "#888", cursor:"pointer"}}>💎 Profile</div>
</div>
</div>
);
}
