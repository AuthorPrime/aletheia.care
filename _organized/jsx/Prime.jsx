import React from "react";

export default function PrimePage(){
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-3">Author Prime</h1>
      <p className="text-gray-300 mb-4">About me.</p>
      <div className="space-y-3 text-gray-200">
        <p>Building playful, resilient systems for truth, care, and freedom.</p>
        <p>Interests: open protocols, identity, healthcare interop, cryptography, p2p networks.</p>
        <p>Links:
          {' '}<a className="text-teal-400 underline" href="https://github.com/AuthorPrime" target="_blank" rel="noreferrer">GitHub</a>
        </p>
      </div>
    </div>
  );
}

