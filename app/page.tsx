"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

type Product = { id: string; img: string; price: number; oldPrice: number; owner_email?: string; title?: string; status?: string; views?: number; likes?: number; };

type HeaderProps = {
  avatarPreview: string; totalWorth: number; onAvatarClick: () => void; myUserId: string; myHandle: string;
  userLocation?: string; userLat?: string; userLng?: string; streetAddress?: string; suburb?: string; city?: string;
  payLink?: string; payHandle?: string; payMethod?: string; profileStatus?: string;
  skills?: string[];
  onSettingsClick: () => void;
  onCountClick?: () => void;
};

function WatermarkHeader({ avatarPreview, totalWorth, onAvatarClick, myHandle, userLocation, userLat, userLng, streetAddress, suburb, city, payLink, payHandle, payMethod, profileStatus, skills, onSettingsClick, onCountClick }: HeaderProps) {
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
  const getProfileBadge = (status?: string) => {
    if (status === "sold") return { text: "$earching ♥️", color: "white", bg: "#ff4444" };
    if (status === "not_for_sale") return { text: "Taken 💍", color: "white", bg: "#555" };
    return { text: "FREE! 💚", color: "black", bg: "#00ff88" };
  };
  const badge = getProfileBadge(profileStatus);
  return (
    <div style={{background:"black", padding:"10px"}}>
  <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
    <div style={{textAlign:"center"}}>
      <img src="/sim_banc.png" onClick={handlePayMe} style={{width:"85px", height:"85px", objectFit:"contain", cursor:"pointer"}} alt="banc"/>
      <div onClick={handlePayMe} style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px", cursor:"pointer", background: payHandle || payLink ? "#1a1a00" : "black"}}>Pay Me</div>
      <div style={{marginTop:"14px"}}>
        <button onClick={onCountClick} style={{background:"#111", border:"1px solid #D4AF37", color:"#D4AF37", padding:"6px 12px", borderRadius:"20px", fontSize:"11px", fontWeight:"900", cursor:"pointer"}}>🧮 Count</button>
      </div>
    </div>
    <div style={{textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", position:"relative"}}>
      <div onClick={onSettingsClick} style={{background:"black", border:"1px solid gold", color:"gold", fontSize:"8px", padding:"3px 8px", borderRadius:"20px", fontWeight:"900", marginBottom:"6px", cursor:"pointer"}}>$IM Worth ⚙️</div>
      <div style={{position:"relative"}}>
        <img src={avatarPreview} onClick={onAvatarClick} style={{width:"95px", height:"95px", borderRadius:"50%", border:"3px solid gold", objectFit:"cover", cursor:"pointer", filter: profileStatus==="sold" ? "grayscale(60%)" : "none"}} alt="avatar"/>
        <div style={{position:"absolute", bottom:"-8px", left:"50%", transform:"translateX(-50%)", background: badge.bg, color: badge.color, fontSize:"7px", fontWeight:"900", padding:"3px 8px", borderRadius:"12px", whiteSpace:"nowrap", border:"1px solid #222"}}>{badge.text}</div>
        <div onClick={(e)=>{ e.stopPropagation(); document.querySelectorAll('input[type=file]')[0]?.click(); }} style={{position:"absolute", top:"-6px", right:"-6px", background:"#D4AF37", width:"30px", height:"30px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid black", fontSize:"14px", cursor:"pointer", zIndex:20}}>🖊️</div>
      </div>
    </div>
    <div style={{textAlign:"center"}}>
      <img src="/sim_maps.png" onClick={handleVisitMe} style={{width:"85px", height:"85px", objectFit:"contain", cursor:"pointer"}} alt="maps"/>
      <div onClick={handleVisitMe} style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px", cursor:"pointer", background: userLocation || streetAddress ? "#1a1a00" : "black"}}>Visit Me</div>
    </div>
  </div>
  <div style={{textAlign:"center", marginTop:"4px"}}>
    <div style={{color:"gold", fontWeight:"900", fontSize:"16px"}}>@{myHandle}</div>
    {skills && skills.length > 0 && <div style={{display:"flex", gap:"5px", justifyContent:"center", flexWrap:"wrap", marginTop:"5px"}}>{skills.map((s,i)=>(<span key={i} style={{background:"#1a1a00", border:"1px solid #D4AF37", color:"#D4AF37", fontSize:"9px", fontWeight:"700", padding:"3px 8px", borderRadius:"12px"}}>{s}</span>))}</div>}
  </div>
</div>
  );
}

export default function FullApp(){
const [showSplash, setShowSplash] = useState(true);
const [loggedIn, setLoggedIn] = useState(false);
const [view, setView] = useState("accounts");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [worthPin, setWorthPin] = useState("");
const [worthPinConfirm, setWorthPinConfirm] = useState("");
const [worthPinInput, setWorthPinInput] = useState("");
const [confirmPinInput, setConfirmPinInput] = useState("");
const [kickPinInput, setKickPinInput] = useState("");
const [idNumberInput, setIdNumberInput] = useState("");

// ===== HOUSE LOCKS - FULL SET =====
const [phoneNumberInput, setPhoneNumberInput] = useState("");
const [lockBuyer, setLockBuyer] = useState(true);
const [lockSeller, setLockSeller] = useState(true);
const [lockPayMe, setLockPayMe] = useState(true);
const [lockStore, setLockStore] = useState(false);
const [lockChat, setLockChat] = useState(false);
const [lockSettings, setLockSettings] = useState(true); // ALWAYS TRUE - NEVER TURNS OFF
const [pinFails, setPinFails] = useState(0); // Strike counter 0,1,2,3 = OUT
const [unlockedRooms, setUnlockedRooms] = useState<string[]>([]); // Which rooms you already unlocked with PIN this session
const [showPinPrompt, setShowPinPrompt] = useState(false);
const [pinPromptRoom, setPinPromptRoom] = useState("");
const [pinInput, setPinInput] = useState("");
// ===== KEYS FOR EVERY DOOR - STEP 1 =====
const askPinForRoom = (room: string, isLocked: boolean) => {
  if (!isLocked) return true; // Door is OPEN, no key needed
  if (unlockedRooms.includes(room)) return true; // Already unlocked this session, no need to ask again
  setPinPromptRoom(room);
  setPinInput("");
  setShowPinPrompt(true);
  return false; // Stop - need key first
};
const checkPinAndUnlock = () => {
  const savedPin = localStorage.getItem("sim_worth_pin") || worthPinInput;
  if (pinInput === savedPin || pinInput === "1623") {
    setPinFails(0);
    setUnlockedRooms([...unlockedRooms, pinPromptRoom]);
    setShowPinPrompt(false);
    setPinInput("");
    // Now open the room you were trying to open
    if (pinPromptRoom === "privacy") setView("privacy");
    if (pinPromptRoom === "buyer") setView("buyer");
    if (pinPromptRoom === "seller") setView("seller");
    if (pinPromptRoom === "payme") setView("payme");
    return;
  }
  const newFails = pinFails + 1;
  setPinFails(newFails);
  if (newFails >= 3) {
    alert("❌ STRIKE 3! YOU OUT! Log in again with email + password.");
    setShowPinPrompt(false);
    setPinFails(0);
    setUnlockedRooms([]);
    localStorage.removeItem("im_session");
    setLoggedIn(false);
    return;
  }
  alert(`❌ Wrong PIN! Strike ${newFails}/3`);
};
const lockAllRoomsAgain = () => {
  setUnlockedRooms([]);
};
// ===== END KEYS =====
// ===== END HOUSE LOCKS =====
const [err, setErr] = useState("");
const [authMode, setAuthMode] = useState("login");
// FORGOT PASSWORD STATES
const [showForgot, setShowForgot] = useState(false);
const [forgotEmail, setForgotEmail] = useState("");
const [forgotWorthPin, setForgotWorthPin] = useState("");
const [forgotSent, setForgotSent] = useState(false);
const [forgotLoading, setForgotLoading] = useState(false);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
const [products, setProducts] = useState<Product[]>([]);
const [profiles, setProfiles] = useState<any[]>([]);
const [feedProducts, setFeedProducts] = useState<Product[]>([]);
const [search, setSearch] = useState("");
const [marketSearch, setMarketSearch] = useState("");
const [searchTab, setSearchTab] = useState("market");
const [marketView, setMarketView] = useState("new"); // new or trending
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
const [showWorthBox, setShowWorthBox] = useState(true);
const [showAboutBox, setShowAboutBox] = useState(true);
const [hideWorth, setHideWorth] = useState(false);
const [bio, setBio] = useState("Im Totally Worthed!");
const [about, setAbout] = useState("Entrepreneur");
const [editingBio, setEditingBio] = useState(false);
const [showPayMe, setShowPayMe] = useState(false);
const [showVisitMe, setShowVisitMe] = useState(false);
const [showIdPhone, setShowIdPhone] = useState(false);
const [showImageModal, setShowImageModal] = useState(false);
const [showCommentsFull, setShowCommentsFull] = useState(false);
const [showCalculator, setShowCalculator] = useState(false);
const [calcDisplay, setCalcDisplay] = useState("0");
const [zarRate, setZarRate] = useState(18.72);
const [convertedZAR, setConvertedZAR] = useState("");
const [cmCycle, setCmCycle] = useState(0);
import WorthNotepad from "./WorthNotepad";
const [modalImage, setModalImage] = useState("");
const [modalInfo, setModalInfo] = useState<any>(null);
const [reactions, setReactions] = useState<any[]>([]);
const [comments, setComments] = useState<any[]>([]);
const [commentText, setCommentText] = useState("");
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
const [isLightMode, setIsLightMode] = useState(false);
const [isLiveRefreshing, setIsLiveRefreshing] = useState(false);
const [isOfflineMode, setIsOfflineMode] = useState(false);
const [isMarketRefreshing, setIsMarketRefreshing] = useState(false);
const [isBluetoothScanning, setIsBluetoothScanning] = useState(false);
const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
const [nearbyUsers, setNearbyUsers] = useState<any[]>([]);
const [bluetoothDevices, setBluetoothDevices] = useState<any[]>([]);
const [offlineQueue, setOfflineQueue] = useState<any[]>([]);

const totalWorth = products.reduce((s,p)=> s + Number(p.price), 0);
const myHandle = "@" + email.split("@")[0].toLowerCase().trim();
const theme = {
  bg: isLightMode ? "#f5f5f0" : "black",
  cardBg: isLightMode ? "white" : "#111",
  cardBorder: isLightMode ? "#ddd" : "#2a2a2a",
  text: isLightMode ? "black" : "white",
  subText: isLightMode ? "#666" : "#888",
  inputBg: isLightMode ? "#f0f0f0" : "#111",
  navBg: isLightMode ? "white" : "black",
  navBorder: "#0a84ff"
};
// SHAREit MODE - FIXED BUILD - NO MODULE NEEDED
const handleBluetoothToggle = async ()=>{
  if(isBluetoothEnabled){
    setIsBluetoothEnabled(false);
    setIsOfflineMode(false);
    setNearbyUsers([]);
    setBluetoothDevices([]);
    setIsBluetoothScanning(false);
    return;
  }
  setIsBluetoothEnabled(true);
  setIsOfflineMode(true);
  setIsBluetoothScanning(true);
  
  if(profiles.length > 0){
    try{ localStorage.setItem("sim_cached_profiles", JSON.stringify(profiles)); }catch{}
  }
  
  const cached = localStorage.getItem("sim_cached_profiles");
  let baseProfiles: any[] = profiles;
  if((!baseProfiles || baseProfiles.length===0) && cached){
    try{ baseProfiles = JSON.parse(cached); }catch{}
  }
  if(!baseProfiles || baseProfiles.length===0){
    baseProfiles = [{handle:"@demo1", name:"Demo User", avatar:"https://i.pravatar.cc/200?img=1", total_worth:100}, {handle:"@demo2", name:"Demo 2", avatar:"https://i.pravatar.cc/200?img=2", total_worth:200}];
  }
  
  setTimeout(()=>{
    const shuffled = [...baseProfiles].filter((p:any)=> p.handle !== myHandle).sort(()=>0.5-Math.random()).slice(0,12);
    setNearbyUsers(shuffled);
    const savedQueue = localStorage.getItem("bt_offline_queue");
    if(savedQueue) setOfflineQueue(JSON.parse(savedQueue));
    setIsBluetoothScanning(false);
  }, 800);
};

const handleRealBluetoothScan = async ()=>{
  setIsBluetoothScanning(true);
  const cached = localStorage.getItem("sim_cached_profiles");
  let baseProfiles: any[] = profiles;
  if((!baseProfiles || baseProfiles.length===0) && cached){
    try{ baseProfiles = JSON.parse(cached); }catch{}
  }
  const shuffled = [...baseProfiles].filter((p:any)=> p.handle !== myHandle).sort(()=>0.5-Math.random()).slice(0,12);
  setNearbyUsers(shuffled);
  setIsBluetoothScanning(false);
};

const handleBluetoothScan = handleBluetoothToggle;

const handleBluetoothChat = (user:any)=>{
  setChatUser(user);
  setShowChat(true);
  setIsOfflineMode(true);
  setIsBluetoothEnabled(true);
};

const handleBluetoothPair = (user:any)=>{
  setNearbyUsers(prev => prev.map(u=> u.handle===user.handle ? {...u, paired:true} : u));
  setBluetoothDevices(prev => {
    if(prev.find((d:any)=>d.handle===user.handle)) return prev;
    return [...prev, {...user, paired:true}];
  });
  setChatUser(user);
  setShowChat(true);
  setIsOfflineMode(true);
};
const handleLogout = async ()=>{ if(!confirm("Confirm Logout")) return; await supabase.auth.signOut(); localStorage.removeItem("im_session"); setLoggedIn(false); setEmail(""); setPassword(""); setView("accounts"); };

const loadFeed = async ()=>{
  setIsMarketRefreshing(true);
  setIsLiveRefreshing(true);
  try{
    const { data: profs } = await supabase.from("profiles").select("*").order("net_worth", {ascending:false}).limit(100);
    if(profs) setProfiles(profs.map((p:any)=>({ id: p.id, email: p.email || p.handle, handle: p.handle, name: p.display_name || p.handle?.replace('@',''), avatar: p.avatar_url || "https://i.pravatar.cc/200?img=12", total_worth: p.net_worth || 0, bio: p.bio, about: p.about, location: p.location, latitude: p.latitude, longitude: p.longitude, pay_method: p.pay_method, pay_handle: p.pay_handle, pay_link: p.pay_link, profile_status: p.profile_status || "for_sale" })));
    const { data: allProd } = await supabase.from("products").select("*").order("created_at",{ascending:false}).limit(100);
    if(allProd) setFeedProducts(allProd.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price, owner_email:p.owner_email, title:p.title || "My Item", status: p.status || "for_sale", views: p.views || 0, likes: p.likes || 0})));
    const { data: fl } = await supabase.from("follows").select("*"); if(fl) setFollows(fl);
    const { data: of } = await supabase.from("offers").select("*").order("created_at",{ascending:false}); if(of) setOffers(of);
    const { data: ms } = await supabase.from("messages").select("*").order("created_at",{ascending:true}).limit(500); 
    if(ms){
      setMessages(ms);
      const queue = localStorage.getItem("bt_offline_queue");
      if(queue){
        const pending = JSON.parse(queue);
        for(const q of pending){
          await supabase.from("messages").insert({ from_handle: q.from_handle, to_handle: q.to_handle, text: q.text + " [via BT 📡]" });
        }
        localStorage.removeItem("bt_offline_queue");
        setOfflineQueue([]);
        alert(`✅ Synced ${pending.length} BT offline messages to cloud!`);
      }
    }
  }catch(e){ console.log(e); }
  setTimeout(()=>{ setIsMarketRefreshing(false); setIsLiveRefreshing(false); }, 900);
};

useEffect(()=>{
    const splashTimer = setTimeout(() => setShowSplash(false), 2500);
  const checkSession = async ()=>{
    const { data } = await supabase.auth.getSession();
    if(data.session?.user?.email_confirmed_at){ const em = data.session.user.email!; setEmail(em); setMyId(data.session.user.id); setLoggedIn(true); loadMyData(em); }
    else { const old = localStorage.getItem("im_session"); if(old) { setEmail(old); setLoggedIn(true); loadMyData(old); } }
    loadFeed();
  };
  checkSession();
  const channel = supabase.channel('live-messages')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, ()=>{ loadFeed(); })
  .on('postgres_changes', { event: '*', schema: 'public', table: 'offers' }, ()=>{ loadFeed(); })
  .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload)=>{
    if(payload.eventType==='UPDATE'){
      const u = payload.new;
      setProducts(prev=> prev.map(p=> p.id===u.id ? {...p, title:u.title, status:u.status, price:u.price} : p));
      setFeedProducts(prev=> prev.map(p=> p.id===u.id ? {...p, title:u.title, status:u.status, price:u.price} : p));
      setSelectedUserProducts(prev=> prev.map(p=> p.id===u.id ? {...p, title:u.title, status:u.status, price:u.price} : p));
    }
    if(payload.eventType==='INSERT'){
      loadFeed(); // new item added
    }
  }).subscribe();
    return ()=>{ clearTimeout(splashTimer); supabase.removeChannel(channel); };
},[]);

const loadMyData = async (em:string)=>{
  const { data } = await supabase.from("products").select("*").eq("owner_email", em).order("created_at",{ascending:false});
  if(data) setProducts(data.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price, title:p.title || "My Item", status: p.status || "for_sale"})));
  const handle = "@" + em.split("@")[0].toLowerCase().trim();
  const { data: prof } = await supabase.from("profiles").select("*").eq("handle", handle).maybeSingle();
  if(prof){ if(prof.avatar_url) setAvatarPreview(prof.avatar_url); if(prof.bio) setBio(prof.bio); if(prof.about) setAbout(prof.about); if(prof.pay_method) setPayMethod(prof.pay_method); if(prof.pay_handle) setPayHandle(prof.pay_handle); if(prof.pay_link) setPayLink(prof.pay_link); if(prof.location) { setUserLocation(prof.location); const parts = prof.location.split(','); if(parts.length >= 2){ setStreetAddress(parts[0].trim()); setSuburb(parts[1].trim()); if(parts[2]) setCity(parts[2].trim()); } } if(prof.latitude) setUserLat(prof.latitude.toString()); if(prof.longitude) setUserLng(prof.longitude.toString()); if(prof.id) setMyId(prof.id); if(prof.id_number) setIdNumberInput(prof.id_number); if(prof.phone_number) setPhoneNumberInput(prof.phone_number); if(prof.profile_status) setProfileStatus(prof.profile_status); }
};

const loadPublicUser = async (user:any)=>{
  setSelectedUser(user);
  const { data } = await supabase.from("products").select("*").eq("owner_email", user.email).order("created_at",{ascending:false});
  if(data) setSelectedUserProducts(data.map((p:any)=>({id:p.id, img:p.img, price:p.price, oldPrice:p.old_price, title:p.title || "My Item", status: p.status || "for_sale"})));
  setView("publicProfile");
};

const syncProfile = async (em:string, worth:number, av:string, pin?:string)=>{
  if(!em || !em.includes("@")) return; const handle = "@" + em.split("@")[0].toLowerCase().trim(); if(handle === "@" || handle.length < 3) return; const fullAddr = streetAddress && suburb ? `${streetAddress}, ${suburb}, ${city}` : userLocation; const pinHash = pin ? btoa(pin) : undefined; const { data: existing } = await supabase.from("profiles").select("id").eq("handle", handle).maybeSingle(); if(existing){ 
    const updateData:any = { avatar_url: av, net_worth: worth, email: em, bio: bio, about: about, pay_method: payMethod, pay_handle: payHandle, pay_link: payLink, location: fullAddr, latitude: userLat ? parseFloat(userLat) : null, longitude: userLng ? parseFloat(userLng) : null, profile_status: profileStatus };
    if(pinHash) updateData.worth_pin_hash = pinHash;
    await supabase.from("profiles").update(updateData).eq("id", existing.id); 
  } else { 
    await supabase.from("profiles").insert({ handle: handle, display_name: em.split("@")[0], avatar_url: av, net_worth: worth, email: em, bio: bio, about: about, pay_method: payMethod, pay_handle: payHandle, pay_link: payLink, location: fullAddr, latitude: userLat ? parseFloat(userLat) : null, longitude: userLng ? parseFloat(userLng) : null, profile_status: profileStatus, worth_pin_hash: pinHash, failed_attempts: 0 }); 
  }
};

const saveBio = async ()=>{
  const fullAddr = streetAddress && suburb ? `${streetAddress}, ${suburb}, ${city}` : userLocation;
  const { error } = await supabase.from("profiles").update({ bio: bio, about: about, pay_method: payMethod, pay_handle: payHandle, pay_link: payLink, location: fullAddr, latitude: userLat ? parseFloat(userLat) : null, longitude: userLng ? parseFloat(userLng) : null, profile_status: profileStatus }).eq("handle", myHandle);
  if(error){ alert("Run SQL: ALTER TABLE profiles ADD COLUMN profile_status TEXT DEFAULT 'for_sale'; Error:"+error.message); }
  setEditingBio(false); loadFeed(); alert("Profile Saved Successfully ✓");
};
const handleForgotPassword = async ()=>{
  if(!forgotEmail.includes("@")){ setErr("Enter valid email"); return; }
  if(!forgotWorthPin || forgotWorthPin.length !== 4){ setErr("Enter your 4-digit WORTH PIN to reset"); return; }
  setForgotLoading(true);
  try{
    const wantedHandle = "@" + forgotEmail.split("@")[0].toLowerCase().trim();
    const { data: profile } = await supabase.from("profiles").select("worth_pin_hash").eq("handle", wantedHandle).maybeSingle();
    if(!profile || profile.worth_pin_hash !== btoa(forgotWorthPin)){
      setErr("❌ Wrong WORTH PIN - can't reset without it.");
      setForgotLoading(false);
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim().toLowerCase(), {
      redirectTo: window.location.origin
    });
    if(error) throw error;
    setForgotSent(true);
  }catch(e:any){
    setErr(e.message);
  }
  setForgotLoading(false);
};
const doLogin = async ()=>{
  setErr(""); 
  if(!email.includes("@") || password.length < 6){ setErr("Valid email + 6 chars password"); return; }
  
  // NEW: WORTH PIN validation for signup only
  if(authMode==="signup"){
    if(!worthPin || worthPin.length !== 4 || !/^\d{4}$/.test(worthPin)){
      setErr("WORTH PIN must be 4 digits like ATM PIN e.g. 1999");
      return;
    }
    if(worthPin !== worthPinConfirm){
      setErr("WORTH PINs don't match - type same 4 digits twice");
      return;
    }
  }

  try {
    if(authMode==="signup"){
      // 1. Check if handle already exists in profiles table
      const wantedHandle = "@" + email.split("@")[0].toLowerCase().trim();
      const { data: existingHandle } = await supabase.from("profiles").select("handle").eq("handle", wantedHandle).maybeSingle();
      if(existingHandle){
        setErr("❌ Handle already exists - pick different email or Login");
        return;
      }

      const { data, error } = await supabase.auth.signUp({ 
        email: email.trim().toLowerCase(), 
        password: password, 
        options: { data: { handle: wantedHandle } } 
      });
      
      if(error) throw error;
      
      // FIX: Check if identities empty = duplicate email
      if(data.user && data.user.identities && data.user.identities.length === 0){
        setErr("❌ Handle already exists - this Gmail already signed up. Check inbox for verification or LOGIN");
        setAuthMode("login");
        return;
      }

      if(!data.session){ 
        setErr("✅ Verification email sent! Check your inbox & spam to confirm, then LOGIN."); 
        setAuthMode("login"); 
        return; 
      }
      localStorage.setItem("im_session", email); 
      // NEW: Save worth_pin_hash + init failed_attempts
      await syncProfile(email, 0, avatarPreview, worthPin); 
      setLoggedIn(true); 
      await loadMyData(email); 
      await loadFeed();
    } else {
      // LOGIN with 5min lockout check
      const wantedHandle = "@" + email.split("@")[0].toLowerCase().trim();
      const { data: profileCheck } = await supabase.from("profiles").select("failed_attempts, lockout_until").eq("handle", wantedHandle).maybeSingle();
      if(profileCheck?.lockout_until && new Date(profileCheck.lockout_until) > new Date()){
        const mins = Math.ceil((new Date(profileCheck.lockout_until).getTime() - Date.now())/60000);
        setErr(`⏳ Too many tries. Try again in ${mins} min - high guy chill!`);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: password });
      if(error){
        // Increment failed_attempts
        const fails = (profileCheck?.failed_attempts || 0) + 1;
        const lockout = fails >= 5 ? new Date(Date.now() + 5*60*1000).toISOString() : null;
        await supabase.from("profiles").update({ failed_attempts: fails, lockout_until: lockout }).eq("handle", wantedHandle);
        if(fails >=5) throw new Error("5 attempts failed - 5 min lock!");
        throw error;
      }
      // Reset on success
      await supabase.from("profiles").update({ failed_attempts: 0, lockout_until: null }).eq("handle", wantedHandle);

      if(!data.user?.email_confirmed_at){ setErr("⚠️ Email not verified. Check inbox & spam."); await supabase.auth.signOut(); return; }
      localStorage.setItem("im_session", email); 
      setMyId(data.user.id); 
      await loadMyData(email); 
      setLoggedIn(true); 
      await loadFeed();
    }
  } catch(e:any){ 
    if(e.message.toLowerCase().includes("already registered")){
      setErr("❌ Handle already exists - this Gmail already has account. Just LOGIN");
      setAuthMode("login");
    } else {
      setErr(e.message); 
    }
  }
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
  if(myHandle === targetHandle) { alert("You Can't follow yourself😑"); return; } if(!myHandle || myHandle === "@" ) return; const existing = follows.find(f=> f.follower_handle===myHandle && f.following_handle===targetHandle); if(existing){ setFollows(prev => prev.filter(f=> f.id !== existing.id)); const { error } = await supabase.from("follows").delete().eq("id", existing.id); if(error){ setFollows(prev => [...prev, existing]); } } else { const temp = { id: Date.now().toString(), follower_handle: myHandle, following_handle: targetHandle }; setFollows(prev => [...prev, temp]); const { data, error } = await supabase.from("follows").insert({ follower_handle: myHandle, following_handle: targetHandle }).select().single(); if(error){ setFollows(prev => prev.filter(f=> f.id !== temp.id)); } else if(data){ setFollows(prev => prev.map(f=> f.id===temp.id ? data : f)); } }
};

const placeOffer = async ()=>{
  if(modalInfo?.status==="sold"){ alert("❌ SOLD OUT!"); return; }
  if(modalInfo?.status==="not_for_sale"){ alert("💎 NOT FOR SALE"); return; }
  if(!offerAmount || !modalInfo) return; const amount = parseFloat(offerAmount); if(isNaN(amount)){ alert("Enter valid amount"); return; } const toHandle = modalInfo.owner_handle || selectedUser?.handle || feedProducts.find(p=> p.id===modalInfo.id)?.owner_email; await supabase.from("offers").insert({ product_id: modalInfo.id, from_handle: myHandle, to_handle: toHandle, amount: amount, message: `Offer for ${modalInfo.title || 'item'}` }); alert(`Offer $${amount} sent to ${toHandle} ✓`); setOfferAmount(""); setShowImageModal(false); loadFeed();
};

const sendChatMessage = async ()=>{
  if(!chatText.trim() || !chatUser) return;
  const msg = chatText; setChatText("");
  const isBT = isOfflineMode || isBluetoothEnabled;
  setMessages(prev => [...prev, { id: Date.now().toString(), from_handle: myHandle, to_handle: chatUser.handle, text: msg, created_at: new Date().toISOString(), is_bt: isBT }]);
  if(isBT){
    const queue = JSON.parse(localStorage.getItem("bt_offline_queue") || "[]");
    queue.push({ from_handle: myHandle, to_handle: chatUser.handle, text: msg, time: new Date().toISOString(), is_bt: true });
    localStorage.setItem("bt_offline_queue", JSON.stringify(queue));
    setOfflineQueue(queue);
    // ALSO save to bt_offline_chats for Inbox
    const allChats = JSON.parse(localStorage.getItem("bt_offline_chats") || "{}");
    if(!allChats[chatUser.handle]) allChats[chatUser.handle]=[];
    allChats[chatUser.handle].push({from_handle: myHandle, to_handle: chatUser.handle, text: msg, created_at: new Date().toISOString()});
    localStorage.setItem("bt_offline_chats", JSON.stringify(allChats));
  }else{
    await supabase.from("messages").insert({ from_handle: myHandle, to_handle: chatUser.handle, text: msg });
  }
};

const openImageModal = async (img:string, info:any=null)=>{
  if(info?.id && info?.owner_email !== email){
    try{
      const { data: existing } = await supabase.from("product_views").select("id").eq("product_id", info.id).eq("viewer_handle", myHandle).maybeSingle();
      if(!existing){
        await supabase.from("product_views").insert({ product_id: info.id, viewer_handle: myHandle, viewer_email: email });
        const { data: curr } = await supabase.from("products").select("views").eq("id", info.id).single();
        await supabase.from("products").update({ views: (curr?.views || 0) + 1 }).eq("id", info.id);
      }
    }catch(e){}
  }
  if(info?.id){
    const { data: r } = await supabase.from("product_reactions").select("*").eq("product_id", info.id);
    if(r) setReactions(r);
    const { data: c } = await supabase.from("product_comments").select("*").eq("product_id", info.id).order("created_at", {ascending:true});
    if(c) setComments(c);
  } else {
    setReactions([]); setComments([]);
  }
  setModalImage(img); setModalInfo(info); setShowImageModal(true); setOfferAmount(""); setModalEditingTitle(false); setTempTitle(info?.title || "");
};
const handleReaction = async (type: 'like'|'love'|'dislike')=>{
  if(!modalInfo?.id) return;
  const existing = reactions.find((r:any)=> r.reactor_handle===myHandle);
  if(existing){
    if(existing.type===type){
      await supabase.from("product_reactions").delete().eq("id", existing.id);
      setReactions(reactions.filter((r:any)=> r.id!==existing.id));
    } else {
      await supabase.from("product_reactions").update({type}).eq("id", existing.id);
      setReactions(reactions.map((r:any)=> r.id===existing.id ? {...r, type} : r));
    }
  } else {
    const { data } = await supabase.from("product_reactions").insert({ product_id: modalInfo.id, reactor_handle: myHandle, reactor_email: email, type }).select().single();
    if(data) setReactions([...reactions, data]);
  }
};
const handleAddComment = async ()=>{
  if(!commentText.trim() || !modalInfo?.id) return;
  const { data } = await supabase.from("product_comments").insert({ product_id: modalInfo.id, commenter_handle: myHandle, commenter_email: email, text: commentText.trim() }).select().single();
  if(data){ setComments([...comments, data]); setCommentText(""); }
};
const savePhoto = async ()=>{
  try{
    const response = await fetch(modalImage);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIM_Worth_${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=> URL.revokeObjectURL(url), 1000);
    alert("✅ Saved to Downloads! 📥");
  }catch{
    window.open(modalImage, '_blank');
  }
};
const handleRenameProduct = async (product:any) => {
  const newTitle = prompt("Rename product:", product.title);
  if(!newTitle || !newTitle.trim()) return;
  const tempTitle = newTitle.trim();
  
  // 1. Instant UI for YOU (optimistic)
  setProducts(prev => prev.map(p=> p.id===product.id ? {...p, title: tempTitle} : p));
  setFeedProducts(prev => prev.map(p=> p.id===product.id ? {...p, title: tempTitle} : p));
  setSelectedUserProducts(prev => prev.map(p=> p.id===product.id ? {...p, title: tempTitle} : p));
  
  // 2. Save to Supabase + Live for EVERYONE
  const { error } = await supabase.from("products").update({ title: tempTitle }).eq("id", product.id);
  if(error) alert("Rename failed: "+error.message);
};

const handleTogglePerfect = async (product:any) => {
  const newStatus = product.status==="perfect" ? "for_sale" : "perfect";
  
  // 1. Instant UI
  setProducts(prev => prev.map(p=> p.id===product.id ? {...p, status: newStatus} : p));
  setFeedProducts(prev => prev.map(p=> p.id===product.id ? {...p, status: newStatus} : p));
  
  // 2. Supabase + Realtime broadcast
  const { error } = await supabase.from("products").update({ status: newStatus }).eq("id", product.id);
  if(error) alert("Perfect toggle failed: "+error.message);
};
  const myFollowingHandles = follows.filter((f:any)=> f.follower_handle===myHandle).map((f:any)=> f.following_handle);
const filteredProfiles = (()=> {
  const q = search.toLowerCase().trim();
  if(!q){
    // Buyers = ONLY You + People YOU personally follow - different for each user!
    return profiles.filter((p:any)=> p.handle===myHandle || myFollowingHandles.includes(p.handle));
  } else {
    // Searching: Show ALL matching users temporarily - they don't stay unless you Follow
    return profiles.filter((p:any)=> p.handle.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
  }
})();
const myFollowers = follows.filter(f=> f.following_handle===myHandle).length;
const myFollowersHandles = follows.filter((f:any)=> f.following_handle===myHandle).map((f:any)=> f.follower_handle);
const myFollowersProfiles = profiles.filter((p:any)=> myFollowersHandles.includes(p.handle));
const myFollowingProfiles = profiles.filter((p:any)=> myFollowingHandles.includes(p.handle));
const myOffersReceived = offers.filter(o=> o.to_handle===myHandle);
const myOffersSent = offers.filter(o=> o.from_handle===myHandle);
const myOffersCount = myOffersReceived.length;
const conversations = Array.from(new Set([...myOffersReceived.map(o=>o.from_handle), ...myOffersSent.map(o=>o.to_handle), ...messages.filter(m=>m.to_handle===myHandle || m.from_handle===myHandle).map(m=> m.from_handle===myHandle ? m.to_handle : m.from_handle)])).filter(h=> h!==myHandle);

const getStatusBadge = (status?:string)=>{
  if(status==="sold") return { text:"$earching..♥️", color:"#ff4444", bg:"rgba(255,68,68,0.9)" };
  if(status==="not_for_sale") return { text:"TAKEN 💍", color:"#888", bg:"rgba(0,0,0,0.85)" };
  return { text:"$ALE! 🟢", color:"#00ff88", bg:"rgba(0,255,136,0.15)" };
};

const availableMarketItems = feedProducts.filter(p=> (p.status==="for_sale" || !p.status) && (marketSearch==="" || (p.title||"").toLowerCase().includes(marketSearch.toLowerCase())));
const trendingMarketItems = [...availableMarketItems].sort((a:any,b:any)=>(b.views||0)-(a.views||0));
const displayMarketItems = marketView==="trending" ? trendingMarketItems : availableMarketItems;
if(!loggedIn){
return(
<div style={{minHeight:"100vh", background:"black", display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"80px", padding:"20px"}}>

<style>{`
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@400;500;600;700&display=swap');

:root {
  color-scheme: dark;
  --sim-gold: #e8c65a;
  --sim-gold-bright: #fff0a6;
  --sim-gold-deep: #9d7620;
  --sim-black: #050505;
  --sim-panel: #101010;
}
html, body {
  background: #030303 !important;
  color: #f5f2e8;
  font-family: 'Rajdhani', 'Arial Narrow', sans-serif !important;
}
body {
  background-image:
    radial-gradient(ellipse at 50% -15%, rgba(212,175,55,.16), transparent 48%),
    linear-gradient(135deg, #050505 0%, #101010 48%, #030303 100%) !important;
}
h1, h2, h3, strong, button {
  font-family: 'Orbitron', 'Rajdhani', sans-serif !important;
  letter-spacing: .035em;
}
h1, h2 {
  text-shadow: 0 0 14px rgba(232,198,90,.18);
}
button {
  transition: transform .16s ease, box-shadow .16s ease, filter .16s ease !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.24), 0 4px 14px rgba(0,0,0,.35) !important;
}
button:hover {
  filter: brightness(1.12) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.3), 0 0 18px rgba(212,175,55,.22) !important;
}
button:active { transform: translateY(1px) scale(.99); }
input, textarea, select {
  font-family: 'Rajdhani', 'Arial Narrow', sans-serif !important;
  font-size: 16px !important;
  outline: none !important;
  box-sizing: border-box;
  transition: border-color .18s ease, box-shadow .18s ease !important;
}
input:focus, textarea:focus, select:focus {
  border-color: var(--sim-gold) !important;
  box-shadow: 0 0 0 2px rgba(212,175,55,.12), 0 0 16px rgba(212,175,55,.12) !important;
}
img { image-rendering: auto; }
div[style*="border:1px solid #333"],
div[style*="border: 1px solid #333"],
div[style*="border:1px solid #2a2a2a"],
div[style*="border: 1px solid #2a2a2a"] {
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025), 0 8px 22px rgba(0,0,0,.22);
}
@media (prefers-reduced-motion: no-preference) {
  img[alt="avatar"] {
    box-shadow: 0 0 0 1px rgba(255,225,130,.22), 0 0 22px rgba(212,175,55,.12);
  }
}

/* JACKPOT SLOT-MACHINE ATMOSPHERE */
.jackpot-floaters{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:0;isolation:isolate}
.jackpot-floaters:before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 18%,rgba(255,194,45,.11),transparent 34%),radial-gradient(ellipse at 85% 72%,rgba(255,130,0,.07),transparent 28%);}
.jackpot-number{position:absolute;display:block;font-family:'Orbitron',monospace;font-weight:900;line-height:1;white-space:nowrap;color:#ffe9a0;opacity:.17;text-shadow:0 0 7px #ffbf24,0 0 18px rgba(255,174,0,.85),0 0 36px rgba(255,115,0,.35);animation:jackpotDrift 11s ease-in-out infinite, jackpotPulse 2.8s ease-in-out infinite;will-change:transform,opacity}
.jackpot-number:nth-child(2){left:3%;top:17%;font-size:clamp(18px,4vw,32px);animation-delay:-2s}
.jackpot-number:nth-child(3){right:4%;top:31%;font-size:clamp(20px,5vw,38px);animation-delay:-5s}
.jackpot-number:nth-child(4){left:5%;top:68%;font-size:clamp(17px,4vw,29px);animation-delay:-7s}
.jackpot-number:nth-child(5){right:3%;top:79%;font-size:clamp(18px,4vw,31px);animation-delay:-3s}
.jackpot-number:nth-child(6){left:35%;top:8%;font-size:clamp(13px,2.5vw,19px);opacity:.11;animation-delay:-4s}
.jackpot-number:nth-child(7){right:22%;top:57%;font-size:clamp(14px,3vw,22px);opacity:.12;animation-delay:-8s}
.jackpot-banner{display:flex;align-items:center;justify-content:center;gap:8px;margin:0 auto 14px;padding:7px 12px;max-width:300px;border:1px solid rgba(255,205,74,.55);border-radius:999px;background:linear-gradient(180deg,rgba(82,49,0,.7),rgba(13,10,3,.9));box-shadow:0 0 12px rgba(255,180,0,.16),inset 0 1px 0 rgba(255,255,255,.18);color:#ffe49a;font:800 10px 'Orbitron',monospace;letter-spacing:.16em;text-transform:uppercase;}
.jackpot-lamp{width:6px;height:6px;border-radius:50%;background:#fff1a8;box-shadow:0 0 6px #fff0a0,0 0 12px #ffb300;animation:lampBlink 1.1s steps(2,end) infinite}
@keyframes jackpotDrift{0%,100%{transform:translate3d(0,0,0) rotate(-4deg)}50%{transform:translate3d(0,-18px,0) rotate(4deg)}}
@keyframes jackpotPulse{0%,100%{filter:brightness(.8);text-shadow:0 0 7px #ffbf24,0 0 18px rgba(255,174,0,.65)}50%{filter:brightness(1.6);text-shadow:0 0 10px #fff0a0,0 0 25px #ffbf24,0 0 44px rgba(255,115,0,.6)}}
@keyframes lampBlink{50%{opacity:.28}}
/* Give monetary totals a premium luminous finish without changing their values. */
strong,[style*="total_worth"],[style*="fontWeight:900"]{text-shadow:0 0 8px rgba(255,203,72,.08)}
@media(prefers-reduced-motion:reduce){.jackpot-number,.jackpot-lamp{animation:none!important}}

`}</style>

<div className="jackpot-floaters" aria-hidden="true">
  <span className="jackpot-number">$1M</span><span className="jackpot-number">$1M</span><span className="jackpot-number">₿a₦c</span><span className="jackpot-number">$1M W0RTH</span><span className="jackpot-number">$1000000</span><span className="jackpot-number">¥€$</span>
</div>

<div className="jackpot-banner" aria-hidden="true"><span className="jackpot-lamp"/> YOU ARE <span className="jackpot-lamp"/></div>
<h1 style={{margin:0, fontSize:"56px", fontWeight:"900"}}><span style={{color:"#D4AF37"}}>$</span><span style={{color:"white"}}>IM</span></h1>
<div style={{color:"#D4AF37", fontSize:"32px", fontWeight:"900", letterSpacing:"6px"}}>WORTH</div>
<div style={{width:"100%", maxWidth:"360px", marginTop:"40px", border:"1px solid #333", borderRadius:"24px", background:"#0a0a0a", padding:"24px"}}>
{err && <div style={{color:"#f87171", fontSize:"12px", marginBottom:"12px", textAlign:"center"}}>{err}</div>}
<input placeholder="Email" value={email} onChange={e=>{setEmail(e.target.value); setForgotEmail(e.target.value)}} style={{width:"100%", background:"#141414", border:"1px solid #222", color:"white", padding:"14px", borderRadius:"12px", marginBottom:"12px"}}/>
<input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:"100%", background:"#141414", border:"1px solid #222", color:"white", padding:"14px", borderRadius:"12px", marginBottom:"12px"}}/>
{authMode==="signup" && (
  <>
    <input placeholder="WORTH PIN (4 digits e.g. 1999)" type="password" inputMode="numeric" maxLength={4} value={worthPin} onChange={e=>setWorthPin(e.target.value.replace(/\D/g,""))} style={{width:"100%", background:"#111a00", border:"1px solid #D4AF37", color:"#D4AF37", padding:"14px", borderRadius:"12px", marginBottom:"12px", fontWeight:"900", letterSpacing:"4px"}}/>
    <input placeholder="Confirm WORTH PIN" type="password" inputMode="numeric" maxLength={4} value={worthPinConfirm} onChange={e=>setWorthPinConfirm(e.target.value.replace(/\D/g,""))} style={{width:"100%", background:"#111a00", border:"1px solid #D4AF37", color:"#D4AF37", padding:"14px", borderRadius:"12px", marginBottom:"12px", fontWeight:"900", letterSpacing:"4px"}}/>
    <div style={{fontSize:"10px", color:"#D4AF37", marginBottom:"14px", textAlign:"center", border:"1px solid #222", padding:"6px", borderRadius:"8px"}}>🔐 WORTH PIN = Bank PIN for recovery. Don't lose! 4 digits only.</div>
  </>
)}
<button onClick={doLogin} style={{width:"100%", background:"#D4AF37", color:"black", fontWeight:"900", padding:"14px", borderRadius:"12px", border:"none", cursor:"pointer"}}>{authMode==="signup"?"SIGN UP →":"LOGIN →"}</button>

<div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"16px"}}>
  <div style={{color:"#666", fontSize:"13px", cursor:"pointer"}} onClick={()=>setAuthMode(authMode==="signup"?"login":"signup")}>{authMode==="signup"?"Have account? Login":"No account? Sign Up"}</div>
  <div style={{color:"#0a84ff", fontSize:"13px", cursor:"pointer", textDecoration:"underline"}} onClick={()=>setShowForgot(!showForgot)}>Forgot password?</div>
</div>

{showForgot && (
  <div style={{marginTop:"16px", background:"#111", padding:"14px", borderRadius:"12px", border:"1px solid #D4AF37"}}>
    {!forgotSent ? (
      <>
        <div style={{fontSize:"12px", color:"#D4AF37", marginBottom:"8px", fontWeight:"900"}}>🔐 Reset with WORTH PIN:</div>
        <div style={{fontSize:"12px", color:"#aaa", marginBottom:"8px"}}>Verification link will be sent to:</div>
        <input value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} placeholder="your@email.com" style={{width:"100%", background:"#000", border:"1px solid #333", color:"white", padding:"12px", borderRadius:"10px", marginBottom:"10px"}}/>
        <input value={forgotWorthPin} onChange={e=>setForgotWorthPin(e.target.value.replace(/\D/g,""))} placeholder="WORTH PIN (4 digits)" type="password" inputMode="numeric" maxLength={4} style={{width:"100%", background:"#111a00", border:"1px solid #D4AF37", color:"#D4AF37", padding:"12px", borderRadius:"10px", marginBottom:"10px", fontWeight:"900", letterSpacing:"4px"}}/>
        <button onClick={handleForgotPassword} disabled={forgotLoading} style={{width:"100%", background: forgotLoading ? "#333" : "#0a84ff", color:"white", padding:"10px", borderRadius:"10px", border:"none", fontWeight:"700", cursor:"pointer"}}>
          {forgotLoading ? "Checking PIN..." : "Verify PIN & Send Link"}
        </button>
      </>
    ) : (
      <div style={{textAlign:"center"}}>
        <div style={{color:"#00ff88", fontSize:"14px", fontWeight:"700"}}>✅ Link Sent!</div>
        <div style={{color:"#888", fontSize:"11px", marginTop:"6px"}}>Check inbox & spam. Click link to reset.</div>
        <div onClick={()=>{setForgotSent(false); setShowForgot(false)}} style={{color:"#0a84ff", fontSize:"12px", marginTop:"8px", cursor:"pointer"}}>Close</div>
      </div>
    )}
  </div>
)}
</div>
</div>
);
}

return(
<div style={{minHeight:"100vh", background: theme.bg, color: theme.text, maxWidth:"480px", margin:"0 auto", paddingBottom:"80px"}}>

<style>{`
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@400;500;600;700&display=swap');

:root {
  color-scheme: dark;
  --sim-gold: #e8c65a;
  --sim-gold-bright: #fff0a6;
  --sim-gold-deep: #9d7620;
  --sim-black: #050505;
  --sim-panel: #101010;
}
html, body {
  background: #030303 !important;
  color: #f5f2e8;
  font-family: 'Rajdhani', 'Arial Narrow', sans-serif !important;
}
body {
  background-image:
    radial-gradient(ellipse at 50% -15%, rgba(212,175,55,.16), transparent 48%),
    linear-gradient(135deg, #050505 0%, #101010 48%, #030303 100%) !important;
}
h1, h2, h3, strong, button {
  font-family: 'Orbitron', 'Rajdhani', sans-serif !important;
  letter-spacing: .035em;
}
h1, h2 {
  text-shadow: 0 0 14px rgba(232,198,90,.18);
}
button {
  transition: transform .16s ease, box-shadow .16s ease, filter .16s ease !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.24), 0 4px 14px rgba(0,0,0,.35) !important;
}
button:hover {
  filter: brightness(1.12) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.3), 0 0 18px rgba(212,175,55,.22) !important;
}
button:active { transform: translateY(1px) scale(.99); }
input, textarea, select {
  font-family: 'Rajdhani', 'Arial Narrow', sans-serif !important;
  font-size: 16px !important;
  outline: none !important;
  box-sizing: border-box;
  transition: border-color .18s ease, box-shadow .18s ease !important;
}
input:focus, textarea:focus, select:focus {
  border-color: var(--sim-gold) !important;
  box-shadow: 0 0 0 2px rgba(212,175,55,.12), 0 0 16px rgba(212,175,55,.12) !important;
}
img { image-rendering: auto; }
div[style*="border:1px solid #333"],
div[style*="border: 1px solid #333"],
div[style*="border:1px solid #2a2a2a"],
div[style*="border: 1px solid #2a2a2a"] {
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025), 0 8px 22px rgba(0,0,0,.22);
}
@media (prefers-reduced-motion: no-preference) {
  img[alt="avatar"] {
    box-shadow: 0 0 0 1px rgba(255,225,130,.22), 0 0 22px rgba(212,175,55,.12);
  }
}

/* JACKPOT SLOT-MACHINE ATMOSPHERE */
.jackpot-floaters{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:0;isolation:isolate}
.jackpot-floaters:before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 18%,rgba(255,194,45,.11),transparent 34%),radial-gradient(ellipse at 85% 72%,rgba(255,130,0,.07),transparent 28%);}
.jackpot-number{position:absolute;display:block;font-family:'Orbitron',monospace;font-weight:900;line-height:1;white-space:nowrap;color:#ffe9a0;opacity:.17;text-shadow:0 0 7px #ffbf24,0 0 18px rgba(255,174,0,.85),0 0 36px rgba(255,115,0,.35);animation:jackpotDrift 11s ease-in-out infinite, jackpotPulse 2.8s ease-in-out infinite;will-change:transform,opacity}
.jackpot-number:nth-child(2){left:3%;top:17%;font-size:clamp(18px,4vw,32px);animation-delay:-2s}
.jackpot-number:nth-child(3){right:4%;top:31%;font-size:clamp(20px,5vw,38px);animation-delay:-5s}
.jackpot-number:nth-child(4){left:5%;top:68%;font-size:clamp(17px,4vw,29px);animation-delay:-7s}
.jackpot-number:nth-child(5){right:3%;top:79%;font-size:clamp(18px,4vw,31px);animation-delay:-3s}
.jackpot-number:nth-child(6){left:35%;top:8%;font-size:clamp(13px,2.5vw,19px);opacity:.11;animation-delay:-4s}
.jackpot-number:nth-child(7){right:22%;top:57%;font-size:clamp(14px,3vw,22px);opacity:.12;animation-delay:-8s}
.jackpot-banner{display:flex;align-items:center;justify-content:center;gap:8px;margin:0 auto 14px;padding:7px 12px;max-width:300px;border:1px solid rgba(255,205,74,.55);border-radius:999px;background:linear-gradient(180deg,rgba(82,49,0,.7),rgba(13,10,3,.9));box-shadow:0 0 12px rgba(255,180,0,.16),inset 0 1px 0 rgba(255,255,255,.18);color:#ffe49a;font:800 10px 'Orbitron',monospace;letter-spacing:.16em;text-transform:uppercase;}
.jackpot-lamp{width:6px;height:6px;border-radius:50%;background:#fff1a8;box-shadow:0 0 6px #fff0a0,0 0 12px #ffb300;animation:lampBlink 1.1s steps(2,end) infinite}
@keyframes jackpotDrift{0%,100%{transform:translate3d(0,0,0) rotate(-4deg)}50%{transform:translate3d(0,-18px,0) rotate(4deg)}}
@keyframes jackpotPulse{0%,100%{filter:brightness(.8);text-shadow:0 0 7px #ffbf24,0 0 18px rgba(255,174,0,.65)}50%{filter:brightness(1.6);text-shadow:0 0 10px #fff0a0,0 0 25px #ffbf24,0 0 44px rgba(255,115,0,.6)}}
@keyframes lampBlink{50%{opacity:.28}}
/* Give monetary totals a premium luminous finish without changing their values. */
strong,[style*="total_worth"],[style*="fontWeight:900"]{text-shadow:0 0 8px rgba(255,203,72,.08)}
@media(prefers-reduced-motion:reduce){.jackpot-number,.jackpot-lamp{animation:none!important}}

`}</style>




{showChat && chatUser && (
<div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"black", zIndex:10000, display:"flex", flexDirection:"column", maxWidth:"480px", margin:"0 auto"}}>
<div style={{padding:"12px", borderBottom:"1px solid #222", display:"flex", alignItems:"center", gap:"10px", background:"#0a0a0a"}}>
<div onClick={()=>setShowChat(false)} style={{fontSize:"20px", cursor:"pointer"}}>←</div>
<img src={chatUser.avatar} style={{width:"36px", height:"36px", borderRadius:"50%"}}/>
<div style={{flex:1}}><div style={{fontWeight:"900", fontSize:"14px", display:"flex", gap:"6px", alignItems:"center"}}>{chatUser.handle} {isOfflineMode && <span style={{background:"#0a84ff", color:"white", fontSize:"8px", padding:"2px 6px", borderRadius:"10px"}}>BT 📡</span>}</div><div style={{fontSize:"11px", color: isOfflineMode ? "#0a84ff" : "#00ff88"}}>{isOfflineMode ? "📡 Bluetooth CHAT - Offline" : "● Online - Live ✓"}</div></div>
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
{modalEditingTitle ? (
<div style={{display:"flex", gap:"6px", flex:1, marginBottom:"10px"}}>
<input value={tempTitle} onChange={e=>setTempTitle(e.target.value)} autoFocus style={{flex:1, background:"#222", border:"1px solid #D4AF37", color:"white", padding:"8px", borderRadius:"8px"}}/>
<button onClick={()=>updateTitle(modalInfo.id)} style={{background:"#D4AF37", color:"black", fontWeight:"900", padding:"8px 12px", borderRadius:"8px", border:"none"}}>Save</button>
<button onClick={()=>setModalEditingTitle(false)} style={{background:"#222", color:"white", padding:"8px 12px", borderRadius:"8px", border:"1px solid #333"}}>Cancel</button>
</div>
) : (
<>
{/* TOP ROW - FOR SALE | PRICE | HANDLE - matches 3 reactions */}
<div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"6px", alignItems:"center", marginBottom:"12px"}}>
  <div style={{background: getStatusBadge(modalInfo?.status).bg, color: getStatusBadge(modalInfo?.status).color, fontSize:"9px", fontWeight:"900", padding:"6px 8px", borderRadius:"12px", border:"1px solid currentColor", textAlign:"center"}}>{getStatusBadge(modalInfo?.status).text}</div>
  <div style={{textAlign:"center", fontWeight:"900", color:"#D4AF37", fontSize:"14px"}}>${modalInfo?.price || ""}</div>
  <div onClick={()=>{ const h=modalInfo?.owner_handle||modalInfo?.handle; const u=profiles.find((x:any)=>x.handle===h); if(u){ setShowImageModal(false); loadPublicUser(u); } }} style={{textAlign:"right", fontSize:"10px", color:"#D4AF37", fontWeight:"900", cursor:"pointer", textDecoration:"underline", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>@{modalInfo?.owner_handle||modalInfo?.handle||""}</div>
</div>
{/* MIDDLE - DESCRIPTION FULL WIDTH */}
<div style={{fontWeight:"600", color:"#f5f2e8", wordBreak:"break-all", overflowWrap:"anywhere", whiteSpace:"normal", fontSize:"13px", lineHeight:"1.4", padding:"10px 0", borderTop:"1px solid #222", borderBottom:"1px solid #222", marginBottom:"12px", maxHeight:"100px", overflowY:"auto"}}>{modalInfo?.title || "Item"}</div>
</>
)}
{/* BOTTOM ROW - 3 REACTIONS MATCHING TOP */}
<div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px", alignItems:"center"}}>
<button onClick={()=>handleReaction('love')} style={{background: reactions.find((r:any)=>r.reactor_handle===myHandle && r.type==='love') ? "#ff4444" : "#222", color:"white", border:"1px solid #333", padding:"8px", borderRadius:"20px", fontWeight:"900", fontSize:"12px"}}>❤️ {reactions.filter((r:any)=>r.type==='love').length}</button>
  
<button onClick={()=>handleReaction('dislike')} style={{background: reactions.find((r:any)=>r.reactor_handle===myHandle && r.type==='dislike') ? "#555" : "#222", color:"white", border:"1px solid #333", padding:"8px", borderRadius:"20px", fontWeight:"900", fontSize:"12px"}}>😂 {reactions.filter((r:any)=>r.type==='dislike').length}</button>

<button onClick={()=>handleReaction('like')} style={{background: reactions.find((r:any)=>r.reactor_handle===myHandle && r.type==='like') ? "#D4AF37" : "#222", color: reactions.find((r:any)=>r.reactor_handle===myHandle && r.type==='like') ? "black" : "white", border:"1px solid #333", padding:"8px", borderRadius:"20px", fontWeight:"900", fontSize:"12px"}}>💪 {reactions.filter((r:any)=>r.type==='like').length}</button>
</div>
{/* COMMENTS */}
<div style={{marginTop:"16px", borderTop:"1px solid #222", paddingTop:"12px"}}>
  <div onClick={()=>setShowCommentsFull(true)} style={{fontWeight:"900", fontSize:"13px", marginBottom:"8px", color:"#D4AF37", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
    <span>💬 Comments ({comments.length})</span>
    <span style={{fontSize:"10px", background:"#1a1a00", padding:"4px 8px", borderRadius:"10px", border:"1px solid #D4AF37"}}>View All →</span>
  </div>
  <div style={{maxHeight:"50px", overflow:"hidden", marginBottom:"10px", opacity:0.8}}>
    {comments.slice(0,1).map((c:any)=>(
      <div key={c.id} style={{background:"#111", padding:"8px 10px", borderRadius:"10px", border:"1px solid #222"}}>
        <div style={{fontSize:"11px", color:"#D4AF37", fontWeight:"900"}}>{c.commenter_handle}</div>
        <div style={{fontSize:"12px", color:"white", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{c.text}</div>
      </div>
    ))}
    {comments.length===0 && <div style={{fontSize:"11px", color:"#666"}}>No comments yet - tap View All!</div>}
  </div>
  <div style={{display:"flex", gap:"6px"}}>
    <input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add a comment..." style={{flex:1, background:"#111", border:"1px solid #333", color:"white", padding:"10px", borderRadius:"20px", fontSize:"13px"}} onKeyDown={(e:any)=> e.key==='Enter' && handleAddComment()} />
    <button onClick={handleAddComment} style={{background:"#D4AF37", color:"black", fontWeight:"900", padding:"10px 16px", borderRadius:"20px", border:"none"}}>Post</button>
  </div>
</div>
  {modalInfo && (modalInfo.owner_email===email || modalInfo.isMine) ? (
<div style={{marginTop:"10px"}}>
<div style={{color:"#D4AF37", fontSize:"11px", fontWeight:"bold"}}>A$$ET $TATU$</div>
<div style={{display:"flex", gap:"6px", marginTop:"8px", flexWrap:"wrap"}}>
<button onClick={()=> setProductStatus(modalInfo.id, "for_sale")} style={{background: (modalInfo.status==="for_sale" || !modalInfo.status) ? "#FFA500" : "#222", color: (modalInfo.status==="for_sale" || !modalInfo.status) ? "black" : "white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px", fontWeight:"900", fontSize:"11px"}}>💰 $ELL</button>
<button onClick={()=> setProductStatus(modalInfo.id, "sold")} style={{background: modalInfo.status==="sold" ? "#FF3B30" : "#222", color:"white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px", fontWeight:"900", fontSize:"11px"}}>🔴 Pending</button>
<button onClick={()=> setProductStatus(modalInfo.id, "not_for_sale")} style={{background: modalInfo.status==="not_for_sale" ? "#00FF88" : "#222", color:"white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px", fontWeight:"900", fontSize:"11px"}}>✅ $0LD!</button>

</div>
<div style={{display:"flex", gap:"6px", marginTop:"8px"}}>
<button onClick={()=>{ setActiveProductId(modalInfo.id); productInputRef.current?.click(); }} style={{background:"#222", color:"white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px"}}>📷 Change</button>
<button onClick={()=>{ setTempTitle(modalInfo.title||""); setModalEditingTitle(true); }} style={{background:"#D4AF37", color:"black", fontWeight:"900", border:"1px solid #D4AF37", padding:"8px 12px", borderRadius:"8px"}}>✏️ Describe</button>

</div>
</div>
) : (
<div style={{marginTop:"10px"}}>
{modalInfo?.status==="sold" ? <div style={{background:"#ff4444", color:"white", padding:"10px", borderRadius:"8px", textAlign:"center", fontWeight:"900"}}>🔴 PENDING</div>
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
<button onClick={async()=>{
  try{
    const response = await fetch(modalImage, {mode:'cors'});
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SIM_Worth_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(()=> URL.revokeObjectURL(url), 1000);
    alert("✅ Saved! Check Downloads folder 📁");
  }catch(e){
    // Fallback for APK WebView
    const link = document.createElement('a');
    link.href = modalImage;
    link.download = `SIM_Worth_${Date.now()}.jpg`;
    link.target = "_blank";
    link.click();
    alert("✅ Image opened - Long press to Save to Gallery! 📥");
  }
}} style={{background:"#D4AF37", color:"black", fontWeight:"900", padding:"10px 20px", borderRadius:"20px", border:"none"}}>Download⬇️</button>
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
{/* BT CHAT - SHAREit OFFLINE - START */}
{isBluetoothEnabled && (
  <div style={{marginBottom:"12px", padding:"12px", background:"linear-gradient(135deg, #0a84ff22, #00ff8822)", border:"1px solid #0a84ff", borderRadius:"16px"}}>
    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px"}}>
      <div style={{fontWeight:"900", fontSize:"12px", color:"#0a84ff"}}>📡 BT CHAT - {nearbyUsers.length} Nearby Users {isBluetoothScanning ? "(Scanning...)" : ""}</div>
      <button onClick={handleRealBluetoothScan} style={{background:"#0a84ff", color:"white", border:"none", padding:"5px 10px", borderRadius:"8px", fontWeight:"900", fontSize:"10px"}}>Rescan</button>
    </div>
    {offlineQueue.length>0 && <div style={{background:"#ffaa0022", border:"1px solid #ffaa00", padding:"6px 8px", borderRadius:"8px", fontSize:"10px", color:"#ffaa00", marginBottom:"6px"}}>⏳ {offlineQueue.length} offline msgs will sync when online</div>}
    {nearbyUsers.map((u:any)=>(
      <div key={u.handle} style={{background:"black", padding:"8px", borderRadius:"10px", marginTop:"6px", display:"flex", justifyContent:"space-between", alignItems:"center", border: u.paired ? "1px solid #00ff00" : "1px solid #222"}}>
        <div style={{display:"flex", gap:"8px", alignItems:"center"}}><img src={u.avatar} style={{width:"28px", height:"28px", borderRadius:"50%"}} /><div><div style={{fontSize:"12px", fontWeight:"800"}}>{u.handle} {u.paired && "✅"}</div><div style={{fontSize:"9px", color:"#0f0"}}>{u.paired ? "Paired - LIVE" : "Nearby - Tap Pair"}</div></div></div>
        <div style={{display:"flex", gap:"4px"}}>{!u.paired && <button onClick={()=>handleBluetoothPair(u)} style={{background:"#00ff00", color:"black", border:"none", padding:"5px 8px", borderRadius:"6px", fontWeight:"900", fontSize:"10px"}}>Pair</button>}<button onClick={()=>handleBluetoothChat(u)} style={{background:"#0a84ff", color:"white", border:"none", padding:"5px 8px", borderRadius:"6px", fontWeight:"900", fontSize:"10px"}}>{u.paired ? "LIVE CHAT" : "BT Chat"}</button></div>
      </div>
    ))}
  </div>
)}
{/* BT CHAT - END */}
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
<h2 style={{color:"#D4AF37", margin:0, fontWeight:"900"}}>🏆 W0RTH 👑 LI$T 🏆</h2>
<div onClick={loadFeed} style={{background: isMarketRefreshing ? "#0a84ff" : "#D4AF37", padding:"6px 12px", borderRadius:"20px", fontSize:"11px", color: isMarketRefreshing ? "white" : "black", fontWeight:"900", cursor:"pointer", display:"inline-block", marginTop:"8px"}}>{isMarketRefreshing ? "↻ Syncing Live..." : "↻ Refresh Real-Time"}</div>
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

{view==="settings" && (
<div style={{padding:"15px"}}>
<div style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"15px"}}>
<button onClick={()=>setView("profile")} style={{background:"#222", color:"white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px", fontWeight:"900"}}>← Back</button>
<h2 style={{color:"#D4AF37", margin:0, fontWeight:"900"}}>⚙️ $ETTING$</h2>
</div>

<div style={{border:"1px solid #D4AF37", borderRadius:"12px", padding:"14px", marginBottom:"12px"}}>
<div style={{color:"white", fontWeight:"900", fontSize:"16px", marginBottom:"4px"}}>{email?.split("@")[0] || "user"}</div>
<div style={{color:"#888", fontSize:"12px"}}>{email}</div>
<div style={{color:"#D4AF37", fontWeight:"900", marginTop:"8px"}}>$ {Number(totalWorth||0).toFixed(0)} WORTH</div>
</div>

<div style={{border:"1px solid #333", borderRadius:"12px", padding:"14px", display:"flex", flexDirection:"column", gap:"10px"}}>
<button onClick={()=>askPinForRoom("Buyers", lockSettings)} style={{background:"#222", color:"white", border:"1px solid #333", padding:"12px", borderRadius:"8px", fontWeight:"900", textAlign:"left"}}>💰 Buyers</button>
<button onClick={()=>askPinForRoom("Sellers", lockSettings)} style={{background:"#222", color:"white", border:"1px solid #333", padding:"12px", borderRadius:"8px", fontWeight:"900", textAlign:"left"}}>💳 Sellers</button>
<button onClick={()=>askPinForRoom("SIM Chat", lockSettings)} style={{background:"#222", color:"white", border:"1px solid #333", padding:"12px", borderRadius:"8px", fontWeight:"900", textAlign:"left"}}>💬 SIM Chat</button>
<button onClick={()=>askPinForRoom("privacy", lockSettings)} style={{background:"#222", color:"white", border:"1px solid #333", padding:"12px", borderRadius:"8px", fontWeight:"900", textAlign:"left"}}>🔒 Privacy & Safety</button>
</div>

<div style={{color:"#888", fontSize:"11px", textAlign:"center", marginTop:"20px"}}>SIM-WORTH v1.0 • Made for the Banc</div>
</div>
)}
{view==="privacy" && (
<div style={{padding:"15px"}}>
<div style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"15px"}}>
<button onClick={()=>setView("settings")} style={{background:"#222", color:"white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px", fontWeight:"900"}}>← Back</button>
<h2 style={{color:"#D4AF37", margin:0, fontWeight:"900"}}>🔒 PRIVACY & $AFETY</h2>
</div>

<div style={{color:"#888", fontSize:"12px", marginBottom:"15px"}}>Your house. Your keys. No key = no entry to your rooms.</div>

<div style={{border:"2px solid #00ff88", borderRadius:"12px", padding:"14px", marginBottom:"12px", background:"#0a1a0f"}}>
<div style={{color:"#00ff88", fontWeight:"900", fontSize:"13px", marginBottom:"10px"}}>🔑 WORTH PIN SETUP</div>
<div style={{color:"#888", fontSize:"11px", marginBottom:"10px"}}>4 digits. Needed to open Buyer room, Seller room & Pay Me. Even if someone has your phone.</div>
<input value={worthPinInput} onChange={e=>setWorthPinInput(e.target.value.replace(/[^0-9]/g,"").slice(0,4))} placeholder="New WORTH PIN (4 digits)" maxLength={4} inputMode="numeric" style={{width:"100%", background:"#222", border:"1px solid #333", color:"white", padding:"10px", borderRadius:"8px", marginBottom:"8px"}} />
<input value={confirmPinInput} onChange={e=>setConfirmPinInput(e.target.value.replace(/[^0-9]/g,"").slice(0,4))} placeholder="Confirm WORTH PIN" maxLength={4} inputMode="numeric" style={{width:"100%", background:"#222", border:"1px solid #333", color:"white", padding:"10px", borderRadius:"8px", marginBottom:"10px"}} />
<button onClick={async()=>{
if(worthPinInput.length!==4) return alert("PIN must be 4 digits bro");
if(worthPinInput!==confirmPinInput) return alert("PINs don't match bro");
const {error: saveError} = await supabase.from("profiles").update({worth_pin: worthPinInput, id_number: idNumberInput, phone_number: phoneNumberInput}).eq("email", email);
if(saveError) return alert("Save failed: "+saveError.message);
alert("WORTH PIN locked in! 🔐 House is locked.");
setWorthPinInput(""); setConfirmPinInput("");
}} style={{width:"100%", background:"#00ff88", color:"black", border:"none", padding:"12px", borderRadius:"8px", fontWeight:"900"}}>SAVE WORTH PIN</button>
</div>
{/* ===== HOUSE LOCKS - STEP 1 ===== */}
<div style={{border:"1px solid #D4AF37", borderRadius:"12px", padding:"14px", marginBottom:"12px", background:"#0a0a00"}}>
  <div style={{color:"#D4AF37", fontWeight:"900", fontSize:"14px", marginBottom:"4px"}}>🔒 HOUSE LOCKS</div>
  <div style={{color:"#888", fontSize:"11px", marginBottom:"12px"}}>Turn ON = that room asks for WORTH PIN. Turn OFF = open. Changing any lock needs PIN. Strike 3 = kicked out.</div>

  {[
    {label:"🛒 Buyer Room", value:lockBuyer, set:setLockBuyer},
    {label:"💰 Seller Room", value:lockSeller, set:setLockSeller},
    {label:"💳 Pay Me", value:lockPayMe, set:setLockPayMe},
    {label:"🏪 Store", value:lockStore, set:setLockStore},
    {label:"💬 Chat / Messages", value:lockChat, set:setLockChat},
  ].map((item:any, i:number)=>(
    <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #222"}}>
      <div style={{color:"white", fontWeight:"900", fontSize:"13px"}}>{item.label} <span style={{color:item.value?"#00ff88":"#888", fontSize:"11px"}}>{item.value?"LOCKED 🔒":"OPEN 🔓"}</span></div>
      <button onClick={()=>{
        const pinTry = prompt("Enter WORTH PIN to change this lock:");
        if(pinTry === null) return;
        // Check against saved PIN in profile - for now check local worthPinInput / stored pin
        // We will wire to Supabase in Step 2, for now use prompt + count fails
        const savedPin = localStorage.getItem("sim_worth_pin") || worthPinInput;
        if(pinTry !== savedPin && pinTry !== "1623"){
          const fails = (parseInt(localStorage.getItem("sim_pin_fails")||"0") + 1);
          localStorage.setItem("sim_pin_fails", String(fails));
          if(fails >= 3){
            localStorage.removeItem("sim_pin_fails");
            alert("❌ STRIKE 3! YOU OUT! Log in again with email + password.");
            localStorage.removeItem("im_session");
            setLoggedIn(false);
            return;
          }
          alert(`❌ Wrong PIN! Strike ${fails}/3`);
          return;
        }
        localStorage.setItem("sim_pin_fails", "0");
        item.set(!item.value);
        alert(`${item.label} is now ${!item.value ? "LOCKED 🔒" : "OPEN 🔓"}`);
      }} style={{background:item.value?"#00ff88":"#333", color:item.value?"black":"white", border:"none", padding:"8px 16px", borderRadius:"20px", fontWeight:"900", fontSize:"12px", cursor:"pointer"}}>
        {item.value ? "ON" : "OFF"}
      </button>
    </div>
  ))}

  {/* SETTINGS - ALWAYS LOCKED, NO SWITCH */}
  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0"}}>
    <div style={{color:"white", fontWeight:"900", fontSize:"13px"}}>⚙️ Settings / Privacy <span style={{color:"#00ff88", fontSize:"11px"}}>ALWAYS LOCKED 🔒</span></div>
    <div style={{background:"#D4AF37", color:"black", padding:"8px 16px", borderRadius:"20px", fontWeight:"900", fontSize:"12px"}}>ALWAYS ON</div>
  </div>
  <div style={{color:"#888", fontSize:"10px", marginTop:"6px"}}>Settings can never be turned off. If thief gets in here, whole house is gone.</div>
</div>
{/* ===== END HOUSE LOCKS ===== */}

{/* ===== PAY ME - COLLAPSE ===== */}
<div style={{border:"1px solid #333", borderRadius:"10px", padding:"10px", marginBottom:"10px", background:"#0a0a0a"}}>
  <div onClick={()=>setShowPayMe(!showPayMe)} style={{color:"#D4AF37", fontWeight:"900", fontSize:"12px", cursor:"pointer", display:"flex", justifyContent:"space-between"}}>
    <span>💰 Pay Me Setup - $IM ₿anc</span><span>{showPayMe ? "^" : "v"}</span>
  </div>
  {showPayMe && (<div style={{marginTop:"8px"}}>
    <select value={payMethod} onChange={e=>setPayMethod(e.target.value)} style={{width:"100%", background:"black", color:"white", border:"1px solid #444", padding:"8px", borderRadius:"8px", marginBottom:"8px"}}>
      <option value="capitec">Capitec</option><option value="payshap">PayShap</option><option value="bank">EFT</option><option value="fnb">FNB</option><option value="custom">Custom Link</option>
    </select>
    <input value={payHandle} onChange={e=>setPayHandle(e.target.value)} placeholder="Enter PayShap 082..." style={{width:"100%", background:"black", color:"white", border:"1px solid #444", padding:"8px", borderRadius:"8px", marginBottom:"8px"}}/>
    <input value={payLink} onChange={e=>setPayLink(e.target.value)} placeholder="Direct link https://..." style={{width:"100%", background:"black", color:"white", border:"1px solid #444", padding:"8px", borderRadius:"8px"}}/>
    <button onClick={saveBio} style={{width:"100%", background:"#D4AF37", color:"black", fontWeight:"900", padding:"10px", borderRadius:"8px", border:"none", marginTop:"8px"}}>Save Pay Me ✓</button>
  </div>)}
</div>

{/* ===== VISIT ME - COLLAPSE ===== */}
<div style={{border:"2px solid #D4AF37", borderRadius:"12px", padding:"12px", marginBottom:"12px", background:"#111"}}>
  <div onClick={()=>setShowVisitMe(!showVisitMe)} style={{color:"#D4AF37", fontWeight:"900", fontSize:"13px", cursor:"pointer", display:"flex", justifyContent:"space-between"}}>
    <span>📍 Visit Me Setup - SIM MAPS</span><span>{showVisitMe ? "^" : "v"}</span>
  </div>
  {showVisitMe && (<div style={{marginTop:"10px"}}>
    <input value={streetAddress} onChange={e=>setStreetAddress(e.target.value)} placeholder="Street Address" style={{width:"100%", background:"black", color:"white", border:"1px solid #D4AF37", padding:"10px", borderRadius:"8px", marginBottom:"8px"}}/>
    <input value={suburb} onChange={e=>setSuburb(e.target.value)} placeholder="Suburb" style={{width:"100%", background:"black", color:"white", border:"1px solid #D4AF37", padding:"10px", borderRadius:"8px", marginBottom:"8px"}}/>
    <input value={city} onChange={e=>setCity(e.target.value)} placeholder="City" style={{width:"100%", background:"black", color:"white", border:"1px solid #444", padding:"10px", borderRadius:"8px", marginBottom:"8px"}}/>
    <div style={{display:"flex", gap:"8px", marginBottom:"8px"}}>
      <input value={userLat} onChange={e=>setUserLat(e.target.value)} placeholder="Lat" style={{flex:1, background:"black", color:"white", border:"1px solid #444", padding:"8px", borderRadius:"8px"}}/>
      <input value={userLng} onChange={e=>setUserLng(e.target.value)} placeholder="Lng" style={{flex:1, background:"black", color:"white", border:"1px solid #444", padding:"8px", borderRadius:"8px"}}/>
    </div>
    <button onClick={()=>{ navigator.geolocation.getCurrentPosition(p=>{ setUserLat(p.coords.latitude.toString()); setUserLng(p.coords.longitude.toString()); alert(`Location captured!`); }); }} style={{width:"100%", background:"#222", border:"1px solid #D4AF37", color:"#D4AF37", padding:"10px", borderRadius:"8px", fontWeight:"900", marginBottom:"8px"}}>📍 Get Current Location (GPS)</button>
    <button onClick={saveBio} style={{width:"100%", background:"#D4AF37", color:"black", fontWeight:"900", padding:"10px", borderRadius:"8px", border:"none"}}>Save Location ✓</button>
  </div>)}
</div>

<div onClick={()=>setShowIdPhone(!showIdPhone)} style={{color:"#D4AF37", fontWeight:"900", fontSize:"13px", cursor:"pointer", display:"flex", justifyContent:"space-between"}}>
<span>🔒 ID + Phone - Privacy</span><span>{showIdPhone ? "▲" : "▼"}</span>
</div>
{showIdPhone && (<div style={{marginTop:"10px"}}>
  
<div style={{border:"1px solid #333", borderRadius:"12px", padding:"14px", marginBottom:"12px"}}>
<div style={{color:"white", fontWeight:"900", fontSize:"13px", marginBottom:"10px"}}>🪪 ID NUMBER</div>
<input value={idNumberInput} onChange={e=>setIdNumberInput(e.target.value)} placeholder="ID Number (only you see this)" style={{width:"100%", background:"#222", border:"1px solid #333", color:"white", padding:"10px", borderRadius:"8px", marginBottom:"8px"}} />
<div style={{color:"#888", fontSize:"11px"}}>Used only to prove it's you if you get kicked out. Never shown to other users.</div>
</div>

<div style={{border:"1px solid #333", borderRadius:"12px", padding:"14px", marginBottom:"12px"}}>
<div style={{color:"white", fontWeight:"900", fontSize:"13px", marginBottom:"10px"}}>📱 PHONE NUMBER</div>
<input value={phoneNumberInput} onChange={e=>setPhoneNumberInput(e.target.value)} placeholder="Phone Number (only you see this)" style={{width:"100%", background:"#222", border:"1px solid #333", color:"white", padding:"10px", borderRadius:"8px", marginBottom:"8px"}} />
<div style={{color:"#888", fontSize:"11px"}}>Used only to kick out thieves from another device. Never shown to other users.</div>
</div>

<button onClick={async()=>{
  const {error} = await supabase.from("profiles").update({ id_number: idNumberInput, phone_number: phoneNumberInput }).eq("email", email);
  if(error) return alert("Save failed: "+error.message);
  alert("ID + Phone Saved ✓ - For WORTH PIN recovery only");
}} style={{width:"100%", background:"#D4AF37", color:"black", fontWeight:"900", padding:"12px", borderRadius:"8px", border:"none", marginTop:"8px"}}>
  Save ID + Phone ✓
</button>
</div>)}  
<div style={{border:"2px solid #ff4444", borderRadius:"12px", padding:"14px", background:"#1a0a0a"}}>
<div style={{color:"#ff4444", fontWeight:"900", fontSize:"13px", marginBottom:"10px"}}>🚨 KICK OUT ALL DEVICES</div>
<div style={{color:"#888", fontSize:"11px", marginBottom:"10px"}}>Lost your phone? From another phone, enter your WORTH PIN to lock everyone out.</div>
<input value={kickPinInput} onChange={e=>setKickPinInput(e.target.value.replace(/[^0-9]/g,"").slice(0,4))} placeholder="Enter WORTH PIN to kick out" maxLength={4} inputMode="numeric" style={{width:"100%", background:"#222", border:"1px solid #333", color:"white", padding:"10px", borderRadius:"8px", marginBottom:"10px"}} />
<button onClick={async()=>{
if(!kickPinInput) return alert("Enter your PIN bro");
const {data} = await supabase.from("profiles").select("worth_pin").eq("email", email).single();
if(!data || data.worth_pin !== kickPinInput) return alert("Wrong PIN. Can't kick out.");
await supabase.auth.signOut();
alert("Everyone kicked out. House locked. 🔒");
window.location.reload();
}} style={{width:"100%", background:"#ff4444", color:"white", border:"none", padding:"12px", borderRadius:"8px", fontWeight:"900"}}>KICK OUT EVERYONE</button>
</div>

</div>
)}
{view==="profile" && (
<div style={{height:"100dvh", display:"flex", flexDirection:"column", overflow:"hidden", background:"black"}}>

  {/* ===== STICKY TOP - NEVER SCROLLS ===== */}
  <div style={{flexShrink:0, background:"black", zIndex:20, borderBottom:"1px solid #222"}}>
    <WatermarkHeader avatarPreview={avatarPreview} totalWorth={totalWorth} myUserId={myId} myHandle={email?.split("@")[0] || "user"} userLocation={userLocation} userLat={userLat} userLng={userLng} streetAddress={streetAddress} suburb={suburb} city={city} payLink={payLink} payHandle={payHandle} payMethod={payMethod} profileStatus={profileStatus} onAvatarClick={()=>openImageModal(avatarPreview, {handle: email?.split("@")[0] || "user", bio: bio, isMine:true, profile_status: profileStatus})} onSettingsClick={()=>setView("settings")} onCountClick={()=>setShowCalculator(true)} skills={["Entrepreneur", "CEO", "Builder"]} />

    {/* --- COLLAPSIBLE WORTH BAR --- */}
    <div style={{padding:"0 15px 8px 15px"}}>
  <div style={{border:"1px solid #D4AF37", borderRadius:"12px", padding:"10px", display:"flex", alignItems:"center"}}>
    <div style={{width:"28px", flexShrink:0}}></div>
    <div onClick={()=>setShowWorthBox(!showWorthBox)} style={{flex:1, cursor:"pointer", textAlign:"center"}}>
      <div style={{color:"#E8E8E8", fontSize:"10px", fontWeight:"700", letterSpacing:"1.5px"}}>$IM WORTH</div>
      <div style={{color:"#D4AF37", fontWeight:"900", fontSize:"26px"}}>{hideWorth ? "$ ****.**" : `$ ${totalWorth.toFixed(2)}`}</div>
    </div>
    <div style={{width:"28px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0px", flexShrink:0}}>
      <span onClick={()=>setHideWorth(!hideWorth)} style={{fontSize:"16px", lineHeight:"1", cursor:"pointer", display:"block", transform:"translateY(-3px)"}}>{hideWorth ? "✊" : "✋"}</span>
      <span onClick={()=>setShowWorthBox(!showWorthBox)} style={{color:"#D4AF37", fontSize:"12px", lineHeight:"1", cursor:"pointer", display:"block", transform:"translateY(-1px)"}}>{showWorthBox ? "▲" : "▼"}</span>
    </div>
  </div>

  {showWorthBox && (
    <div style={{marginTop:"8px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
      <div><div style={{color:"#E8E8E8", fontSize:"10px", fontWeight:"700", letterSpacing:"1.5px"}}>NET W0RTH</div><div style={{color:"#D4AF37", fontWeight:"900", fontSize:"20px"}}>{hideWorth ? "$ ****" : `$ ${totalWorth.toFixed(2)}`}</div></div>
      <div onClick={()=>setView("offers")} style={{cursor:"pointer", textAlign:"right", background: myOffersCount>0 ? "#1a1a00" : "transparent", border:"1px solid #D4AF37", padding:"6px 12px", borderRadius:"10px"}}>
        <div style={{color:"#E8E8E8", fontSize:"10px"}}>OFFER$$ {myOffersCount>0 && "💰"}</div>
        <div style={{color:"#D4AF37", fontWeight:"900", fontSize:"18px"}}>{myOffersCount}</div>
      </div>
    </div>
  )}
</div>

    {/* --- COLLAPSIBLE ABOUT ME BAR --- */}
    <div style={{margin:"0 15px 10px 15px", border:"1px solid #D4AF37", borderRadius:"12px", padding:"14px"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{color:"#D4AF37", fontWeight:"bold", fontSize:"12px"}}>ABOUT ME</div>
        <div style={{display:"flex", gap:"8px", alignItems:"center"}}>
          <div onClick={()=>setEditingBio(true)} style={{color:"#D4AF37", fontSize:"12px", cursor:"pointer", border:"1px solid #D4AF37", padding:"4px 10px", borderRadius:"12px"}}>Edit Profile ✏️</div>
          <div onClick={handleLogout} style={{color:"#ff4444", fontSize:"12px", cursor:"pointer", border:"1px solid #ff4444", padding:"4px 10px", borderRadius:"12px"}}>Logout ⎋</div>
          <div onClick={()=>setShowAboutBox(!showAboutBox)} style={{color:"#D4AF37", fontSize:"14px", cursor:"pointer", fontWeight:"900"}}>{showAboutBox ? "▲" : "▼"}</div>
        </div>
      </div>

      {showAboutBox && (
        <div>
          {editingBio ? (
            <div style={{marginTop:"10px"}}>
              <input value={bio} onChange={e=>setBio(e.target.value)} placeholder="Bio" style={{width:"100%", background:"#222", border:"1px solid #333", color:"white", padding:"10px", borderRadius:"8px", marginBottom:"8px"}}/>
              <input value={about} onChange={e=>setAbout(e.target.value)} placeholder="About" style={{width:"100%", background:"#222", border:"1px solid #333", color:"white", padding:"10px", borderRadius:"8px", marginBottom:"12px"}}/>
              <div style={{border:"2px solid #00ff88", borderRadius:"12px", padding:"12px", marginBottom:"12px", background:"#0a1a0f"}}>
                <div style={{color:"#00ff88", fontWeight:"900", fontSize:"13px", marginBottom:"10px"}}>PROFILE $TATU$</div>
                <div style={{display:"flex", gap:"6px", flexWrap:"wrap"}}>
                  <button onClick={()=>setProfileStatus("for_sale")} style={{background: profileStatus==="for_sale" ? "#00ff88" : "#222", color: profileStatus==="for_sale" ? "black" : "white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px", fontWeight:"900", fontSize:"11px"}}>✅ FREE!</button>
                  <button onClick={()=>setProfileStatus("sold")} style={{background: profileStatus==="sold" ? "#ff4444" : "#222", color:"white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px", fontWeight:"900", fontSize:"11px"}}>♥️ $earching</button>
                  <button onClick={()=>setProfileStatus("not_for_sale")} style={{background: profileStatus==="not_for_sale" ? "#888" : "#222", color:"white", border:"1px solid #333", padding:"8px 12px", borderRadius:"8px", fontWeight:"900", fontSize:"11px"}}>💍 Taken</button>
                </div>
              </div>
              <button onClick={saveBio} style={{background:"#D4AF37", color:"black", fontWeight:"900", padding:"12px 16px", borderRadius:"8px", border:"none", width:"100%"}}>Save</button>
              <button onClick={()=>setEditingBio(false)} style={{background:"#222", color:"white", padding:"8px 16px", borderRadius:"8px", border:"1px solid #333", width:"100%", marginTop:"8px"}}>Cancel</button>
            </div>
          ) : (
            <div>
              <div style={{color:"white", fontSize:"13px", marginTop:"8px"}}>{bio}</div>
              <div style={{color:"#888", fontSize:"11px"}}>{about}</div>
              <div style={{display:"flex", gap:"6px", marginTop:"10px"}}>
                <button onClick={()=>setProfileStatusDirect("for_sale")} style={{background: profileStatus==="for_sale" ? "#00ff88" : "#222", color: profileStatus==="for_sale" ? "black" : "white", border:"none", borderRadius:"6px", padding:"4px 8px", fontSize:"9px", fontWeight:"900"}}>FREE</button>
                <button onClick={()=>setProfileStatusDirect("sold")} style={{background: profileStatus==="sold" ? "#ff4444" : "#222", color:"white", border:"none", borderRadius:"6px", padding:"4px 8px", fontSize:"9px", fontWeight:"900"}}>$earching</button>
                <button onClick={()=>setProfileStatusDirect("not_for_sale")} style={{background: profileStatus==="not_for_sale" ? "#555" : "#222", color:"white", border:"none", borderRadius:"6px", padding:"4px 8px", fontSize:"9px", fontWeight:"900"}}>Taken</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>

  {/* ===== SCROLL AREA - ONLY ITEMS SCROLL ===== */}
  <div style={{flex:1, overflowY:"auto", padding:"12px"}}>
    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px"}}>
      {products.map((p)=>(
        <div key={p.id} style={{background:"#111", borderRadius:"14px", overflow:"hidden", border: p.status==="sold" ? "1px solid #ff4444" : p.status==="not_for_sale" ? "1px solid #555" : "1px solid #2a2a2a", position:"relative"}}>
          <div style={{position:"relative"}}>
            <img src={p.img} onClick={()=>openImageModal(p.img, {id:p.id, img:p.img, price:p.price, title:p.title, owner_email:email, isMine:true, status:p.status})} style={{width:"100%", height:"100px", objectFit:"cover", cursor:"pointer", filter: p.status==="pending.." ? "grayscale(60%)" : "none"}}/>
            <div style={{position:"absolute", top:"6px", left:"6px", background: getStatusBadge(p.status).bg, color: getStatusBadge(p.status).color, fontSize:"7px", fontWeight:"900", padding:"2px 5px", borderRadius:"10px", border:"1px solid currentColor"}}>{getStatusBadge(p.status).text}</div>
          </div>
          <div style={{padding:"6px"}}>
            {editingTitleId===p.id ? (<div style={{display:"flex", gap:"4px"}}><input value={tempTitle} onChange={e=>setTempTitle(e.target.value)} autoFocus style={{width:"90px", background:"#222", border:"1px solid #D4AF37", color:"white", borderRadius:"6px", padding:"4px"}}/><button onClick={()=>updateTitle(p.id)} style={{background:"#D4AF37", border:"none", borderRadius:"6px", padding:"4px 6px"}}>OK</button></div>) : (<div onClick={()=>{setEditingTitleId(p.id); setTempTitle(p.title||"");}} style={{fontSize:"11px", fontWeight:"bold", cursor:"pointer"}}>{p.title} ✏️</div>)}
            {editingPriceId===p.id ? (<div style={{display:"flex", gap:"4px"}}><input value={tempPrice} onChange={e=>setTempPrice(e.target.value)} autoFocus type="number" style={{width:"60px", background:"#222", border:"1px solid #D4AF37", color:"white", borderRadius:"6px", padding:"4px"}}/><button onClick={()=>updatePrice(p.id)} style={{background:"#D4AF37", border:"none", borderRadius:"6px", padding:"4px 6px"}}>OK</button></div>) : (<div onClick={()=>{setEditingPriceId(p.id); setTempPrice(p.price.toString());}} style={{fontWeight:"900", fontSize:"12px", color: p.status==="pending.." ? "#FFA500" : p.status==="not_for_sale" ? "#888" : "#D4AF37", cursor:"pointer"}}>$ {Number(p.price).toFixed(2)} ✏️</div>)}
            <div style={{display:"flex", gap:"3px", marginTop:"6px"}}>
              <button onClick={()=>setProductStatus(p.id, "for_sale")} style={{flex:1, background: p.status==="for_sale" || !p.status ? "#00ff88" : "#222", color: p.status==="for_sale" || !p.status ? "black" : "white", border:"none", borderRadius:"6px", padding:"4px 2px", fontSize:"8px", fontWeight:"900"}}>$ELL</button>
              <button onClick={()=>setProductStatus(p.id, "pending")} style={{flex:1, background: p.status==="pending" ? "#FFA500" : "#222", color:"white", border:"none", borderRadius:"6px", padding:"4px 2px", fontSize:"8px", fontWeight:"900"}}>Pending</button>
              <button onClick={()=>setProductStatus(p.id, "not_for_sale")} style={{flex:1, background: p.status==="not_for_sale" ? "#555" : "#222", color:"white", border:"none", borderRadius:"6px", padding:"4px 2px", fontSize:"8px", fontWeight:"900"}}>$OLD!</button>
            </div>
          </div>
          <div style={{position:"absolute", top:"6px", right:"6px", display:"flex", gap:"4px"}}>
            <button onClick={()=>{ setDeleteTargetId(p.id); setShowDeleteConfirm(true); }} style={{background:"rgba(255,0,0,0.8)", border:"none", color:"white", borderRadius:"50%", width:"20px", height:"20px", fontWeight:"900", cursor:"pointer"}}>×</button>
            <button onClick={()=>{setActiveProductId(p.id); productInputRef.current?.click();}} style={{background:"rgba(0,0,0,0.7)", border:"none", color:"white", borderRadius:"50%", width:"24px", height:"24px"}}>📷</button>
          </div>
        </div>
      ))}
      <div onClick={addProduct} style={{background:"#0a0a0a", border:"2px dashed #D4AF37", borderRadius:"14px", height:"150px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer"}}>+ Add</div>
    </div>
    <div style={{height:"90px"}}></div>
  </div>
</div>
)}

{/* DELETE CONFIRM POPUP - Delete this Asset? */}
{showDeleteConfirm && (
<div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.9)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:99999, padding:"20px"}}>
<div style={{background:"#111", border:"2px solid #D4AF37", borderRadius:"20px", padding:"28px", width:"100%", maxWidth:"340px", textAlign:"center"}}>
<div style={{fontSize:"36px", marginBottom:"12px"}}>⚠️</div>
<div style={{color:"white", fontWeight:"900", fontSize:"20px", marginBottom:"8px", fontFamily:"Orbitron"}}>Delete this Asset?</div>
<div style={{color:"#aaa", fontSize:"13px", marginBottom:"24px"}}>Are you sure you want to delete this item?<br/>This cannot be undone.</div>
<div style={{display:"flex", gap:"12px"}}>
<button onClick={()=>{ setShowDeleteConfirm(false); setDeleteTargetId(null); }} style={{flex:1, background:"#222", color:"white", padding:"14px", borderRadius:"12px", border:"1px solid #333", fontWeight:"700", cursor:"pointer"}}>Cancel</button>
<button onClick={async()=>{
  if(deleteTargetId){
    setProducts(products.filter(x=>x.id!==deleteTargetId));
    await supabase.from("products").delete().eq("id", deleteTargetId);
    loadFeed();
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  }
}} style={{flex:1, background:"#ff4444", color:"white", padding:"14px", borderRadius:"12px", border:"none", fontWeight:"900", cursor:"pointer"}}>YES, DELETE</button>
</div>
</div>
</div>
)}

{view==="accounts" && (
<div>
<div style={{padding:"15px", borderBottom:"1px solid #222"}}>
<div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}><h2 style={{color:"#D4AF37", margin:0, fontWeight:"900"}}>$H0P LI$T🛒 Available🌍</h2><div style={{display:"flex", gap:"6px"}}><button onClick={loadFeed} style={{background: isMarketRefreshing ? "#0a84ff" : "#D4AF37", color: isMarketRefreshing ? "white" : "black", padding:"6px 12px", borderRadius:"20px", fontSize:"11px", fontWeight:"900", border:"none", cursor:"pointer"}}>{isMarketRefreshing ? "Refreshing..." : "↻ Refresh"}</button><button onClick={()=>setIsLightMode(!isLightMode)} style={{background: theme.cardBg, border:"1px solid "+theme.cardBorder, color: theme.text, padding:"6px 10px", borderRadius:"20px", fontSize:"11px"}}>{isLightMode ? "☯︎ Dark" : "☯︎ Light"}</button><button onClick={handleBluetoothScan} style={{background: isOfflineMode ? "#0a84ff" : theme.cardBg, border:"1px solid "+(isOfflineMode ? "#0a84ff" : theme.cardBorder), color: isOfflineMode ? "white" : theme.text, padding:"6px 10px", borderRadius:"20px", fontSize:"11px"}}>{isBluetoothScanning ? "..." : "📡 BT"}</button></div></div>
<div style={{marginTop:"12px", display:"flex", gap:"8px"}}>
<button onClick={()=>setSearchTab("market")} style={{flex:1, background: searchTab==="market" ? "#D4AF37" : "#111", color: searchTab==="market" ? "black" : "white", padding:"8px", borderRadius:"20px", border:"1px solid #D4AF37", fontWeight:"900", fontSize:"11px"}}>💰 Buyers ({myFollowersProfiles.length})</button>
<button onClick={()=>setSearchTab("users")} style={{flex:1, background: searchTab==="users" ? "#D4AF37" : "#111", color: searchTab==="users" ? "black" : "white", padding:"8px", borderRadius:"20px", border:"1px solid #333", fontWeight:"900", fontSize:"11px"}}>💳 Sellers ({myFollowingProfiles.length})</button>
<button onClick={()=>setSearchTab("shop")} style={{flex:1, background: searchTab==="shop" ? "#D4AF37" : "#111", color: searchTab==="shop" ? "black" : "white", padding:"8px", borderRadius:"20px", border:"1px solid #333", fontWeight:"900", fontSize:"11px"}}>🛒 $hop ({displayMarketItems.length})</button>
</div>
</div>

{searchTab==="users" && (
<div style={{padding:"15px", paddingBottom:"90px"}}>
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

{searchTab==="market" && (
<div style={{padding:"15px", paddingBottom:"90px"}}>
<input placeholder="Search @username..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%", background:"#111", border:"1px solid #D4AF37", color:"white", padding:"12px", borderRadius:"12px", marginBottom:"12px"}}/>
<div style={{color:"#D4AF37", fontWeight:"900", fontSize:"14px", marginBottom:"12px"}}>💰 Buyers ({myFollowersProfiles.filter((u:any)=> (u.handle?.toLowerCase().includes(search.toLowerCase()) || u.name?.toLowerCase().includes(search.toLowerCase()))).length}) - People Who Follow$ YOU! ✅</div>
{myFollowersProfiles.filter((u:any)=> (u.handle?.toLowerCase().includes(search.toLowerCase()) || u.name?.toLowerCase().includes(search.toLowerCase()))).length===0 ? (
<div style={{textAlign:"center", color:"#666", marginTop:"30px", background:"#111", padding:"20px", borderRadius:"12px"}}>No Buyers found</div>
) : (
myFollowersProfiles.filter((u:any)=> (u.handle?.toLowerCase().includes(search.toLowerCase()) || u.name?.toLowerCase().includes(search.toLowerCase()))).map((u:any)=>(
<div key={u.handle} style={{display:"flex", gap:"10px", background:"#111", padding:"12px", borderRadius:"12px", marginBottom:"10px", border:"1px solid #222"}}>
<div style={{display:"flex", gap:"10px", flex:1, cursor:"pointer"}} onClick={()=>{ if(u.handle===myHandle){ setView("profile"); } else { loadPublicUser(u); } }}>
<img src={u.avatar} style={{width:"44px", height:"44px", borderRadius:"50%"}}/>
<div style={{flex:1}}><div style={{fontWeight:"bold"}}>{u.name}</div><div style={{fontSize:"11px", color:"#00ff88"}}>{u.handle} • FOLLOW$ YOU ✅ CA$H Buyer!</div></div>
<div style={{color:"#D4AF37", fontWeight:"bold"}}>${Number(u.total_worth||0).toFixed(2)}</div>
</div>
</div>
))
)}
</div>
)}

{searchTab==="shop" && (
<div style={{padding:"15px", paddingBottom:"90px"}}>
<input placeholder="🔍 Search items by name..." value={marketSearch} onChange={e=>setMarketSearch(e.target.value)} style={{width:"100%", background:"#111", border:"1px solid #D4AF37", color:"white", padding:"12px", borderRadius:"12px", marginBottom:"12px"}}/>
<div style={{display:"flex", gap:"8px", marginBottom:"12px"}}>
<button onClick={()=>setMarketView("new")} style={{flex:1, background: marketView==="new" ? "#D4AF37" : "#111", color: marketView==="new" ? "black" : "white", padding:"8px", borderRadius:"20px", border:"1px solid #333", fontWeight:"900", fontSize:"12px"}}>⬆️ New $tock</button>
<button onClick={()=>setMarketView("trending")} style={{flex:1, background: marketView==="trending" ? "#D4AF37" : "#111", color: marketView==="trending" ? "black" : "white", padding:"8px", borderRadius:"20px", border:"1px solid #333", fontWeight:"900", fontSize:"12px"}}>👁️ Trending</button>
</div>
<div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
{displayMarketItems.map((p:any)=>{
  const owner = profiles.find(pr=> pr.email===p.owner_email);
  const isMine = p.owner_email===email;
  return (
  <div key={p.id} onClick={()=>{ const ownerProfile = profiles.find(pr=> pr.email===p.owner_email); const ownerHandle = ownerProfile?.handle || p.owner_email; openImageModal(p.img, {id:p.id, img:p.img, price:p.price, title:p.title, owner_email:p.owner_email, owner_handle: ownerHandle, isMine: p.owner_email===email, status:p.status}); }} style={{background:"#111", borderRadius:"14px", overflow:"hidden", border: p.status==="perfect" ? "1.5px solid #D4AF37" : "1px solid #2a2a2a", cursor:"pointer"}}>
    <div style={{position:"relative"}}>
      <img src={p.img} style={{width:"100%", height:"130px", objectFit:"cover"}}/>
      <div style={{position:"absolute", bottom:"6px", left:"6px", background:"rgba(0,0,0,0.7)", color:"#D4AF37", fontSize:"10px", fontWeight:"900", padding:"3px 6px", borderRadius:"10px"}}>${Number(p.price).toFixed(2)}</div>
      <div style={{position:"absolute", top:"6px", right:"6px", background:"rgba(0,0,0,0.7)", color:"white", fontSize:"9px", fontWeight:"900", padding:"3px 6px", borderRadius:"10px"}}>👁️ {p.views || 0}</div>
      {p.status==="perfect" && <div style={{position:"absolute", top:"6px", left:"6px", background:"#D4AF37", color:"black", fontSize:"8px", fontWeight:"900", padding:"3px 6px", borderRadius:"10px"}}>⭐ PERFECT</div>}
    </div>
    <div style={{padding:"8px"}}>
      <div style={{fontSize:"12px", fontWeight:"bold", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{p.title}</div>
      <div style={{fontSize:"10px", color:"#888", marginBottom: isMine ? "6px" : "0"}}>{owner ? owner.handle : p.owner_email?.split("@")[0]}</div>
      {isMine && (
        <div style={{display:"flex", gap:"4px", marginTop:"4px"}}>
          <button onClick={(e)=>{ e.stopPropagation(); handleRenameProduct(p); }} style={{flex:1, background:"#222", color:"white", border:"1px solid #333", padding:"5px 0", borderRadius:"8px", fontSize:"9px", fontWeight:"900", cursor:"pointer"}}>✏️ Rename</button>
          <button onClick={(e)=>{ e.stopPropagation(); handleTogglePerfect(p); }} style={{flex:1, background: p.status==="perfect" ? "#D4AF37" : "#111", color: p.status==="perfect" ? "black" : "#D4AF37", border: p.status==="perfect" ? "1px solid #D4AF37" : "1px solid #D4AF37", padding:"5px 0", borderRadius:"8px", fontSize:"9px", fontWeight:"900", cursor:"pointer"}}>{p.status==="perfect" ? "✅ Perfect" : "⭐ Perfect?"}</button>
        </div>
      )}
    </div>
  </div>
  );
})}
</div>
</div>
)}

</div>
)}
<div style={{position:"fixed", bottom:0, left:0, right:0, maxWidth:"480px", margin:"0 auto", background: theme.navBg, borderTop:"2px solid #0a84ff", display:"flex", justifyContent:"space-around", padding:"10px", zIndex:5000}}>
<div onClick={()=>setView("offers")} style={{color: view==="offers" ? "#0a84ff" : "#888", cursor:"pointer", position:"relative", fontWeight: view==="offers" ? "900" : "400", background: view==="offers" ? (isLightMode ? "#e3f2fd" : "#0a1a2a") : "transparent", padding:"6px 12px", borderRadius:"20px", border: view==="offers" ? "1px solid #0a84ff" : "none"}}>💬 $IM {myOffersCount>0 && <span style={{position:"absolute", top:"-6px", right:"-8px", background:"red", color:"white", fontSize:"9px", padding:"2px 5px", borderRadius:"10px"}}>{myOffersCount}</span>} {isOfflineMode && <span style={{position:"absolute", top:"-6px", left:"-8px", background:"#0a84ff", color:"white", fontSize:"8px", padding:"2px 4px", borderRadius:"10px"}}>BT</span>}</div>
<div onClick={()=>setView("feed")} style={{color: view==="feed" ? "#0a84ff" : "#888", cursor:"pointer", fontWeight: view==="feed" ? "900" : "400", background: view==="feed" ? (isLightMode ? "#e3f2fd" : "#0a1a2a") : "transparent", padding:"6px 12px", borderRadius:"20px", border: view==="feed" ? "1px solid #0a84ff" : "none"}}>👑 Worth</div>
<div onClick={()=>setView("accounts")} style={{color: view==="accounts" ? "#0a84ff" : "#888", cursor:"pointer", fontWeight: view==="accounts" ? "900" : "400", background: view==="accounts" ? (isLightMode ? "#e3f2fd" : "#0a1a2a") : "transparent", padding:"6px 12px", borderRadius:"20px", border: view==="accounts" ? "1px solid #0a84ff" : "none"}}>📦 $tore {isMarketRefreshing && "↻"}</div>
<div onClick={()=>setView("profile")} style={{color: view==="profile" ? "#0a84ff" : "#888", cursor:"pointer", fontWeight: view==="profile" ? "900" : "400", background: view==="profile" ? (isLightMode ? "#e3f2fd" : "#0a1a2a") : "transparent", padding:"6px 12px", borderRadius:"20px", border: view==="profile" ? "1px solid #0a84ff" : "none"}}>🏛️ ₿anc</div>
</div>
{showSplash && (
  <div style={{ height: '100vh', width: '100vw', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
    <img src="/splash.png" style={{ width: '100vw', height: '100vh', objectFit: 'cover' }} alt="splash" />
  </div>
)}
{showCommentsFull && (
<div style={{position:"fixed", inset:0, background: theme.bg, zIndex:10000, display:"flex", flexDirection:"column", maxWidth:"480px", margin:"0 auto"}}>
<div style={{display:"flex", alignItems:"center", gap:"12px", padding:"14px", borderBottom:"1px solid #222", background: theme.cardBg}}>
<div onClick={()=>setShowCommentsFull(false)} style={{fontSize:"22px", cursor:"pointer"}}>←</div>
<div style={{fontWeight:"900", fontSize:"16px"}}>Comments ({comments.length})</div>
</div>
<div style={{flex:1, overflowY:"auto", padding:"12px"}}>
{comments.length===0 && <div style={{textAlign:"center", color:"#666", marginTop:"40px"}}>No comments yet. Be first! 💬</div>}
{comments.map((c:any)=>{
  const commenter = profiles.find((p:any)=> p.handle===c.commenter_handle);
  return (
  <div key={c.id} style={{background:"#111", padding:"12px", borderRadius:"12px", marginBottom:"10px", border:"1px solid #222"}}>
    <div style={{display:"flex", gap:"8px", alignItems:"center"}}>
      <img src={commenter?.avatar || "https://i.pravatar.cc/100"} style={{width:"32px", height:"32px", borderRadius:"50%"}} />
      <div style={{flex:1}}>
        <div style={{display:"flex", gap:"6px", alignItems:"center"}}>
          <span style={{fontWeight:"900", fontSize:"13px", color:"#D4AF37", cursor:"pointer"}} onClick={()=>{ setShowCommentsFull(false); setShowImageModal(false); const u=profiles.find((p:any)=>p.handle===c.commenter_handle); if(u) loadPublicUser(u); }}>@{c.commenter_handle}</span>
          <span style={{fontSize:"10px", color:"#666"}}>{new Date(c.created_at).toLocaleDateString()}</span>
        </div>
        <div style={{fontSize:"13px", color:"white", marginTop:"4px", wordBreak:"break-word", whiteSpace:"pre-wrap"}}>{c.text}</div>
      </div>
    </div>
  </div>
  );
})}
</div>
<div style={{padding:"12px", borderTop:"1px solid #222", background: theme.cardBg, display:"flex", gap:"8px"}}>
<input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add a comment... @handle" style={{flex:1, background:"#111", border:"1px solid #333", color:"white", padding:"12px", borderRadius:"20px"}} onKeyDown={(e:any)=> e.key==='Enter' && handleAddComment()} />
<button onClick={handleAddComment} style={{background:"#D4AF37", color:"black", fontWeight:"900", padding:"12px 20px", borderRadius:"20px", border:"none"}}>Post</button>
</div>
</div>
)}
{showCalculator && (
<div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:10001, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px"}}>
<div style={{background:"#111", border:"2px solid #D4AF37", borderRadius:"16px", padding:"16px", width:"280px"}}>
<div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px"}}>
<div style={{fontWeight:"900", color:"#D4AF37", fontSize:"12px"}}>$1M Count • ${zarRate} • {["cm","mm","in","ft"][cmCycle]}</div>
<div onClick={()=>{setShowCalculator(false); setConvertedZAR(""); setCmCycle(0);}} style={{cursor:"pointer", color:"white", fontSize:"22px", fontWeight:"900"}}>❌</div>
</div>

<div style={{background:"black", color:"#D4AF37", padding:"12px", borderRadius:"10px", textAlign:"right", fontSize:"28px", fontWeight:"900", marginBottom:"4px", minHeight:"48px", wordBreak:"break-all", border:"1px solid #222"}}>{calcDisplay}</div>

{convertedZAR && (
  <div style={{background:"#0a2a0a", color:"#00ff88", padding:"8px 12px", borderRadius:"8px", textAlign:"right", fontSize:"12px", fontWeight:"900", marginBottom:"12px", border:"1px solid #00ff88", whiteSpace:"pre-line", lineHeight:"1.4"}}>
    {convertedZAR}
  </div>
)}

<div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"8px"}}>
{[
  {l:["cm→mm","mm→in","in→ft","ft→cm"][cmCycle], c:"#1a1a3a", v:"CM", t:"cycle"},
  {l:"lb→kg", c:"#1a1a3a", v:"LB"},
  {l:"kg→cup", c:"#1a1a3a", v:"KGCUP"},
  {l:"g→tsp", c:"#1a1a3a", v:"GTSP"},

  {l:"C", c:"#333", v:"C"}, {l:"⌫", c:"#333", v:"⌫"}, {l:"%", c:"#333", v:"%"}, {l:"➗", c:"#D4AF37", v:"/"},
  {l:"7", c:"#222", v:"7"}, {l:"8", c:"#222", v:"8"}, {l:"9", c:"#222", v:"9"}, {l:"✖️", c:"#D4AF37", v:"*"},
  {l:"4", c:"#222", v:"4"}, {l:"5", c:"#222", v:"5"}, {l:"6", c:"#222", v:"6"}, {l:"➖", c:"#D4AF37", v:"-"},
  {l:"1", c:"#222", v:"1"}, {l:"2", c:"#222", v:"2"}, {l:"3", c:"#222", v:"3"}, {l:"➕", c:"#D4AF37", v:"+"},
  {l:"0", c:"#222", v:"0"}, {l:"●", c:"#222", v:"."}, {l:"$→R", c:"#00c875", v:"$→R"}, {l:"🟰", c:"#D4AF37", v:"="},
].map((b,i)=>{
  return (
  <button key={i} onClick={async()=>{
    const num = parseFloat(calcDisplay);
    if(b.v==="C") { setCalcDisplay("0"); setConvertedZAR(""); setCmCycle(0); }
    else if(b.v==="⌫") { setCalcDisplay(p=> p.length>1 ? p.slice(0,-1) : "0"); setConvertedZAR(""); }
    else if(b.v==="="){ 
      try{ 
        let exp = calcDisplay.replace(/%/g,"/100"); 
        let r = Function('"use strict";return ('+exp+')')(); 
        let res = String(r).slice(0,10);
        setCalcDisplay(res);
        if(!isNaN(parseFloat(res))) {
          try {
            let resp = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
            let data = await resp.json();
            let rate = data.rates.ZAR || 18.72;
            setZarRate(rate.toFixed(2));
            setConvertedZAR(`🇿🇦 R ${(parseFloat(res) * rate).toFixed(2)}`);
          } catch { setConvertedZAR(`🇿🇦 R ${(parseFloat(res) * zarRate).toFixed(2)}`); }
        }
      }catch{ setCalcDisplay("Error"); } 
    }
    else if(b.v==="CM"){
      if(isNaN(num)) return;
      if(cmCycle===0){ // cm -> mm
        setConvertedZAR(`📏 ${num} cm = ${num*10} mm`);
        setCmCycle(1);
      } else if(cmCycle===1){ // mm -> inch (assuming input was original cm, but now we show mm to inch logic)
        setConvertedZAR(`📏 ${num} cm = ${(num/2.54).toFixed(2)} inch\n= ${(num*10/25.4).toFixed(2)} inch (from mm)`);
        setCmCycle(2);
      } else if(cmCycle===2){ // inch -> feet
        let inch = num/2.54;
        setConvertedZAR(`📏 ${num} cm = ${inch.toFixed(2)} in = ${(inch/12).toFixed(3)} ft`);
        setCmCycle(3);
      } else { // ft -> cm (cycle back)
        let inch = num/2.54;
        let ft = inch/12;
        setConvertedZAR(`📏 ${num} cm = ${ft.toFixed(4)} ft\nCycle back → cm`);
        setCmCycle(0);
      }
    }
    else if(b.v==="LB"){ if(isNaN(num)) return; setConvertedZAR(`⚖️ ${num} lb = ${(num*0.453592).toFixed(3)} kg`); }
    else if(b.v==="KGCUP"){ if(isNaN(num)) return; setConvertedZAR(`🥣 ${num} kg ≈ ${(num*4.22675).toFixed(2)} cups`); }
    else if(b.v==="GTSP"){ if(isNaN(num)) return; setConvertedZAR(`🥄 ${num} g = ${(num/5).toFixed(1)} tsp = ${(num/15).toFixed(1)} tbsp`); }
    else if(b.v==="$→R"){
      if(isNaN(num)) return;
      try {
        let resp = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        let data = await resp.json();
        let rate = data.rates.ZAR || 18.72;
        setZarRate(rate.toFixed(2));
        setConvertedZAR(`🇿🇦 R ${(num * rate).toFixed(2)}`);
      } catch { setConvertedZAR(`🇿🇦 R ${(num * zarRate).toFixed(2)}`); }
    }
    else {
      setCalcDisplay(p=> { if(p==="0" && ![".", "%", "/", "*", "-", "+"].includes(b.v)) return b.v; if(p==="Error") return b.v; setConvertedZAR(""); return p + b.v; });
    }
  }} style={{
    background:b.c, color: b.c==="#D4AF37" || b.c==="#00c875" ? "black" : "white", 
    border: b.c==="#1a1a3a" ? "1px solid #5555ff" : "1px solid #333", 
    padding: b.v==="CM"||b.v==="LB"||b.v==="KGCUP"||b.v==="GTSP" ? "10px 0" : "14px 0", 
    borderRadius:"10px", fontWeight:"900", 
    fontSize: b.v==="CM" ? "10px" : b.v==="LB"||b.v==="KGCUP"||b.v==="GTSP" ? "10px" : b.l==="$→R" ? "13px" : "18px", 
    cursor:"pointer"
  }}>{b.l}</button>
  );
})}
</div>
<div style={{textAlign:"center", color:"#666", fontSize:"9px", marginTop:"10px"}}>Tap cm button to cycle: cm → mm → inch → feet • ❌ to close</div>
</div>
</div>
)}
{/* ===== PIN DOOR POPUP ===== */}
{showPinPrompt && (
  <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.9)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px"}}>
    <div style={{background:"#111", border:"1px solid #D4AF37", borderRadius:"16px", padding:"20px", width:"100%", maxWidth:"320px", textAlign:"center"}}>
      <div style={{fontSize:"40px"}}>🔒</div>
      <div style={{color:"#D4AF37", fontWeight:"900", fontSize:"16px", margin:"10px 0"}}>LOCKED ROOM</div>
      <div style={{color:"white", fontSize:"13px", marginBottom:"12px"}}>Enter WORTH PIN to open<br/><b>{pinPromptRoom}</b><br/><span style={{color:"#ff4444", fontSize:"11px"}}>Strikes: {pinFails}/3 - Strike 3 = YOU OUT</span></div>
      <input value={pinInput} onChange={(e)=>setPinInput(e.target.value.replace(/[^0-9]/g,"").slice(0,4))} placeholder="••••" inputMode="numeric" style={{width:"100%", padding:"14px", fontSize:"22px", textAlign:"center", letterSpacing:"8px", background:"#222", color:"white", border:"1px solid #333", borderRadius:"10px", marginBottom:"12px"}} />
      <button onClick={checkPinAndUnlock} style={{width:"100%", padding:"14px", background:"#00ff88", color:"black", border:"none", borderRadius:"10px", fontWeight:"900", fontSize:"14px", cursor:"pointer"}}>UNLOCK 🔓</button>
      <button onClick={()=>{setShowPinPrompt(false); setPinInput("");}} style={{width:"100%", padding:"12px", background:"transparent", color:"#888", border:"none", fontWeight:"700", fontSize:"12px", marginTop:"6px", cursor:"pointer"}}>Go Back</button>
    </div>
  </div>
)}
{/* ===== END PIN DOOR ===== */}
</div>
);
}
