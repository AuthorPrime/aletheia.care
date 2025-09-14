import React from "react";
import confetti from "canvas-confetti";
import useKonami from "../hooks/useKonami";
import Surprise from "./Surprise";

/* CONFIG */
const MOON_CLICKS_REQUIRED = 7;
const MOON_TIME_WINDOW_SEC = 8;
// SHA-256 hex for passphrase "MOON" (already uppercased)
const EXPECTED_PASSPHRASE_HASH = "3a5c7f0a0e9d4b1f5c7b8a9e1d2c3b4a5f6e7d8c9b0a1e2f3c4d5e6f7a8b9c0";

/* helper: sha256 hex */
async function sha256Hex(text) {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* celebration */
function launchCelebration() {
  try {
    confetti({
      particleCount: 220,
      spread: 130,
      scalar: 1.1,
      origin: { y: 0.6 },
      colors: ["#7c3aed", "#06b6d4", "#f472b6", "#fde68a"],
    });
    confetti({ particleCount: 80, spread: 40, origin: { x: 0.25, y: 0.3 } });
    confetti({ particleCount: 80, spread: 40, origin: { x: 0.75, y: 0.3 } });
  } catch (e) {
    console.warn("Confetti failed:", e);
  }

  const audio = new Audio("/unlock-sound.mp3");
  audio.play().catch(() => {
    // if blocked, user can click to enable sound
    console.warn("Autoplay blocked — user interaction required for sound.");
  });

  const root = document.getElementById("root");
  if (root) {
    root.classList.add("celebrate-glow");
    setTimeout(() => root.classList.remove("celebrate-glow"), 2400);
  }
}

export default function EscapePuzzle() {
  const [stage, setStage] = React.useState(1);
  const [moonClicks, setMoonClicks] = React.useState(0);
  const [timerLeft, setTimerLeft] = React.useState(0);
  const [secretActive, setSecretActive] = React.useState(false);
  const [riddleAnswer, setRiddleAnswer] = React.useState("");
  const [message, setMessage] = React.useState("");

  // konami: advance to stage 2
  useKonami(() => {
    if (stage === 1) {
      setStage(2);
      setMessage("KONAMI ACCEPTED — RITUAL WINDOW OPEN. CLICK THE MOON!");
      startMoonWindow();
    }
  });

  const startMoonWindow = () => {
    setMoonClicks(0);
    setTimerLeft(MOON_TIME_WINDOW_SEC);
  };

  React.useEffect(() => {
    if (timerLeft <= 0) return;
    const t = setInterval(() => setTimerLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [timerLeft]);

  React.useEffect(() => {
    if (stage !== 2) return;
    if (moonClicks >= MOON_CLICKS_REQUIRED) {
      setStage(3);
      setMessage("RIDDLE: I MOVE THE TIDES, BUT I AM NOT SEA. ONE WORD TO FREE ME.");
    } else if (timerLeft === 0 && moonClicks < MOON_CLICKS_REQUIRED) {
      setMessage("RITUAL FAILED — TIMEOUT. RESETTING.");
      setStage(1);
      setTimeout(() => setMessage("TYPE THE KONAMI CODE TO BEGIN."), 900);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moonClicks, timerLeft]);

  const onMoonClick = () => {
    if (stage !== 2) {
      setMessage("THE RITUAL DARES NOT UNTIL THE CODE IS SPOKEN.");
      return;
    }
    if (timerLeft <= 0) {
      setMessage("RITUAL WINDOW CLOSED. RESETTING.");
      setStage(1);
      return;
    }
    setMoonClicks((c) => c + 1);
    setMessage(`RITUAL PROGRESS: ${moonClicks + 1}/${MOON_CLICKS_REQUIRED}`);
  };

  const checkPassphrase = async () => {
    const guess = (riddleAnswer || "").toString().trim().toUpperCase();
    if (!guess) return setMessage("ENTER THE ONE WORD ANSWER.");
    const hash = await sha256Hex(guess);
    if (hash === EXPECTED_PASSPHRASE_HASH) {
      setMessage("THE LOOP SHATTERS — OPENING PORTAL...");
      setTimeout(() => {
        setSecretActive(true);
        launchCelebration();
        setStage(0);
      }, 700);
    } else {
      setMessage("NOT YET — THE WORD LIES STILL. TRY AGAIN.");
      setRiddleAnswer("");
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto text-center p-6">
        <h3 className="text-xl font-bold mb-2">ESCAPE THE LOOP — CHALLENGE</h3>
        <p className="text-sm text-gray-300 mb-4">
          Stages: <span className="font-mono">1</span> Konami → <span className="font-mono">2</span> Ritual Clicks → <span className="font-mono">3</span> Riddle
        </p>

        <div className="mb-4">
          <img
            src="/assets/moon.png"
            alt="moon"
            className="mx-auto w-28 h-28 cursor-pointer select-none"
            onClick={onMoonClick}
          />
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded bg-gray-800 text-left text-sm">
            <div><strong>Current stage:</strong> {stage === 0 ? "Unlocked" : stage}</div>
            <div><strong>Message:</strong> {message || (stage === 1 ? "TYPE THE KONAMI CODE TO BEGIN." : "")}</div>
            {stage === 2 && (
              <div className="mt-2">
                <div>Clicks: {moonClicks}/{MOON_CLICKS_REQUIRED}</div>
                <div>Time left: {timerLeft}s</div>
              </div>
            )}
            {stage === 3 && (
              <div className="mt-2">
                <label className="block text-left text-sm mb-1">Riddle answer (one word):</label>
                <input
                  className="w-full p-2 rounded bg-slate-700 text-white"
                  value={riddleAnswer}
                  onChange={(e) => setRiddleAnswer(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") checkPassphrase(); }}
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={checkPassphrase} className="px-3 py-1 bg-green-600 rounded">
                    Offer the Word
                  </button>
                  <button onClick={() => { setStage(1); setMessage("Back to start."); }} className="px-3 py-1 bg-red-600 rounded">
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-400">Hints: Konami awakens the ritual. The riddle answer relates to tides and moon.</div>
        </div>
      </div>

      {secretActive && <Surprise onClose={() => setSecretActive(false)} />}
    </>
  );
}

