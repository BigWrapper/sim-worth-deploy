"use client";
import { useState } from "react";

const products = [
  { img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df", price: 19.99, old: 62.99, off: 68, rating: 4.8 },
  { img: "https://images.unsplash.com/photo-1555421689-d68471e189f2", price: 16.99, old: 59.99, off: 72, rating: 4.7 },
  { img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", price: 24.99, old: 72.99, off: 65, rating: 4.6 },
  { img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7", price: 27.99, old: 73.99, off: 62, rating: 4.5 },
  { img: "https://images.unsplash.com/photo-1592899677977-9bb10ba128a5", price: 539.99, old: 1799.99, off: 70, rating: 4.8 },
  { img: "https://images.unsplash.com/photo-1585237672818-0aab67de67f6", price: 39.99, old: 118.99, off: 66, rating: 4.6 },
  { img: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e", price: 14.99, old: 35.99, off: 58, rating: 4.7 },
  { img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db", price: 399.99, old: 799.99, off: 50, rating: 4.8 },
];

export default function Page() {
  const [tab, setTab] = useState("ALL");
  return (
    <div className="min-h-screen bg-black text-white font-sans pb-24">
      {/* Header */}
      <div className="relative bg-black p-2 flex justify-between items-start">
        <div className="mt-6">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 leading-none">$IM<br/><span className="text-xl tracking-widest text-yellow-600">— Ban¢ —</span></h1>
          <button className="mt-2 border border-yellow-600 rounded-full px-4 py-1 text-sm flex gap-2 items-center">🪙 Pay Me &gt;</button>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-1 flex flex-col items-center">
          <div className="bg-gradient-to-b from-yellow-400 to-yellow-700 text-black text-xs font-bold px-4 py-1 rounded-t-full border border-yellow-400">SIM Worth Account</div>
          <img src="https://i.pravatar.cc/150?img=12" className="w-24 h-24 rounded-full border-4 border-yellow-500 object-cover -mt-1" />
        </div>
        <div className="mt-6 text-right">
          <h1 className="text-2xl font-black text-yellow-500">$IM<br/><span className="text-sm">MAPS</span></h1>
          <button className="mt-2 border border-yellow-600 rounded-full px-4 py-1 text-sm flex gap-2 items-center">📍 Visit Me &gt;</button>
        </div>
      </div>

      {/* Net Worth */}
      <div className="mx-2 mt-2 border border-yellow-600 rounded-2xl bg-gradient-to-b from-black to-zinc-900 p-3 flex justify-between items-center">
        <div className="text-center w-full">
          <div className="text-[10px] text-zinc-400 tracking-widest">👑 NET WORTH</div>
          <div className="text-4xl font-black text-yellow-500">$ 248,750.32</div>
        </div>
        <div className="text-green-400 text-sm font-bold">↑ +12.5%<br/><span className="text-[10px] text-zinc-400">(24h)</span></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-1 m-2">
        {[
          ["Cash Balance", "$ 12,450.00"],
          ["Investments", "$ 186,320.45"],
          ["Crypto", "$ 32,580.21"],
          ["Total Assets", "$ 248,750.32"],
        ].map(([label, val])=>(
          <div key={label} className="border border-yellow-700/50 rounded-lg bg-zinc-900/50 p-2 text-center">
            <div className="text-[10px] text-zinc-300">{label}</div>
            <div className="text-[11px] font-bold">{val}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto px-2 py-2 text-sm">
        {["ALL","Electronics","Fashion","Home & Living","Beauty","Sports","More"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-1.5 rounded-full whitespace-nowrap ${tab===t ? "bg-gradient-to-b from-yellow-200 to-yellow-600 text-black font-bold" : "text-zinc-400"}`}>{t}</button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-4 md:grid-cols-4 gap-1 px-1">
        {products.map((p,i)=>(
          <div key={i} className="bg-zinc-900 border border-yellow-800/30 rounded-lg overflow-hidden">
            <div className="relative">
              <span className="absolute top-1 left-1 bg-orange-600 text-[9px] px-1 rounded">TEMU</span>
              <img src={p.img} className="w-full h-20 object-cover"/>
              <span className="absolute bottom-1 left-1 bg-red-600 text-[10px] px-1 rounded-full">-{p.off}%</span>
            </div>
            <div className="p-1">
              <div className="text-[11px]">$ {p.price} <span className="line-through text-[9px] text-zinc-500">${p.old}</span></div>
              <div className="text-[9px] text-yellow-500">★★★★★ ({p.rating})</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-yellow-900/50 p-2 flex justify-between items-center gap-2">
        <button className="flex-1 border border-yellow-600 rounded-full py-2 text-sm">💬 Message</button>
        <button className="text-xs text-yellow-600">▲<br/>More Assets</button>
        <button className="flex-1 bg-green-500 rounded-full py-2 text-sm font-bold">WhatsApp Call 📞</button>
      </div>
    </div>
  );
}
