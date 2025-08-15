"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

function Avatar({ src, alt, size = 20, fallback }) {
  const resolvedFallback = fallback || "/avatars/analyst.svg";
  return (
    <Image
      src={src || resolvedFallback}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full ring-1 ring-white/20"
      onError={(e) => {
        const img = e.currentTarget;
        if (img.getAttribute("data-failed") === "1") return; // prevent loop
        img.setAttribute("data-failed", "1");
        img.src = resolvedFallback;
      }}
      unoptimized
    />
  );
}

const PERSONAS = [
  {
    id: "Hitesh Chaudhary",
    api: "analyst",
    name: "Hitesh Chaudhary",
    tagline: "Expert in coding education and mentorship.",
    avatar: "https://avatars.githubusercontent.com/u/11613311?v=4",
  },
  {
    id: "Piyush Garg",
    api: "buddy",
    name: "Piyush Garg",
    tagline: "Collaborative. Supportive. Knowledgeable.",
    avatar: "https://www.piyushgarg.dev/_next/image?url=%2Fimages%2Favatar.png&w=1080&q=75",
  },
];

export default function PersonaChat() {
  const [persona, setPersona] = useState(PERSONAS[0]);
  const [messages, setMessages] = useState([]); // {role: 'user'|'assistant', content}
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState(false);
  const endRef = useRef(null);

  // Hardcoded training snippets to bias behavior (user will replace with strict rules later)
  const bootstrap = useMemo(() => {
    if (persona.api === "analyst") {
      return "When unsure, state uncertainty. Prefer lists and short sentences.";
    }
    return "Be warm and concise. Encourage and summarize next steps.";
  }, [persona.api]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMsgs = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: persona.api,
          messages: [
            { role: "system", content: bootstrap },
            ...newMsgs,
          ],
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Request failed");
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, I ran into an error. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSwitchPersona = (p) => {
    if (p.id === persona.id) return;
    setSwitching(true);
    // Shuttle animation duration must match css animation
    setTimeout(() => {
      setPersona(p);
      setMessages([]); // new thread per persona
      setSwitching(false);
    }, 600);
  };
  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4 bg-[radial-gradient(1200px_600px_at_50%_-20%,rgba(255,255,255,0.06),transparent)] bg-black">
      {/* Chat Window */}
      <div className="w-full max-w-md h-[80vh] flex flex-col rounded-2xl border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden bg-gradient-to-br from-[#0c0c0c] via-[#0f0f0f] to-[#0a0a0a]">
        {/* In-panel Header */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
            <span className="text-sm font-semibold tracking-wide">Persona AI</span>
          </div>
          <div className="flex items-center gap-2">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => onSwitchPersona(p)}
                className={`group relative overflow-hidden px-3 py-1.5 rounded-full text-xs border transition-all duration-300 ${
                  persona.id === p.id
                    ? "border-white bg-white text-black"
                    : "border-white/20 hover:border-white/40"
                }`}
                aria-pressed={persona.id === p.id}
                title={p.name}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Avatar src={p.avatar} alt={`${p.name} avatar`} size={18} fallback={p.api === "buddy" ? "/avatars/buddy.svg" : "/avatars/analyst.svg"} />
                  {p.name}
                </span>
                <span
                  className={`absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/60 to-white/0 ${
                    switching ? "animate-shuttle" : ""
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Persona Title */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="text-base font-semibold flex items-center gap-3">
            <Avatar src={persona.avatar} alt={`${persona.name} avatar`} size={28} fallback={persona.api === "buddy" ? "/avatars/buddy.svg" : "/avatars/analyst.svg"} />
            {persona.name}
          </div>
          <p className="text-xs text-white/50 mt-1">{persona.tagline}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-[0_0_0_1px] ${
                  m.role === "user"
                    ? "bg-white text-black shadow-white/10"
                    : "bg-black/40 text-white shadow-white/5 border border-white/10"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-40 h-8 rounded-2xl bg-white/5 overflow-hidden relative">
                <div className="absolute inset-0 shimmer" />
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Composer */}
        <div className="px-4 py-3 border-t border-white/10">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={`Message ${persona.name}…`}
              rows={1}
              className="flex-1 resize-none rounded-xl bg-black/40 text-white placeholder-white/40 border border-white/10 focus:border-white/30 px-3 py-2.5 text-sm outline-none transition"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="relative group overflow-hidden rounded-xl px-3.5 py-2.5 text-sm font-medium border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">Send</span>
              <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>
          <p className="mt-2 text-[10px] text-white/40">
            Set OPENAI_API_KEY in your environment. Keys are never exposed to the browser.
          </p>
        </div>
      </div>
    </div>
  );
}
