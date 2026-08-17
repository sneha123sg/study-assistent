import { useState } from "react";
import { RotateCw, ChevronLeft, ChevronRight } from "lucide-react";

export default function Flashcard({ cards }) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[current];

  function nextCard() {
    setFlipped(false);
    setCurrent((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  }

  function previousCard() {
    setFlipped(false);
    setCurrent((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  }

  return (
    <section className="flashcard-section">
      <div className="section-heading">
        <div>
          <h2>Flashcards</h2>
        </div>

        <div className="counter">
          {current + 1}
          <span>/</span>
          {cards.length}
        </div>
      </div>

      <div
        className={`flashcard-scene ${flipped ? "is-flipped" : ""}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flashcard-inner">
          <div className="flashcard-face flashcard-front">
            <span className="card-label">QUESTION</span>

            <h3>{card.question}</h3>

            <div className="flip-hint">
              <RotateCw size={16} />
              Click to reveal answer
            </div>
          </div>

          <div className="flashcard-face flashcard-back">
            <span className="card-label">ANSWER</span>

            <h3>{card.answer}</h3>

            <div className="flip-hint">
              <RotateCw size={16} />
              Click to flip back
            </div>
          </div>
        </div>
      </div>

      <div className="card-controls">
        <button onClick={previousCard}>
          <ChevronLeft size={18} />
          Previous
        </button>

        <button onClick={nextCard}>
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
