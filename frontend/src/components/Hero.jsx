import { Sparkles, ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow glow-one"></div>
      <div className="hero-glow glow-two"></div>

      <div className="hero-badge">
        <Sparkles size={14} />
        Turn curiosity into mastery
      </div>

      <h2>
        Learn smarter.
        <br />
        <span>Remember longer.</span>
      </h2>

      <p>
        Turn any topic into an interactive study pack with AI-generated
        flashcards, quizzes and mistake reviews.
      </p>

      <div className="hero-features">
        <div>
          <span>01</span>
          Learn
        </div>

        <div>
          <span>02</span>
          Practice
        </div>

        <div>
          <span>03</span>
          Improve
        </div>
      </div>

      <div
        className="hero-arrow"
        onClick={() => {
          document.getElementById("topic-form")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }}
      >
        <ArrowDown size={22} />
      </div>
    </section>
  );
}
