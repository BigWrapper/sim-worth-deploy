"use client"
import { useParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"

export default function UserProfilePage() {
  const params = useParams()
  const username = (params?.username as string) || "DreVanWyk"
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/300?img=12")
  const [products, setProducts] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const avatarRef = useRef<HTMLInputElement>(null)
  const prodRef = useRef<HTMLInputElement>(null)

  useEffect(()=>{
    supabase.from("products").select("*").eq("user_handle", username).then(({data})=> data && setProducts(data))
    supabase.from("profiles").select("avatar_url").eq("handle", username).single().then(({data})=> data?.avatar_url && setAvatar(data.avatar_url))
  },[username])

  const uploadAvatar = async (e:any) =>{
    const file = e.target.files[0]; if(!file) return; setUploading(true)
    const name = `${username}-avatar-${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from("avatars").upload(name, file, {upsert:true})
    if(error) { alert(error.message); setUploading(false); return }
    const { data } = supabase.storage.from("avatars").getPublicUrl(name)
    await supabase.from("profiles").upsert({ handle: username, avatar_url: data.publicUrl, net_worth: 248750 })
    setAvatar(data.publicUrl); setUploading(false); alert("Profile pic + Supabase avatars bucket ✅")
  }

  const uploadProduct = async (e:any) =>{
    const file = e.target.files[0]; if(!file) return; setUploading(true)
    const name = `${username}-product-${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from("products").upload(name, file)
    if(error) { alert(error.message); setUploading(false); return }
    const { data } = supabase.storage.from("products").getPublicUrl(name)
    const { data: inserted } = await supabase.from("products").insert({ user_handle: username, image_url: data.publicUrl, price: 19.99, old_price: 62.99 }).select()
    if(inserted) setProducts([...products, ...inserted])
    setUploading(false); alert("Product + Supabase products bucket ✅")
  }

  return (
    <div style={{background:"#000", minHeight:"100vh", color:"white", maxWidth:"430px", margin:"0 auto", paddingBottom:"90px"}}>
      <div style={{display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", padding:"8px", background:"black", borderBottom:"1px solid #222"}}>
        <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
          <button onClick={()=>history.back()} style={{background:"none", border:"none", color:"white", fontSize:"20px"}}>←</button>
          <img src={avatar} style={{width:"32px", height:"32px", borderRadius:"50%"}}/>
          <div><div style={{fontSize:"13px", fontWeight:"700"}}>{username}</div><div style={{fontSize:"10px", color:"#777"}}>@{username}</div></div>
        </div>
        <div style={{textAlign:"center"}}>
          {/* FIXED CLICKABLE AVATAR */}
          <div onClick={()=>avatarRef.current?.click()} style={{cursor:"pointer"}}>
            <img src={avatar} style={{width:"90px", height:"90px", borderRadius:"50%", border:"4px solid #D4AF37", boxShadow:"0 0 20px gold", objectFit:"cover"}}/>
            <div style={{fontSize:"10px", color:"#D4AF37", marginTop:"4px"}}>{uploading ? "Uploading..." : "Tap pic to change"}</div>
          </div>
          <input ref={avatarRef} type="file" hidden accept="image/*" onChange={uploadAvatar}/>
        </div>
        <div style={{textAlign:"right"}}><div style={{color:"#D4AF37", fontWeight:"900"}}>$IM</div><div style={{fontWeight:"900"}}>MAPS</div></div>
      </div>

      <div onClick={()=>alert(`Full breakdown: Cash $12k + Investments $186k + Crypto $32k = $248,750`)} style={{margin:"8px", border:"1px solid #D4AF37", borderRadius:"12px", padding:"10px", display:"flex", justifyContent:"space-between"}}>
        <span style={{color:"#D4AF37", fontWeight:"900"}}>$ 248,750.32</span><span style={{fontSize:"10px"}}>NET WORTH<br/><span style={{color:"#0f0"}}>↑ +12.5% (24h)</span></span>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", padding:"8px"}}>
        {products.length===0 ? (
          <div onClick={()=>prodRef.current?.click()} style={{gridColumn:"1 / -1", border:"1px dashed #D4AF37", padding:"30px", textAlign:"center", borderRadius:"12px", cursor:"pointer"}}>
            <div style={{color:"#D4AF37"}}>+ Upload first product</div><div style={{fontSize:"11px", color:"#aaa"}}>Stores in Supabase products bucket</div>
          </div>
        ) : products.map((p:any)=>(
          <div key={p.id} style={{background:"#111", borderRadius:"12px", overflow:"hidden", border:"1px solid #222"}}>
            <img src={p.image_url} style={{width:"100%", height:"140px", objectFit:"cover"}}/>
            <div style={{padding:"6px"}}><span style={{color:"white"}}>${p.price}</span><span style={{color:"#777", fontSize:"11px", marginLeft:"4px"}}>${p.old_price}</span></div>
          </div>
        ))}
      </div>

      <div style={{textAlign:"center", marginTop:"16px"}}>
        <button onClick={()=>prodRef.current?.click()} style={{background:"#D4AF37", color:"black", padding:"12px 24px", borderRadius:"24px", fontWeight:"900", border:"none", cursor:"pointer"}}>+ Add Product Image</button>
        <input ref={prodRef} type="file" hidden accept="image/*" onChange={uploadProduct}/>
      </div>

      <div style={{position:"fixed", bottom:"0", left:"0", right:"0", background:"black", borderTop:"1px solid #D4AF37", display:"flex", padding:"8px", gap:"8px", maxWidth:"430px", margin:"0 auto"}}>
        <button onClick={()=>alert("DM page")} style={{flex:1, border:"1px solid #D4AF37", background:"black", color:"#D4AF37", borderRadius:"24px", padding:"12px"}}>💬 Message</button>
        <button onClick={()=>window.open("https://wa.me/27821234567","_blank")} style={{flex:1, background:"#00C851", borderRadius:"24px", padding:"12px", border:"none", fontWeight:"900"}}>📞 WhatsApp Call</button>
      </div>
    </div>
  )
}
