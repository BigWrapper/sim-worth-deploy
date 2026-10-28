"use client"
import { useState } from 'react';

const MOCK_USERS = [
  {name:"Dre Van Wyk", handle:"DreVanWyk", avatar:"https://i.pravatar.cc/200?img=12", net:"$ 248,750.32", verified:true, worth:"$ 362,450.00"},
  {name:"Tina Roar", handle:"TinaRoar", avatar:"https://i.pravatar.cc/200?img=5", net:"$ 12,400.00", verified:true, worth:"$ 45,000.00"},
];

const PRODUCTS = [
  {price:"$ 19.99", old:"$62.99", img:"https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400"},
  {price:"$ 16.99", old:"$59.99", img:"https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400"},
  {price:"$ 24.99", old:"$72.99", img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"},
  {price:"$ 27.99", old:"$73.99", img:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400"},
];

export default function FullApp(){
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState("accounts");
  const [selectedUser, setSelectedUser] = useState(MOCK_USERS[0]);
  const [tab, setTab] = useState("All Accounts");
  const [authMode, setAuthMode] = useState("login");

  const waLink = "https://wa.me/27821234567?text=Hi";

  if(!loggedIn){
    return (
      <div style={{minHeight:"100vh", background:"black", color:"white", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px"}}>
        <h1 style={{color:"#D4AF37", fontSize:"56px", fontWeight:"bold", margin:0}}>$IM</h1>
        <p style={{color:"#D4AF37", marginBottom:"30px"}}>— Ban¢ —</p>
        <button
          type="button"
          onClick={()=>setLoggedIn(true)}
          style={{cursor:"pointer", background:"#D4AF37", color:"black", padding:"16px 64px", borderRadius:"999px", fontWeight:"bold", border:"none", fontSize:"16px"}}
        >
          TAP TO LOGIN
        </button>
      </div>
    )
  }

  // PROFILE VIEW (Dre Van Wyk screen)
  if(view === "profile"){
    return (
      <div style={{minHeight:"100vh", background:"black", color:"white", maxWidth:"480px", margin:"0 auto", paddingBottom:"80px"}}>
        <div style={{display:"flex", alignItems:"center", gap:"10px", padding:"15px", borderBottom:"1px solid #222"}}>
          <span onClick={()=>setView("accounts")} style={{cursor:"pointer"}}>←</span>
          <img src={selectedUser.avatar} style={{width:"36px", height:"36px", borderRadius:"50%", border:"1px solid #D4AF37"}} />
          <div style={{flex:1}}><div style={{fontWeight:"bold", fontSize:"14px"}}>{selectedUser.name}</div><div style={{color:"#D4AF37", fontSize:"11px"}}>@{selectedUser.handle}</div></div>
          <div style={{background:"#D4AF37", color:"black", padding:"6px 12px", borderRadius:"20px", fontSize:"11px", fontWeight:"bold"}}>Following ✓</div>
        </div>

        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px"}}>
          <div><div style={{color:"#D4AF37", fontWeight:"bold", fontSize:"24px"}}>$IM</div><div style={{color:"#D4AF37", fontSize:"12px"}}>— Ban¢ —</div></div>
          <img src={selectedUser.avatar} style={{width:"95px", height:"95px", borderRadius:"50%", border:"2px solid #D4AF37"}} />
          <div style={{textAlign:"right"}}><div style={{color:"#D4AF37", fontWeight:"bold", fontSize:"24px"}}>$IM</div><div style={{fontWeight:"bold"}}>MAPS</div></div>
        </div>

        <div style={{margin:"0 15px", border:"1px solid #D4AF37", borderRadius:"12px", padding:"12px", display:"flex", justifyContent:"space-between"}}>
          <div style={{color:"#D4AF37", fontWeight:"bold", fontSize:"20px"}}>{selectedUser.net}</div>
          <div style={{textAlign:"right"}}><div style={{color:"#888", fontSize:"10px"}}>NET WORTH</div><div style={{color:"#00c851", fontSize:"12px"}}>↑ +12.5% (24h)</div></div>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", padding:"12px"}}>
          {PRODUCTS.map((p,i)=>(
            <div key={i} onClick={()=>window.open(waLink,"_blank")} style={{background:"#111", borderRadius:"12px", overflow:"hidden", border:"1px solid #333", cursor:"pointer"}}>
              <img src={p.img} style={{width:"100%", height:"100px", objectFit:"cover"}} />
              <div style={{padding:"6px", display:"flex", gap:"6px"}}><span style={{fontWeight:"bold"}}>{p.price}</span><span style={{color:"#666", textDecoration:"line-through", fontSize:"11px"}}>{p.old}</span></div>
            </div>
          ))}
        </div>

        <div style={{position:"fixed", bottom:"0", left:"0", right:"0", maxWidth:"480px", margin:"0 auto", background:"black", borderTop:"1px solid #D4AF37", padding:"10px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", zIndex:9999}}>
          <div onClick={()=>setView("messages")} style={{background:"black", border:"1px solid #D4AF37", borderRadius:"30px", padding:"12px", textAlign:"center", fontWeight:"bold", color:"#D4AF37", cursor:"pointer"}}>💬 Message</div>
          <div onClick={()=>window.open(waLink,"_blank")} style={{background:"#00c851", borderRadius:"30px", padding:"12px", textAlign:"center", fontWeight:"bold", color:"white", cursor:"pointer"}}>📞 WhatsApp Call</div>
        </div>
      </div>
    )
  }

  // ACCOUNTS PAGE
  return (
    <div style={{minHeight:"100vh", background:"black", color:"white", maxWidth:"480px", margin:"0 auto", paddingBottom:"80px"}}>
      <div style={{padding:"15px"}}><h2 style={{color:"#D4AF37", fontWeight:"bold"}}>Accounts</h2></div>
      <div style={{padding:"0 15px", display:"flex", gap:"8px", overflow:"auto"}}>
        {["All Accounts","Following","Your Account","Suggested"].map(t=>(
          <div key={t} onClick={()=>setTab(t)} style={{padding:"6px 12px", borderRadius:"20px", background: tab===t ? "#D4AF37" : "#222", color: tab===t ? "black" : "white", fontSize:"12px", cursor:"pointer", whiteSpace:"nowrap"}}>{t}</div>
        ))}
      </div>
      <div style={{padding:"15px"}}>
        {MOCK_USERS.map((u,i)=>(
          <div key={i} onClick={()=>{setSelectedUser(u); setView("profile")}} style={{display:"flex", alignItems:"center", gap:"10px", padding:"12px", background:"#111", border:"1px solid #333", borderRadius:"12px", marginBottom:"10px", cursor:"pointer"}}>
            <img src={u.avatar} style={{width:"44px", height:"44px", borderRadius:"50%"}} />
            <div style={{flex:1}}><div style={{fontWeight:"bold"}}>{u.name}</div><div style={{fontSize:"11px", color:"#888"}}>@{u.handle}</div></div>
            <div style={{color:"#D4AF37", fontWeight:"bold"}}>{u.worth}</div>
          </div>
        ))}
      </div>

      <div style={{position:"fixed", bottom:"0", left:"0", right:"0", maxWidth:"480px", margin:"0 auto", background:"black", borderTop:"1px solid #D4AF37", display:"flex", justifyContent:"space-around", padding:"10px", zIndex:9999}}>
        <div onClick={()=>setView("accounts")} style={{textAlign:"center", cursor:"pointer"}}>💼<div style={{fontSize:"10px", color:"#D4AF37"}}>Accounts</div></div>
        <div onClick={()=>window.open(waLink,"_blank")} style={{textAlign:"center", cursor:"pointer"}}>💬<div style={{fontSize:"10px"}}>Messages</div></div>
        <div onClick={()=>setLoggedIn(false)} style={{textAlign:"center", cursor:"pointer"}}>⋯<div style={{fontSize:"10px"}}>More</div></div>
      </div>
    </div>
  )
}
