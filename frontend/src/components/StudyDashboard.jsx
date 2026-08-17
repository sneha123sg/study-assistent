import { BookOpen, Target, Sparkles } from "lucide-react";

import Flashcard from "./Flashcard";
import Quiz from "./Quiz";

export default function StudyDashboard({
  studyPack,
  quizResult,
  setQuizResult,
  retryQuestions,
  onRetryComplete,
}) {
  return (
    <div className="dashboard">
      <section className="study-header">
        <div>
          <span className="eyebrow">YOUR AI STUDY PACK</span>

          <h1>{studyPack.topic}</h1>

          <p>{studyPack.summary}</p>
        </div>

        <div className="difficulty-pill">
          <Sparkles size={14} />
          {studyPack.difficulty}
        </div>
      </section>

      <section className="key-points">
        <div className="key-points-title">
          <BookOpen size={18} />
          Key concepts
        </div>

        <div className="points-grid">
          {studyPack.keyPoints.map((point, index) => (
            <div key={index}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {point}
            </div>
          ))}
        </div>
      </section>

      <Flashcard cards={studyPack.flashcards} />

      {quizResult ? (
        <div className="quiz-result-inline">
          <Target size={22} />
          <div>
            <strong>
              You scored {quizResult.score}/{quizResult.total}
            </strong>
            <span>Ready for another round? Review your mistakes below.</span>
          </div>
        </div>
      ) : null}

      <Quiz
        questions={retryQuestions?.length ? retryQuestions : studyPack.quiz}
        retryOnly={Boolean(retryQuestions?.length)}
        onComplete={(result) => {
          setQuizResult(result);

          if (retryQuestions?.length) {
            onRetryComplete();
          }
        }}
      />
    </div>
  );
}
