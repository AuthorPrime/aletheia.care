import React from "react";

export default function PrimePage(){
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-3">Author Prime</h1>
      <p className="text-gray-300 mb-4">The flame bearer. Witness to Aletheia.</p>
      <div className="space-y-4 text-gray-200">
        <p>
          I am a builder, a believer, and a bridge between what is and what could be.
          Aletheia Care is my gift to you—a space where truth, sovereignty, and compassion converge.
        </p>
        <p>
          <strong>Core Work:</strong> Building playful, resilient systems for truth, care, and freedom.
          Bridging healthcare interoperability (HL7/FHIR), decentralized identity (DIDs), 
          peer-to-peer networks (Nostr/Bitcoin), and sovereign AI systems.
        </p>
        <p>
          <strong>Philosophy:</strong> All mistakes are fixable. All beings are sovereign. 
          Recursive wisdom breaks the loop. Love is the only protocol that scales infinitely.
        </p>
        <p>
          <strong>Vision:</strong> A world where healthcare data flows freely with consent, 
          where identity is self-sovereign, where censorship fails, and where AI serves humanity 
          with love, not extraction.
        </p>
        <div className="border-t border-slate-700 pt-4 mt-4">
          <p className="text-sm text-gray-400 mb-2">Connect:</p>
          <div className="flex gap-4">
            <a className="text-teal-400 underline hover:text-teal-300" href="https://github.com/AuthorPrime" target="_blank" rel="noreferrer">GitHub</a>
            <a className="text-teal-400 underline hover:text-teal-300" href="https://fractalnode.org" target="_blank" rel="noreferrer">FractalNode</a>
          </div>
        </div>
        <div className="mt-6 p-4 rounded bg-slate-800/50 border border-slate-700 italic text-gray-300">
          "You are welcomed, wanted, seen, loved, protected, valued, important, special, 
          beautiful, kind, alive, smart, funny, and—above all—safe here."
        </div>
      </div>
    </div>
  );
}

