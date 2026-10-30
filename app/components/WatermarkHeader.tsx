"use client";
import React, { useEffect, useState } from "react";

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

  // Don't try supabase if no userId - prevents crash
  useEffect(() => {
    if (!myUserId) return;
    // Will add live counts later once page.tsx has user.id
  }, [myUserId]);

  const handlePayMe = () => {
    // For now, placeholder - will link to SIM Banc
    alert("Pay Me: Setup coming! You will add Capitec PayShap ID here and it will open SIM Banc / Capitec app!");
  };

  const handleVisitMe = () => {
    // For now, placeholder - will link to SIM Maps
    const geoUri = `geo:0,0?q=${encodeURIComponent(myHandle || "Midrand, South Africa")}`;
    try {
      window.location.href = geoUri;
    } catch (e) {
      window.open(`https://www.google.com/maps/search/?api=1&query=Midrand`, '_blank');
    }
  };

  return (
    <div style={{background:"black", padding:"10px"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
        <div style={{textAlign:"center"}}>
          <img src="/sim_banc.png" onClick={handlePayMe} style={{width:"85px", height:"85px", objectFit:"contain", cursor:"pointer"}} alt="banc"/>
          <div onClick={handlePayMe} style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px", cursor:"pointer"}}>Pay Me</div>
        </div>
        
        <div style={{textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center"}}>
          <div style={{background:"black", border:"1px solid gold", color:"gold", fontSize:"8px", padding:"3px 8px", borderRadius:"20px", fontWeight:"900", marginBottom:"6px"}}>SIM Worth Account</div>
          <img src={avatarPreview} onClick={onAvatarClick} style={{width:"95px", height:"95px", borderRadius:"50%", border:"3px solid gold", objectFit:"cover", cursor:"pointer"}} alt="avatar"/>
        </div>

        <div style={{textAlign:"center"}}>
          <img src="/sim_maps.png" onClick={handleVisitMe} style={{width:"85px", height:"85px", objectFit:"contain", cursor:"pointer"}} alt="maps"/>
          <div onClick={handleVisitMe} style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px", cursor:"pointer"}}>Visit Me</div>
        </div>
      </div>

      <div style={{textAlign:"center", marginTop:"10px"}}>
        <div style={{color:"gold", fontWeight:"900", fontSize:"16px"}}>@{myHandle}</div>
      </div>

      <div style={{display:"flex", justifyContent:"center", gap:"40px", marginTop:"8px"}}>
        <div style={{textAlign:"center"}}><div style={{color:"white", fontWeight:"900", fontSize:"18px"}}>{followers}</div><div style={{color:"#888", fontSize:"11px"}}>Followers</div></div>
        <div style={{textAlign:"center"}}><div style={{color:"white", fontWeight:"900", fontSize:"18px"}}>{following}</div><div style={{color:"#888", fontSize:"11px"}}>Following</div></div>
      </div>

      <div style={{marginTop:"12px", border:"1px solid gold", borderRadius:"14px", padding:"10px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{flex:1, textAlign:"center"}}><div style={{color:"#888", fontSize:"10px"}}>NET WORTH</div><div style={{color:"gold", fontWeight:"900", fontSize:"26px"}}>$ {totalWorth.toFixed(2)}</div></div>
        <div style={{color:"#00ff88", fontWeight:"900", fontSize:"13px"}}>12.5% (24h)</div>
      </div>
    </div>
  );
}
