import { useState } from "react";
import {
  squadPlayers,
  type SquadPlayer,
  type SquadPosition,
} from "../lib/squadPlayers";
import { SquadBattle } from "./SquadBattle";
import { SquadCard } from "./SquadCard";

type Slot = {
  id: number;
  position: SquadPosition;
  code: string;
  ru: string;
  en: string;
  x: number;
  y: number;
};
const slots: Slot[] = [
  { id: 1, position: "GK", code: "GK", ru: "Вратарь", en: "Goalkeeper", x: 50, y: 87 },
  { id: 2, position: "DEF", code: "LB", ru: "Левый защитник", en: "Left back", x: 17, y: 68 },
  { id: 3, position: "DEF", code: "LCB", ru: "Левый центральный защитник", en: "Left centre-back", x: 39, y: 72 },
  { id: 4, position: "DEF", code: "RCB", ru: "Правый центральный защитник", en: "Right centre-back", x: 61, y: 72 },
  { id: 5, position: "DEF", code: "RB", ru: "Правый защитник", en: "Right back", x: 83, y: 68 },
  { id: 6, position: "MID", code: "LCM", ru: "Левый полузащитник", en: "Left midfielder", x: 25, y: 45 },
  { id: 7, position: "MID", code: "CM", ru: "Центральный полузащитник", en: "Central midfielder", x: 50, y: 52 },
  { id: 8, position: "MID", code: "RCM", ru: "Правый полузащитник", en: "Right midfielder", x: 75, y: 45 },
  { id: 9, position: "ATT", code: "LW", ru: "Левый вингер", en: "Left winger", x: 20, y: 19 },
  { id: 10, position: "ATT", code: "ST", ru: "Центральный нападающий", en: "Striker", x: 50, y: 13 },
  { id: 11, position: "ATT", code: "RW", ru: "Правый вингер", en: "Right winger", x: 80, y: 19 },
];

export function SquadBuilder({
  language,
  onBack,
  onComplete,
}: {
  language: "ru" | "en";
  onBack: () => void;
  onComplete: () => void;
}) {
  const en = language === "en";
  const [team, setTeam] = useState<Record<number, SquadPlayer>>({});
  const [activeSlot, setActiveSlot] = useState<Slot | null>(slots[0]);
  const [battle, setBattle] = useState(false);
  const usedIds = Object.values(team).map((player) => player.id);
  const teamPlayers = Object.values(team);
  const rating = teamPlayers.length
    ? Math.round(
        teamPlayers.reduce((sum, player) => sum + player.rating, 0) /
          teamPlayers.length,
      )
    : 0;
  const chemistry = Math.min(
    100,
    teamPlayers.length * 5 +
      teamPlayers.reduce(
        (points, player, index) =>
          points +
          teamPlayers
            .slice(index + 1)
            .filter(
              (other) =>
                other.club === player.club || other.country === player.country,
            ).length *
            3,
        0,
      ),
  );
  const addPlayer = (player: SquadPlayer) => {
    if (!activeSlot) return;
    const nextTeam = { ...team, [activeSlot.id]: player };
    setTeam(nextTeam);
    setActiveSlot(slots.find((slot) => !nextTeam[slot.id]) ?? null);
  };
  const reset = () => {
    setTeam({});
    setActiveSlot(slots[0]);
  };
  if (battle)
    return (
      <SquadBattle
        language={language}
        team={teamPlayers}
        userChemistry={chemistry}
        onBack={() => setBattle(false)}
        onComplete={onComplete}
      />
    );
  const choices = activeSlot
    ? squadPlayers
        .filter(
          (player) =>
            player.position === activeSlot.position &&
            !usedIds.includes(player.id),
        )
        .slice(0, 6)
    : [];
  const continueSelection = () =>
    setActiveSlot(slots.find((slot) => !team[slot.id]) ?? null);
  return (
    <section className="squad-builder">
      <button className="game-back" onClick={onBack}>
        ← {en ? "All games" : "Все игры"}
      </button>
      <div className="squad-heading">
        <div>
          <div className="eyebrow">
            <span /> {en ? "Squad builder" : "Конструктор состава"}
          </div>
          <h1>Squad Builder 26</h1>
          <p>
            {en
              ? "Build your dream 4-3-3 team."
              : "Собери свою команду мечты по схеме 4‑3‑3."}
          </p>
        </div>
        <div className="squad-metrics">
          <div>
            <span>{en ? "Rating" : "Рейтинг"}</span>
            <strong>{rating}</strong>
          </div>
          <div>
            <span>{en ? "Chemistry" : "Химия"}</span>
            <strong>{chemistry}</strong>
          </div>
        </div>
      </div>
      <div className="squad-layout">
        <div className="squad-pitch">
          <div className="squad-box squad-box--top" />
          <div className="squad-box squad-box--bottom" />
          <div className="squad-half" />
          {slots.map((slot) => {
            const player = team[slot.id];
            return (
              <button
                className={`squad-slot ${player ? "filled" : ""}`}
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                onClick={() => setActiveSlot(slot)}
                key={slot.id}
              >
                {player ? (
                  <>
                    <span>{player.rating}</span>
                    {player.photo ? (
                      <img src={player.photo} alt={player.name} />
                    ) : (
                      <i>{player.initials}</i>
                    )}
                    <strong>{player.name}</strong>
                    <small>{slot.code}</small>
                  </>
                ) : (
                  <>
                    <b>+</b>
                    <small>{slot.code}</small>
                  </>
                )}
              </button>
            );
          })}
        </div>
        <aside className="squad-side">
          <span className="step-label">
            {en ? "YOUR SQUAD" : "ТВОЙ СОСТАВ"}
          </span>
          <h2>
            {teamPlayers.length} / 11 {en ? "players" : "игроков"}
          </h2>
          <div className="squad-bars">
            <label>
              {en ? "Rating" : "Рейтинг"}{" "}
              <i>
                <b style={{ width: `${rating}%` }} />
              </i>
            </label>
            <label>
              {en ? "Chemistry" : "Химия"}{" "}
              <i>
                <b style={{ width: `${chemistry}%` }} />
              </i>
            </label>
          </div>
          <p>
            {en
              ? "Matching clubs or countries improve chemistry."
              : "Игроки одного клуба или сборной повышают химию."}
          </p>
          <button
            className="squad-play-ai"
            disabled={teamPlayers.length < 11}
            onClick={() => setBattle(true)}
          >
            {teamPlayers.length < 11
              ? en
                ? `Add ${11 - teamPlayers.length} more`
                : `Добавь ещё ${11 - teamPlayers.length}`
              : en
                ? "Play against AI →"
                : "Играть против AI →"}
          </button>
          <button className="squad-reset" onClick={reset}>
            {en ? "Clear squad" : "Очистить состав"}
          </button>
        </aside>
      </div>
      {!activeSlot && (
        <button
          className="squad-mobile-action"
          onClick={
            teamPlayers.length === 11
              ? () => setBattle(true)
              : continueSelection
          }
        >
          {teamPlayers.length === 11
            ? en
              ? "Play against AI →"
              : "Играть против AI →"
            : en
              ? `Continue · ${teamPlayers.length}/11`
              : `Продолжить · ${teamPlayers.length}/11`}
        </button>
      )}
      {activeSlot && (
        <div className="player-picker mad-picker">
          <div>
            <span>
              {team[activeSlot.id] ? teamPlayers.length : teamPlayers.length + 1} / 11 ·{" "}
              {en
                ? `AI suggests: ${activeSlot.en}`
                : `AI рекомендует: ${activeSlot.ru}`}
            </span>
            <button onClick={() => setActiveSlot(null)}>×</button>
          </div>
          <section>
            {choices.map((player) => (
              <SquadCard
                player={player}
                onClick={() => addPlayer(player)}
                key={player.id}
              />
            ))}
          </section>
        </div>
      )}
    </section>
  );
}
