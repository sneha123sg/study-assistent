import { useState } from "react";
import { Sparkles, Send, Lightbulb } from "lucide-react";

const suggestions = [
  "Binary trees for coding interviews",
  "Operating systems process management",
  "DBMS normalization",
  "Computer networks TCP vs UDP",
];

export default function TopicForm({ onGenerate, loading }) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("interview");

  function handleSubmit(e) {
    e.preventDefault();

    if (!topic.trim() || loading) return;

    onGenerate({
      topic: topic.trim(),
      difficulty,
    });
  }

  function chooseSuggestion(value) {
    setTopic(value);
  }

  return (
    <section className="generator-section">
      <div className="section-label">
        <span>01</span>
        BUILD YOUR STUDY PACK
      </div>

      <form onSubmit={handleSubmit} className="generator-card">
        <div className="input-header">
          <div>
            <h2>What are you learning today?</h2>
            <p>Be as specific as you want. StudyFlow adapts to your goal.</p>
          </div>

          <div className="input-icon">
            <Sparkles size={22} />
          </div>
        </div>

        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Example: Teach me binary trees for a coding interview..."
          rows={4}
          disabled={loading}
        />

        <div className="generator-controls">
          <div className="difficulty">
            <span>Difficulty</span>

            <div className="difficulty-options">
              {["beginner", "intermediate", "interview"].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={
                    difficulty === level
                      ? "difficulty-btn active"
                      : "difficulty-btn"
                  }
                  onClick={() => setDifficulty(level)}
                  disabled={loading}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            className="generate-btn"
            type="submit"
            disabled={!topic.trim() || loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Creating...
              </>
            ) : (
              <>
                Generate
                <Send size={17} />
              </>
            )}
          </button>
        </div>

        <div className="suggestions">
          <div className="suggestions-title">
            <Lightbulb size={15} />
            Try one
          </div>

          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => chooseSuggestion(suggestion)}
              disabled={loading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </form>
    </section>
  );
}
