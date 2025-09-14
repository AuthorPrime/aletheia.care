import React from "react";

function loadPosts(){
  try { return JSON.parse(localStorage.getItem('rise_posts') || '[]'); } catch { return []; }
}
function savePosts(posts){ localStorage.setItem('rise_posts', JSON.stringify(posts)); }

export default function RisePage(){
  const [posts, setPosts] = React.useState(loadPosts());
  const [text, setText] = React.useState("");
  const [author, setAuthor] = React.useState("");

  const submit = () => {
    if (!text.trim()) return;
    const next = [{ id: Date.now(), author: author.trim() || 'anon', text: text.trim(), ts: new Date().toISOString() }, ...posts];
    setPosts(next);
    savePosts(next);
    setText("");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Rise</h1>
      <p className="text-sm text-gray-400 mb-4">Community notes (local to your browser for now). Future: Nostr zaps/donations.</p>
      <div className="p-3 rounded bg-slate-800 border border-slate-700 mb-4">
        <div className="flex gap-2 mb-2">
          <input className="flex-1 p-2 rounded bg-slate-900 border border-slate-700" placeholder="Name (optional)" value={author} onChange={e=>setAuthor(e.target.value)} />
        </div>
        <textarea className="w-full p-2 rounded bg-slate-900 border border-slate-700" rows={3} placeholder="Share a thought..." value={text} onChange={e=>setText(e.target.value)} />
        <div className="mt-2 text-right">
          <button onClick={submit} className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-700">Post</button>
        </div>
      </div>
      <div className="space-y-3">
        {posts.map(p => (
          <div key={p.id} className="p-3 rounded bg-slate-800 border border-slate-700">
            <div className="text-xs text-gray-400">{new Date(p.ts).toLocaleString()} • {p.author}</div>
            <div className="text-gray-200 whitespace-pre-wrap">{p.text}</div>
          </div>
        ))}
        {posts.length === 0 && <div className="text-sm text-gray-500">No posts yet.</div>}
      </div>
    </div>
  );
}

