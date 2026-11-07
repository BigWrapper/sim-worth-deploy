import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

export default function WorthNotepad({ userId }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceRate, setVoiceRate] = useState(1);
  const recognitionRef = useRef(null);

  // LOAD - Supabase first, localStorage fallback offline
  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    const { data } = await supabase.from("worth_notes").select("*").eq("user_id", userId).order("updated_at", { ascending: false });
    if (data && data.length > 0) {
      setNotes(data);
      localStorage.setItem("worth_notes_offline", JSON.stringify(data));
    } else {
      const local = JSON.parse(localStorage.getItem("worth_notes_offline") || "[]");
      setNotes(local);
    }
  }

  // SAVE - Supabase + Offline at same time
  async function saveNote() {
    if (!content.trim() && !title.trim()) return;
    const now = new Date().toISOString();
    const payload = { title: title || "Untitled Note", content, user_id: userId, updated_at: now };

    // 1. Save offline instantly
    let newNotes;
    if (activeId) {
      newNotes = notes.map(n => n.id === activeId ? { ...n, ...payload } : n);
    } else {
      const tempId = "local_" + Date.now();
      newNotes = [{ id: tempId, ...payload, created_at: now }, ...notes];
      setActiveId(tempId);
    }
    setNotes(newNotes);
    localStorage.setItem("worth_notes_offline", JSON.stringify(newNotes));

    // 2. Sync to Supabase in background
    try {
      if (activeId && !String(activeId).startsWith("local_")) {
        await supabase.from("worth_notes").update(payload).eq("id", activeId);
      } else {
        const { data } = await supabase.from("worth_notes").insert(payload).select().single();
        if (data) {
          setNotes(prev => prev.map(n => n.id === activeId ? data : n));
          setActiveId(data.id);
          localStorage.setItem("worth_notes_offline", JSON.stringify(prev => prev));
          loadNotes();
        }
      }
    } catch (e) { console.log("Offline, will sync later", e); }
  }

  async function deleteNote(id) {
    setNotes(notes.filter(n => n.id !== id));
    localStorage.setItem("worth_notes_offline", JSON.stringify(notes.filter(n => n.id !== id)));
    if (!String(id).startsWith("local_")) await supabase.from("worth_notes").delete().eq("id", id);
    if (activeId === id) { setActiveId(null); setTitle(""); setContent(""); }
  }

  // TEXT TO SPEECH - Built in, offline voices
  function speak() {
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    const utter = new SpeechSynthesisUtterance(`${title}. ${content}`);
    utter.rate = voiceRate;
    utter.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    utter.voice = voices.find(v => v.lang.includes("en")) || voices[0];
    utter.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  }

  // SPEECH TO TEXT - Built in
  function toggleListen() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Speech to text not supported on this browser, use Chrome");
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) transcript += e.results[i][0].transcript;
      setContent(prev => prev + transcript);
    };
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  }

  const filtered = notes.filter(n => (n.title + n.content).toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: "15px", background: "#000", color: "#fff", minHeight: "100vh" }}>
      <h2 style={{ color: "#D4AF37", textAlign: "center" }}>📝 WORTH NOTEPAD</h2>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search notes..." style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "#111", border: "1px solid #D4AF37", color: "#fff", marginBottom: "10px" }} />

      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title..." style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "#111", border: "1px solid #333", color: "#E8E8E8", marginBottom: "8px", fontWeight: "700" }} />

      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Speak or type your idea... your worth, your plan, your dream..." rows={8} style={{ width: "100%", padding: "12px", borderRadius: "12px", background: "#111", border: "1px solid #333", color: "#fff", fontSize: "16px" }} />

      <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
        <button onClick={toggleListen} style={{ flex: 1, padding: "12px", borderRadius: "10px", background: isListening ? "#ff0000" : "#D4AF37", color: "#000", fontWeight: "900", border: "none" }}>
          {isListening ? "⏹️ STOP LISTENING" : "🎤 SPEAK TO TEXT"}
        </button>
        <button onClick={speak} style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "#222", color: "#E8E8E8", fontWeight: "900", border: "1px solid #D4AF37" }}>
          {isSpeaking ? "⏹️ STOP" : "🔊 READ ALOUD"}
        </button>
      </div>

      <div style={{ display: "flex", gap: "8px", marginTop: "8px", alignItems: "center" }}>
        <label style={{ color: "#E8E8E8", fontSize: "12px" }}>Speed:</label>
        <input type="range" min="0.5" max="2" step="0.1" value={voiceRate} onChange={e => setVoiceRate(parseFloat(e.target.value))} />
        <span style={{ color: "#D4AF37" }}>{voiceRate}x</span>
        <button onClick={saveNote} style={{ marginLeft: "auto", padding: "10px 20px", borderRadius: "10px", background: "#D4AF37", color: "#000", fontWeight: "900", border: "none" }}>💾 SAVE</button>
        <button onClick={() => { setActiveId(null); setTitle(""); setContent(""); }} style={{ padding: "10px 16px", borderRadius: "10px", background: "#111", color: "#fff", border: "1px solid #333" }}>+ NEW</button>
      </div>

      <div style={{ marginTop: "16px" }}>
        {filtered.map(n => (
          <div key={n.id} onClick={() => { setActiveId(n.id); setTitle(n.title); setContent(n.content); }} style={{ border: "1px solid #333", borderRadius: "12px", padding: "12px", marginBottom: "8px", background: activeId === n.id ? "#1a1a00" : "#111", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b style={{ color: "#E8E8E8" }}>{n.title}</b>
              <span onClick={(e) => { e.stopPropagation(); deleteNote(n.id); }} style={{ color: "#ff4444" }}>🗑️</span>
            </div>
            <div style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>{n.content?.slice(0, 80)}...</div>
          </div>
        ))}
      </div>
    </div>
  );
}
