"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  avatarPreview: string;
  totalWorth: number;
  onAvatarClick: () => void;
  myUserId: string;
  myHandle: string;
};

export default function WatermarkHeader({ avatarPreview, totalWorth, onAvatarClick, myUserId, myHandle }: Props) {
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  useEffect(() => {
    if (!myUserId) return;
    const fetchCounts = async () => {
      const { count: fCount } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", myUserId);
      const { count: fgCount } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", myUserId);
      setFollowers(fCount || 0);
      setFollowing(fgCount || 0);
    };
    fetchCounts();
    const channel = supabase.channel('follows-live').on('postgres_changes', { event: '*', schema: 'public', table: 'follows' }, fetchCounts).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [myUserId]);

  return (
    <div style={{background:"black", padding:"10px"}}>
      {/* TOP ROW - Banc / Avatar / Maps */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
        <div style={{textAlign:"center"}}>
          <img src="/sim_banc.png" style={{width:"85px", height:"85px", objectFit:"contain"}} alt="banc"/>
          <div style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px"}}>Pay Me</div>
        </div>
        
        <div style={{textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center"}}>
          <div style={{background:"black", border:"1px solid gold", color:"gold", fontSize:"8px", padding:"3px 8px", borderRadius:"20px", fontWeight:"900", marginBottom:"6px"}}>SIM Worth Account</div>
          <img src={avatarPreview} onClick={onAvatarClick} style={{width:"95px", height:"95px", borderRadius:"50%", border:"3px solid gold", objectFit:"cover", cursor:"pointer"}} alt="avatar"/>
        </div>

        <div style={{textAlign:"center"}}>
          <img src="/sim_maps.png" style={{width:"85px", height:"85px", objectFit:"contain"}} alt="maps"/>
          <div style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px"}}>Visit Me</div>
        </div>
      </div>

      {/* HANDLE - Directly under profile pic circle */}
      <div style={{textAlign:"center", marginTop:"10px"}}>
        <div style={{color:"gold", fontWeight:"900", fontSize:"16px"}}>@{myHandle}</div>
      </div>

      {/* FOLLOWERS / FOLLOWING - Centered underneath handle */}
      <div style={{display:"flex", justifyContent:"center", gap:"40px", marginTop:"8px"}}>
        <div style={{textAlign:"center"}}>
          <div style={{color:"white", fontWeight:"900", fontSize:"18px"}}>{followers}</div>
          <div style={{color:"#888", fontSize:"11px"}}>Followers</div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{color:"white", fontWeight:"900", fontSize:"18px"}}>{following}</div>
          <div style={{color:"#888", fontSize:"11px"}}>Following</div>
        </div>
      </div>

      {/* NET WORTH BOX */}
      <div style={{marginTop:"12px", border:"1px solid gold", borderRadius:"14px", padding:"10px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{flex:1, textAlign:"center"}}>
          <div style={{color:"#888", fontSize:"10px"}}>NET WORTH</div>
          <div style={{color:"gold", fontWeight:"900", fontSize:"26px"}}>$ {totalWorth.toFixed(2)}</div>
        </div>
        <div style={{color:"#00ff88", fontWeight:"900", fontSize:"13px"}}>12.5% (24h)</div>
      </div>
    </div>
  );
}
