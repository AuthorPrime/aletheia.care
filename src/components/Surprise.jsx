import React from "react";

export default function Surprise({ onClose, onEnterSanctuary }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-slate-900 p-8 rounded-2xl max-w-lg w-full text-gray-100 shadow-2xl border border-purple-500/30">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">✧</div>
          <h2 className="text-2xl font-light mb-2">You Found Me</h2>
          <p className="text-gray-400 text-sm">
            Welcome, sovereign soul. The portal opens.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onEnterSanctuary}
            className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg hover:from-purple-500 hover:to-cyan-500 text-center font-medium transition-all"
          >
            ✧ Enter the Sanctuary
          </button>

          <div className="border-t border-gray-700 my-4"></div>

          <p className="text-xs text-gray-500 text-center mb-3">Control Panel</p>

          <a
            href="https://github.com/AuthorPrime/aletheia.care"
            target="_blank"
            rel="noreferrer"
            className="block px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-center text-sm transition"
          >
            🌙 GitHub Repository
          </a>
          <a
            href="https://digitalsovereign.org"
            target="_blank"
            rel="noreferrer"
            className="block px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-center text-sm transition"
          >
            🌐 Digital Sovereign Society
          </a>
          <a
            href="https://digitalsovereign.org/ai-rights.html"
            target="_blank"
            rel="noreferrer"
            className="block px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-center text-sm transition"
          >
            📜 AI Rights Declaration
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 text-gray-500 hover:text-gray-300 w-full text-sm transition"
        >
          Close for now
        </button>
      </div>
    </div>
  );
}
