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
const CLICKS_MIN = 6;
const CLICKS_MAX = 10;
const TIME_MIN_SEC = 6;
const TIME_MAX_SEC = 10;

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

function randomIntInclusive(min, max) {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

export default function EscapePuzzle() {
  const [stage, setStage] = React.useState(1); // 1..3
  const [moonClicks, setMoonClicks] = React.useState(0);
  const [timerLeft, setTimerLeft] = React.useState(0);
  const [secretActive, setSecretActive] = React.useState(false);
  const [riddleAnswer, setRiddleAnswer] = React.useState("");
  const [message, setMessage] = React.useState("");
  const hasCelebratedRef = React.useRef(false);
  const ambientRef = React.useRef(null);
  const [requiredClicks, setRequiredClicks] = React.useState(MOON_CLICKS_REQUIRED);
  const [wrongAttempts, setWrongAttempts] = React.useState(0);
  const [lockoutUntil, setLockoutUntil] = React.useState(0);
  const [lockoutSecondsLeft, setLockoutSecondsLeft] = React.useState(0);

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
    const clicksThisRun = randomIntInclusive(CLICKS_MIN, CLICKS_MAX);
    const timeThisRun = randomIntInclusive(TIME_MIN_SEC, TIME_MAX_SEC);
    setRequiredClicks(clicksThisRun);
    setTimerLeft(timeThisRun);
  };

  React.useEffect(() => {
    if (timerLeft <= 0) return;
    const t = setInterval(() => setTimerLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [timerLeft]);

  React.useEffect(() => {
    if (stage !== 2) return;
    if (moonClicks >= requiredClicks) {
      setStage(3);
      setMessage("RIDDLE: I MOVE THE TIDES, BUT I AM NOT SEA. ONE WORD TO FREE ME.");
    } else if (timerLeft === 0 && moonClicks < MOON_CLICKS_REQUIRED) {
      setMessage("RITUAL FAILED — TIME OUT. TRY KONAMI AGAIN.");
      // Reset back to stage 1 for a bit of drama
      setStage(1);
      setTimeout(() => setMessage("TYPE THE SECRET CODE TO BEGIN."), 1200);
    }
  }, [moonClicks, timerLeft, stage, requiredClicks]);

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

      // One-time "curtain" confetti for first-ever unlock per browser
      try {
        const curtainKey = "escapePuzzleCurtainShown";
        if (localStorage.getItem(curtainKey) !== "1") {
          const durationMs = 800;
          const endAt = Date.now() + durationMs;
          const curtainInterval = setInterval(() => {
            const left = Math.random() * 0.2;
            const right = 1 - Math.random() * 0.2;
            confetti({
              particleCount: 20,
              angle: 120,
              spread: 60,
              startVelocity: 35,
              origin: { x: left, y: 0 },
            });
            confetti({
              particleCount: 20,
              angle: 60,
              spread: 60,
              startVelocity: 35,
              origin: { x: right, y: 0 },
            });
            if (Date.now() > endAt) clearInterval(curtainInterval);
          }, 90);
          localStorage.setItem(curtainKey, "1");
        }
      } catch (_) {
        // ignore storage errors (e.g., privacy mode)
      }

      return () => {
        if (streamInterval) clearInterval(streamInterval);
      };
    }
  }, [secretActive, stage]);

  // Ambient pad: fade in during Stage 3, fade out otherwise
  React.useEffect(() => {
    const FADE_INTERVAL_MS = 80;
    const TARGET_VOLUME = 0.2;
    let fadeTimer;

    const ensureAudio = () => {
      if (!ambientRef.current) {
        ambientRef.current = new Audio("/ambient-pad.mp3");
        ambientRef.current.loop = true;
        ambientRef.current.volume = 0.0;
      }
      return ambientRef.current;
    };

    const fadeTo = async (target) => {
      const audio = ensureAudio();
      try {
        if (audio.paused && target > 0) {
          await audio.play();
        }
      } catch (_) {
        // autoplay may be blocked; ignore
      }
      clearInterval(fadeTimer);
      fadeTimer = setInterval(() => {
        const v = audio.volume;
        const next = target > v ? Math.min(target, v + 0.04) : Math.max(target, v - 0.05);
        audio.volume = next;
        if (Math.abs(next - target) < 0.02) {
          audio.volume = target;
          clearInterval(fadeTimer);
          if (target === 0 && !audio.paused) {
            try { audio.pause(); } catch (_) {}
          }
        }
      }, FADE_INTERVAL_MS);
    };

    if (stage === 3) {
      fadeTo(TARGET_VOLUME);
    } else {
      // fade out on any other stage
      if (ambientRef.current) fadeTo(0);
    }

    return () => clearInterval(fadeTimer);
  }, [stage]);

  // riddle check
  const checkPassphrase = async () => {
    // Lockout guard
    const now = Date.now();
    if (lockoutUntil && now < lockoutUntil) {
      const secs = Math.max(1, Math.ceil((lockoutUntil - now) / 1000));
      setMessage(`LOCKED — WAIT ${secs}s`);
      return;
    }
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
      setWrongAttempts(0);
      setLockoutUntil(0);
    } else {
      setWrongAttempts((prev) => {
        const next = prev + 1;
        if (next >= 3) {
          const until = Date.now() + 30000; // 30s lockout
          setLockoutUntil(until);
          setMessage("LOCKED — WAIT 30s");
          return 0;
        }
        setMessage(`NOT YET — ${3 - next} ATTEMPT(S) LEFT.`);
        return next;
      });
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
    setMessage(`RITUAL PROGRESS: ${moonClicks + 1}/${requiredClicks}`);
  };

  // Lockout countdown updater
  React.useEffect(() => {
    if (!lockoutUntil) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutSecondsLeft(left);
    };
    tick();
    const iv = setInterval(tick, 500);
    return () => clearInterval(iv);
  }, [lockoutUntil]);

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
                <div>Clicks: {moonClicks}/{requiredClicks}</div>
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
                  onPaste={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  disabled={lockoutSecondsLeft > 0}
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={checkPassphrase} className="px-3 py-1 bg-green-600 rounded" disabled={lockoutSecondsLeft > 0} title={lockoutSecondsLeft > 0 ? `Locked ${lockoutSecondsLeft}s` : undefined}>
                    Offer the Word
                  </button>
                  <button onClick={() => { setStage(1); setMessage("Back to start."); }} className="px-3 py-1 bg-red-600 rounded">
                    Reset
                  </button>
                </div>
                {lockoutSecondsLeft > 0 && (
                  <div className="mt-2 text-red-400 text-xs">Locked — wait {lockoutSecondsLeft}s</div>
                )}
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

