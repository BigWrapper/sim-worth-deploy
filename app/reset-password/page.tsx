"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ResetPassword() {
  const [pwd, setPwd] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const handle = async () => {
    if (pwd.length < 6) { setErr("Min 6 chars"); return; }
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) setErr(error.message); else { setDone(true); setTimeout(()=>window.location.href="/", 2000); }
  };
  return (
    <div style={{minHeight:"100vh", background:"black", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px"}}>
      <div style={{background:"#0a0a0a", padding:"24px", borderRadius:"16px", width:"100%", maxWidth:"360px", border:"1px solid #333"}}>
        <h2 style={{color:"#D4AF37", textAlign:"center", marginTop:0}}>Reset Password</h2>
        {err && <div style={{color:"#f87171", fontSize:"12px", textAlign:"center", marginBottom:"10px"}}>{err}</div>}
        {!done ? (
          <>
            <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="New Password (min 6 chars)" style={{width:"100%", background:"#141414", border:"1px solid #222", color:"white", padding:"14px", borderRadius:"12px", margin:"12px 0"}}/>
            <button onClick={handle} style={{width:"100%", background:"#D4AF37", color:"black", fontWeight:"900", padding:"12px", borderRadius:"12px", border:"none"}}>Update Password</button>
          </>
        ) : (
          <div style={{color:"#00ff88", textAlign:"center"}}>✅ Updated! Going to login...</div>
        )}
      </div>
    </div>
  );
}
