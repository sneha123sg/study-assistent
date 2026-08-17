import { BookOpen, Sparkles } from "lucide-react";

import Flashcard from "./Flashcard";
import Quiz from "./Quiz";

export default function StudyDashboard({
  studyPack,
  quizResult,
  setQuizResult,
  retryQuestions,
  onRetryComplete,
}) {
  const isReviewing = retryQuestions && retryQuestions.length > 0;

  const questionsToShow = isReviewing ? retryQuestions : studyPack.quiz;

  return (
    <div className="dashboard">

      <section className="study-header">
        <div>
          <br />
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

      {!isReviewing && <Flashcard cards={studyPack.flashcards} />}

      {isReviewing && (
        <div className="review-banner">
          <Sparkles size={18} />

          <div>
            <strong>Reviewing your mistakes</strong>

            <span>Let's make these concepts stick.</span>
          </div>
        </div>
      )}

      <Quiz
        key={
          isReviewing
            ? `review-${retryQuestions.map((q) => q.id).join("-")}`
            : "main-quiz"
        }
        questions={questionsToShow}
        retryOnly={isReviewing}
        onComplete={(result) => {
          setQuizResult(result);

          if (isReviewing) {
            onRetryComplete();
          }
        }}
      />
    </div>
  );
}
