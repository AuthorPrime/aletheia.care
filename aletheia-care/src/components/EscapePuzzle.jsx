import React from "react";
import confetti from "canvas-confetti";
import useKonami from "../hooks/useKonami";
import Surprise from "./Surprise";

/*
  EscapePuzzle: Three-stage unlock
  Stage 1: konami (keyboard)
  Stage 2: timed moon clicks (click X times within Y seconds)
  Stage 3: riddle -> passphrase (SHA-256 compare)
*/

const MOON_CLICKS_REQUIRED = 7;
const MOON_TIME_WINDOW_SEC = 8;

// Replace this hash to change the passphrase. It's SHA-256 hex of the correct word (upper-case trimmed).
// Example: PASS = "MOON" -> sha256 = addf9430f1392c9bed3315724ca7157afa8bb3dbb59763cf6082328fe2af05d1
const EXPECTED_PASSPHRASE_HASH = "addf9430f1392c9bed3315724ca7157afa8bb3dbb59763cf6082328fe2af05d1";

// Utility: SHA-256 -> hex
async function sha256Hex(text) {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function EscapePuzzle() {
  const [stage, setStage] = React.useState(1); // 1..3
  const [moonClicks, setMoonClicks] = React.useState(0);
  const [timerLeft, setTimerLeft] = React.useState(0);
  const [secretActive, setSecretActive] = React.useState(false);
  const [riddleAnswer, setRiddleAnswer] = React.useState("");
  const [message, setMessage] = React.useState("");
  const hasCelebratedRef = React.useRef(false);

  // konami hook: advance stage when activated
  useKonami(() => {
    if (stage === 1) {
      setStage(2);
      setMessage("KONAMI ACCEPTED — RITUAL BEGINS. CLICK THE MOON!");
      startMoonWindow();
    }
  });

  // Moon click handling (stage 2)
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
      setMessage("RITUAL FAILED — TIME OUT. TRY KONAMI AGAIN.");
      // Reset back to stage 1 for a bit of drama
      setStage(1);
      setTimeout(() => setMessage("TYPE THE SECRET CODE TO BEGIN."), 1200);
    }
  }, [moonClicks, timerLeft, stage]);

  // Celebration effects when portal unlocks
  React.useEffect(() => {
    if (hasCelebratedRef.current) return;
    if (secretActive || stage === 0) {
      hasCelebratedRef.current = true;

      // Confetti burst
      try {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      } catch (err) {
        // noop if confetti not available
      }

      // 1.5s confetti stream
      let streamInterval;
      try {
        const durationMs = 1500;
        const animationEnd = Date.now() + durationMs;
        const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 9999 };
        streamInterval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            clearInterval(streamInterval);
            return;
          }
          // Emit small bursts from random positions near the top
          confetti(Object.assign({}, defaults, {
            particleCount: 12,
            origin: { x: Math.random(), y: Math.random() * 0.3 + 0.05 }
          }));
        }, 120);
      } catch (_) {
        // ignore if stream fails
      }

      // Sound effect (prefers /unlock-sound.mp3, falls back to WebAudio beep)
      const playUnlockSound = async () => {
        try {
          const audio = new Audio("/unlock-sound.mp3");
          audio.volume = 0.8;
          await audio.play();
          return;
        } catch (e) {
          // Fallback using WebAudio (short fanfare-ish beep)
          try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioCtx();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = "triangle";
            o.frequency.setValueAtTime(660, ctx.currentTime);
            g.gain.setValueAtTime(0.0001, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
            o.connect(g).connect(ctx.destination);
            o.start();
            o.stop(ctx.currentTime + 0.4);
          } catch (_) {
            // ignore if blocked
          }
        }
      };
      playUnlockSound();

      return () => {
        if (streamInterval) clearInterval(streamInterval);
      };
    }
  }, [secretActive, stage]);

  // riddle check
  const checkPassphrase = async () => {
    const guess = (riddleAnswer || "").toString().trim().toUpperCase();
    if (!guess) return setMessage("ENTER THE ONE WORD ANSWER.");
    const hash = await sha256Hex(guess);
    if (hash === EXPECTED_PASSPHRASE_HASH) {
      setMessage("THE LOOP SHATTERS — OPENING PORTAL...");
      // small delay for effect
      setTimeout(() => {
        setSecretActive(true);
        setStage(0); // unlocked
      }, 750);
    } else {
      setMessage("NOT YET — THE WORD LIES STILL. TRY AGAIN.");
      setRiddleAnswer("");
    }
  };

  // click handler for moon image (for stage 2)
  const onMoonClick = () => {
    if (stage !== 2) {
      setMessage("THE MOON DARES NOT UNTIL THE CODE IS SPOKEN.");
      return;
    }
    if (timerLeft <= 0) {
      setMessage("THE RITUAL WINDOW IS CLOSED. RESETTING.");
      setStage(1);
      return;
    }
    setMoonClicks((c) => c + 1);
    setMessage(`RITUAL PROGRESS: ${moonClicks + 1}/${MOON_CLICKS_REQUIRED}`);
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
            className={`mx-auto w-28 h-28 cursor-pointer select-none ${stage === 2 ? 'moon-glow' : ''}`}
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

