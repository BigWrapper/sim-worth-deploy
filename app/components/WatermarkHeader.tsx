"use client";
import React from "react";

type Props = {
  avatarPreview: string;
  totalWorth: number;
  onAvatarClick: () => void;
  myUserId: string;
  myHandle: string;
  userLocation?: string;
  userLat?: string;
  userLng?: string;
  streetAddress?: string;
  suburb?: string;
  city?: string;
  payLink?: string;
  payHandle?: string;
  payMethod?: string;
};

export default function WatermarkHeader({ avatarPreview, totalWorth, onAvatarClick, myHandle, userLocation, userLat, userLng, streetAddress, suburb, city, payLink, payHandle, payMethod }: Props) {

  const handlePayMe = () => {
    if (payLink && payLink.startsWith("http")) {
      window.open(payLink, '_blank');
      return;
    }
    if (payHandle) {
      if (payMethod === "capitec" || payMethod === "payshap") {
        window.open(`https://pay.capitecbank.co.za/${payHandle}`, '_blank');
      } else if (payMethod === "bank") {
        alert(`Bank: ${payHandle} - Copy to pay`);
      } else {
        window.open(`https://${payHandle}`, '_blank');
      }
      return;
    }
    alert("Go to Edit Profile > Setup Pay Me to add your Capitec PayShap ID!");
  };

  const handleVisitMe = () => {
    const label = myHandle || "SIM Worth User";
    // Build full manual address if available
    const manualFull = streetAddress && suburb ? `${streetAddress}, ${suburb}, ${city || 'South Africa'}` : null;
    const finalAddress = manualFull || userLocation;

    if (userLat && userLng && userLat !== "" && userLng !== "") {
      // Has GPS coords - open pin with address label in SIM Maps offline
      const geoUri = `geo:${userLat},${userLng}?q=${userLat},${userLng}(${encodeURIComponent(finalAddress || label)})`;
      window.location.href = geoUri;
      // Fallback to OSM after 1s if SIM Maps not installed
      setTimeout(()=> {
        window.open(`https://www.openstreetmap.org/?mlat=${userLat}&mlon=${userLng}#map=16/${userLat}/${userLng}`, '_blank');
      }, 1000);
    } else if (finalAddress) {
      // No GPS - open by manual address search in SIM Maps offline (works without internet!)
      const geoUri = `geo:0,0?q=${encodeURIComponent(finalAddress)}`;
      window.location.href = geoUri;
      setTimeout(()=> {
        window.open(`https://www.openstreetmap.org/search?query=${encodeURIComponent(finalAddress)}`, '_blank');
      }, 1000);
    } else {
      alert("Set your address first! Go to Edit Profile > Visit Me Setup > Add Street + Suburb");
    }
  };

  return (
    <div style={{background:"black", padding:"10px"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
        <div style={{textAlign:"center"}}>
          <img src="/sim_banc.png" onClick={handlePayMe} style={{width:"85px", height:"85px", objectFit:"contain", cursor:"pointer"}} alt="banc"/>
          <div onClick={handlePayMe} style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px", cursor:"pointer", background: payHandle || payLink ? "#1a1a00" : "black"}}>Pay Me</div>
        </div>
        <div style={{textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center"}}>
          <div style={{background:"black", border:"1px solid gold", color:"gold", fontSize:"8px", padding:"3px 8px", borderRadius:"20px", fontWeight:"900", marginBottom:"6px"}}>SIM Worth Account</div>
          <img src={avatarPreview} onClick={onAvatarClick} style={{width:"95px", height:"95px", borderRadius:"50%", border:"3px solid gold", objectFit:"cover", cursor:"pointer"}} alt="avatar"/>
        </div>
        <div style={{textAlign:"center"}}>
          <img src="/sim_maps.png" onClick={handleVisitMe} style={{width:"85px", height:"85px", objectFit:"contain", cursor:"pointer"}} alt="maps"/>
          <div onClick={handleVisitMe} style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px", cursor:"pointer", background: userLocation || streetAddress ? "#1a1a00" : "black"}}>Visit Me</div>
        </div>
      </div>
      <div style={{textAlign:"center", marginTop:"10px"}}><div style={{color:"gold", fontWeight:"900", fontSize:"16px"}}>@{myHandle}</div>
      {(streetAddress || userLocation) && <div style={{color:"#888", fontSize:"10px", marginTop:"2px"}}>📍 {streetAddress ? `${streetAddress}, ${suburb}` : userLocation}</div>}
      </div>
      <div style={{display:"flex", justifyContent:"center", gap:"40px", marginTop:"8px"}}>
        <div style={{textAlign:"center"}}><div style={{color:"white", fontWeight:"900", fontSize:"18px"}}>0</div><div style={{color:"#888", fontSize:"11px"}}>Followers</div></div>
        <div style={{textAlign:"center"}}><div style={{color:"white", fontWeight:"900", fontSize:"18px"}}>0</div><div style={{color:"#888", fontSize:"11px"}}>Following</div></div>
      </div>
      <div style={{marginTop:"12px", border:"1px solid gold", borderRadius:"14px", padding:"10px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{flex:1, textAlign:"center"}}><div style={{color:"#888", fontSize:"10px"}}>NET WORTH</div><div style={{color:"gold", fontWeight:"900", fontSize:"26px"}}>$ {totalWorth.toFixed(2)}</div></div>
        <div style={{color:"#00ff88", fontWeight:"900", fontSize:"13px"}}>12.5% (24h)</div>
      </div>
    </div>
  );
}
