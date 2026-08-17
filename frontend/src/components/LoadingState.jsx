import { Brain, Sparkles } from "lucide-react";

export default function LoadingState() {
  return (
    <section className="loading-state">
      <div className="loading-orbit">
        <div className="orbit-ring"></div>

        <div className="loading-brain">
          <Brain size={30} />
        </div>
      </div>

      <div>
        <h3>Building your study pack...</h3>

        <p>
          Your AI tutor is preparing concepts, flashcards and interview
          questions.
        </p>
      </div>

      <div className="loading-steps">
        <span>
          <Sparkles size={13} />
          Understanding topic
        </span>

        <span>
          <Sparkles size={13} />
          Creating questions
        </span>

        <span>
          <Sparkles size={13} />
          Checking quality
        </span>
      </div>
    </section>
  );
}
