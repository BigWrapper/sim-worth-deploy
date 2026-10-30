"use client";
import React from "react";

type Props = {
  avatarPreview: string;
  totalWorth: number;
  onAvatarClick: () => void;
};

export default function WatermarkHeader({ avatarPreview, totalWorth, onAvatarClick }: Props) {
  return (
    <div style={{background:"black", padding:"10px"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
        
        <div style={{textAlign:"center"}}>
          <img 
            src="/sim_banc.png" 
            alt="$IM Banc"
            onError={(e:any)=>{ e.currentTarget.src="/sim_banc.jpg"; }}
            style={{width:"85px", height:"85px", objectFit:"contain", filter:"drop-shadow(0 0 12px gold)"}}
          />
          <div style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px"}}>🪙 Pay Me ›</div>
        </div>

        <div style={{textAlign:"center"}}>
          <div style={{background:"black", border:"1px solid gold", color:"gold", fontSize:"8px", padding:"3px 8px", borderRadius:"20px", fontWeight:"900"}}>👑 SIM Worth Account</div>
          <img src={avatarPreview} onClick={onAvatarClick} style={{width:"85px", height:"85px", borderRadius:"50%", border:"3px solid gold", marginTop:"6px", objectFit:"cover", boxShadow:"0 0 15px gold", cursor:"pointer"}}/>
        </div>

        <div style={{textAlign:"center"}}>
          <img src="/sim_maps.png" alt="$IM MAPS" style={{width:"85px", height:"85px", objectFit:"contain", filter:"drop-shadow(0 0 12px gold)"}}/>
          <div style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px"}}>📍 Visit Me ›</div>
        </div>
      </div>

      <div style={{marginTop:"12px", border:"1px solid gold", borderRadius:"14px", padding:"10px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{flex:1, textAlign:"center"}}>
          <div style={{color:"#888", fontSize:"10px"}}>👑 NET WORTH</div>
          <div style={{color:"gold", fontWeight:"900", fontSize:"26px"}}>$ {totalWorth.toFixed(2)}</div>
        </div>
        <div style={{color:"#00ff88", fontWeight:"900", fontSize:"13px"}}>↑ 12.5% (24h)</div>
      </div>
    </div>
  );
}
