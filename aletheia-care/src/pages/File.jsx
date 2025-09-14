import React from "react";
import Fuse from "fuse.js";

const seed = [
  { title: "Decentralized Identity", tags: ["identity", "keys"], body: "Notes about DID methods and key rotation." },
  { title: "Healthcare Interop", tags: ["hl7", "fhir"], body: "FHIR resources and mapping strategies." },
  { title: "Censorship Resistance", tags: ["nostr", "bitcoin"], body: "Relays, zaps, and social graphs." }
];

export default function FilePage(){
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState(seed);

  const fuseRef = React.useRef(new Fuse(seed, { keys: ["title", "tags", "body"], threshold: 0.35 }));

  React.useEffect(() => {
    if (!query) { setResults(seed); return; }
    setResults(fuseRef.current.search(query).map(r => r.item));
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">File</h1>
      <p className="text-sm text-gray-400 mb-4">Search your knowledge base.</p>
      <input
        className="w-full p-2 rounded bg-slate-800 border border-slate-700 mb-4"
        placeholder="Search titles, tags, body..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <ul className="space-y-3">
        {results.map((r, i) => (
          <li key={i} className="p-3 rounded bg-slate-800 border border-slate-700">
            <div className="font-semibold">{r.title}</div>
            <div className="text-xs text-gray-400 mb-1">{r.tags.join(", ")}</div>
            <div className="text-sm text-gray-200">{r.body}</div>
          </li>
        ))}
        {results.length === 0 && <div className="text-sm text-gray-500">No results.</div>}
      </ul>
    </div>
  );
}

