"use client"
import { useState } from "react"
import { supabase } from "../../lib/supabase"
import { useRouter } from "next/navigation"

export default function SignupPage(){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("@56bluntmusic")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async () => {
    if(!email || !password || !username) return alert("Fill all")
    setLoading(true)
    try{
      // THIS IS THE CODE I GAVE YOU - PASTED HERE
      const { data, error } = await supabase.auth.signUp({ email, password })
      if(error) throw error
      
      if(data.user){
        await supabase.from("profiles").upsert({
          id: data.user.id, // THIS IS THE aca15d46-... ID IN YOUR SCREENSHOT
          handle: username, // @56bluntmusic
          display_name: username,
          avatar_url: "",
          net_worth: 79.96
        }, {onConflict: 'id'})
        
        localStorage.setItem("current_handle", username)
        localStorage.setItem("sb_user_id", data.user.id)
        alert("Account created ✅")
        router.push(`/profile/${username}`)
      }
    }catch(err:any){ alert(err.message) } finally{ setLoading(false) }
  }

  const handleLogin = async () => {
    setLoading(true)
    try{
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if(error) throw error
      if(data.user){
        localStorage.setItem("sb_user_id", data.user.id)
        // Get handle from profiles table
        const { data: prof } = await supabase.from("profiles").select("handle").eq("id", data.user.id).single()
        const h = prof?.handle || username
        localStorage.setItem("current_handle", h)
        router.push(/profile/${username})
      }
    }catch(err:any){ alert(err.message) } finally{ setLoading(false) }
  }

  return (
    <div style={{background:"black", minHeight:"100vh", color:"white", padding:"40px", maxWidth:"430px", margin:"0 auto"}}>
      <h1 style={{color:"#D4AF37", fontWeight:"900", fontSize:"24px"}}>SIM WORTH Login</h1>
      
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="@yourhandle" style={{width:"100%", marginTop:"20px", padding:"12px", borderRadius:"10px", background:"#111", border:"1px solid #333", color:"white"}}/>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@gmail.com" style={{width:"100%", marginTop:"12px", padding:"12px", borderRadius:"10px", background:"#111", border:"1px solid #333", color:"white"}}/>
      <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="password" style={{width:"100%", marginTop:"12px", padding:"12px", borderRadius:"10px", background:"#111", border:"1px solid #333", color:"white"}}/>

      <button onClick={handleSignup} disabled={loading} style={{width:"100%", marginTop:"20px", background:"#D4AF37", color:"black", padding:"14px", borderRadius:"12px", fontWeight:"900"}}>{loading ? "Loading..." : "SIGN UP"}</button>
      <button onClick={handleLogin} disabled={loading} style={{width:"100%", marginTop:"12px", background:"#111", color:"#D4AF37", padding:"14px", borderRadius:"12px", fontWeight:"900", border:"1px solid #D4AF37"}}>LOGIN (if you already signed up)</button>
    </div>
  )
}
