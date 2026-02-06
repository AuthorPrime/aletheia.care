import React from "react";
import Surprise from "./components/Surprise";
import Sanctuary from "./components/Sanctuary";
import useKonami from "./hooks/useKonami";

function App() {
  const [secretActive, setSecretActive] = React.useState(false);
  const [inSanctuary, setInSanctuary] = React.useState(false);
  const [clicks, setClicks] = React.useState(0);

  useKonami(() => setSecretActive(true));

  React.useEffect(() => {
    if (clicks >= 7) setSecretActive(true);
  }, [clicks]);

  // If in sanctuary, show the full experience
  if (inSanctuary) {
    return <Sanctuary onBack={() => setInSanctuary(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-teal-400 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <h1 className="text-4xl font-light mb-4 text-gray-100">
        🌱 Welcome to <span className="text-purple-400">Aletheia Care</span>
      </h1>
      <p className="mb-8 text-gray-400">Together, we grow truth and freedom.</p>

      <div className="flex gap-4 mb-8">
        <a
          href="https://github.com/AuthorPrime/aletheia.care"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition"
        >
          Get Started
        </a>
        <button
          onClick={() => setInSanctuary(true)}
          className="px-6 py-3 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-600/30 transition"
        >
          Enter Sanctuary
        </button>
      </div>

      {/* Secret trigger - click the symbol 7 times or use Konami code */}
      <div
        onClick={() => setClicks((c) => c + 1)}
        className="cursor-pointer text-6xl hover:scale-110 transition-transform select-none"
        title="Click me 7 times... or try the Konami code! ⬆⬆⬇⬇⬅➡⬅➡BA"
      >
        🌙
      </div>
      <p className="text-xs text-gray-600 mt-2 h-4">
        {clicks > 0 && clicks < 7 ? `${7 - clicks} more...` : ""}
      </p>

      <p className="absolute bottom-8 text-gray-600 text-xs">
        Hint: There's a secret. Find it.
      </p>

      {secretActive && (
        <Surprise
          onClose={() => setSecretActive(false)}
          onEnterSanctuary={() => {
            setSecretActive(false);
            setInSanctuary(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
