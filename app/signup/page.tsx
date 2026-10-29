"use client"
import { useState } from "react"
import { supabase } from "../../lib/supabase"
import { useRouter } from "next/navigation"

export default function Signup(){
  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [loading,setLoading]=useState(false)
  const router=useRouter()

  const handleSignup=async()=>{
    if(!username || !email || !password) return alert("Fill all")
    setLoading(true)
    try{
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options:{ data:{ handle: username }}
      })
      if(error) throw error
      if(data.user){
        await supabase.from("profiles").insert({
          id: data.user.id,
          handle: username,
          worth: 1000
        })
        localStorage.setItem("current_handle", username)
        localStorage.setItem("sb_user_id", data.user.id)
        alert("Account created ✅")
        router.push(`/profile/${username}`)
      }
    }catch(err:any){ alert(err.message) }finally{ setLoading(false) }
  }

  const handleLogin=async()=>{
    setLoading(true)
    try{
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if(error) throw error
      if(data.user){
        const { data: prof } = await supabase.from("profiles").select("handle").eq("id", data.user.id).single()
        const h = prof?.handle || username
        localStorage.setItem("current_handle", h)
        router.push(`/profile/${h}`)
      }
    }catch(err:any){ alert(err.message) }finally{ setLoading(false) }
  }

  return(
    <div style={{padding:20}}>
      <h1>Sign up</h1>
      <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={handleSignup} disabled={loading}>{loading?"...":"Create Account"}</button>
      <button onClick={handleLogin} disabled={loading}>Login</button>
    </div>
  )
}
