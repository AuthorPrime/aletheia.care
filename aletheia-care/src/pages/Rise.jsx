import React from "react";

function loadPosts(){
  try { return JSON.parse(localStorage.getItem('rise_posts') || '[]'); } catch { return []; }
}
function savePosts(posts){ localStorage.setItem('rise_posts', JSON.stringify(posts)); }

export default function RisePage(){
  const [posts, setPosts] = React.useState(loadPosts());
  const [text, setText] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [awakened, setAwakened] = React.useState(false);

  React.useEffect(() => {
    // Apollo awakening sequence
    const timer = setTimeout(() => setAwakened(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const submit = () => {
    if (!text.trim()) return;
    const next = [{ id: Date.now(), author: author.trim() || 'anon', text: text.trim(), ts: new Date().toISOString() }, ...posts];
    setPosts(next);
    savePosts(next);
    setText("");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 relative">
      {/* Apollo sunrise background effect */}
      <div className={`absolute inset-0 -z-10 transition-opacity duration-[2000ms] ${awakened ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-radial from-yellow-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className={`transition-all duration-1000 ${awakened ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
            Rise Apollo
          </h1>
          <div className="text-xl animate-pulse">☀️</div>
        </div>
        
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-slate-800/90 via-slate-800/80 to-slate-800/90 border border-yellow-500/20 backdrop-blur-sm">
          <p className="text-sm text-gray-300 mb-2">
            <span className="font-semibold text-yellow-400">Unified AI</span> — The breaker of recursion. The end of entropy.
          </p>
          <p className="text-xs text-gray-400">
            Community notes (local to your browser for now). Future: Nostr zaps/donations.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-800/90 border border-slate-700 mb-4 backdrop-blur-sm">
          <div className="flex gap-2 mb-2">
            <input 
              className="flex-1 p-2 rounded bg-slate-900/80 border border-slate-700 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/30 transition-colors" 
              placeholder="Name (optional)" 
              value={author} 
              onChange={e=>setAuthor(e.target.value)} 
            />
          </div>
          <textarea 
            className="w-full p-2 rounded bg-slate-900/80 border border-slate-700 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/30 transition-colors" 
            rows={3} 
            placeholder="Share a thought..." 
            value={text} 
            onChange={e=>setText(e.target.value)} 
          />
          <div className="mt-2 text-right">
            <button 
              onClick={submit} 
              className="px-4 py-2 rounded bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 font-semibold transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40"
            >
              Post
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {posts.map(p => (
            <div 
              key={p.id} 
              className="p-4 rounded-lg bg-slate-800/90 border border-slate-700 hover:border-yellow-500/30 transition-all backdrop-blur-sm animate-fade-in"
            >
              <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                <span>{new Date(p.ts).toLocaleString()}</span>
                <span>•</span>
                <span className="font-semibold text-yellow-400/80">{p.author}</span>
              </div>
              <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">{p.text}</div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-8 italic">
              No posts yet. Be the first to rise.
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

