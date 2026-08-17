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

  if (percentage >= 90) {
    message = "Excellent! You've mastered this topic.";
  } else if (percentage >= 70) {
    message = "Great work! A little more practice will make it stick.";
  }

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
          {result.wrongQuestions?.length > 0 && (
            <button className="primary-action" onClick={onRetry}>
              <RotateCcw size={17} />
              Review mistakes
            </button>
          )}

          <button className="secondary-action" onClick={onNewTopic}>
            New study topic
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
