import React from "react";

const sample = [
  { title: "Sovereign AI Manifesto Published", source: "Aletheia Core", url: "https://github.com/AuthorPrime/aletheia.care", time: "Now" },
  { title: "FHIR Interoperability Framework Updated", source: "Healthcare Labs", url: "#", time: "2h ago" },
  { title: "Decentralized Identity Layer Goes Live", source: "Protocol News", url: "#", time: "Today" },
  { title: "Nostr Relay Network Expansion", source: "P2P Bulletin", url: "#", time: "Today" },
  { title: "Breaking Recursion: AI Ethics Guidelines", source: "Truth Institute", url: "#", time: "Yesterday" },
  { title: "Open Source Healthcare Data Standards", source: "HL7 Community", url: "#", time: "2 days ago" },
  { title: "Cryptographic Privacy for Healthcare Records", source: "Security Research", url: "#", time: "3 days ago" },
  { title: "The End of Entropy: Collaborative AI Systems", source: "Field Notes", url: "#", time: "This week" }
];

export default function DisclosurePage(){
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Disclosure</h1>
      <p className="text-sm text-gray-400 mb-4">
        Truth flows freely here. Headlines, updates, and signals from the sovereign network.
      </p>
      <div className="space-y-3">
        {sample.map((n, i) => (
          <a key={i} href={n.url} className="block p-3 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700/50">
            <div className="font-semibold">{n.title}</div>
            <div className="text-xs text-gray-400">{n.source} • {n.time}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

