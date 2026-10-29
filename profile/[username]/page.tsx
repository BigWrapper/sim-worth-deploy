"use client"
import { useParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"

export default function UserProfilePage() {
  const params = useParams()
  const rawUsername = (params?.username as string) || "DreVanWyk"
  // Clean the .comd typo if present
  const username = rawUsername.replace(".comd",".com")
  const [avatar, setAvatar] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const avatarRef = useRef<HTMLInputElement>(null)
  const prodRef = useRef<HTMLInputElement>(null)

  // LOAD - like Temu grid: localStorage FIRST, then Supabase
  useEffect(()=>{
    // 1. Instant from localStorage (never snap to default)
    const cached = localStorage.getItem(`avatar_${username}`)
    if(cached) setAvatar(cached)
    
    // 2. Products (this already works)
    supabase.from("products").select("*").eq("user_handle", username).order("created_at", {ascending:false}).then(({data})=> data && setProducts(data))
    
    // 3. Profile from Supabase - OVERWRITE cache if DB has newer
    supabase.from("profiles").select("avatar_url, net_worth").eq("handle", username).maybeSingle().then(({data})=>{
      if(data?.avatar_url){
        localStorage.setItem(`avatar_${username}`, data.avatar_url)
        setAvatar(data.avatar_url + "?t=" + Date.now())
      }
    })
  },[username])

  const uploadAvatar = async (e:any) =>{
    const file = e.target.files[0]; if(!file) return; setUploading(true)
    try {
      // SAME AS PRODUCTS - new unique name each time
      const name = `${username}-avatar-${Date.now()}`
      const { error } = await supabase.storage.from("avatars").upload(name, file, {upsert:true, cacheControl: '0'})
      if(error) throw error
      
      const { data } = supabase.storage.from("avatars").getPublicUrl(name)
      const cleanUrl = data.publicUrl

      // SAVE LIKE PRODUCTS: UPSERT not UPDATE
      const { error: dbError } = await supabase.from("profiles").upsert({ 
        handle: username, 
        avatar_url: cleanUrl,
        net_worth: 209.92,
        updated_at: new Date().toISOString()
      }, {onConflict: 'handle'})
      
      if(dbError) throw dbError

      // SAVE LOCALLY IMMEDIATELY - no more snap back
      localStorage.setItem(`avatar_${username}`, cleanUrl)
      setAvatar(cleanUrl + "?t=" + Date.now())
      alert("Profile pic saved ✅ Now permanent")
    } catch(err:any){
      alert("Avatar error: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  const uploadProduct = async (e:any) =>{
    const file = e.target.files[0]; if(!file) return; setUploading(true)
    try {
      const name = `${username}-product-${Date.now()}-${file.name.replace(/\s/g,'_')}`
      const { error } = await supabase.storage.from("products").upload(name, file, {upsert:true})
      if(error) throw error
      const { data } = supabase.storage.from("products").getPublicUrl(name)
      const { data: inserted } = await supabase.from("products").insert({ user_handle: username, image_url: data.publicUrl, price: 19.99 }).select()
      if(inserted) setProducts([...inserted, ...products])
    } catch(err:any){ alert(err.message) } finally { setUploading(false) }
  }

  // Fallback only if nothing in cache or DB
  const displayAvatar = avatar || "https://i.pravatar.cc/300?img=12"

  return (
    <div style={{background:"#000", minHeight:"100vh", color:"white", maxWidth:"430px", margin:"0 auto", paddingBottom:"90px"}}>
      <div style={{padding:"12px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <span style={{color:"#D4AF37", fontSize:"12px"}}>{username}</span>
        <span style={{fontSize:"10px", color:"#0f0"}}>Online Synced ✓</span>
      </div>
      
      <div style={{textAlign:"center", padding:"10px"}}>
        <div onClick={()=>avatarRef.current?.click()} style={{cursor:"pointer", display:"inline-block"}}>
          <img src={displayAvatar} style={{width:"110px", height:"110px", borderRadius:"50%", border:"3px solid #D4AF37", objectFit:"cover"}}/>
          <div style={{fontSize:"10px", color:"#D4AF37", marginTop:"6px"}}>{uploading ? "Uploading..." : "Tap to change face"}</div>
        </div>
        <input ref={avatarRef} type="file" hidden accept="image/*" onChange={uploadAvatar}/>
        <div style={{marginTop:"8px", fontWeight:"700", color:"#D4AF37"}}>{username.split("@")[0]}</div>
        <div style={{margin:"8px", border:"1px solid #D4AF37", borderRadius:"12px", padding:"10px", display:"flex", justifyContent:"space-between"}}>
          <span style={{fontSize:"11px", color:"#888"}}>TOTAL NET WORTH</span>
          <span style={{color:"#D4AF37", fontWeight:"900"}}>$ 209.92</span>
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", padding:"8px"}}>
        {products.map((p:any)=>(
          <div key={p.id} style={{background:"#111", borderRadius:"12px", overflow:"hidden", border:"1px solid #222", position:"relative"}}>
            <div onClick={async()=>{ if(confirm("Delete?")){ await supabase.from("products").delete().eq("id", p.id); setProducts(products.filter(x=>x.id!==p.id)) }}} style={{position:"absolute", top:"6px", left:"6px", background:"red", width:"24px", height:"24px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", zIndex:2}}>x</div>
            <img src={p.image_url} style={{width:"100%", height:"140px", objectFit:"cover"}}/>
            <div style={{padding:"6px"}}><span style={{color:"white"}}>${p.price || "19.99"}</span></div>
          </div>
        ))}
        <div onClick={()=>prodRef.current?.click()} style={{border:"1px dashed #D4AF37", padding:"30px", textAlign:"center", borderRadius:"12px", cursor:"pointer", gridColumn: products.length===0 ? "1 / -1" : "auto"}}>
          <div style={{color:"#D4AF37"}}>+ Add</div>
        </div>
      </div>

      <div style={{textAlign:"center", marginTop:"16px"}}>
        <button onClick={()=>prodRef.current?.click()} style={{background:"#D4AF37", color:"black", padding:"12px 24px", borderRadius:"24px", fontWeight:"900", border:"none"}}>+ Add Product Image</button>
        <input ref={prodRef} type="file" hidden accept="image/*" onChange={uploadProduct}/>
      </div>
    </div>
  )
}
