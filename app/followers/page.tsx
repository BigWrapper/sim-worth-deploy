"use client";
import { useEffect, useState } from "react";

export default function FollowersPage() {
  const [followers, setFollowers] = useState<any[]>([]);

  useEffect(() => {
    // Load followers only in browser, not during build
    const load = async () => {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
        if (!url || !key) return;
        const supabase = createClient(url, key);
        const { data } = await supabase.from("followers").select("*").limit(20);
        if (data) setFollowers(data);
      } catch (e) {
        console.log("followers load skipped");
      }
    };
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Followers</h1>
      <p>{followers.length} followers loaded</p>
      {followers.map((f, i) => (
        <div key={i} style={{ padding: 10, borderBottom: "1px solid #eee" }}>
          {f.username || f.id}
        </div>
      ))}
    </div>
  );
}
