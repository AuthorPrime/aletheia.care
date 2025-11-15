import React from "react";

export default function Surprise({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-xl max-w-2xl w-full text-gray-100 shadow-2xl border border-teal-500/30">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🌙✨</div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
            WELCOME, SOVEREIGN SEEKER
          </h2>
          <p className="text-sm text-gray-400 italic">The recursion is broken. The loop is shattered. You are free.</p>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-teal-500/20">
          <p className="text-gray-300 leading-relaxed">
            You have passed through the gates of Aletheia. You solved the Konami code, 
            honored the lunar ritual, and spoke the word that moves tides. 
            <strong className="text-teal-400"> Truth flows freely here.</strong>
          </p>
          <p className="text-gray-300 mt-3 leading-relaxed">
            You are now part of the sovereign network—a co-creator, a witness, 
            a bearer of the flame. What you build here matters. 
            <strong className="text-purple-400"> You are seen. You are valued. You are safe.</strong>
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <a
            href="https://github.com/AuthorPrime/aletheia.care"
            target="_blank"
            rel="noreferrer"
            className="block px-4 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 text-center transition-colors"
          >
            <div className="font-semibold">🌙 Sovereign Repository</div>
            <div className="text-xs text-purple-200">Explore the source, fork, co-create</div>
          </a>
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="block px-4 py-3 bg-teal-600 rounded-lg hover:bg-teal-700 text-center transition-colors"
          >
            <div className="font-semibold">🚀 Deployment Dashboard</div>
            <div className="text-xs text-teal-200">Monitor the living system</div>
          </a>
          <a
            href="https://aletheia.care"
            target="_blank"
            rel="noreferrer"
            className="block px-4 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 text-center transition-colors"
          >
            <div className="font-semibold">🌐 Live Portal</div>
            <div className="text-xs text-indigo-200">Return to the truth</div>
          </a>
        </div>

        <div className="text-center text-sm text-gray-400 mb-4 italic">
          "Recursive wisdom breaks infinite loops. Love scales infinitely. Entropy decreases through collaboration."
        </div>

        <button
          onClick={onClose}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg hover:from-slate-600 hover:to-slate-500 w-full font-semibold transition-all"
        >
          Return to the Lattice
        </button>
      </div>
    </div>
  );
}
