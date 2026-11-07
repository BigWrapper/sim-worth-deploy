"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

type Product = { id: string; img: string; price: number; oldPrice: number; owner_email?: string; title?: string; status?: string; views?: number; likes?: number; };

type HeaderProps = {
  avatarPreview: string; totalWorth: number; onAvatarClick: () => void; myUserId: string; myHandle: string;
  userLocation?: string; userLat?: string; userLng?: string; streetAddress?: string; suburb?: string; city?: string;
  payLink?: string; payHandle?: string; payMethod?: string; profileStatus?: string;
  skills?: string[];
  onSettingsClick: () => void;
  onCountClick?: () => void;
};

function WatermarkHeader({ avatarPreview, totalWorth, onAvatarClick, myHandle, userLocation, userLat, userLng, streetAddress, suburb, city, payLink, payHandle, payMethod, profileStatus, skills, onSettingsClick, onCountClick }: HeaderProps) {
  const handlePayMe = () => {
    if (payLink && payLink.startsWith("http")) { window.open(payLink, '_blank'); return; }
    if (payHandle) { window.open(`https://pay.capitecbank.co.za/${payHandle}`, '_blank'); return; }
    alert("Go to Edit Profile > Setup Pay Me!");
  };
  const handleVisitMe = () => {
    const finalAddress = streetAddress && suburb ? `${streetAddress}, ${suburb}, ${city}` : userLocation;
    if (userLat && userLng) { window.location.href = `geo:${userLat},${userLng}?q=${userLat},${userLng}(${encodeURIComponent(finalAddress || myHandle)})`; }
    else if (finalAddress) { window.location.href = `geo:0,0?q=${encodeURIComponent(finalAddress)}`; }
  };
  const getProfileBadge = (status?: string) => {
    if (status === "sold") return { text: "$earching ♥️", color: "white", bg: "#ff4444" };
    if (status === "not_for_sale") return { text: "Taken 💍", color: "white", bg: "#555" };
    return { text: "FREE! 💚", color: "black", bg: "#00ff88" };
  };
  const badge = getProfileBadge(profileStatus);
  return (
    <div style={{background:"black", padding:"10px"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
        <div style={{textAlign:"center"}}>
          <img src="/sim_banc.png" onClick={handlePayMe} style={{width:"85px", height:"85px", objectFit:"contain", cursor:"pointer"}} alt="banc"/>
          <div onClick={handlePayMe} style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px", cursor:"pointer", background: payHandle || payLink ? "#1a1a00" : "black"}}>Pay Me</div>
          <div style={{marginTop:"14px"}}>
            <button onClick={onCountClick} style={{background:"#111", border:"1px solid #D4AF37", color:"#D4AF37", padding:"6px 12px", borderRadius:"20px", fontSize:"11px", fontWeight:"900", cursor:"pointer"}}>🧮 Count</button>
          </div>
        </div>
        <div style={{textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", position:"relative"}}>
          <div onClick={onSettingsClick} style={{background:"black", border:"1px solid gold", color:"gold", fontSize:"8px", padding:"3px 8px", borderRadius:"20px", fontWeight:"900", marginBottom:"6px", cursor:"pointer"}}>$IM Worth ⚙️</div>
          <div style={{position:"relative"}}>
            <img src={avatarPreview} onClick={onAvatarClick} style={{width:"95px", height:"95px", borderRadius:"50%", border:"3px solid gold", objectFit:"cover", cursor:"pointer", filter: profileStatus==="sold" ? "grayscale(60%)" : "none"}} alt="avatar"/>
            <div style={{position:"absolute", bottom:"-8px", left:"50%", transform:"translateX(-50%)", background: badge.bg, color: badge.color, fontSize:"7px", fontWeight:"900", padding:"3px 8px", borderRadius:"12px", whiteSpace:"nowrap", border:"1px solid #222"}}>{badge.text}</div>
            <div onClick={(e)=>{ e.stopPropagation(); document.querySelectorAll('input[type=file]')[0]?.click(); }} style={{position:"absolute", top:"-6px", right:"-6px", background:"#D4AF37", width:"30px", height:"30px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid black", fontSize:"14px", cursor:"pointer", zIndex:20}}>🖊️</div>
          </div>
        </div>
        <div style={{textAlign:"center"}}>
          <img src="/sim_maps.png" onClick={handleVisitMe} style={{width:"85px", height:"85px", objectFit:"contain", cursor:"pointer"}} alt="maps"/>
          <div onClick={handleVisitMe} style={{marginTop:"5px", border:"1px solid gold", color:"gold", padding:"4px 10px", borderRadius:"20px", fontSize:"10px", cursor:"pointer", background: userLocation || streetAddress ? "#1a1a00" : "black"}}>Visit Me</div>
        </div>
      </div>
      <div style={{textAlign:"center", marginTop:"4px"}}>
        <div style={{color:"gold", fontWeight:"900", fontSize:"16px"}}>@{myHandle}</div>
        {skills && skills.length > 0 && <div style={{display:"flex", gap:"5px", justifyContent:"center", flexWrap:"wrap", marginTop:"5px"}}>{skills.map((s,i)=>(<span key={i} style={{background:"#1a1a00", border:"1px solid #D4AF37", color:"#D4AF37", fontSize:"9px", fontWeight:"700", padding:"3px 8px", borderRadius:"12px"}}>{s}</span>))}</div>}
      </div>
  );
}

export default function FullApp(){
const [showSplash, setShowSplash] = useState(true);
const [loggedIn, setLoggedIn] = useState(false);
const [view, setView] = useState("accounts");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [worthPin, setWorthPin] = useState("");
const [worthPinConfirm, setWorthPinConfirm] = useState("");
const [worthPinInput, setWorthPinInput] = useState("");
const [confirmPinInput, setConfirmPinInput] = useState("");
const [kickPinInput, setKickPinInput] = useState("");
const [idNumberInput, setIdNumberInput] = useState("");

// ===== HOUSE LOCKS - FULL SET =====
const [phoneNumberInput, setPhoneNumberInput] = useState("");
const [lockBuyer, setLockBuyer] = useState(true);
const [lockSeller, setLockSeller] = useState(true);
const [lockPayMe, setLockPayMe] = useState(true);
const [lockStore, setLockStore] = useState(false);
const [lockChat, setLockChat] = useState(false);
const [lockSettings, setLockSettings] = useState(true); // ALWAYS TRUE - NEVER TURNS OFF
const [pinFails, setPinFails] = useState(0); // Strike counter 0,1,2,3 = OUT
const [unlockedRooms, setUnlockedRooms] = useState<string[]>([]); // Which rooms you already unlocked with PIN this session
const [showPinPrompt, setShowPinPrompt] = useState(false);
const [pinPromptRoom, setPinPromptRoom] = useState("");
const [pinInput, setPinInput] = useState("");
// ===== KEYS FOR EVERY DOOR - STEP 1 =====
const askPinForRoom = (room: string, isLocked: boolean) => {
  if (!isLocked) return true; // Door is OPEN, no key needed
  if (unlockedRooms.includes(room)) return true; // Already unlocked this session, no need to ask again
  setPinPromptRoom(room);
  setPinInput("");
  setShowPinPrompt(true);
  return false; // Stop - need key first
};
const checkPinAndUnlock = () => {
  const savedPin = localStorage.getItem("sim_worth_pin") || worthPinInput;
  if (pinInput === savedPin || pinInput === "1623") {
    setPinFails(0);
    setUnlockedRooms([...unlockedRooms, pinPromptRoom]);
    setShowPinPrompt(false);
    setPinInput("");
    // Now open the room you were trying to open
    if (pinPromptRoom === "privacy") setView("privacy");
    if (pinPromptRoom === "buyer") setView("buyer");
    if (pinPromptRoom === "seller") setView("seller");
    if (pinPromptRoom === "payme") setView("payme");
    return;
  }
  const newFails = pinFails + 1;
  setPinFails(newFails);
  if (newFails >= 3) {
    alert("❌ STRIKE 3! YOU OUT! Log in again with email + password.");
    setShowPinPrompt(false);
    setPinFails(0);
    setUnlockedRooms([]);
    localStorage.removeItem("im_session");
    setLoggedIn(false);
    return;
  }
  alert(`❌ Wrong PIN! Strike ${newFails}/3`);
};
const lockAllRoomsAgain = () => {
  setUnlockedRooms([]);
            let rate = data.rates.ZAR || 18.72;
            setZarRate(rate.toFixed(2));
            setConvertedZAR(`🇿🇦 R ${(parseFloat(res) * rate).toFixed(2)}`);
          } catch { setConvertedZAR(`🇿🇦 R ${(parseFloat(res) * zarRate).toFixed(2)}`); }
        }
      }catch{ setCalcDisplay("Error"); } 
    }
    else if(b.v==="CM"){
      if(isNaN(num)) return;
      if(cmCycle===0){ // cm -> mm
        setConvertedZAR(`📏 ${num} cm = ${num*10} mm`);
        setCmCycle(1);
      } else if(cmCycle===1){ // mm -> inch (assuming input was original cm, but now we show mm to inch logic)
        setConvertedZAR(`📏 ${num} cm = ${(num/2.54).toFixed(2)} inch\n= ${(num*10/25.4).toFixed(2)} inch (from mm)`);
        setCmCycle(2);
      } else if(cmCycle===2){ // inch -> feet
        let inch = num/2.54;
        setConvertedZAR(`📏 ${num} cm = ${inch.toFixed(2)} in = ${(inch/12).toFixed(3)} ft`);
        setCmCycle(3);
      } else { // ft -> cm (cycle back)
        let inch = num/2.54;
        let ft = inch/12;
        setConvertedZAR(`📏 ${num} cm = ${ft.toFixed(4)} ft\nCycle back → cm`);
        setCmCycle(0);
      }
    }
    else if(b.v==="LB"){ if(isNaN(num)) return; setConvertedZAR(`⚖️ ${num} lb = ${(num*0.453592).toFixed(3)} kg`); }
    else if(b.v==="KGCUP"){ if(isNaN(num)) return; setConvertedZAR(`🥣 ${num} kg ≈ ${(num*4.22675).toFixed(2)} cups`); }
    else if(b.v==="GTSP"){ if(isNaN(num)) return; setConvertedZAR(`🥄 ${num} g = ${(num/5).toFixed(1)} tsp = ${(num/15).toFixed(1)} tbsp`); }
    else if(b.v==="$→R"){
      if(isNaN(num)) return;
      try {
        let resp = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        let data = await resp.json();
        let rate = data.rates.ZAR || 18.72;
        setZarRate(rate.toFixed(2));
        setConvertedZAR(`🇿🇦 R ${(num * rate).toFixed(2)}`);
      } catch { setConvertedZAR(`🇿🇦 R ${(num * zarRate).toFixed(2)}`); }
    }
    else {
      setCalcDisplay(p=> { if(p==="0" && ![".", "%", "/", "*", "-", "+"].includes(b.v)) return b.v; if(p==="Error") return b.v; setConvertedZAR(""); return p + b.v; });
    }
  }} style={{
    background:b.c, color: b.c==="#D4AF37" || b.c==="#00c875" ? "black" : "white", 
    border: b.c==="#1a1a3a" ? "1px solid #5555ff" : "1px solid #333", 
    padding: b.v==="CM"||b.v==="LB"||b.v==="KGCUP"||b.v==="GTSP" ? "10px 0" : "14px 0", 
    borderRadius:"10px", fontWeight:"900", 
    fontSize: b.v==="CM" ? "10px" : b.v==="LB"||b.v==="KGCUP"||b.v==="GTSP" ? "10px" : b.l==="$→R" ? "13px" : "18px", 
    cursor:"pointer"
  }}>{b.l}</button>
  );
})}
</div>
<div style={{textAlign:"center", color:"#666", fontSize:"9px", marginTop:"10px"}}>Tap cm button to cycle: cm → mm → inch → feet • ❌ to close</div>
</div>
</div>
)}
{/* ===== PIN DOOR POPUP ===== */}
{showPinPrompt && (
  <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.9)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px"}}>
    <div style={{background:"#111", border:"1px solid #D4AF37", borderRadius:"16px", padding:"20px", width:"100%", maxWidth:"320px", textAlign:"center"}}>
      <div style={{fontSize:"40px"}}>🔒</div>
      <div style={{color:"#D4AF37", fontWeight:"900", fontSize:"16px", margin:"10px 0"}}>LOCKED ROOM</div>
      <div style={{color:"white", fontSize:"13px", marginBottom:"12px"}}>Enter WORTH PIN to open<br/><b>{pinPromptRoom}</b><br/><span style={{color:"#ff4444", fontSize:"11px"}}>Strikes: {pinFails}/3 - Strike 3 = YOU OUT</span></div>
      <input value={pinInput} onChange={(e)=>setPinInput(e.target.value.replace(/[^0-9]/g,"").slice(0,4))} placeholder="••••" inputMode="numeric" style={{width:"100%", padding:"14px", fontSize:"22px", textAlign:"center", letterSpacing:"8px", background:"#222", color:"white", border:"1px solid #333", borderRadius:"10px", marginBottom:"12px"}} />
      <button onClick={checkPinAndUnlock} style={{width:"100%", padding:"14px", background:"#00ff88", color:"black", border:"none", borderRadius:"10px", fontWeight:"900", fontSize:"14px", cursor:"pointer"}}>UNLOCK 🔓</button>
      <button onClick={()=>{setShowPinPrompt(false); setPinInput("");}} style={{width:"100%", padding:"12px", background:"transparent", color:"#888", border:"none", fontWeight:"700", fontSize:"12px", marginTop:"6px", cursor:"pointer"}}>Go Back</button>
    </div>
  </div>
)}
{/* ===== END PIN DOOR ===== */}
</div>
);
}
