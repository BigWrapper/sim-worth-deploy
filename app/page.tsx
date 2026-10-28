"use client";
import { useState } from "react";

const MOCK_USERS = [
{name:"Dre Van Wyk", handle:"@DreVanWyk", avatar:"https://i.pravatar.cc/200?img=12", net:"$ 248,750.32", verified:true, worth:"$ 362,450.00"},
{name:"Tina Roar", handle:"@tinaRoar", avatar:"https://i.pravatar.cc/200?img=5", net:"$ 12,400.00", verified:true, worth:"$ 45,000.00"},
];

const PRODUCTS = [
{price:"$ 10.59", old:"$62.99", img:"https://images.unsplash.com/photo-1590556880077-6e12165cd67b?w=400"},
{price:"$ 16.49", old:"$59.99", img:"https://images.unsplash.com/photo-1523774256-e71cc15778f3?w=400"},
{price:"$ 24.09", old:"$72.99", img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"},
{price:"$ 27.99", old:"$79.99", img:"https://images.unsplash.com/photo-1591348121980-e91a5c0bc5c5?w=400"},
];

export default function FullApp(){
const [loggedIn, setLoggedIn] = useState(false);
const [view, setView] = useState("accounts");
const [selectedUser, setSelectedUser] = useState(MOCK_USERS[0]);
const [tab, setTab] = useState("All Accounts");
const [authMode, setAuthMode] = useState("login");

// REAL LOGIN FIELDS
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [err, setErr] = useState("");

const wAlink = "https://wa.me/27821234567?text=Hi";

const doLogin = () => {
  setErr("");
  if(!email.includes("@") || password.length < 3){
    setErr("Enter valid email + password (min 3 chars)");
    return;
  }
  const key = `im_user_${email}`;
  const saved = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  
  if(authMode === "signup"){
    if(saved){
      setErr("Account exists. Please Login.");
      setAuthMode("login");
      return;
    }
    localStorage.setItem(key, password);
    localStorage.setItem("im_session", email);
    setLoggedIn(true);
  } else {
    if(!saved){
      setErr("No account. Tap Sign Up below.");
      return;
    }
    if(saved !== password){
      setErr("Wrong password");
      return;
    }
    localStorage.setItem("im_session", email);
    setLoggedIn(true);
  }
};

// === REAL LOCK SCREEN - THIS IS THE FIX ===
if(!loggedIn){
return(
<div style={{minHeight:"100vh", background:"black", display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"80px", paddingLeft:"20px", paddingRight:"20px"}}>
<div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
<h1 style={{margin:0, fontSize:"56px", fontWeight:"900", lineHeight:1}}>
<span style={{color:"#D4AF37", textShadow:"0 0 20px rgba(212,175,55,0.6)"}}>$</span>
<span style={{color:"white"}}>IM</span>
</h1>
<div style={{color:"#D4AF37", fontSize:"32px", fontWeight:"900", letterSpacing:"6px", marginTop:"4px"}}>WORTH</div>
<div style={{color:"#D4AF37", opacity:0.7, fontSize:"10px", letterSpacing:"2px", marginTop:"8px", textAlign:"center"}}>REAL PEOPLE • REAL ACCOUNTS • REAL VALUE</div>
</div>

<div style={{width:"100%", maxWidth:"360px", marginTop:"56px", border:"1px solid rgba(212,175,55,0.4)", borderRadius:"24px", background:"#0a0a0a", padding:"24px", boxShadow:"0 0 30px rgba(212,175,55,0.1)"}}>
<div style={{textAlign:"center", color:"#D4AF37", fontSize:"24px", fontWeight:"bold", marginBottom:"24px"}}>Welcome Back</div>

{err && <div style={{background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#f87171", fontSize:"12px", padding:"10px", borderRadius:"8px", marginBottom:"12px", textAlign:"center"}}>{err}</div>}

<input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%", background:"#141414", border:"1px solid #222", color:"white", padding:"14px", borderRadius:"12px", marginBottom:"12px", outline:"none", boxSizing:"border-box"}}/>
<input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter" && doLogin()} style={{width:"100%", background:"#141414", border:"1px solid #222", color:"white", padding:"14px", borderRadius:"12px", marginBottom:"20px", outline:"none", boxSizing:"border-box"}}/>

<button onClick={doLogin} style={{width:"100%", background:"linear-gradient(to bottom, #D4AF37, #9c7d1e)", color:"black", fontWeight:"900", padding:"14px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"15px"}}>{authMode==="signup"?"SIGN UP →":"LOGIN →"}</button>

<div style={{textAlign:"center", color:"#666", fontSize:"13px", marginTop:"16px"}}>
{authMode==="signup"?"Already have account?":"Don't have account?"} <span onClick={()=>{setAuthMode(authMode==="signup"?"login":"signup"); setErr("");}} style={{color:"#bbb", cursor:"pointer", textDecoration:"underline"}}>{authMode==="signup"?"Login":"Sign Up"}</span>
</div>
<div style={{textAlign:"center", color:"#444", fontSize:"10px", marginTop:"16px"}}>By continuing you agree to $IM Worth luxury terms</div>
</div>
</div>
);
}

// PROFILE VIEW (Dre Van Wyk screen)
if(view==="profile"){
return(
<div style={{minHeight:"100vh", background:"black", color:"white", maxWidth:"480px", margin:"0 auto", paddingBottom:"80px"}}>
<div style={{display:"flex", alignItems:"center", gap:"10px", padding:"15px", borderBottom:"1px solid #222"}}>
<div onClick={()=>setView("accounts")} style={{cursor:"pointer"}}>←</div>
<div style={{color:"#D4AF37", fontWeight:"bold"}}>{selectedUser.name}</div>
</div>
<div style={{padding:"20px", textAlign:"center"}}>
<img src={selectedUser.avatar} style={{width:"90px", height:"90px", borderRadius:"50%", border:"2px solid #D4AF37"}}/>
<div style={{marginTop:"10px", color:"#D4AF37", fontWeight:"bold", fontSize:"24px"}}>{selectedUser.name}</div>
<div style={{fontWeight:"bold"}}>{selectedUser.handle}</div>
</div>
<div style={{margin:"0 15px", border:"1px solid #D4AF37", borderRadius:"12px", padding:"12px", display:"flex", justifyContent:"space-between"}}>
<div style={{color:"#D4AF37", fontWeight:"bold", fontSize:"20px"}}>{selectedUser.net}</div>
<div style={{textAlign:"right"}}><div style={{color:"#888", fontSize:"10px"}}>NET WORTH</div><div style={{color:"#00A651", fontSize:"12px"}}>+12.5% (24h)</div></div>
</div>
<div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", padding:"12px"}}>
{PRODUCTS.map((p,i)=>(
<div key={i} onClick={()=>window.open(wAlink,"_blank")} style={{background:"#111", borderRadius:"12px", overflow:"hidden", border:"1px solid #333", cursor:"pointer"}}>
<img src={p.img} style={{width:"100%", height:"100px", objectFit:"cover"}}/>
<div style={{padding:"8px", display:"flex", gap:"8px"}}><span style={{fontWeight:"bold"}}>{p.price}</span><span style={{color:"#666", textDecoration:"line-through", fontSize:"11px"}}>{p.old}</span></div>
</div>
))}
</div>
<div style={{position:"fixed", bottom:"0", left:"0", right:"0", maxWidth:"480px", margin:"0 auto", background:"black", borderTop:"1px solid #D4AF37", padding:"10px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
<div onClick={()=>setView("messages")} style={{background:"black", border:"1px solid #D4AF37", borderRadius:"10px", padding:"12px", textAlign:"center", fontWeight:"bold", color:"#D4AF37", cursor:"pointer"}}>Message</div>
<div onClick={()=>window.open(wAlink,"_blank")} style={{background:"#00A651", borderRadius:"10px", padding:"12px", textAlign:"center", fontWeight:"bold", color:"white", cursor:"pointer"}}>WhatsApp Call</div>
</div>
</div>
);
}

// ACCOUNTS PAGE
return(
<div style={{minHeight:"100vh", background:"black", color:"white", maxWidth:"480px", margin:"0 auto", paddingBottom:"80px"}}>
<div style={{padding:"15px"}}><h2 style={{color:"#D4AF37", fontWeight:"bold"}}>Accounts</h2></div>
<div style={{display:"flex", gap:"8px", padding:"0 15px", overflowX:"auto"}}>
{["All Accounts","Following","Your Account","Suggested"].map(t=>(
<div key={t} onClick={()=>setTab(t)} style={{padding:"8px 12px", borderRadius:"20px", background: tab===t ? "#D4AF37" : "#222", color: tab===t ? "black" : "white", fontSize:"12px", cursor:"pointer", whiteSpace:"nowrap"}}>{t}</div>
))}
</div>
<div style={{padding:"15px"}}>
{MOCK_USERS.map((u,i)=>(
<div key={i} onClick={()=>{setSelectedUser(u); setView("profile")}} style={{display:"flex", alignItems:"center", gap:"10px", padding:"12px", background:"#111", border:"1px solid #333", borderRadius:"12px", marginBottom:"10px", cursor:"pointer"}}>
<img src={u.avatar} style={{width:"44px", height:"44px", borderRadius:"50%"}}/>
<div style={{flex:1}}><div style={{fontWeight:"bold"}}>{u.name}</div><div style={{fontSize:"11px", color:"#888"}}>{u.handle}</div></div>
<div style={{color:"#D4AF37", fontWeight:"bold"}}>{u.worth}</div>
</div>
))}
</div>
<div style={{position:"fixed", bottom:"0", left:"0", right:"0", maxWidth:"480px", margin:"0 auto", background:"black", borderTop:"1px solid #D4AF37", display:"flex", justifyContent:"space-around", padding:"10px", fontSize:"12px"}}>
<div onClick={()=>setView("accounts")} style={{textAlign:"center", cursor:"pointer"}}><div style={{fontSize:"18px", color:"#D4AF37"}}>👤</div>Accounts</div>
<div onClick={()=>window.open(wAlink,"_blank")} style={{textAlign:"center", cursor:"pointer"}}><div style={{fontSize:"18px"}}>💬</div>Messages</div>
<div onClick={()=>setLoggedIn(false)} style={{textAlign:"center", cursor:"pointer"}}><div style={{fontSize:"18px"}}>More</div></div>
</div>
</div>
);
}
