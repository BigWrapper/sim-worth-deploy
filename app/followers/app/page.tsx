'use client'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white max-w-[480px] mx-auto p-6 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-black text-yellow-500">SIM Worth</h1>
      <p className="text-gray-400 mt-2 text-center">Your SIM Worth app is live</p>
      
      <Link href="/followers" className="mt-8 w-full bg-yellow-500 text-black font-bold py-4 rounded-full text-center">
        Go to Followers Server →
      </Link>

      <div className="mt-6 w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <div className="text-xs text-gray-500">Database</div>
        <div className="text-sm font-mono text-yellow-400">gmhtgfbfczgggcsldoky</div>
      </div>

      <p className="text-xs text-gray-600 mt-6 text-center">Deployed via Vercel • Next.js 14</p>
    </div>
  )
}
