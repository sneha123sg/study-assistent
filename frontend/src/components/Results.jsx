import {
  Trophy,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function Results({ result, onRetry, onNewTopic }) {
  const percentage = Math.round((result.score / result.total) * 100);

  let message = "Keep going — you're building momentum.";

  if (percentage === 100) {
    message = "Perfect score! You've mastered this topic.";
  } else if (percentage >= 80) {
    message = "Excellent work! You have a strong understanding.";
  } else if (percentage >= 60) {
    message =
      "Good progress! Review your mistakes to strengthen your understanding.";
  } else {
    message = "Don't worry. Review your mistakes and try again.";
  }

  const hasMistakes = result.wrongQuestions && result.wrongQuestions.length > 0;

  return (
    <section className="results-section">
      <div className="results-card">
        <div className="trophy">
          <Trophy size={30} />
        </div>

        <span className="eyebrow">SESSION COMPLETE</span>

        <h2>{percentage}%</h2>

        <p>{message}</p>

        <div className="result-stats">
          <div>
            <CheckCircle2 size={19} />

            <strong>{result.score}</strong>

            <span>Correct</span>
          </div>

          <div>
            <XCircle size={19} />

            <strong>{result.total - result.score}</strong>

            <span>To review</span>
          </div>
        </div>

        <div className="results-actions">
          {hasMistakes && (
            <button
              type="button"
              className="primary-action"
              onClick={() => onRetry(result.wrongQuestions)}
            >
              <RotateCcw size={17} />
              Review mistakes
            </button>
          )}

          <button
            type="button"
            className="secondary-action"
            onClick={onNewTopic}
          >
            New study topic
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
