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
    if (!myUserId || myUserId === "") {
      // No user yet, show 0, don't crash
      return;
    }
    <div style={{background:"black", padding:"10px"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
        <div style={{textAlign:"center"}}>
          <img src="/sim_banc.png" style={{width:"85px", height:"85px", objectFit:"contain", filter:"drop-shadow(0 0 12px gold)"}}/>
          <div style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px"}}>🪙 Pay Me ›</div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{background:"black", border:"1px solid gold", color:"gold", fontSize:"8px", padding:"3px 8px", borderRadius:"20px", fontWeight:"900"}}>👑 SIM Worth Account</div>
          <img src={avatarPreview} onClick={onAvatarClick} style={{width:"85px", height:"85px", borderRadius:"50%", border:"3px solid gold", marginTop:"6px", objectFit:"cover", boxShadow:"0 0 15px gold", cursor:"pointer"}}/>
        </div>
        <div style={{textAlign:"center"}}>
          <img src="/sim_maps.png" style={{width:"85px", height:"85px", objectFit:"contain", filter:"drop-shadow(0 0 12px gold)"}}/>
          <div style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px"}}>📍 Visit Me ›</div>
        </div>
      </div>

      {/* FOLLOWERS / FOLLOWING - LIVE FROM SUPABASE */}
      <div style={{display:"flex", justifyContent:"center", gap:"40px", marginTop:"12px", marginBottom:"10px"}}>
        <div style={{textAlign:"center", cursor:"pointer"}}>
          <div style={{color:"white", fontWeight:"900", fontSize:"18px"}}>{followers}</div>
          <div style={{color:"#888", fontSize:"11px"}}>Followers</div>
        </div>
        <div style={{textAlign:"center", cursor:"pointer"}}>
          <div style={{color:"white", fontWeight:"900", fontSize:"18px"}}>{following}</div>
          <div style={{color:"#888", fontSize:"11px"}}>Following</div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{color:"gold", fontWeight:"900", fontSize:"18px"}}>{myHandle}</div>
          <div style={{color:"#888", fontSize:"11px"}}>Handle</div>
        </div>
      </div>

      <div style={{marginTop:"8px", border:"1px solid gold", borderRadius:"14px", padding:"10px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{flex:1, textAlign:"center"}}>
          <div style={{color:"#888", fontSize:"10px"}}>👑 NET WORTH</div>
          <div style={{color:"gold", fontWeight:"900", fontSize:"26px"}}>$ {totalWorth.toFixed(2)}</div>
        </div>
        <div style={{color:"#00ff88", fontWeight:"900", fontSize:"13px"}}>↑ 12.5% (24h)</div>
      </div>
    </div>
  );
}
