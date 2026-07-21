import { useEffect, useState } from "react";
import { getMiniGameCoachTip } from "../lib/aiCoach";

type Props = {
  language: "ru" | "en";
  mistake: string;
  correctPlay: string;
};

export function MiniGameCoach({ language, mistake, correctPlay }: Props) {
  const en = language === "en";
  const fallback = en
    ? `${mistake} Next time: ${correctPlay}`
    : `${mistake} В следующий раз: ${correctPlay}`;
  const [tip, setTip] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setTip(fallback);
    setLoading(true);
    getMiniGameCoachTip(mistake, correctPlay, language)
      .then((answer) => active && setTip(answer))
      .catch(() => undefined)
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [correctPlay, fallback, language, mistake]);

  return (
    <aside className="mini-game-coach" aria-live="polite">
      <span>AI</span>
      <div>
        <strong>{en ? "Coach explains the mistake" : "Тренер объясняет ошибку"}</strong>
        <p>{tip}</p>
        {loading && <small>{en ? "AI is refining the tip…" : "AI уточняет совет…"}</small>}
      </div>
    </aside>
  );
}
