"use client";
import { useState } from "react";

const products = [
  { price: "$ 19.99", old: "$62.99", disc: "-68%", rating: "(4.8)", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400" },
  { price: "$ 16.99", old: "$59.99", disc: "-72%", rating: "(4.7)", img: "https://images.unsplash.com/photo-1555421689-3f034debb7a6?w=400" },
  { price: "$ 24.99", old: "$72.99", disc: "-65%", rating: "(4.6)", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
  { price: "$ 27.99", old: "$73.99", disc: "-62%", rating: "(4.5)", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" },
  { price: "$ 539.99", old: "$1,799.99", disc: "-70%", rating: "(4.8)", img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400" },
  { price: "$ 39.99", old: "$118.99", disc: "-66%", rating: "(4.6)", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400" },
  { price: "$ 14.99", old: "$35.99", disc: "-58%", rating: "(4.7)", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400" },
  { price: "$ 399.99", old: "$799.99", disc: "-50%", rating: "(4.8)", img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400" },
  { price: "$ 32.99", old: "$71.99", disc: "-54%", rating: "(4.5)", img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400" },
  { price: "$ 12.99", old: "$34.99", disc: "-63%", rating: "(4.6)", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400" },
  { price: "$ 22.99", old: "$57.99", disc: "-60%", rating: "(4.7)", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400" },
  { price: "$ 18.99", old: "$44.99", disc: "-57%", rating: "(4.5)", img: "https://images.unsplash.com/photo-1590602847861-f357a9b6aeb3?w=400" },
];

export default function Home() {
  const [active, setActive] = useState("ALL");
  const cats = ["ALL", "Electronics", "Fashion", "Home & Living", "Beauty", "Sports", "More"];

  return (
    <div style={{ background: "#000", color: "white", minHeight: "100vh", fontFamily: "system-ui", paddingBottom: "90px" }}>
      {/* TOP */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "10px", background: "linear-gradient(to bottom, #1a1a1a, #000)", position: "relative" }}>
        <div>
          <div style={{ fontSize: "36px", fontWeight: "900", lineHeight: "0.9" }}><span style={{ color: "#D4AF37", textShadow: "0 0 10px #D4AF37" }}>$</span>IM<br/><span style={{ fontSize: "18px", color: "#D4AF37" }}>— Ban¢ —</span></div>
          <div style={{ marginTop: "8px", background: "linear-gradient(#222,#000)", border: "1px solid #D4AF37", borderRadius: "20px", padding: "6px 12px", fontSize: "13px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px", color: "#D4AF37", boxShadow: "0 0 10px rgba(212,175,55,0.4)" }}>🪙 Pay Me &gt;</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ background: "#D4AF37", color: "black", fontSize: "10px", fontWeight: "900", padding: "2px 10px", borderRadius: "10px 10px 0 0", letterSpacing: "0.5px" }}>👑 SIM Worth Account</div>
          <img src="https://i.pravatar.cc/300?img=15" style={{ width: "110px", height: "110px", borderRadius: "50%", border: "4px solid #D4AF37", boxShadow: "0 0 20px #D4AF37", objectFit: "cover" }} />
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "30px", fontWeight: "900" }}><span style={{ color: "#D4AF37" }}>$</span>IM<br/><span style={{ fontSize: "14px" }}>MAPS</span></div>
          <div style={{ marginTop: "8px", background: "linear-gradient(#222,#000)", border: "1px solid #D4AF37", borderRadius: "20px", padding: "6px 12px", fontSize: "13px", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "6px", color: "#D4AF37", boxShadow: "0 0 10px rgba(212,175,55,0.4)" }}>📍 Visit Me &gt;</div>
        </div>
      </div>

      {/* NET WORTH */}
      <div style={{ margin: "-10px 10px 10px", background: "linear-gradient(90deg, #111, #000, #111)", border: "1px solid #D4AF37", borderRadius: "12px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 0 15px rgba(212,175,55,0.3)" }}>
        <div style={{ fontSize: "28px", fontWeight: "900", color: "#D4AF37", textShadow: "0 0 10px #D4AF37" }}>$ 248,750.32</div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "10px", color: "#aaa" }}>👑 NET WORTH</div>
          <div style={{ color: "#00ff88", fontSize: "14px", fontWeight: "bold" }}>↑ +12.5%<br/><span style={{ color: "white", fontSize: "11px", fontWeight: "normal" }}>(24h)</span></div>
        </div>
      </div>

      {/* 4 CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "6px", padding: "0 10px" }}>
        {[
          { label: "Cash Balance", value: "$ 12,450.00", icon: "🪙" },
          { label: "Investments", value: "$ 186,320.45", icon: "📈" },
          { label: "Crypto", value: "$ 32,580.21", icon: "₿" },
          { label: "Total Assets", value: "$ 248,750.32", icon: "💳" },
        ].map((c) => (
          <div key={c.label} style={{ background: "linear-gradient(#1a1a1a,#000)", border: "1px solid #D4AF37", borderRadius: "10px", padding: "8px 4px", textAlign: "center" }}>
            <div style={{ fontSize: "16px" }}>{c.icon}</div>
            <div style={{ fontSize: "8px", color: "#aaa", marginTop: "2px" }}>{c.label}</div>
            <div style={{ fontSize: "10px", fontWeight: "bold", marginTop: "2px" }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* CATEGORIES */}
      <div style={{ display: "flex", gap: "10px", overflowX: "auto", padding: "12px 10px", whiteSpace: "nowrap", scrollbarWidth: "none" }}>
        {cats.map(cat => (
          <div key={cat} onClick={() => setActive(cat)} style={{ background: active === cat ? "#D4AF37" : "transparent", color: active === cat ? "black" : "#ccc", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: active === cat ? "900" : "400", border: active === cat ? "1px solid #D4AF37" : "none", cursor: "pointer" }}>{cat}{cat==="More"?" ▼":""}</div>
        ))}
      </div>

      {/* GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "0 10px" }}>
        {products.map((p, i) => (
          <div key={i} style={{ background: "#111", border: "1px solid #333", borderRadius: "12px", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", top: "6px", left: "6px", background: "#ff5000", color: "white", fontSize: "9px", padding: "2px 6px", borderRadius: "6px", fontWeight: "bold", zIndex: 2 }}>TEMU</div>
            <img src={p.img} style={{ width: "100%", height: "110px", objectFit: "cover" }} />
            <div style={{ position: "absolute", top: "86px", left: "6px", background: "#ff0000", color: "white", fontSize: "10px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold" }}>{p.disc}</div>
            <div style={{ padding: "6px" }}>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: "bold" }}>{p.price}</span>
                <span style={{ fontSize: "10px", color: "#888", textDecoration: "line-through" }}>{p.old}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                <span style={{ fontSize: "10px", color: "#D4AF37" }}>★★★★★ <span style={{ color: "#888" }}>{p.rating}</span></span>
                <span style={{ fontSize: "14px" }}>🛒</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM */}
      <div style={{ position: "fixed", bottom: "0", left: "0", right: "0", background: "linear-gradient(to top, #000 80%, transparent)", padding: "10px", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "10px", alignItems: "center" }}>
        <div style={{ background: "black", border: "1.5px solid #D4AF37", borderRadius: "30px", padding: "10px 16px", display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
          <span style={{ background: "white", color: "black", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>💬</span>
          <span style={{ fontSize: "13px", fontWeight: "bold" }}>Message</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "18px" }}>^</div>
          <div style={{ fontSize: "10px", color: "#D4AF37", fontWeight: "bold" }}>More Assets</div>
        </div>
        <div style={{ background: "#00c851", borderRadius: "30px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
          <span style={{ background: "white", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center" }}>📞</span>
          <span style={{ fontSize: "12px", fontWeight: "bold", color: "white" }}>WhatsApp Call</span>
        </div>
      </div>
    </div>
  );
}
