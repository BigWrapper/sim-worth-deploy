'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Followers() {
  const [followers, setFollowers] = useState<any[]>([])
  const [count, setCount] = useState(0)

  useEffect(()=>{
    fetchFollowers()
  },[])

  const fetchFollowers = async () => {
    const { data } = await supabase.from('followers').select('*').order('created_at',{ascending:false})
    if(data){ setFollowers(data); setCount(data.length) }
  }

  const addFollower = async () => {
    const fakeId = `user_${Math.random().toString(36).substr(2,5)}`
    await supabase.from('followers').insert([{follower_id: fakeId, following_id: 'SIM-Worth-Owner'}])
    fetchFollowers()
  }

  return (
    <div className="min-h-screen bg-black text-white max-w-[480px] mx-auto p-4">
      <h1 className="text-2xl font-black text-yellow-500">👥 Followers Server</h1>
      <p className="text-gray-400 text-sm mt-1">Database: gmhtgfbfczgggcsldoky.supabase.co</p>
      
      <div className="mt-4 bg-gradient-to-b from-zinc-900 to-black border border-yellow-600 rounded-2xl p-4 flex justify-between">
        <div><div className="text-3xl font-black text-yellow-400">{count}</div><div className="text-xs text-gray-400">TOTAL FOLLOWERS</div></div>
        <button onClick={addFollower} className="bg-yellow-500 text-black font-bold px-5 rounded-full">+ Follow Test</button>
      </div>

      <div className="mt-6 space-y-2">
        {followers.map((f,i)=>(
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex justify-between">
            <div className="flex gap-3"><div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center font-bold">👤</div><div><div className="font-bold text-sm">{f.follower_id}</div><div className="text-xs text-gray-500">{new Date(f.created_at).toLocaleString()}</div></div></div>
            <div className="text-green-400 text-xs">● Live</div>
          </div>
        ))}
        {followers.length===0 && <div className="text-center text-gray-500 mt-10">No followers yet — click + Follow Test to add one to your Supabase followers table</div>}
      </div>

      <a href="../" className="block mt-8 text-center border border-yellow-600 rounded-full py-3">← Back to SIM Worth</a>
    </div>
  )
}
