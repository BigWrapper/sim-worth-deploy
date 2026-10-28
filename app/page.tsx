"use client";
import { useState, useEffect, useRef } from "react";

const MOCK_USERS = [
{name:"Dre Van Wyk", handle:"@DreVanWyk", avatar:"https://i.pravatar.cc/200?img=12", verified:true},
{name:"Tina Roar", handle:"@tinaRoar", avatar:"https://i.pravatar.cc/200?img=5", verified:true},
];

type Product = { id: string; img: string; price: number; oldPrice: number; };

const DEFAULT_PRODUCTS: Product[] = [
{id:"1", img:"https://images.unsplash.com/photo-1590556880077-6e12165cd67b?w=400", price:10.59, oldPrice:62.99},
{id:"2", img:"https://images.unsplash.com/photo-1523774256-e71cc15778f3?w=400", price:16.49, oldPrice:59.99},
{id:"3", img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", price:24.09, oldPrice:72.99},
{id:"4", img:"https://images.unsplash.com/photo-1591348121980-e91a5c0bc5c5?w=400", price:27.99, oldPrice:79.99},
];

export default function FullApp(){
const [loggedIn, setLoggedIn] = useState(false);
const [view, setView] = useState("accounts");
const [selectedUser, setSelectedUser] = useState(MOCK_USERS[0]);
const [tab, setTab] = useState("All Accounts");
const [authMode, setAuthMode] = useState("login");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [err, setErr] = useState("");
const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
const [avatarPreview, setAvatarPreview] = useState(selectedUser.avatar);
const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
const [tempPrice, setTempPrice] = useState("");
const avatarInputRef = useRef<HTMLInputElement>(null);
const productInputRef = useRef<HTMLInputElement>(null);
const [activeProductId, setActiveProductId] = useState<string | null>(null);
const wAlink = "https://wa.me/27821234567?text=Hi $IM Worth";

// LOAD SAVED DATA
useEffect(()=>{
  const session = localStorage.getItem("im_session");
  if(session) setEmail(session);
  
  const savedProducts = localStorage.getItem(`im_products_${localStorage.getItem("im_session") || "default"}`) || localStorage.getItem("im_products");
  if(savedProducts){ try{ setProducts(JSON.parse(savedProducts)); }catch{} }
  
  const savedAvatar = localStorage.getItem(`im_avatar_${localStorage.getItem("im_session") || "default"}`) || localStorage.getItem("im_avatar");
  if(savedAvatar) setAvatarPreview(savedAvatar);
},[]);

// SAVE PRODUCTS PER USER
useEffect(()=>{
  if(products.length===0) return;
  const key = `im_products_${email || "default"}`;
  localStorage.setItem(key, JSON.stringify(products));
  localStorage.setItem("im_products", JSON.stringify(products)); // fallback
},[products, email]);

useEffect(()=>{
  if(!avatarPreview) return;
  const key = `im_avatar_${email || "default"}`;
  localStorage.setItem(key, avatarPreview);
  localStorage.setItem("im_avatar", avatarPreview);
},[avatarPreview, email]);

const totalWorth = products.reduce((sum, p)=> sum + p.price, 0);

const doLogin = () => {
  setErr("");
  if(!email.includes("@") || password.length < 3){ setErr("Enter valid email + password (min 3 chars)"); return; }
  const key = `im_user_${email}`;
  const saved = localStorage.getItem(key);
  if(authMode === "signup"){
    if(saved){ setErr("Account exists. Please Login."); setAuthMode("login"); return; }
    localStorage.setItem(key, password);
    localStorage.setItem("im_session", email);
    // load this user's data
    const up = localStorage.getItem(`im_products_${email}`);
    if(up) setProducts(JSON.parse(up));
    const av = localStorage.getItem(`im_avatar_${email}`);
    if(av) setAvatarPreview(av);
    setLoggedIn(true);
  } else {
    if(!saved){ setErr("No account. Tap Sign Up below."); return; }
    if(saved !== password){ setErr("Wrong password"); return; }
    localStorage.setItem("im_session", email);
    const up = localStorage.getItem(`im_products_${email}`);
    if(up) setProducts(JSON.parse(up));
    const av = localStorage.getItem(`im_avatar_${email}`);
    if(av) setAvatarPreview(av);
    else setAvatarPreview(selectedUser.avatar);
    setLoggedIn(true);
  }
};

// PERMANENT SAVE - convert to base64
const toBase64 = (file:File):Promise<string> => new Promise((res,rej)=>{
  const reader = new FileReader();
  reader.onload = ()=> res(reader.result as string);
  reader.onerror = rej;
  reader.readAsDataURL(file);
});

const handleAvatarChange = async (e:any)=>{
  const file = e.target.files?.[0];
  if(file){
    const base64 = await toBase64(file);
    setAvatarPreview(base64);
    setSelectedUser(prev=>({...prev, avatar: base64}));
  }
};

const handleProductImageChange = async (e:any)=>{
  const file = e.target.files?.[0];
  if(file && activeProductId){
    const base64 = await toBase64(file);
    setProducts(prev => prev.map(p=> p.id===activeProductId ? {...p, img:base64} : p));
  }
};

const updatePrice = (id:string)=>{
  const num = parseFloat(tempPrice);
  if(!isNaN(num)){ setProducts(prev => prev.map(p=> p.id===id ? {...p, price:num} : p)); }
  setEditingPriceId(null);
};

const addProduct = ()=>{
  const newItem: Product = { id: Date.now().toString(), img:"https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400", price:19.99, oldPrice:59.99 };
  setProducts([...products, newItem]);
};

if(!loggedIn){
return(
<div style={{minHeight:"100vh", background:"black", display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"80px", paddingLeft:"20px", paddingRight:"20px"}}>
<div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
<h1 style={{margin:0, fontSize:"56px", fontWeight:"900", lineHeight:1}}><span style={{color:"#D4AF37"}}>$</span><span style={{color:"white"}}>IM</span></h1>
<div style={{color:"#D4AF37", fontSize:"32px", fontWeight:"900", letterSpacing:"6px", marginTop:"4px"}}>WORTH</div>
<div style={{color:"#D4AF37", opacity:0.7, fontSize:"10px", letterSpacing:"2px", marginTop:"8px"}}>REAL PEOPLE • REAL ACCOUNTS • REAL VALUE</div>
</div>
<div style={{width:"100%", maxWidth:"360px", marginTop:"56px", border:"1px solid rgba(212,175,55,0.4)", borderRadius:"24px", background:"#0a0a0a", padding:"24px"}}>
<div style={{textAlign:"center", color:"#D4AF37", fontSize:"24px", fontWeight:"bold", marginBottom:"24px"}}>Welcome Back</div>
{err && <div style={{background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#f87171", fontSize:"12px", padding:"10px", borderRadius:"8px", marginBottom:"12px", textAlign:"center"}}>{err}</div>}
<input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%", background:"#141414", border:"1px solid #222", color:"white", padding:"14px", borderRadius:"12px", marginBottom:"12px", outline:"none", boxSizing:"border-box"}}/>
<input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter" && doLogin()} style={{width:"100%", background:"#141414", border:"1px solid #222", color:"white", padding:"14px", borderRadius:"12px", marginBottom:"20px", outline:"none", boxSizing:"border-box"}}/>
<button onClick={doLogin} style={{width:"100%", background:"linear-gradient(to bottom, #D4AF37, #9c7d1e)", color:"black", fontWeight:"900", padding:"14px", borderRadius:"12px", border:"none", cursor:"pointer"}}>{authMode==="signup"?"SIGN UP →":"LOGIN →"}</button>
<div style={{textAlign:"center", color:"#666", fontSize:"13px", marginTop:"16px"}}>{authMode==="signup"?"Already have?":"No account?"} <span onClick={()=>{setAuthMode(authMode==="signup"?"login":"signup"); setErr("");}} style={{color:"#bbb", cursor:"pointer", textDecoration:"underline"}}>{authMode==="signup"?"Login":"Sign Up"}</span></div>
</div>
</div>
);
}

if(view==="profile"){
return(
<div style={{minHeight:"100vh", background:"black", color:"white", maxWidth:"480px", margin:"0 auto", paddingBottom:"90px"}}>
<input ref={avatarInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatarChange}/>
<input ref={productInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleProductImageChange}/>
<div style={{display:"flex", alignItems:"center", gap:"10px", padding:"15px", borderBottom:"1px solid #222"}}>
<div onClick={()=>setView("accounts")} style={{cursor:"pointer", fontSize:"20px"}}>←</div>
<div style={{color:"#D4AF37", fontWeight:"bold"}}>{selectedUser.name}</div>
</div>
<div style={{padding:"20px", textAlign:"center"}}>
<div style={{position:"relative", display:"inline-block"}}>
<img src={avatarPreview} onClick={()=>avatarInputRef.current?.click()} style={{width:"90px", height:"90px", borderRadius:"50%", border:"2px solid #D4AF37", cursor:"pointer", objectFit:"cover"}}/>
<div onClick={()=>avatarInputRef.current?.click()} style={{position:"absolute", bottom:"0", right:"0", background:"#D4AF37", width:"28px", height:"28px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:"2px solid black", fontSize:"12px"}}>📷</div>
</div>
<div style={{marginTop:"10px", color:"#D4AF37", fontWeight:"bold", fontSize:"24px"}}>{selectedUser.name}</div>
<div style={{fontWeight:"bold", opacity:0.8}}>{selectedUser.handle}</div>
<div style={{color:"#888", fontSize:"11px", marginTop:"4px"}}>Tap photo to change — now SAVES forever</div>
</div>
<div style={{margin:"0 15px", border:"1px solid #D4AF37", borderRadius:"12px", padding:"14px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"linear-gradient(90deg, #111, #0a0a0a)"}}>
<div>
<div style={{color:"#888", fontSize:"10px", letterSpacing:"1px"}}>TOTAL NET WORTH (AUTO)</div>
<div style={{color:"#D4AF37", fontWeight:"900", fontSize:"22px"}}>$ {totalWorth.toFixed(2)}</div>
<div style={{color:"#00A651", fontSize:"12px"}}>Sum of {products.length} items below</div>
</div>
<div style={{textAlign:"right"}}><div style={{color:"#00A651", fontSize:"12px"}}>+12.5% (24h)</div><div style={{fontSize:"10px", color:"#666"}}>Live</div></div>
</div>
<div style={{padding:"12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px"}}>
{products.map((p)=>(
<div key={p.id} style={{background:"#111", borderRadius:"14px", overflow:"hidden", border:"1px solid #2a2a2a", position:"relative"}}>
<img src={p.img} onClick={()=>{setActiveProductId(p.id); productInputRef.current?.click();}} style={{width:"100%", height:"120px", objectFit:"cover", cursor:"pointer"}}/>
<div style={{position:"absolute", top:"6px", right:"6px", background:"rgba(0,0,0,0.7)", borderRadius:"6px", padding:"2px 6px", fontSize:"10px", cursor:"pointer"}} onClick={()=>{setActiveProductId(p.id); productInputRef.current?.click();}}>📷</div>
<div style={{padding:"8px"}}>
{editingPriceId===p.id ? (
<div style={{display:"flex", gap:"4px"}}>
<input value={tempPrice} onChange={e=>setTempPrice(e.target.value)} autoFocus type="number" style={{width:"70px", background:"#222", border:"1px solid #D4AF37", color:"white", borderRadius:"6px", padding:"4px"}}/>
<button onClick={()=>updatePrice(p.id)} style={{background:"#D4AF37", border:"none", borderRadius:"6px", padding:"4px 8px", fontWeight:"bold", cursor:"pointer"}}>OK</button>
</div>
) : (
<div style={{display:"flex", gap:"6px", alignItems:"center"}} onClick={()=>{setEditingPriceId(p.id); setTempPrice(p.price.toString());}} >
<span style={{fontWeight:"900", fontSize:"15px", cursor:"pointer"}}>$ {p.price.toFixed(2)}</span>
<span style={{color:"#666", textDecoration:"line-through", fontSize:"11px"}}>$ {p.oldPrice.toFixed(2)}</span>
<span style={{fontSize:"10px", color:"#D4AF37", marginLeft:"auto"}}>✏️</span>
</div>
)}
<div style={{fontSize:"9px", color:"#555", marginTop:"2px"}}>Tap price to edit • Tap image to change</div>
</div>
<button onClick={()=>setProducts(products.filter(x=>x.id!==p.id))} style={{position:"absolute", top:"6px", left:"6px", background:"rgba(255,0,0,0.7)", border:"none", color:"white", borderRadius:"50%", width:"20px", height:"20px", fontSize:"10px", cursor:"pointer"}}>×</button>
</div>
))}
<div onClick={addProduct} style={{background:"#0a0a0a", border:"2px dashed #D4AF37", borderRadius:"14px", height:"120px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", minHeight:"160px"}}>
<div style={{fontSize:"32px", color:"#D4AF37"}}>+</div>
<div style={{color:"#D4AF37", fontSize:"12px", fontWeight:"bold"}}>Add Item</div>
</div>
</div>
<div style={{position:"fixed", bottom:"0", left:"0", right:"0", maxWidth:"480px", margin:"0 auto", background:"black", borderTop:"1px solid #D4AF37", padding:"10px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
<div onClick={()=>setView("accounts")} style={{background:"black", border:"1px solid #D4AF37", borderRadius:"10px", padding:"12px", textAlign:"center", fontWeight:"bold", color:"#D4AF37", cursor:"pointer"}}>Back</div>
<div onClick={()=>window.open(wAlink,"_blank")} style={{background:"#00A651", borderRadius:"10px", padding:"12px", textAlign:"center", fontWeight:"bold", color:"white", cursor:"pointer"}}>WhatsApp Call</div>
</div>
</div>
);
}
return(
<div style={{minHeight:"100vh", background:"black", color:"white", maxWidth:"480px", margin:"0 auto", paddingBottom:"80px"}}>
<div style={{padding:"15px", display:"flex", justifyContent:"space-between"}}><h2 style={{color:"#D4AF37", fontWeight:"bold", margin:0}}>Accounts</h2><span style={{color:"#666", fontSize:"12px"}}>${totalWorth.toFixed(2)} total</span></div>
<div style={{display:"flex", gap:"8px", padding:"0 15px", overflowX:"auto"}}>
{["All Accounts","Following","Your Account","Suggested"].map(t=>(
<div key={t} onClick={()=>setTab(t)} style={{padding:"8px 12px", borderRadius:"20px", background: tab===t ? "#D4AF37" : "#222", color: tab===t ? "black" : "white", fontSize:"12px", cursor:"pointer", whiteSpace:"nowrap"}}>{t}</div>
))}
</div>
<div style={{padding:"15px"}}>
{MOCK_USERS.map((u,i)=>(
<div key={i} onClick={()=>{setSelectedUser(u); setAvatarPreview(i===0 ? avatarPreview : u.avatar); setView("profile")}} style={{display:"flex", alignItems:"center", gap:"10px", padding:"12px", background:"#111", border:"1px solid #333", borderRadius:"12px", marginBottom:"10px", cursor:"pointer"}}>
<img src={i===0 ? avatarPreview : u.avatar} style={{width:"44px", height:"44px", borderRadius:"50%", objectFit:"cover"}}/>
<div style={{flex:1}}><div style={{fontWeight:"bold"}}>{u.name}</div><div style={{fontSize:"11px", color:"#888"}}>{u.handle}</div></div>
<div style={{color:"#D4AF37", fontWeight:"bold", fontSize:"13px"}}>$ {totalWorth.toFixed(2)}</div>
</div>
))}
</div>
<div style={{position:"fixed", bottom:"0", left:"0", right:"0", maxWidth:"480px", margin:"0 auto", background:"black", borderTop:"1px solid #D4AF37", display:"flex", justifyContent:"space-around", padding:"10px", fontSize:"12px"}}>
<div onClick={()=>setView("accounts")} style={{textAlign:"center", cursor:"pointer", color:"#D4AF37"}}><div style={{fontSize:"18px"}}>👤</div>Accounts</div>
<div onClick={()=>window.open(wAlink,"_blank")} style={{textAlign:"center", cursor:"pointer"}}><div style={{fontSize:"18px"}}>💬</div>Messages</div>
<div onClick={()=>{localStorage.removeItem("im_session"); setLoggedIn(false); setView("accounts");}} style={{textAlign:"center", cursor:"pointer"}}><div style={{fontSize:"18px"}}>More</div>Logout</div>
</div>
</div>
);
}
