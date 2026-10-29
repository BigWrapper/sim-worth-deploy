"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "./supabase"

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: {children: React.ReactNode}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    // 1. Check if we already logged in
    supabase.auth.getSession().then(({data})=>{
      setUser(data.session?.user || null)
      setLoading(false)
      if(data.session?.user){
        localStorage.setItem("sb_user_id", data.session.user.id)
      }
    })

    // 2. Listen for login/logout
    const {data: listener} = supabase.auth.onAuthStateChange((_event, session)=>{
      setUser(session?.user || null)
      if(session?.user) localStorage.setItem("sb_user_id", session.user.id)
      else localStorage.removeItem("sb_user_id")
    })
    return ()=> listener.subscription.unsubscribe()
  },[])

  return <AuthContext.Provider value={{user, loading}}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
