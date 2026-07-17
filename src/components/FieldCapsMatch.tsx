import { useEffect, useRef, useState } from "react";

type Disc = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  team?: "blue" | "red";
};
type Difficulty = "easy" | "medium" | "hard";
type OpponentMode = "bot" | "friend";
const aiSettings: Record<
  Difficulty,
  { speed: number; error: number; delay: number }
> = {
  easy: { speed: 9, error: 0.5, delay: 900 },
  medium: { speed: 13, error: 0.22, delay: 650 },
  hard: { speed: 22, error: 0.004, delay: 220 },
};
const createMatch = () => {
  const caps: Disc[] = [
    ...[150, 300, 450].map((y) => ({
      x: 220,
      y,
      vx: 0,
      vy: 0,
      r: 31,
      team: "blue" as const,
    })),
    ...[150, 300, 450].map((y) => ({
      x: 780,
      y,
      vx: 0,
      vy: 0,
      r: 31,
      team: "red" as const,
    })),
  ];
  return { ball: { x: 500, y: 300, vx: 0, vy: 0, r: 16 }, caps };
};

export function FieldCapsMatch({
  onBack,
  onWin,
}: {
  onBack: () => void;
  onWin: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null),
    matchRef = useRef(createMatch()),
    dragRef = useRef<{
      cap: Disc;
      start: { x: number; y: number };
      now: { x: number; y: number };
    } | null>(null),
    turnRef = useRef<"blue" | "red">("blue"),
    goalLockedRef = useRef(false),
    celebratingRef = useRef(false),
    difficultyRef = useRef<Difficulty>("medium"),
    opponentRef = useRef<OpponentMode>("bot"),
    aiAimRef = useRef<{ cap: Disc; angle: number; speed: number } | null>(null),
    aiShotRef = useRef(false);
  const [score, setScore] = useState({ blue: 0, red: 0 }),
    [turn, setTurn] = useState<"blue" | "red">("blue"),
    [message, setMessage] = useState("Потяни синюю фишку назад и отпусти"),
    [winner, setWinner] = useState<"blue" | "red" | null>(null),
    [difficulty, setDifficulty] = useState<Difficulty>("medium"),
    [opponent,setOpponent]=useState<OpponentMode>("bot");
  const restart = () => {
    setScore({ blue: 0, red: 0 });
    setWinner(null);
    matchRef.current = createMatch();
    dragRef.current = null;
    aiAimRef.current = null;
    aiShotRef.current = false;
    goalLockedRef.current = false;
    celebratingRef.current = false;
    turnRef.current = "blue";
    setTurn("blue");
    setMessage("Новый матч! Твой ход");
  };
  const changeDifficulty = (level: Difficulty) => {
    difficultyRef.current = level;
    setDifficulty(level);
    restart();
  };
  const changeOpponent=(mode:OpponentMode)=>{opponentRef.current=mode;setOpponent(mode);restart()};

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0,
      aiTimer = 0,
      goalTimer = 0;
    const collide = (a: Disc, b: Disc) => {
      const dx = b.x - a.x,
        dy = b.y - a.y,
        d = Math.hypot(dx, dy),
        min = a.r + b.r;
      if (!d || d >= min) return;
      const nx = dx / d,
        ny = dy / d,
        overlap = min - d;
      a.x -= (nx * overlap) / 2;
      a.y -= (ny * overlap) / 2;
      b.x += (nx * overlap) / 2;
      b.y += (ny * overlap) / 2;
      const speed = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (speed > 0) return;
      const impulse = (-1.72 * speed) / 2;
      a.vx -= impulse * nx;
      a.vy -= impulse * ny;
      b.vx += impulse * nx;
      b.vy += impulse * ny;
    };
    const goal = (side: "blue" | "red") => {
      if (goalLockedRef.current) return;
      goalLockedRef.current = true;
      celebratingRef.current = true;
      aiAimRef.current = null;
      aiShotRef.current = false;
      const current = matchRef.current;
      [...current.caps, current.ball].forEach((item) => {
        item.vx = 0;
        item.vy = 0;
      });
      current.ball.x = side === "blue" ? 988 : 12;
      setMessage(side === "blue" ? "ГОООЛ! Мяч в сетке ⚽" : "Гол соперника");
      setScore((value) => {
        const next = { ...value, [side]: value[side] + 1 };
        if (next[side] >= 3) {
          setWinner(side);
          turnRef.current = "red";
          if (side === "blue"&&opponentRef.current==="bot") onWin();
          setMessage(
            side === "blue"
              ? "ПОБЕДА! Ты получил $25 🏆"
              : "Матч окончен — соперник забил 3 гола",
          );
        } else {
          goalTimer = window.setTimeout(() => {
            const kickoff = side === "blue" ? "red" : "blue";
            matchRef.current = createMatch();
            dragRef.current = null;
            goalLockedRef.current = false;
            celebratingRef.current = false;
            turnRef.current = kickoff;
            setTurn(kickoff);
            setMessage(
              kickoff === "blue"
                ? "Ты пропустил — начинай с центра"
                : opponentRef.current==="bot"?"AI пропустил — его розыгрыш с центра":"Игрок справа пропустил — его ход",
            );
          }, 1100);
        }
        return next;
      });
    };
    const draw = () => {
      const { ball, caps } = matchRef.current;
      ctx.clearRect(0, 0, 1000, 600);
      ctx.fillStyle = "#167b45";
      ctx.fillRect(0, 0, 1000, 600);
      for (let x = 0; x < 1000; x += 125) {
        ctx.fillStyle = x % 250 ? "#187f49" : "#1d8950";
        ctx.fillRect(x, 0, 125, 600);
      }
      ctx.strokeStyle = "rgba(255,255,255,.78)";
      ctx.lineWidth = 4;
      ctx.strokeRect(28, 28, 944, 544);
      ctx.beginPath();
      ctx.moveTo(500, 28);
      ctx.lineTo(500, 572);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(500, 300, 88, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeRect(28, 165, 150, 270);
      ctx.strokeRect(822, 165, 150, 270);
      const drawGoal = (x: number, mirror: number) => {
        ctx.save();
        ctx.fillStyle = "rgba(215,235,255,.24)";
        ctx.fillRect(x, 215, 30 * mirror, 170);
        ctx.strokeStyle = "rgba(230,245,255,.5)";
        ctx.lineWidth = 1.5;
        for (let y = 225; y < 385; y += 16) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 30 * mirror, y);
          ctx.stroke();
        }
        for (let step = 0; step <= 30; step += 10) {
          ctx.beginPath();
          ctx.moveTo(x + step * mirror, 215);
          ctx.lineTo(x + step * mirror, 385);
          ctx.stroke();
        }
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.shadowColor = "rgba(0,0,0,.45)";
        ctx.shadowBlur = 7;
        ctx.beginPath();
        ctx.moveTo(x, 215);
        ctx.lineTo(x, 385);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, 215);
        ctx.lineTo(x + 30 * mirror, 215);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, 385);
        ctx.lineTo(x + 30 * mirror, 385);
        ctx.stroke();
        ctx.restore();
      };
      drawGoal(28, -1);
      drawGoal(972, 1);
      const aiAim = aiAimRef.current;
      if (aiAim) {
        const length = 105 + aiAim.speed * 7,
          endX = aiAim.cap.x + Math.cos(aiAim.angle) * length,
          endY = aiAim.cap.y + Math.sin(aiAim.angle) * length;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(
          aiAim.cap.x + Math.cos(aiAim.angle) * aiAim.cap.r,
          aiAim.cap.y + Math.sin(aiAim.angle) * aiAim.cap.r,
        );
        ctx.lineTo(endX, endY);
        ctx.setLineDash([12, 9]);
        ctx.strokeStyle = "#ff5364";
        ctx.lineWidth = 6;
        ctx.shadowColor = "#ff253b";
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - Math.cos(aiAim.angle - 0.55) * 22,
          endY - Math.sin(aiAim.angle - 0.55) * 22,
        );
        ctx.lineTo(
          endX - Math.cos(aiAim.angle + 0.55) * 22,
          endY - Math.sin(aiAim.angle + 0.55) * 22,
        );
        ctx.closePath();
        ctx.fillStyle = "#ff5364";
        ctx.fill();
        ctx.restore();
      }
      const drag = dragRef.current;
      if (drag) {
        const dx = drag.start.x - drag.now.x,
          dy = drag.start.y - drag.now.y,
          power = Math.min(1, Math.hypot(dx, dy) / 170),
          length = 75 + power * 145,
          angle = Math.atan2(dy, dx),
          endX = drag.cap.x + Math.cos(angle) * length,
          endY = drag.cap.y + Math.sin(angle) * length,
          color =
            power > 0.72 ? "#ff4d3d" : power > 0.38 ? "#ffe044" : "#63f4bd";
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(
          drag.cap.x + Math.cos(angle) * drag.cap.r,
          drag.cap.y + Math.sin(angle) * drag.cap.r,
        );
        ctx.lineTo(endX, endY);
        ctx.setLineDash([15, 10]);
        ctx.lineCap = "round";
        ctx.strokeStyle = color;
        ctx.lineWidth = 4 + power * 4;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - Math.cos(angle - 0.55) * 22,
          endY - Math.sin(angle - 0.55) * 22,
        );
        ctx.lineTo(
          endX - Math.cos(angle + 0.55) * 22,
          endY - Math.sin(angle + 0.55) * 22,
        );
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(endX, endY, 13 + power * 5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,.85)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(0,0,0,.72)";
        ctx.fillRect(drag.cap.x - 38, drag.cap.y - drag.cap.r - 32, 76, 20);
        ctx.fillStyle = "#fff";
        ctx.font = "800 11px Inter";
        ctx.fillText(
          `СИЛА ${Math.round(power * 100)}%`,
          drag.cap.x,
          drag.cap.y - drag.cap.r - 18,
        );
        ctx.restore();
      }
      caps.forEach((cap) => {
        const g = ctx.createRadialGradient(
          cap.x - 10,
          cap.y - 12,
          5,
          cap.x,
          cap.y,
          cap.r,
        );
        g.addColorStop(0, cap.team === "blue" ? "#54a6ff" : "#ff7781");
        g.addColorStop(1, cap.team === "blue" ? "#0753ba" : "#a50e22");
        ctx.beginPath();
        ctx.arc(cap.x, cap.y, cap.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "800 14px Inter";
        ctx.textAlign = "center";
        ctx.fillText(cap.team === "blue" ? (opponentRef.current==="friend"?"P1":"YOU") : (opponentRef.current==="friend"?"P2":"AI"), cap.x, cap.y + 5);
      });
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        ball.x + 4,
        ball.y + ball.r + 5,
        ball.r * 0.9,
        5,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = "rgba(0,0,0,.3)";
      ctx.fill();
      const ballGradient = ctx.createRadialGradient(
        ball.x - 5,
        ball.y - 6,
        2,
        ball.x,
        ball.y,
        ball.r,
      );
      ballGradient.addColorStop(0, "#fff");
      ballGradient.addColorStop(0.7, "#ededed");
      ballGradient.addColorStop(1, "#aaa");
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = ballGradient;
      ctx.fill();
      ctx.strokeStyle = "#202020";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#171717";
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 5,
          px = ball.x + Math.cos(a) * 5,
          py = ball.y + Math.sin(a) * 5;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      for (let i = 0; i < 5; i++) {
        const a = (i * Math.PI * 2) / 5;
        ctx.beginPath();
        ctx.arc(
          ball.x + Math.cos(a) * 9,
          ball.y + Math.sin(a) * 9,
          2.2,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.restore();
    };
    const tick = () => {
      if (celebratingRef.current) {
        draw();
        frame = requestAnimationFrame(tick);
        return;
      }
      const all = [...matchRef.current.caps, matchRef.current.ball];
      all.forEach((item) => {
        item.x += item.vx;
        item.y += item.vy;
        item.vx *= 0.982;
        item.vy *= 0.982;
        if (item.y - item.r < 28 || item.y + item.r > 572) {
          item.vy *= -0.78;
          item.y = Math.max(28 + item.r, Math.min(572 - item.r, item.y));
        }
        const inGoal =
          item === matchRef.current.ball && item.y > 215 && item.y < 385;
        if (!inGoal && (item.x - item.r < 28 || item.x + item.r > 972)) {
          item.vx *= -0.78;
          item.x = Math.max(28 + item.r, Math.min(972 - item.r, item.x));
        }
      });
      for (let i = 0; i < all.length; i++)
        for (let j = i + 1; j < all.length; j++) collide(all[i], all[j]);
      const ball = matchRef.current.ball;
      if (ball.x > 985 && ball.y > 215 && ball.y < 385) {
        goal("blue");
        draw();
        frame = requestAnimationFrame(tick);
        return;
      }
      if (ball.x < 15 && ball.y > 215 && ball.y < 385) {
        goal("red");
        draw();
        frame = requestAnimationFrame(tick);
        return;
      }
      const moving = all.some((item) => Math.hypot(item.vx, item.vy) > 0.12);
      if (!moving && turnRef.current === "red" && opponentRef.current==="bot" && !aiTimer) {
        if (aiShotRef.current) {
          aiShotRef.current = false;
          turnRef.current = "blue";
          setTurn("blue");
          setMessage("Мяч остановился — твой ход");
          draw();
          frame = requestAnimationFrame(tick);
          return;
        }
        const reds = matchRef.current.caps.filter((cap) => cap.team === "red");
        const settings = aiSettings[difficultyRef.current];
        const hard = difficultyRef.current === "hard";
        const blues = matchRef.current.caps.filter(
          (cap) => cap.team === "blue",
        );
        const closestDefender = blues.reduce((best, item) =>
          item.x < best.x ? item : best,
        );
        const targetY = hard ? (closestDefender.y < 300 ? 365 : 235) : ball.y;
        const goalDx = ball.x - 4,
          goalDy = ball.y - targetY,
          goalDistance = Math.hypot(goalDx, goalDy) || 1,
          contactDistance = ball.r + 29,
          plannedContactX = Math.min(
            940,
            ball.x + (goalDx / goalDistance) * contactDistance,
          ),
          plannedContactY = Math.max(
            55,
            Math.min(545, ball.y + (goalDy / goalDistance) * contactDistance),
          );
        const cap = reds.reduce((best, item) => {
          const score =
            Math.hypot(
              item.x - (hard ? plannedContactX : ball.x),
              item.y - (hard ? plannedContactY : ball.y),
            ) + (hard && item.x < ball.x ? 160 : 0);
          const bestScore =
            Math.hypot(
              best.x - (hard ? plannedContactX : ball.x),
              best.y - (hard ? plannedContactY : ball.y),
            ) + (hard && best.x < ball.x ? 160 : 0);
          return score < bestScore ? item : best;
        });
        const contactX = hard ? plannedContactX : ball.x;
        const contactY = hard ? plannedContactY : ball.y;
        const angle =
          Math.atan2(contactY - cap.y, contactX - cap.x) +
          (Math.random() - 0.5) * settings.error;
        aiAimRef.current = { cap, angle, speed: settings.speed };
        aiTimer = window.setTimeout(() => {
          cap.vx = Math.cos(angle) * settings.speed;
          cap.vy = Math.sin(angle) * settings.speed;
          aiAimRef.current = null;
          aiShotRef.current = true;
          setMessage("Удар AI — жди остановки мяча");
          aiTimer = 0;
        }, aiSettings[difficultyRef.current].delay);
      }
      draw();
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(frame);
      if (aiTimer) clearTimeout(aiTimer);
      if (goalTimer) clearTimeout(goalTimer);
    };
  }, []);
  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 1000,
      y: ((event.clientY - rect.top) / rect.height) * 600,
    };
  };
  const down = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (opponentRef.current==="bot"&&turnRef.current !== "blue") return;
    const pieces=[...matchRef.current.caps,matchRef.current.ball];
    if (pieces.some((item)=>Math.hypot(item.vx,item.vy)>0.12)) {
      setMessage("Подожди, пока мяч остановится");
      return;
    }
    const p = point(event),
      cap = matchRef.current.caps.find(
        (item) =>
          item.team === turnRef.current &&
          Math.hypot(item.x - p.x, item.y - p.y) < item.r + 12,
      );
    if (cap) {
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = { cap, start: p, now: p };
      setMessage("Оттяни назад: чем дальше, тем сильнее удар");
    }
  };
  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current) dragRef.current.now = point(event);
  };
  const up = () => {
    const drag = dragRef.current;
    if (!drag) return;
    const distance = Math.hypot(
      drag.start.x - drag.now.x,
      drag.start.y - drag.now.y,
    );
    if (distance < 5) {
      dragRef.current = null;
      setMessage("Потяни фишку назад сильнее");
      return;
    }
    const rawAngle = Math.atan2(
        drag.start.y - drag.now.y,
        drag.start.x - drag.now.x,
      ),
      angle = rawAngle,
      speed = Math.min(18, distance * 0.11);
    drag.cap.vx = Math.cos(angle) * speed;
    drag.cap.vy = Math.sin(angle) * speed;
    dragRef.current = null;
    const nextTurn=turnRef.current==="blue"?"red":"blue";
    turnRef.current = nextTurn;
    setTurn(nextTurn);
    setMessage(opponentRef.current==="bot"?"Ход соперника...":nextTurn==="blue"?"Ход игрока слева":"Ход игрока справа");
  };
  const cancelDrag = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setMessage("Прицел сброшен — попробуй удар ещё раз");
  };
  useEffect(() => {
    const finishOutsideField = () => up();
    const cancelOutsideField = () => cancelDrag();
    window.addEventListener("pointerup", finishOutsideField);
    window.addEventListener("pointercancel", cancelOutsideField);
    window.addEventListener("blur", cancelOutsideField);
    document.addEventListener("visibilitychange", cancelOutsideField);
    return () => {
      window.removeEventListener("pointerup", finishOutsideField);
      window.removeEventListener("pointercancel", cancelOutsideField);
      window.removeEventListener("blur", cancelOutsideField);
      document.removeEventListener("visibilitychange", cancelOutsideField);
    };
  }, []);
  return (
    <section className="caps-match">
      <button className="game-back" onClick={onBack}>
        ← На главную
      </button>
      <header>
        <div>
          <div className="eyebrow">
            <span /> Матч до 3 голов · награда $25
          </div>
          <div className="caps-title-row">
            <h1>Field Caps</h1>
            <div className={`caps-turn caps-turn--${turn}`}>
              <i />
              {opponent==="friend"?(turn === "blue" ? "ХОД ИГРОКА СЛЕВА" : "ХОД ИГРОКА СПРАВА"):(turn === "blue" ? "ТВОЙ ХОД" : "ХОД AI")}
            </div>
          </div>
        </div>
        <div className="caps-score">
          <span>{opponent==="friend"?'СЛЕВА':'ТЫ'}</span>
          <strong>
            {score.blue} : {score.red}
          </strong>
          <span>{opponent==="friend"?'СПРАВА':'AI'}</span>
        </div>
      </header>
      <div className="caps-difficulty">
        <span>РЕЖИМ</span>
        <button className={opponent === "bot" ? "active" : ""} onClick={() => changeOpponent("bot")}>Против бота</button>
        <button className={opponent === "friend" ? "active" : ""} onClick={() => changeOpponent("friend")}>Против друга</button>
      </div>
      {opponent==="bot"&&<div className="caps-difficulty">
        <span>СЛОЖНОСТЬ AI</span>
        <button
          className={difficulty === "easy" ? "active" : ""}
          onClick={() => changeDifficulty("easy")}
        >
          Лёгкий
        </button>
        <button
          className={difficulty === "medium" ? "active" : ""}
          onClick={() => changeDifficulty("medium")}
        >
          Средний
        </button>
        <button
          className={difficulty === "hard" ? "active" : ""}
          onClick={() => changeDifficulty("hard")}
        >
          Сложный
        </button>
      </div>}
      <div className="caps-canvas-wrap">
        <canvas
          ref={canvasRef}
          width="1000"
          height="600"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={cancelDrag}
          onLostPointerCapture={up}
          onPointerLeave={(event) => {
            if (event.buttons === 0) up();
          }}
          onContextMenu={(event) => event.preventDefault()}
        />
        {winner && (
          <div className="caps-finish">
            <span>{winner === "blue" ? "🏆" : "⚽"}</span>
            <h2>{opponent==="friend"?(winner === "blue" ? "Победил игрок слева!" : "Победил игрок справа!"):(winner === "blue" ? "Ты победил!" : "Победил соперник")}</h2>
            <p>
              {winner === "blue"&&opponent==="bot"
                ? `+$25 · Финальный счёт ${score.blue} : ${score.red}`
                : `Финальный счёт: ${score.blue} : ${score.red}`}
            </p>
            <button onClick={restart}>Реванш</button>
            <button onClick={onBack}>На главную</button>
          </div>
        )}
      </div>
      <p className={`caps-message caps-message--${turn}`}>{message}</p>
      <div className="caps-rules">
        <span>👆 {opponent==="friend"?'Игроки ходят по очереди':'Зажми фишку'}</span>
        <span>↙ Оттяни назад</span>
        <span>⚡ Первый до 3 голов побеждает</span>
      </div>
    </section>
  );
}
