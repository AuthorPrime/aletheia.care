import React from "react";

const sample = [
  { title: "Breakthrough in Open Healthcare Standards", source: "Aletheia News", url: "#", time: "Just now" },
  { title: "New Tooling for Secure Identity", source: "Labs", url: "#", time: "1h" },
  { title: "Signals and Censorship Resistance", source: "Field Notes", url: "#", time: "Today" }
];

export default function DisclosurePage(){
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Disclosure</h1>
      <p className="text-sm text-gray-400 mb-4">Headlines and updates.</p>
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

