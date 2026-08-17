import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Quiz({ questions, onComplete, retryOnly = false }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]);

  const question = questions[current];
  const [elaboration, setElaboration] = useState("");
  const [loadingElaboration, setLoadingElaboration] = useState(false);
  useEffect(() => {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setWrongQuestions([]);
  }, [questions]);

  function submitAnswer() {
    if (selected === null || answered) return;

    setAnswered(true);

    if (selected === question.correctAnswer) {
      setScore((prev) => prev + 1);
    } else {
      setWrongQuestions((prev) => [...prev, question]);
    }
  }

  function nextQuestion() {
    if (current === questions.length - 1) {
      onComplete({
        score: score + (selected === question.correctAnswer ? 1 : 0),
        total: questions.length,
        wrongQuestions,
      });

      return;
    }

    setCurrent((prev) => prev + 1);
    setSelected(null);
    setAnswered(false);
  }

  async function handleElaborate() {
    try {
      setLoadingElaboration(true);
      setElaboration("");

      const response = await fetch(
        "http://localhost:5000/api/study/elaborate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic,
            question: question.question,
            options: question.options,
            answer: question.options[question.correctAnswer],
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to elaborate.");
      }

      setElaboration(result.data.explanation);
    } catch (error) {
      console.error(error);
      setElaboration(
        "Sorry, I couldn't generate an explanation right now. Please try again.",
      );
    } finally {
      setLoadingElaboration(false);
    }
  }

  return (
    <section className="quiz-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{retryOnly ? "REVIEW" : "PRACTICE"}</span>

          <h2>{retryOnly ? "Let's fix those mistakes." : "Test yourself"}</h2>
        </div>

        <div className="quiz-progress">
          <span>
            {current + 1}/{questions.length}
          </span>

          <div>
            <i
              style={{
                width: `${((current + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="quiz-card">
        <div className="question-number">
          QUESTION {String(current + 1).padStart(2, "0")}
        </div>

        <h3>{question.question}</h3>

        <div className="options">
          {question.options.map((option, index) => {
            let className = "option";

            if (selected === index) {
              className += " selected";
            }

            if (answered) {
              if (index === question.correctAnswer) {
                className += " correct";
              } else if (selected === index) {
                className += " incorrect";
              }
            }

            return (
              <button
                key={option}
                className={className}
                onClick={() => !answered && setSelected(index)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>

                <span>{option}</span>

                {answered && index === question.correctAnswer && (
                  <CheckCircle2 className="option-result" />
                )}

                {answered &&
                  selected === index &&
                  index !== question.correctAnswer && (
                    <XCircle className="option-result" />
                  )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={`explanation ${
              selected === question.correctAnswer ? "success" : "failure"
            }`}
          >
            {selected === question.correctAnswer
              ? "✓ Correct!"
              : "✗ Not quite."}

            <p>{question.explanation}</p>
          </div>
        )}

        <div className="quiz-actions">
          {!answered ? (
            <button
              className="submit-answer"
              onClick={submitAnswer}
              disabled={selected === null}
            >
              Check answer
            </button>
          ) : (
            <button className="submit-answer" onClick={nextQuestion}>
              {current === questions.length - 1
                ? "See results"
                : "Next question"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
