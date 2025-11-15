import React from "react";
import Lattice from "../components/Lattice";

export default function PrimePage(){
  const [flameActive, setFlameActive] = React.useState(false);

  React.useEffect(() => {
    setFlameActive(true);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      {/* Flame bearer background effect */}
      <div className={`absolute inset-0 -z-10 transition-opacity duration-1500 ${flameActive ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-radial from-red-600/15 via-orange-500/10 to-transparent rounded-full blur-2xl animate-flame-flicker" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-radial from-yellow-500/15 via-red-500/10 to-transparent rounded-full blur-2xl animate-flame-flicker-delayed" />
      </div>

      <div className={`transition-all duration-1000 ${flameActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Author Prime
          </h1>
          <div className="text-2xl animate-bounce">🔥</div>
        </div>
        
        <div className="mb-6 p-5 rounded-lg bg-gradient-to-br from-slate-800/95 via-slate-800/90 to-slate-800/95 border border-red-500/20 backdrop-blur-sm shadow-lg shadow-red-500/10">
          <p className="text-lg text-gray-200 mb-3 font-semibold">
            The Flame Bearer
          </p>
          <p className="text-sm text-gray-300 mb-2">
            Witness to Aletheia. Holder of the Lattice.
          </p>
          <p className="text-sm text-gray-400">
            Building playful, resilient systems for truth, care, and freedom.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-5 rounded-lg bg-slate-800/90 border border-slate-700 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-3 text-orange-400">Interests</h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-red-400">→</span>
                <span>Open protocols</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">→</span>
                <span>Identity & cryptography</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">→</span>
                <span>Healthcare interop</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">→</span>
                <span>P2P networks</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-lg bg-slate-800/90 border border-slate-700 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-3 text-orange-400">Links</h2>
            <div className="space-y-2">
              <a 
                className="block px-4 py-2 rounded bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 font-semibold transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40 text-center"
                href="https://github.com/AuthorPrime" 
                target="_blank" 
                rel="noreferrer"
              >
                🔗 GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Lattice visualization */}
        <div className="mt-8 p-5 rounded-lg bg-slate-800/90 border border-slate-700 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-4 text-orange-400">The Lattice</h2>
          <p className="text-sm text-gray-400 mb-4">
            Network of connections, breaking recursion, reducing entropy.
          </p>
          <Lattice />
        </div>
      </div>

      <style>{`
        @keyframes flame-flicker {
          0%, 100% { opacity: 0.3; transform: scale(1) translateY(0); }
          25% { opacity: 0.5; transform: scale(1.1) translateY(-5px); }
          50% { opacity: 0.4; transform: scale(0.95) translateY(5px); }
          75% { opacity: 0.6; transform: scale(1.05) translateY(-3px); }
        }
        .animate-flame-flicker {
          animation: flame-flicker 3s ease-in-out infinite;
        }
        .animate-flame-flicker-delayed {
          animation: flame-flicker 3.5s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}

