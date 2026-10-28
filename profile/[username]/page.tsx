"use client";
import { useParams } from "next/navigation";

export default function UserProfilePage() {
  const params = useParams();
  // In real app, fetch user by params.username from Supabase
  
  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "white", fontFamily: "system-ui" }}>
      {/* TOP - SIM Banc | Photo | SIM Maps */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "8px", background: "radial-gradient(#2a2000, #000)" }}>
        <div>
          <div style={{ fontSize: "36px", fontWeight: "900", color: "#D4AF37", lineHeight: "0.9" }}>$IM<br/><span style={{ fontSize: "20px" }}>— Banc —</span></div>
          <div style={{ background: "linear-gradient(#D4AF37,#AA871E)", color: "black", padding: "6px 14px", borderRadius: "20px", marginTop: "8px", fontWeight: "900", fontSize: "14px" }}>Pay Me →</div>
        </div>
        
        <div style={{ textAlign: "center" }}>
          <div style={{ background: "linear-gradient(#D4AF37,#AA871E)", color: "black", padding: "2px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "900" }}>SIM Worth Account</div>
          <img src="https://i.pravatar.cc/300?img=12" style={{ width: "110px", height: "110px", borderRadius: "50%", border: "4px solid #D4AF37", marginTop: "4px", boxShadow: "0 0 25px #D4AF37" }} />
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "28px", fontWeight: "900", color: "#D4AF37", lineHeight: "0.9" }}>$IM<br/><span style={{ fontSize: "16px" }}>MAPS</span></div>
          <div style={{ border: "1px solid #D4AF37", padding: "6px 14px", borderRadius: "20px", marginTop: "8px", fontSize: "14px", color: "#D4AF37" }}>📍 Visit Me →</div>
        </div>
      </div>

      {/* NET WORTH BAR - This is from your screenshot */}
      <div style={{ margin: "8px", border: "1.5px solid #D4AF37", borderRadius: "14px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(90deg,#111,#000)" }}>
        <div style={{ fontSize: "34px", fontWeight: "900", color: "#D4AF37" }}>$ 248,750.32</div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "10px", color: "#aaa" }}>NET WORTH</div>
          <div style={{ color: "#00ff88", fontWeight: "900" }}>↑ +12.5% (24h)</div>
        </div>
      </div>

      {/* CASH | INVESTMENTS | CRYPTO | TOTAL */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "6px", padding: "0 8px" }}>
        {[
          { label: "Cash Balance", val: "$ 12,450.00" },
          { label: "Investments", val: "$ 186,320.45" },
          { label: "Crypto", val: "$ 32,580.21" },
          { label: "Total Assets", val: "$ 248,750.32" },
        ].map((c,i) => (
          <div key={i} style={{ background: "#111", border: "1px solid #D4AF37", borderRadius: "10px", padding: "8px 4px", textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: "#aaa" }}>{c.label}</div>
            <div style={{ fontSize: "11px", fontWeight: "900" }}>{c.val}</div>
          </div>
        ))}
      </div>

      {/* TEMU GRID - From screenshot */}
      <div style={{ padding: "10px" }}>
        <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px" }}>
          {["ALL","Electronics","Fashion","Home & Living","Beauty","Sports"].map(cat => (
            <div key={cat} style={{ background: cat==="ALL" ? "#D4AF37" : "transparent", color: cat==="ALL" ? "black" : "white", padding: "6px 16px", borderRadius: "20px", fontWeight: "900", fontSize: "12px", whiteSpace: "nowrap" }}>{cat}</div>
          ))}
        </div>
        <p style={{ fontSize: "12px", color: "#aaa" }}>Showing products for {String(params.username || "Dre Van Wyk")} • This is the PROFILE store</p>
      </div>

      {/* BOTTOM BUTTONS */}
      <div style={{ position: "fixed", bottom: "0", left: "0", right: "0", background: "black", borderTop: "1px solid #D4AF37", padding: "10px", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "10px" }}>
        <div style={{ border: "1px solid #D4AF37", borderRadius: "30px", padding: "12px", textAlign: "center" }}>💬 Message</div>
        <div style={{ textAlign: "center", color: "#D4AF37", fontSize: "12px" }}>⌃<br/>More Assets</div>
        <div style={{ background: "#00c851", borderRadius: "30px", padding: "12px", textAlign: "center", fontWeight: "900" }}>WhatsApp Call</div>
      </div>
    </div>
  );
}
