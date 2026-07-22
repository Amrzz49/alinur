import { useState } from "react";
import { Goalkeeper } from "./Goalkeeper";
import { MiniGameCoach } from "./MiniGameCoach";

type Direction = "left" | "center" | "right";
const allDirections: Direction[] = ["left", "center", "right"];
const directions: { id: Direction; label: string; icon: string }[] = [
  { id: "left", label: "Левый угол", icon: "↖" },
  { id: "center", label: "По центру", icon: "↑" },
  { id: "right", label: "Правый угол", icon: "↗" },
];

const keeperPrediction = (history: Direction[]): Direction => {
  const all = allDirections;
  if (history.length >= 2 && Math.random() < 0.6) {
    return all.reduce((best, item) =>
      history.filter((shot) => shot === item).length >
      history.filter((shot) => shot === best).length
        ? item
        : best,
    );
  }
  return all[Math.floor(Math.random() * all.length)];
};

export function PenaltyMind({
  language = "ru",
  onBack,
  onComplete,
}: {
  language?: "ru" | "en";
  onBack?: () => void;
  onComplete?: () => void;
}) {
  const en = language === "en";
  const [selected, setSelected] = useState<Direction>("left");
  const [keeper, setKeeper] = useState<Direction | null>(null);
  const [keeperRead, setKeeperRead] = useState<Direction>(() =>
    keeperPrediction([]),
  );
  const [history, setHistory] = useState<Direction[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [finished, setFinished] = useState(false);
  const isGoal = keeper !== null && keeper !== selected;
  const shoot = () => {
    if (keeper) return;
    const alternatives = allDirections.filter((item) => item !== keeperRead);
    const guess =
      Math.random() < 0.72
        ? keeperRead
        : alternatives[Math.floor(Math.random() * alternatives.length)];
    const goal = guess !== selected;
    setKeeper(guess);
    setHistory((items) => [...items, selected]);
    if (goal) {
      const nextStreak = streak + 1;
      setScore((value) => value + 1);
      setStreak(nextStreak);
      setBestStreak((value) => Math.max(value, nextStreak));
    } else setStreak(0);
  };
  const next = () => {
    if (round === 7) {
      onComplete?.();
      return setFinished(true);
    }
    setRound((value) => value + 1);
    setKeeper(null);
    setKeeperRead(keeperPrediction(history));
  };
  const restart = () => {
    setSelected("left");
    setKeeper(null);
    setKeeperRead(keeperPrediction([]));
    setHistory([]);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setRound(1);
    setFinished(false);
  };
  const resultTitle =
    score >= 5
      ? en
        ? "Penalty master!"
        : "Мастер пенальти!"
      : score >= 3
        ? en
          ? "Good run!"
          : "Хорошая серия!"
        : en
          ? "Keep trying!"
          : "Старайся лучше!";
  const resultText =
    score >= 5
      ? en
        ? "You changed direction well and beat the goalkeeper."
        : "Ты отлично менял направления и перехитрил вратаря."
      : score >= 3
        ? en
          ? "Good result. Keep changing corners."
          : "Неплохой результат. Меняй углы ударов, чтобы стать ещё опаснее."
        : en
          ? "The goalkeeper read your shots. Vary the corner and try again!"
          : "Вратарь разгадал твои удары. Не повторяй один угол и попробуй ещё раз!";

  if (finished)
    return (
      <section className="penalty-finish">
        {onBack && (
          <button className="game-back" onClick={onBack}>
            ← {en ? "All games" : "Все игры"}
          </button>
        )}
        <div>{score >= 5 ? "🏆" : score >= 3 ? "⚽" : "💪"}</div>
        <span className="step-label">
          {en ? "SERIES COMPLETE" : "СЕРИЯ ЗАВЕРШЕНА"}
        </span>
        <h1>{resultTitle}</h1>
        <strong>
          {score} <small>/ 7</small>
        </strong>
        <p>
          {resultText}
          <br />
          🔥 {en ? "Best streak" : "Лучшая серия"}: {bestStreak}
        </p>
        <button className="play-button" onClick={restart}>
          {en ? "Play again" : "Сыграть ещё раз"} ↻
        </button>
      </section>
    );

  return (
    <section className="penalty-screen">
      {onBack && (
        <button className="game-back" onClick={onBack}>
          ← {en ? "All games" : "Все игры"}
        </button>
      )}
      <div className="penalty-heading">
        <div>
          <div className="eyebrow">
            <span /> {en ? "Mini-game" : "Мини-игра"}
          </div>
          <h1>{en ? "Penalty Mind" : "Мастер пенальти"}</h1>
          <p>
            {en
              ? "Pick a corner and build a scoring streak."
              : "Выбери угол и собери серию голов."}
          </p>
        </div>
        <div className="penalty-score">
          <span>{en ? "Goals" : "Голы"}</span>
          <strong>{score}</strong>
          <small>
            {en ? "Round" : "Раунд"} {round} / 7 · 🔥 {streak}
          </small>
        </div>
      </div>
      <div className="penalty-game">
        <div className="stadium-crowd" />
        <div className="stadium-lights" />
        <div className="pitch-stripes" />
        <div className="goal">
          <div className="goal-net" />
          <div className={`keeper ${keeper ? `keeper--${keeper}` : ""}`}>
            <Goalkeeper />
          </div>
          <div
            className={`shot-ball ${keeper ? `shot-ball--${selected}` : ""}`}
          >
            ⚽
          </div>
          {keeper && (
            <div
              className={`goal-result ${isGoal ? "result--goal" : "result--save"}`}
            >
              {isGoal
                ? streak >= 2
                  ? `🔥 x${streak}`
                  : en
                    ? "GOAL!"
                    : "ГОООЛ!"
                : en
                  ? "SAVE!"
                  : "СЕЙВ!"}
            </div>
          )}
        </div>
        <div className="penalty-spot" />
        {keeper && !isGoal && (
          <MiniGameCoach
            language={language}
            mistake={
              en
                ? "The goalkeeper read your chosen corner."
                : "Вратарь прочитал выбранный тобой угол."
            }
            correctPlay={
              en
                ? "Notice the goalkeeper’s lean and vary your previous shots."
                : "Смотри на движение вратаря и не повторяй прошлые удары."
            }
          />
        )}
        <div className="keeper-read">
          👀 {en ? "Keeper leans" : "Вратарь смещается"}:{" "}
          <strong>
            {en
              ? ({ left: "LEFT", center: "CENTRE", right: "RIGHT" } as const)[
                  keeperRead
                ]
              : (
                  { left: "ВЛЕВО", center: "В ЦЕНТР", right: "ВПРАВО" } as const
                )[keeperRead]}
          </strong>
          <small>{en ? "He may bluff" : "Он может обмануть"}</small>
        </div>
        <div className="penalty-controls">
          <span>{en ? "Where will you shoot?" : "Куда бьём?"}</span>
          <div>
            {directions.map((direction) => (
              <button
                className={selected === direction.id ? "active" : ""}
                disabled={keeper !== null}
                onClick={() => setSelected(direction.id)}
                key={direction.id}
              >
                <i>{direction.icon}</i>
                {en
                  ? (
                      {
                        left: "Left corner",
                        center: "Centre",
                        right: "Right corner",
                      } as const
                    )[direction.id]
                  : direction.label}
              </button>
            ))}
          </div>
          {keeper ? (
            <button className="penalty-shoot" onClick={next}>
              {round === 7
                ? en
                  ? "Result"
                  : "Результат"
                : en
                  ? "Next penalty"
                  : "Следующий пенальти"}{" "}
              →
            </button>
          ) : (
            <button className="penalty-shoot" onClick={shoot}>
              {en ? "Shoot" : "Ударить"} ⚽
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
