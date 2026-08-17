import { Brain, BookOpen, Target, Zap } from "lucide-react";

export default function EmptyState() {
  return (
    <section className="empty-state">
      <div className="empty-icon">
        <Brain size={32} />
      </div>

      <h2>Your next breakthrough starts here.</h2>

      <p>
        Enter a topic above and let StudyFlow transform it into an active
        learning experience.
      </p>

      <div className="empty-features">
        <div>
          <BookOpen size={19} />
          <span>Smart flashcards</span>
        </div>

        <div>
          <Target size={19} />
          <span>Interview quizzes</span>
        </div>

        <div>
          <Zap size={19} />
          <span>Instant feedback</span>
        </div>
      </div>
    </section>
  );
}
