"use client";
import { useState } from "react";

// MOCK USERS - later this comes from Supabase
const ACCOUNTS = [
  { name: "Dre Van Wyk", handle: "@DreVanWyk", img: "https://i.pravatar.cc/300?img=12", verified: true, worth: "$ 248,750.32" },
  { name: "Luna Star", handle: "@LunaStar", img: "https://i.pravatar.cc/300?img=5", verified: true, worth: "$ 182,300.00" },
  { name: "King T", handle: "@KingT", img: "https://i.pravatar.cc/300?img=15", verified: true, worth: "$ 521,100.50" },
  { name: "Bella Rose", handle: "@BellaRose", img: "https://i.pravatar.cc/300?img=32", verified: true, worth: "$ 98,400.00" },
  { name: "Jaco Venter", handle: "@JacoVenter", img: "https://i.pravatar.cc/300?img=11", verified: true, worth: "$ 156,200.00" },
  { name: "Tash B", handle: "@TashB", img: "https://i.pravatar.cc/300?img=28", verified: true, worth: "$ 203,900.00" },
  { name: "Ruan Botha", handle: "@RuanBotha", img: "https://i.pravatar.cc/300?img=16", verified: true, worth: "$ 312,000.00" },
  { name: "Megan Lee", handle: "@MeganLee", img: "https://i.pravatar.cc/300?img=23", verified: true, worth: "$ 88,750.00" },
];

const PRODUCTS = [
  { price: "$ 19.99", old: "$62.99", disc: "-68%", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400" },
  { price: "$ 16.99", old: "$59.99", disc: "-72%", img: "https://images.unsplash.com/photo-1555421689-3f034debb7a6?w=400" },
  { price: "$ 24.99", old: "$72.99", disc: "-65%", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
  { price: "$ 27.99", old: "$73.99", disc: "-62%", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" },
];

export default function FullApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState("accounts"); // accounts | profile | login | messages
  const [selectedUser, setSelectedUser] = useState<any>(ACCOUNTS[0]);
  const [tab, setTab] = useState("All Accounts");
  const [authMode, setAuthMode] = useState("login");

  <button 
  type="button"
  onClick={() => {
    console.log("LOGIN CLICKED");
    setLoggedIn(true);
  }}
  style={{ 
    cursor: 'pointer', 
    pointerEvents: 'auto', 
    position: 'relative', 
    zIndex: 9999,
    width: '100%',
    padding: '16px',
    background: '#D4AF37',
    color: 'black',
    borderRadius: '999px',
    fontWeight: 'bold'
  }}
>
  TAP TO LOGIN
</button>
          
          <input placeholder="Email" style={{ width: "100%", padding: "14px", marginTop: "16px", borderRadius: "12px", border: "1px solid #333", background: "#111", color: "white", boxSizing: "border-box" }} />
          <input placeholder="Password" type="password" style={{ width: "100%", padding: "14px", marginTop: "12px", borderRadius: "12px", border: "1px solid #333", background: "#111", color: "white", boxSizing: "border-box" }} />
          {authMode === "signup" && <input placeholder="Username @handle" style={{ width: "100%", padding: "14px", marginTop: "12px", borderRadius: "12px", border: "1px solid #333", background: "#111", color: "white", boxSizing: "border-box" }} />}

          <div onClick={() => setIsLoggedIn(true)} style={{ background: "linear-gradient(#D4AF37,#AA871E)", color: "black", padding: "14px", borderRadius: "12px", textAlign: "center", fontWeight: "900", marginTop: "20px", cursor: "pointer" }}>
            {authMode === "login" ? "LOGIN →" : "CREATE ACCOUNT →"}
          </div>

          <div onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")} style={{ textAlign: "center", marginTop: "16px", color: "#888", fontSize: "13px" }}>
            {authMode === "login" ? "Don't have account? Sign Up" : "Have account? Login"}
          </div>

          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "11px", color: "#555" }}>By continuing you agree to $IM Worth luxury terms</div>
        </div>
      </div>
    );
  }

  // PROFILE / MARKETPLACE SCREEN (the one we built)
  if (view === "profile") {
    return (
      <div style={{ background: "#000", color: "white", minHeight: "100vh", fontFamily: "system-ui", paddingBottom: "90px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", borderBottom: "1px solid #222" }}>
          <div onClick={() => setView("accounts")} style={{ fontSize: "22px", cursor: "pointer" }}>←</div>
          <img src={selectedUser.img} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid #D4AF37" }} />
          <div><div style={{ fontWeight: "bold", fontSize: "14px" }}>{selectedUser.name}</div><div style={{ fontSize: "11px", color: "#D4AF37" }}>{selectedUser.handle}</div></div>
          <div style={{ marginLeft: "auto", background: "#D4AF37", color: "black", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>Following ✓</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "10px" }}>
          <div><div style={{ fontSize: "28px", fontWeight: "900" }}><span style={{ color: "#D4AF37" }}>$</span>IM<br/><span style={{ fontSize: "16px", color: "#D4AF37" }}>— Ban¢ —</span></div></div>
          <img src={selectedUser.img} style={{ width: "90px", height: "90px", borderRadius: "50%", border: "3px solid #D4AF37", boxShadow: "0 0 15px #D4AF37" }} />
          <div style={{ textAlign: "right" }}><div style={{ fontSize: "24px", fontWeight: "900" }}><span style={{ color: "#D4AF37" }}>$</span>IM<br/>MAPS</div></div>
        </div>

        <div style={{ margin: "0 10px", background: "linear-gradient(90deg,#111,#000)", border: "1px solid #D4AF37", borderRadius: "12px", padding: "10px 14px", display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: "24px", fontWeight: "900", color: "#D4AF37" }}>{selectedUser.worth}</div>
          <div style={{ textAlign: "right" }}><div style={{ fontSize: "10px", color: "#aaa" }}>NET WORTH</div><div style={{ color: "#00ff88", fontSize: "12px" }}>↑ +12.5% (24h)</div></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "10px" }}>
          {PRODUCTS.map((p,i) => (
            <div key={i} style={{ background: "#111", borderRadius: "12px", overflow: "hidden", border: "1px solid #333" }}>
              <img src={p.img} style={{ width: "100%", height: "100px", objectFit: "cover" }} />
              <div style={{ padding: "6px" }}><span style={{ fontWeight: "bold", fontSize: "13px" }}>{p.price}</span> <span style={{ fontSize: "10px", color: "#888", textDecoration: "line-through" }}>{p.old}</span></div>
            </div>
          ))}
        </div>

        <div style={{ position: "fixed", bottom: "0", left: "0", right: "0", background: "black", borderTop: "1px solid #D4AF37", padding: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div style={{ background: "black", border: "1px solid #D4AF37", borderRadius: "30px", padding: "12px", textAlign: "center", fontWeight: "bold", color: "#D4AF37" }}>💬 Message</div>
          <div style={{ background: "#00c851", borderRadius: "30px", padding: "12px", textAlign: "center", fontWeight: "bold" }}>📞 WhatsApp Call</div>
        </div>
      </div>
    );
  }

  // FOLLOWERS / ACCOUNTS PAGE (your screenshot)
  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "white", fontFamily: "system-ui", paddingBottom: "80px" }}>
      {/* Header */}
      <div style={{ background: "radial-gradient(ellipse at top, #2a2000, #000)", padding: "12px", position: "sticky", top: "0", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "24px" }}>←</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "900" }}><span style={{ color: "#D4AF37" }}>$</span>IM <span style={{ color: "white" }}>WORTH</span></div>
            <div style={{ fontSize: "8px", letterSpacing: "2px", color: "#D4AF37" }}>REAL PEOPLE • REAL ACCOUNTS • REAL VALUE</div>
          </div>
          <div style={{ display: "flex", gap: "12px", fontSize: "20px" }}>🔍 ⋮</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", background: "#111", borderRadius: "12px", border: "1px solid #D4AF37", overflow: "hidden", marginTop: "12px" }}>
          {["All Accounts","Following","Your Accounts","Suggested"].map(t => (
            <div key={t} onClick={() => setTab(t)} style={{ background: tab===t ? "linear-gradient(#D4AF37,#AA871E)" : "transparent", color: tab===t ? "black" : "#aaa", padding: "10px 4px", textAlign: "center", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>
              <div style={{ fontSize: "18px" }}>{t==="All Accounts"?"👥":t==="Following"?"👤+":t==="Your Accounts"?"👤":"⭐"}</div>{t}
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "6px", padding: "8px" }}>
        {ACCOUNTS.map((u,i) => (
          <div key={i} onClick={() => { setSelectedUser(u); setView("profile"); }} style={{ background: "linear-gradient(#1a1a1a,#000)", border: "1px solid #D4AF37", borderRadius: "12px", padding: "8px 4px", textAlign: "center", cursor: "pointer" }}>
            <div style={{ position: "relative", width: "60px", height: "60px", margin: "0 auto" }}>
              <img src={u.img} style={{ width: "60px", height: "60px", borderRadius: "50%", border: "2px solid #D4AF37", boxShadow: "0 0 10px #D4AF37" }} />
              <div style={{ position: "absolute", bottom: "-4px", right: "-4px", background: "#000", border: "1px solid #D4AF37", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>👑</div>
            </div>
            <div style={{ fontSize: "11px", fontWeight: "bold", marginTop: "6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
            <div style={{ fontSize: "9px", color: "#5DADE2" }}>{u.handle}</div>
            <div style={{ background: "black", border: "1px solid #D4AF37", borderRadius: "20px", padding: "3px", marginTop: "6px", fontSize: "9px", color: "#D4AF37", display: "flex", alignItems: "center", justifyContent: "center", gap: "3px" }}>👤 Following</div>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: "0", left: "0", right: "0", background: "black", borderTop: "1px solid #D4AF37", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "6px 0" }}>
        {[
          { icon: "🏠", label: "Home", action: () => setView("accounts") },
          { icon: "👥", label: "Accounts", active: true },
          { icon: "$", label: "Add Account", big: true },
          { icon: "💬", label: "Messages" },
          { icon: "•••", label: "More" },
        ].map((b,i) => (
          <div key={i} style={{ textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontSize: b.big ? "24px" : "20px", background: b.big ? "linear-gradient(#D4AF37,#AA871E)" : "none", width: b.big ? "40px" : "auto", height: b.big ? "40px" : "auto", borderRadius: b.big ? "50%" : "0", display: "flex", alignItems: "center", justifyContent: "center", margin: b.big ? "0 auto" : "0", color: b.big ? "black" : b.active ? "#D4AF37" : "#888", fontWeight: "900" }}>{b.icon}</div>
            <div style={{ fontSize: "10px", color: b.active ? "#D4AF37" : "#888", marginTop: "2px" }}>{b.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
