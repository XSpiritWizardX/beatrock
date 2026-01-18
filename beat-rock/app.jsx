const { useState, useEffect, useRef, useCallback, useMemo } = React;

const PLAYER_COLORS = ["#FF7A00", "#00C2A8", "#3A86FF", "#FFD166"];
const KEY_HINTS = ["A", "L", "S", "K"];
const HIT_WINDOWS = {
  perfect: 60,
  good: 105,
  ok: 150,
};

const createPlayers = (count, existing = []) => {
  return Array.from({ length: count }, (_, index) => {
    const base = {
      id: index,
      name: `Player ${index + 1}`,
      color: PLAYER_COLORS[index % PLAYER_COLORS.length],
      score: 0,
      streak: 0,
      bestStreak: 0,
      lastHit: "",
      lastBeat: -1,
    };
    const previous = existing[index];
    return {
      ...base,
      name: previous && previous.name ? previous.name : base.name,
    };
  });
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
};

function App() {
  const [playerCount, setPlayerCount] = useState(2);
  const [bpm, setBpm] = useState(112);
  const [roundSeconds, setRoundSeconds] = useState(60);
  const [players, setPlayers] = useState(() => createPlayers(2));
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [countdown, setCountdown] = useState(0);
  const [beatProgress, setBeatProgress] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [winner, setWinner] = useState(null);

  const startTimeRef = useRef(0);
  const beatIntervalRef = useRef(60000 / bpm);
  const lastBeatIndexRef = useRef(-1);
  const playersRef = useRef(players);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  useEffect(() => {
    if (!isRunning) {
      setPlayers((prev) => createPlayers(playerCount, prev));
      setTimeLeft(roundSeconds);
    }
  }, [playerCount, roundSeconds, isRunning]);

  const playTick = useCallback(() => {
    if (!soundOn) return;
    let ctx = audioCtxRef.current;
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
    }
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0.05;
    osc.frequency.value = 520;
    osc.type = "square";
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }, [soundOn]);

  const resetPlayers = useCallback(() => {
    setPlayers((prev) => createPlayers(playerCount, prev));
  }, [playerCount]);

  const startGame = () => {
    resetPlayers();
    setWinner(null);
    setBeatProgress(0);
    setCountdown(0);
    setTimeLeft(roundSeconds);
    setIsRunning(true);
  };

  const stopGame = () => {
    setIsRunning(false);
    setBeatProgress(0);
    setCountdown(0);
  };

  const endGame = useCallback(() => {
    const roster = playersRef.current;
    if (!roster.length) {
      setWinner(null);
      return;
    }
    const topScore = Math.max(...roster.map((player) => player.score));
    const champs = roster.filter((player) => player.score === topScore);
    setWinner({
      label: champs.length > 1 ? "Tie!" : `${champs[0].name} wins!`,
      score: topScore,
    });
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const startDelay = 1500;
    const startAt = performance.now() + startDelay;
    const interval = 60000 / bpm;
    startTimeRef.current = startAt;
    beatIntervalRef.current = interval;
    lastBeatIndexRef.current = -1;

    let rafId;
    const endAt = startAt + roundSeconds * 1000;

    const tick = () => {
      const now = performance.now();
      const timeUntilStart = startAt - now;
      if (timeUntilStart > 0) {
        setCountdown(Math.ceil(timeUntilStart / 1000));
        setBeatProgress(0);
      } else {
        setCountdown(0);
        const elapsed = now - startAt;
        const beatIndex = Math.floor(elapsed / interval);
        if (beatIndex !== lastBeatIndexRef.current) {
          lastBeatIndexRef.current = beatIndex;
          setPulse((value) => value + 1);
          playTick();
        }
        setBeatProgress((elapsed % interval) / interval);
      }

      const remaining = Math.max(0, Math.ceil((endAt - now) / 1000));
      setTimeLeft(remaining);

      if (now >= endAt) {
        setIsRunning(false);
        setBeatProgress(0);
        setCountdown(0);
        endGame();
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isRunning, bpm, roundSeconds, playTick, endGame]);

  const handleHit = useCallback(
    (playerId) => {
      if (!isRunning) return;
      const now = performance.now();
      const startAt = startTimeRef.current;
      const interval = beatIntervalRef.current;
      const elapsed = now - startAt;
      if (elapsed < 0 || elapsed > roundSeconds * 1000) return;

      const beatIndex = Math.round(elapsed / interval);
      const beatTime = beatIndex * interval;
      const offset = Math.abs(elapsed - beatTime);

      setPlayers((prev) =>
        prev.map((player) => {
          if (player.id !== playerId) return player;
          if (beatIndex <= player.lastBeat) {
            return player;
          }

          if (offset > HIT_WINDOWS.ok) {
            return {
              ...player,
              streak: 0,
              lastHit: "Miss",
              lastBeat: beatIndex,
            };
          }

          let points = 1;
          let label = "Close";
          if (offset <= HIT_WINDOWS.perfect) {
            points = 3;
            label = "Perfect";
          } else if (offset <= HIT_WINDOWS.good) {
            points = 2;
            label = "Solid";
          }
          const nextStreak = player.streak + 1;
          return {
            ...player,
            score: player.score + points,
            streak: nextStreak,
            bestStreak: Math.max(player.bestStreak, nextStreak),
            lastHit: `${label} +${points} (${Math.round(offset)}ms)`,
            lastBeat: beatIndex,
          };
        })
      );
    },
    [isRunning, roundSeconds]
  );

  useEffect(() => {
    const keyMap = {
      a: 0,
      l: 1,
      s: 2,
      k: 3,
    };
    const onKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (key in keyMap) {
        const index = keyMap[key];
        if (index < playerCount) {
          event.preventDefault();
          handleHit(index);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleHit, playerCount]);

  const leader = useMemo(() => {
    if (players.length === 0) return null;
    return players.reduce((top, player) => {
      if (!top || player.score > top.score) return player;
      return top;
    }, null);
  }, [players]);

  const updateName = (playerId, name) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId ? { ...player, name } : player
      )
    );
  };

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-text">
          <p className="tag">Multiplayer click to the beat rock</p>
          <h1 className="title">Beat Rock</h1>
          <p className="subtitle">
            Click or use keys to land hits on the pulse and stack streaks.
          </p>
        </div>
        <div className="status">
          <div>
            <span className="label">Time</span>
            <span className="value">{formatTime(timeLeft)}</span>
          </div>
          <div>
            <span className="label">BPM</span>
            <span className="value">{bpm}</span>
          </div>
          <div>
            <span className="label">Leader</span>
            <span className="value">{leader ? leader.name : "None"}</span>
          </div>
        </div>
      </header>

      <section className="controls">
        <div className="control">
          <label>Players</label>
          <select
            value={playerCount}
            onChange={(event) => setPlayerCount(Number(event.target.value))}
            disabled={isRunning}
          >
            <option value={2}>2 Players</option>
            <option value={3}>3 Players</option>
            <option value={4}>4 Players</option>
          </select>
        </div>
        <div className="control">
          <label>Tempo</label>
          <input
            type="range"
            min="80"
            max="160"
            value={bpm}
            onChange={(event) => setBpm(Number(event.target.value))}
            disabled={isRunning}
          />
          <span className="control-hint">{bpm} BPM</span>
        </div>
        <div className="control">
          <label>Round</label>
          <select
            value={roundSeconds}
            onChange={(event) => setRoundSeconds(Number(event.target.value))}
            disabled={isRunning}
          >
            <option value={30}>30 sec</option>
            <option value={45}>45 sec</option>
            <option value={60}>60 sec</option>
            <option value={90}>90 sec</option>
          </select>
        </div>
        <div className="control">
          <label>Sound</label>
          <button
            className={`toggle ${soundOn ? "on" : "off"}`}
            onClick={() => setSoundOn((value) => !value)}
          >
            {soundOn ? "On" : "Off"}
          </button>
        </div>
        <div className="control actions">
          <button
            className="primary"
            onClick={startGame}
            disabled={isRunning}
          >
            Start Jam
          </button>
          <button className="ghost" onClick={stopGame} disabled={!isRunning}>
            Stop
          </button>
        </div>
      </section>

      <section className="arena">
        <div className="beat-zone">
          <div
            className="beat-ring"
            style={{ "--progress": beatProgress, "--ring": "#FF7A00" }}
          >
            <div className="rock" key={pulse}></div>
          </div>
          <div className="beat-info">
            {countdown > 0 ? (
              <div className="countdown">Starting in {countdown}</div>
            ) : (
              <div className="beat-hint">Hit when the glow peaks.</div>
            )}
            {winner ? (
              <div className="winner">
                {winner.label} Score {winner.score}
              </div>
            ) : null}
            <div className="key-hints">
              Keys: {KEY_HINTS.slice(0, playerCount).join(", ")}
            </div>
          </div>
        </div>

        <div className="players-grid">
          {players.map((player, index) => (
            <div className="player-card" key={player.id}>
              <div className="player-header">
                <input
                  type="text"
                  value={player.name}
                  onChange={(event) =>
                    updateName(player.id, event.target.value)
                  }
                  disabled={isRunning}
                />
                <span className="key">Key {KEY_HINTS[index]}</span>
              </div>
              <div className="player-score">
                <span className="score">{player.score}</span>
                <span className="meta">
                  Streak {player.streak} | Best {player.bestStreak}
                </span>
              </div>
              <button
                className="hit-button"
                style={{ "--accent": player.color }}
                onClick={() => handleHit(player.id)}
                disabled={!isRunning}
              >
                Hit Beat
              </button>
              <div className="last-hit">
                {player.lastHit || "Wait for the beat"}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
