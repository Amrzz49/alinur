import { choices, type Challenge, type ChoiceId } from '../lib/challenges';
import { choiceLabel } from '../lib/trainingTranslations';

type Props = {
  challenge: Challenge;
  selectedChoice: ChoiceId | null;
  onChoose: (choice: ChoiceId) => void;
  onNext: () => void;
  language:'ru'|'en';
};

export function DecisionPanel({ challenge, selectedChoice, onChoose, onNext, language }: Props) {
  const isCorrect = selectedChoice === challenge.correctChoice;
  const en=language==='en';

  return (
    <aside className="decision-card">
      {!selectedChoice ? <>
        <span className="step-label">{en?'YOUR DECISION':'ТВОЁ РЕШЕНИЕ'}</span><h2>{en?'What will you do?':'Что сделаешь?'}</h2><p>{challenge.situation}</p>
        <div className="choices">{choices.map((choice) => (
          <button className="choice" onClick={() => onChoose(choice.id)} key={choice.id}><span className="choice__icon">{choice.icon}</span>{choiceLabel(choice.id,language)}</button>
        ))}</div>
        <div className="coach-tip"><span>💡</span><p><strong>{en?'Coach’s tip':'Подсказка тренера'}</strong>{challenge.tip}</p></div>
      </> : <div className="result">
        <div className={`result__icon ${isCorrect ? '' : 'result__icon--try'}`}>{isCorrect ? '✓' : '↻'}</div>
        <span className="step-label">{en?'MOVE REVIEW':'РАЗБОР ХОДА'}</span><h2>{isCorrect ? (en?'Great decision!':'Отличное решение!') : (en?'You can do better':'Можно лучше')}</h2>
        <p>{isCorrect ? challenge.result : en?`That option is too risky. The best choice is “${choiceLabel(challenge.correctChoice,language)}”. ${challenge.result}`:`Этот путь слишком рискованный. Лучший вариант: «${choiceLabel(challenge.correctChoice,language)}». ${challenge.result}`}</p>
        <div className="pro-note"><span>⚽</span><p><strong>{en?'How a professional plays':'Как играет профессионал'}</strong>{challenge.proTip}</p></div>
        <button className="next-button" onClick={onNext}>{en?'Next challenge':'Следующее задание'} <span>→</span></button>
      </div>}
    </aside>
  );
}
