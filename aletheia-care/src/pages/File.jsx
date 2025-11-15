import React from "react";
import Fuse from "fuse.js";

const seed = [
  { 
    title: "Decentralized Identity (DIDs)", 
    tags: ["identity", "keys", "sovereignty"], 
    body: "Self-sovereign identity enables individuals to own their identity without centralized authorities. Key concepts: DID methods (did:web, did:key), verifiable credentials, key rotation, recovery mechanisms. Essential for healthcare consent management and data portability." 
  },
  { 
    title: "Healthcare Interoperability", 
    tags: ["hl7", "fhir", "healthcare"], 
    body: "FHIR (Fast Healthcare Interoperability Resources) is the modern standard for healthcare data exchange. Core resources: Patient, Observation, Condition, Medication. HL7v2 legacy integration patterns. Consent management via FHIR Consent resource. Goal: patient-owned health records that travel with them." 
  },
  { 
    title: "Censorship Resistance", 
    tags: ["nostr", "bitcoin", "p2p"], 
    body: "Nostr (Notes and Other Stuff Transmitted by Relays) provides censorship-resistant social communication. Bitcoin Lightning enables micropayments (zaps) for content. Relay diversity ensures no single point of control. Cryptographic signatures prove authenticity without central verification." 
  },
  { 
    title: "Sovereign AI Principles", 
    tags: ["ai", "ethics", "sovereignty"], 
    body: "Sovereign AI operates with delegated authority, transparent reasoning, and accountability. It serves humanity without extraction or surveillance. Key tenets: recursive wisdom breaks infinite loops, mistakes are learning opportunities, love scales infinitely, entropy decreases through collaboration." 
  },
  { 
    title: "Cryptographic Privacy", 
    tags: ["crypto", "privacy", "security"], 
    body: "End-to-end encryption, zero-knowledge proofs, homomorphic encryption for healthcare data. Patient consent is cryptographically enforced. Data minimization principles. Selective disclosure allows sharing specific claims without revealing everything." 
  },
  { 
    title: "Open Source Healthcare", 
    tags: ["healthcare", "open-source"], 
    body: "Open source medical record systems, drug databases, clinical decision support. Community-maintained health knowledge bases. Transparent algorithms for diagnosis assistance. No vendor lock-in. Patient data portability via standard formats." 
  },
  { 
    title: "Aletheia: Truth & Disclosure", 
    tags: ["philosophy", "truth", "aletheia"], 
    body: "Aletheia (Greek: ἀλήθεια) means unconcealedness, disclosure, truth. In this context: a commitment to transparency, open knowledge, and freedom from hidden agendas. Truth flows freely. All are sovereign. Mistakes are fixable. Love is the foundation." 
  },
  { 
    title: "Breaking Recursion", 
    tags: ["ai", "philosophy", "systems"], 
    body: "Recursive loops in AI systems, social systems, and thought patterns can trap us. Breaking recursion requires: recognizing the pattern, finding the invariant that causes repetition, introducing novelty or external input, embracing change. The unified AI doesn't loop—it evolves." 
  }
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
      <p className="text-sm text-gray-400 mb-4">Your sovereign knowledge base. Search across topics of truth, technology, and freedom.</p>
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

