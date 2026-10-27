'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SIMWorth() {
  const [netWorth, setNetWorth] = useState(248750.32)
  const [items, setItems] = useState<any[]>([
    {name:'AirPods', price:19.99, old:62.99, off:68, rating:4.8},
    {name:'Watch', price:16.99, old:59.99, off:72, rating:4.7},
    {name:'Nike Shoe', price:24.99, old:72.99, off:65, rating:4.6},
    {name:'Nike Set', price:27.99, old:73.99, off:62, rating:4.5},
  ])
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')

  const liveNewWorth = newPrice ? netWorth + parseFloat(newPrice || '0') : netWorth

  const addItem = async () => {
    if(!newName || !newPrice) return
    const price = parseFloat(newPrice)
    const oldPrice = price * 3.2
    const off = Math.round((1 - price/oldPrice)*100)
    const newItem = {name:newName, price, old:oldPrice, off, rating:4.8}
    
    // Auto calc worth under profile
    const updatedWorth = netWorth + price
    setNetWorth(updatedWorth)
    setItems([newItem, ...items])
    
    // Save to Supabase sims table as followers server
    await supabase.from('sims').insert([{
      name: newName,
      worth: price,
      description: `TEMU -${off}% OFF`,
      phone_number: 'SIM-Worth-Asset'
    }])
    
    setNewName(''); setNewPrice('')
  }

  return (
    <div className="min-h-screen bg-black text-white max-w-[480px] mx-auto p-3 font-sans">
      {/* Header like your screenshot */}
      <div className="flex justify-between items-start">
        <div className="w-28"><div className="text-5xl font-black bg-gradient-to-b from-yellow-300 to-yellow-700 bg-clip-text text-transparent">$IM</div><div className="text-xl font-bold text-yellow-600 -mt-2">— Ban¢ —</div><button className="mt-3 w-full border border-yellow-600 rounded-full px-3 py-1.5 flex justify-between text-sm">🪙 Pay Me <span>{'>'}</span></button></div>
        <div className="flex flex-col items-center"><div className="text-[10px] bg-gradient-to-b from-yellow-300 to-yellow-600 text-black font-black px-4 py-1 rounded-full border">SIM Worth Account</div><div className="w-32 h-32 rounded-full border-2 border-yellow-500 p-1 shadow-[0_0_30px_rgba(255,215,0,0.4)] mt-2 overflow-hidden"><img src="https://i.pravatar.cc/200?img=15" className="w-full h-full rounded-full"/></div></div>
        <div className="w-28 text-right"><div className="text-3xl font-black bg-gradient-to-b from-yellow-300 to-yellow-700 bg-clip-text text-transparent">$IM<br/><span className="text-sm">MAPS</span></div><button className="mt-3 w-full border border-yellow-600 rounded-full px-3 py-1.5 flex justify-between text-sm">📍 Visit Me <span>{'>'}</span></button></div>
      </div>

      {/* NET WORTH AUTO CALC */}
      <div className="mt-4 bg-gradient-to-b from-zinc-900 to-black border border-yellow-600 rounded-2xl p-3 flex justify-between items-center shadow-[0_0_20px_rgba(255,215,0,0.2)]">
        <div className="text-3xl font-black text-yellow-500">$ {netWorth.toLocaleString(undefined,{minimumFractionDigits:2})}</div>
        <div className="text-right"><div className="text-xs text-gray-400">👑 NET WORTH</div><div className="text-green-400 text-sm font-bold">↑ +12.5% (24h)</div></div>
      </div>

      {/* Add Item - THIS ADDS TO WORTH */}
      <div className="mt-4 bg-zinc-900 border border-yellow-800 rounded-xl p-3">
        <div className="text-yellow-500 text-xs font-bold mb-2">ADD ITEM → AUTO ADDS TO WORTH</div>
        <div className="flex gap-2">
          <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Item name (e.g. iPhone)" className="flex-1 bg-black border border-yellow-900 rounded-full px-3 py-2 text-sm"/>
          <input value={newPrice} onChange={e=>setNewPrice(e.target.value)} type="number" placeholder="$ Price" className="w-24 bg-black border border-yellow-900 rounded-full px-3 py-2 text-sm"/>
          <button onClick={addItem} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-4 rounded-full text-sm">Add</button>
        </div>
        {newPrice && <div className="text-xs text-green-400 mt-2">+ ${newPrice} will be added → New Worth: $ {liveNewWorth.toLocaleString()}</div>}
      </div>

      {/* Product Grid like TEMU */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {items.map((p,i)=>(
          <div key={i} className="bg-gradient-to-b from-zinc-900 to-black border border-yellow-900 rounded-lg overflow-hidden relative">
            <div className="absolute top-1 left-1 bg-orange-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">TEMU</div>
            <div className="w-full h-20 bg-zinc-800 mt-5 flex items-center justify-center text-xs">{p.name}</div>
            <div className="p-1"><div className="bg-red-600 text-white text-[9px] px-1 rounded inline">-{p.off}%</div><div className="flex gap-1 text-[10px]"><span className="font-bold">$ {p.price}</span><span className="line-through text-gray-500 text-[8px]">${p.old?.toFixed(2)}</span></div><div className="text-[8px] text-yellow-400">★★★★★ ({p.rating})</div></div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6 gap-3 pb-6">
        <button className="flex-1 border border-yellow-600 rounded-full py-3 flex items-center justify-center gap-2">💬 Message</button>
        <button className="flex-1 bg-green-500 rounded-full py-3 font-bold">WhatsApp Call 📞</button>
      </div>
    </div>
  )
}
