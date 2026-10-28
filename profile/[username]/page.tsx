"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function UserProfilePage() {
  const params = useParams();
  const username = (params.username as string) || "DreVanWyk";
  
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/300?img=12");
  const [products, setProducts] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(()=>{
    // Load from Supabase
    supabase.from('products').select('*').eq('user_handle', username).then(({data})=>data && setProducts(data));
    supabase.from('profiles').select('avatar_url').eq('handle', username).single().then(({data})=>data?.avatar_url && setAvatar(data.avatar_url));
  },[username]);

  const uploadAvatar = async (e:any) => {
    const file = e.target.files[0];
    if(!file) return;
    setUploading(true);
    const name = `${username}-avatar-${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('avatars').upload(name, file);
    if(error){ alert(error.message); setUploading(false); return; }
    const url = supabase.storage.from('avatars').getPublicUrl(data.path).data.publicUrl;
    await supabase.from('profiles').upsert({ handle: username, avatar_url: url, net_worth: 248750 });
    setAvatar(url);
    setUploading(false);
    alert("Profile pic → Supabase avatars bucket ✅");
  };

  const uploadProduct = async (e:any) => {
    const file = e.target.files[0];
    if(!file) return;
    setUploading(true);
    const name = `${username}-product-${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('products').upload(name, file);
    if(error){ alert(error.message); setUploading(false); return; }
    const url = supabase.storage.from('products').getPublicUrl(data.path).data.publicUrl;
    const { data: inserted } = await supabase.from('products').insert({ user_handle: username, image_url: url, price: 19.99, old_price: 62.99 }).select().single();
    if(inserted) setProducts([inserted, ...products]);
    setUploading(false);
    alert("Product → Supabase products bucket ✅");
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "white", maxWidth:"430px", margin:"0 auto", paddingBottom:"80px" }}>
      {/* TOP BAR */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "8px", background: "radial-gradient(circle at center, #222 0%, #000 100%)" }}>
        <div style={{ textAlign: "left" }}>
          <button onClick={()=>alert(`$IM Banc: ${username} net worth $248,750\nPay Me button here`)} style={{ background: "linear-gradient(#D4AF37,#AA871E)", color: "black", padding: "6px 14px", borderRadius: "20px", fontWeight:"900", border:"none" }}>$IM<br/>— Banc —</button>
        </div>
        <div style={{ textAlign: "center" }}>
          <label style={{cursor:"pointer", display:"block"}}>
            <img src={avatar} style={{ width: "110px", height: "110px", borderRadius: "50%", border: "4px solid #D4AF37", boxShadow:"0 0 15px #D4AF37" }} />
            <input type="file" hidden accept="image/*" onChange={uploadAvatar} />
            <div style={{fontSize:"10px", color:"#D4AF37", marginTop:"4px"}}>{uploading ? "Uploading..." : "Tap pic to change"}</div>
          </label>
          <div style={{fontWeight:"900", marginTop:"6px"}}>@{String(username)}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <button onClick={()=>window.open(`https://maps.google.com/?q=${username}`,"_blank")} style={{ border: "1px solid #D4AF37", padding: "6px 14px", borderRadius: "20px", background:"none", color:"#D4AF37", fontWeight:"900" }}>$IM<br/>MAPS</button>
        </div>
      </div>

      {/* NET WORTH - clickable */}
      <div onClick={()=>alert("Full breakdown: Cash $12k + Investments $186k + Crypto $32k = $248,750")} style={{ margin: "8px", border: "1.5px solid #D4AF37", borderRadius: "14px", padding: "10px 14px", display: "flex", justifyContent: "space-between", cursor:"pointer" }}>
        <div style={{ fontSize: "24px", fontWeight: "900", color: "#D4AF37" }}>$ 248,750.32</div>
        <div style={{ textAlign: "right" }}><div style={{ fontSize: "10px", color: "#aaa" }}>NET WORTH</div><div style={{ color: "#00ff88", fontWeight: "900" }}>↑ +12.5% (24h)</div></div>
      </div>

      {/* TEMU GRID */}
      <div style={{ padding: "10px" }}>
        <div style={{ display: "flex", gap: "8px", overflowX:"auto", paddingBottom:"8px" }}>
          {["ALL","Electronics","Fashion","Home","Beauty"].map(cat=>(
            <button key={cat} style={{ background: cat==="ALL" ? "#D4AF37" : "#111", color: cat==="ALL" ? "black" : "white", padding:"4px 12px", borderRadius:"20px", border:"1px solid #333", fontWeight:"700" }}>{cat}</button>
          ))}
        </div>
        
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginTop:"8px"}}>
          {products.length===0 ? 
            <div onClick={()=>document.getElementById('prodUpload')?.click()} style={{gridColumn:"1 / -1", border:"1.5px dashed #D4AF37", borderRadius:"14px", padding:"30px", textAlign:"center", cursor:"pointer"}}>
              <div style={{fontSize:"30px"}}>📸</div>
              <div style={{color:"#D4AF37", fontWeight:"900"}}>+ Upload first product</div>
              <div style={{fontSize:"11px", color:"#aaa"}}>Stores in Supabase products bucket</div>
            </div>
            :
            products.map((p:any)=>(
              <div key={p.id} style={{background:"#111", borderRadius:"14px", overflow:"hidden", border:"1px solid #222"}}>
                <img src={p.image_url} style={{width:"100%", height:"160px", objectFit:"cover"}} />
                <div style={{padding:"6px", display:"flex", gap:"6px"}}><b>$19.99</b><s style={{color:"#777"}}>$62.99</s></div>
              </div>
            ))
          }
        </div>

        <div style={{textAlign:"center", marginTop:"14px"}}>
          <label style={{background:"#D4AF37", color:"black", padding:"12px 24px", borderRadius:"24px", fontWeight:"900", cursor:"pointer"}}>
            + Add Product Image
            <input id="prodUpload" type="file" hidden accept="image/*" onChange={uploadProduct} />
          </label>
        </div>
      </div>

      {/* BOTTOM */}
      <div style={{ position: "fixed", bottom: "0", left: "0", right: "0", background: "black", borderTop: "1px solid #D4AF37", padding: "8px", display: "flex", gap:"8px", maxWidth:"430px", margin:"0 auto" }}>
        <button onClick={()=>alert("Message DM page /messages/"+username)} style={{flex:1, border: "1px solid #D4AF37", borderRadius: "30px", padding: "12px", background:"black", color:"#D4AF37", fontWeight:"900"}}>💬 Message</button>
        <button onClick={()=>window.open("https://wa.me/27821234567","_blank")} style={{flex:1, background: "#00c851", borderRadius: "30px", padding: "12px", border:"none", fontWeight: "900", color:"white"}}>WhatsApp Call</button>
      </div>
    </div>
  );
}
