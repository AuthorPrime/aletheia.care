import React from "react";

export default function Surprise({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-xl max-w-lg w-full text-gray-100 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">🚀 ALETHEIA CONTROL PANEL</h2>
        <p className="mb-4 text-gray-300">
          Your secret portal to watch over the project's deployments.
        </p>

        <div className="space-y-3">
          <a
            href="https://github.com/AuthorPrime/aletheia.care"
            target="_blank"
            rel="noreferrer"
            className="block px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 text-center"
          >
            🌙 GitHub Repository
          </a>
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="block px-4 py-2 bg-teal-600 rounded hover:bg-teal-700 text-center"
          >
            🚀 Vercel Dashboard
          </a>
          <a
            href="https://aletheia-care.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="block px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 text-center"
          >
            🌐 Live Site
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-red-500 rounded hover:bg-red-600 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}
