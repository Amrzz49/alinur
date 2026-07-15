import { choices, type Challenge, type ChoiceId } from '../lib/challenges';

type Props = {
  challenge: Challenge;
  selectedChoice: ChoiceId | null;
  onChoose: (choice: ChoiceId) => void;
  onNext: () => void;
};

export function DecisionPanel({ challenge, selectedChoice, onChoose, onNext }: Props) {
  const isCorrect = selectedChoice === challenge.correctChoice;

  return (
    <aside className="decision-card">
      {!selectedChoice ? <>
        <span className="step-label">ТВОЁ РЕШЕНИЕ</span><h2>Что сделаешь?</h2><p>{challenge.situation}</p>
        <div className="choices">{choices.map((choice) => (
          <button className="choice" onClick={() => onChoose(choice.id)} key={choice.id}><span className="choice__icon">{choice.icon}</span>{choice.label}</button>
        ))}</div>
        <div className="coach-tip"><span>💡</span><p><strong>Подсказка тренера</strong>{challenge.tip}</p></div>
      </> : <div className="result">
        <div className={`result__icon ${isCorrect ? '' : 'result__icon--try'}`}>{isCorrect ? '✓' : '↻'}</div>
        <span className="step-label">РАЗБОР ХОДА</span><h2>{isCorrect ? 'Отличное решение!' : 'Можно лучше'}</h2>
        <p>{isCorrect ? challenge.result : `Этот путь слишком рискованный. Лучший вариант: «${choices.find((item) => item.id === challenge.correctChoice)?.label}». ${challenge.result}`}</p>
        <div className="pro-note"><span>⚽</span><p><strong>Как играет профессионал</strong>{challenge.proTip}</p></div>
        <button className="next-button" onClick={onNext}>Следующее задание <span>→</span></button>
      </div>}
    </aside>
  );
}
