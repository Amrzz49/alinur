import { useState } from "react";
import { Goalkeeper } from "./Goalkeeper";
import { MiniGameCoach } from "./MiniGameCoach";

type Direction = "left" | "center" | "right";
const directions: { id: Direction; label: string; icon: string }[] = [
  { id: "left", label: "Прыжок влево", icon: "↖" },
  { id: "center", label: "Остаться в центре", icon: "↑" },
  { id: "right", label: "Прыжок вправо", icon: "↗" },
];
const randomShot = (): Direction =>
  ["left", "center", "right"][Math.floor(Math.random() * 3)] as Direction;
const shotFromCue = (cue: Direction): Direction => {
  if (Math.random() < 0.72) return cue;
  const other = (["left", "center", "right"] as Direction[]).filter(
    (item) => item !== cue,
  );
  return other[Math.floor(Math.random() * other.length)];
};

export function GoalkeeperIQ({
  language,
  onBack,
  onComplete,
}: {
  language: "ru" | "en";
  onBack: () => void;
  onComplete?: () => void;
}) {
  const en = language === "en";
  const [choice, setChoice] = useState<Direction>("center");
  const [shot, setShot] = useState<Direction | null>(null);
  const [cue, setCue] = useState<Direction>(randomShot);
  const [saves, setSaves] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [finished, setFinished] = useState(false);
  const isSave = shot !== null && shot === choice;
  const defend = () => {
    if (shot) return;
    const nextShot = shotFromCue(cue);
    setShot(nextShot);
    if (nextShot === choice) {
      const nextStreak = streak + 1;
      setSaves((value) => value + 1);
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
    setShot(null);
    setCue(randomShot());
  };
  const restart = () => {
    setChoice("center");
    setShot(null);
    setCue(randomShot());
    setSaves(0);
    setStreak(0);
    setBestStreak(0);
    setRound(1);
    setFinished(false);
  };
  const labels = {
    left: en ? "Dive left" : "Прыжок влево",
    center: en ? "Stay central" : "Остаться в центре",
    right: en ? "Dive right" : "Прыжок вправо",
  };
  if (finished)
    return (
      <section className="keeper-finish">
        <button className="game-back" onClick={onBack}>
          ← {en ? "All games" : "Все игры"}
        </button>
        <div>{saves >= 5 ? "🏆" : saves >= 3 ? "🧤" : "💪"}</div>
        <span className="step-label">
          {en ? "MATCH COMPLETE" : "МАТЧ ЗАВЕРШЁН"}
        </span>
        <h1>
          {saves >= 5
            ? en
              ? "A wall in goal!"
              : "Стена в воротах!"
            : saves >= 3
              ? en
                ? "Great game!"
                : "Хорошая игра!"
              : en
                ? "Keep training!"
                : "Продолжай тренироваться!"}
        </h1>
        <strong>
          {saves}
          <small>/ 7 {en ? "saves" : "сейвов"}</small>
        </strong>
        <p>
          {saves >= 5
            ? en
              ? "You read the shots brilliantly."
              : "Ты отлично читаешь удары соперника."
            : en
              ? "Watch the striker and time your dive."
              : "Следи за разбегом нападающего и меняй направление прыжка."}<br />
          🔥 {en ? "Best streak" : "Лучшая серия"}: {bestStreak}
        </p>
        <button className="play-button" onClick={restart}>
          {en ? "Play again" : "Сыграть ещё раз"} ↻
        </button>
      </section>
    );
  return (
    <section className="goalkeeper-game">
      <button className="game-back" onClick={onBack}>
        ← {en ? "All games" : "Все игры"}
      </button>
      <div className="keeper-game-heading">
        <div>
          <div className="eyebrow">
            <span /> {en ? "Mini-game" : "Мини-игра"}
          </div>
          <h1>{en ? "Goalkeeper IQ" : "IQ вратаря"}</h1>
          <p>
            {en
              ? "Read the run-up and choose before the shot."
              : "Прочитай разбег и выбери направление."}
          </p>
        </div>
        <div className="penalty-score">
          <span>{en ? "Saves" : "Сейвы"}</span>
          <strong>{saves}</strong>
          <small>
            {en ? "Round" : "Раунд"} {round} / 7 · 🔥 {streak}
          </small>
        </div>
      </div>
      <div className="penalty-game keeper-arena">
        <div className="stadium-crowd" />
        <div className="stadium-lights" />
        <div className="pitch-stripes" />
        <div className="goal">
          <div className="goal-net" />
          <div className={`keeper ${shot ? `keeper--${choice}` : ""}`}>
            <Goalkeeper />
          </div>
          <div className={`shot-ball ${shot ? `shot-ball--${shot}` : ""}`}>
            ⚽
          </div>
          {shot && (
            <div
              className={`goal-result ${isSave ? "result--goal" : "result--save"}`}
            >
              {isSave ? (streak >= 2 ? `🔥 x${streak}` : en ? "SAVE!" : "СЕЙВ!") : en ? "GOAL!" : "ГОЛ!"}
            </div>
          )}
        </div>
        <div className="penalty-spot" />
        {shot && !isSave && (
          <MiniGameCoach
            language={language}
            mistake={en ? `You dived ${labels[choice].toLowerCase()}, but the shot went ${labels[shot].toLowerCase()}.` : `Ты выбрал «${labels[choice]}», но удар пошёл в другое направление.`}
            correctPlay={en ? "Read the final step of the run-up and delay your dive." : "Следи за последним шагом разбега и не прыгай слишком рано."}
          />
        )}
        <div className="striker-cue">
          🏃 {en ? "Run-up points" : "Разбег направлен"}{" "}
          <strong>
            {en
              ? ({ left: "LEFT", center: "CENTRE", right: "RIGHT" } as const)[
                  cue
                ]
              : (
                  { left: "ВЛЕВО", center: "В ЦЕНТР", right: "ВПРАВО" } as const
                )[cue]}
          </strong>
          <small>{en ? "Watch for a bluff" : "Возможен обманный удар"}</small>
        </div>
        <div className="penalty-controls">
          <span>{en ? "Where will you dive?" : "Куда прыгнуть?"}</span>
          <div>
            {directions.map((direction) => (
              <button
                className={choice === direction.id ? "active" : ""}
                disabled={shot !== null}
                onClick={() => setChoice(direction.id)}
                key={direction.id}
              >
                <i>{direction.icon}</i>
                {labels[direction.id]}
              </button>
            ))}
          </div>
          {shot ? (
            <button className="penalty-shoot" onClick={next}>
              {round === 7
                ? en
                  ? "Results"
                  : "Результат"
                : en
                  ? "Next shot"
                  : "Следующий удар"}{" "}
              →
            </button>
          ) : (
            <button className="penalty-shoot" onClick={defend}>
              {en ? "Defend" : "Защищать"} 🧤
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
