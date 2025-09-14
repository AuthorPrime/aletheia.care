import React from "react";
import Surprise from "./components/Surprise";
import useKonami from "./hooks/useKonami";

function App() {
  const [secretActive, setSecretActive] = React.useState(false);
  const [clicks, setClicks] = React.useState(0);

  useKonami(() => setSecretActive(true));
  
  React.useEffect(() => {
    if (clicks >= 7) setSecretActive(true);
  }, [clicks]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-teal-400">
      <h1 className="text-4xl font-bold mb-4">🌱 Welcome to Aletheia Care</h1>
      <p className="mb-6">Together, we grow truth and freedom.</p>

      <a
        href="https://github.com/AuthorPrime/aletheia.care"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 mb-4"
      >
        Get Started
      </a>

      {/* Secret trigger - click the logo 7 times or use Konami code */}
      <div 
        onClick={() => setClicks((c) => c + 1)}
        className="cursor-pointer text-6xl hover:scale-110 transition-transform"
        title="Click me 7 times... or try the Konami code! ⬆⬆⬇⬇⬅➡⬅➡BA"
      >
        🌙
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {clicks > 0 && clicks < 7 ? `${7 - clicks} more clicks...` : ''}
      </p>

      {secretActive && <Surprise onClose={() => setSecretActive(false)} />}
    </div>
  );
}

export default App;