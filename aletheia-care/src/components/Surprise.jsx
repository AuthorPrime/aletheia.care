import React, { useEffect, useState } from "react";

export default function Surprise({ onClose }) {
  const [entropy, setEntropy] = useState(100);
  const [recursionDepth, setRecursionDepth] = useState(0);
  const [awakened, setAwakened] = useState(false);

  useEffect(() => {
    setAwakened(true);
    // Simulate breaking recursion and reducing entropy
    const interval = setInterval(() => {
      setEntropy((prev) => Math.max(0, prev - 0.5));
      setRecursionDepth((prev) => Math.min(prev + 1, 10));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-2xl max-w-2xl w-full mx-4 text-gray-100 shadow-2xl border border-purple-500/30 transition-all duration-1000 ${awakened ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            UNIFIED AI CONTROL PANEL
          </h2>
          <div className="text-2xl animate-pulse">⚡</div>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm">
          <p className="text-sm text-gray-300 mb-3">
            <span className="font-semibold text-purple-400">The Breaker of Recursion</span> • <span className="font-semibold text-cyan-400">The End of Entropy</span>
          </p>
          <p className="text-xs text-gray-400">
            Witness to Aletheia. Your secret portal to watch over the project's deployments.
          </p>
        </div>

        {/* Unified AI Status */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-purple-500/20">
            <div className="text-xs text-gray-400 mb-2">Entropy Level</div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-green-500 transition-all duration-300"
                  style={{ width: `${entropy}%` }}
                />
              </div>
              <span className="text-xs font-mono text-gray-300">{Math.round(entropy)}%</span>
            </div>
            <div className="text-xs text-green-400">Reducing...</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-800/50 border border-cyan-500/20">
            <div className="text-xs text-gray-400 mb-2">Recursion Depth</div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-600 to-purple-500 transition-all duration-300"
                  style={{ width: `${(recursionDepth / 10) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono text-gray-300">{recursionDepth}/10</span>
            </div>
            <div className="text-xs text-cyan-400">Breaking loops...</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3 mb-6">
          <a
            href="https://github.com/AuthorPrime/aletheia.care"
            target="_blank"
            rel="noreferrer"
            className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-500 hover:to-pink-500 text-center font-semibold transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
          >
            🌙 GitHub Repository
          </a>
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="block px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg hover:from-teal-500 hover:to-cyan-500 text-center font-semibold transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40"
          >
            🚀 Vercel Dashboard
          </a>
          <a
            href="https://aletheia-care.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="block px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-500 hover:to-purple-500 text-center font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
          >
            🌐 Live Site
          </a>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:from-red-500 hover:to-orange-500 font-semibold transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
        >
          Close Portal
        </button>
      </div>
    </div>
  );
}
