import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Sparkles, Loader2 } from "lucide-react";

import { elaborateQuizExplanation } from "../services/api";

export default function Quiz({ questions, onComplete, retryOnly = false }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [elaborating, setElaborating] = useState(false);

  const [detailedExplanation, setDetailedExplanation] = useState(null);

  useEffect(() => {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setWrongQuestions([]);
    setElaborating(false);
    setDetailedExplanation("");
  }, [questions]);

  if (!questions || questions.length === 0) {
    return (
      <section className="quiz-section">
        <div className="quiz-card">
          <p>No quiz questions available.</p>
        </div>
      </section>
    );
  }

  const question = questions[current];

  function handleSelect(index) {
    if (answered) return;

    setSelected(index);
  }

  function submitAnswer() {
    if (selected === null || answered) {
      return;
    }

    setAnswered(true);
  }

  function nextQuestion() {
    const isCorrect = selected === question.correctAnswer;

    const finalScore = score + (isCorrect ? 1 : 0);

    const finalWrongQuestions = isCorrect
      ? wrongQuestions
      : [...wrongQuestions, question];

    if (current === questions.length - 1) {
      onComplete({
        score: finalScore,
        total: questions.length,
        wrongQuestions: finalWrongQuestions,
      });

      return;
    }

    setCurrent((prev) => prev + 1);
    setSelected(null);
    setAnswered(false);
    setElaborating(false);
    setDetailedExplanation("");
    setScore(finalScore);
    setWrongQuestions(finalWrongQuestions);
  }

  async function handleElaborate() {
    if (elaborating) return;

    try {
      setElaborating(true);

      const detailed = await elaborateQuizExplanation({
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      });

      setDetailedExplanation(detailed);
    } catch (error) {
      console.error("Elaborate error:", error);

      setDetailedExplanation({
        concept: "Unable to elaborate",
        simpleExplanation:
          "Something went wrong while generating the detailed explanation.",
        whyCorrect: "",
        whyOthersWrong: [],
        example: "",
        takeaway: "Please click Elaborate again.",
      });
    } finally {
      setElaborating(false);
    }
  }

  const isCorrect = selected === question.correctAnswer;

  return (
    <section className="quiz-section">

      <div className="section-heading">
        <div>
          <span className="eyebrow">
            {retryOnly ? "REVIEW MISTAKES" : "PRACTICE"}
          </span>

          <h2>{retryOnly ? "Let's fix those mistakes." : "Test yourself"}</h2>
        </div>

        <div className="quiz-progress">
          <span>
            {current + 1} / {questions.length}
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
              }

              if (index === selected && index !== question.correctAnswer) {
                className += " incorrect";
              }
            }

            return (
              <button
                key={`${question.id}-${index}`}
                type="button"
                className={className}
                onClick={() => handleSelect(index)}
                disabled={answered}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>

                <span>{option}</span>

                {answered && index === question.correctAnswer && (
                  <CheckCircle2 className="option-result" />
                )}

                {answered &&
                  index === selected &&
                  index !== question.correctAnswer && (
                    <XCircle className="option-result" />
                  )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`explanation ${isCorrect ? "success" : "failure"}`}>

            <div className="explanation-header">
              <strong>
                {isCorrect ? "✓ Correct answer" : "✗ Incorrect answer"}
              </strong>
            </div>

            {!detailedExplanation && (
              <div className="normal-explanation">
                <div className="explanation-section-title">Explanation</div>

                <p>{question.explanation}</p>
              </div>
            )}

            {detailedExplanation && (
              <div className="structured-elaboration">
                <div className="elaboration-block">
                  <div className="elaboration-title">🧠 Concept</div>
                  <p>{detailedExplanation.concept}</p>
                </div>

                <div className="elaboration-block">
                  <div className="elaboration-title">📖 In simple words</div>

                  <p>{detailedExplanation.simpleExplanation}</p>
                </div>

                <div className="elaboration-block correct-block">
                  <div className="elaboration-title">
                    ✓ Why this answer is correct
                  </div>

                  <p>{detailedExplanation.whyCorrect}</p>
                </div>

                {detailedExplanation.whyOthersWrong?.length > 0 && (
                  <div className="elaboration-block">
                    <div className="elaboration-title">
                      ✕ Why the other options are wrong
                    </div>

                    <div className="wrong-options">
                      {detailedExplanation.whyOthersWrong.map((item, index) => (
                        <div key={index} className="wrong-option">
                          <span>{String.fromCharCode(65 + index)}</span>

                          <p>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="elaboration-block example-block">
                  <div className="elaboration-title">💡 Example</div>
                  <p>{detailedExplanation.example}</p>
                </div>

                <div className="takeaway-block">
                  <div className="elaboration-title">🎯 Remember this</div>
                  <p>{detailedExplanation.takeaway}</p>
                </div>
              </div>
            )}

            {!detailedExplanation && (
              <button
                type="button"
                className="elaborate-btn"
                onClick={handleElaborate}
                disabled={elaborating}
              >
                {elaborating ? "✨ Generating..." : "✨ Elaborate"}
              </button>
            )}
          </div>
        )}

        <div className="quiz-actions">
          {!answered ? (
            <button
              type="button"
              className="submit-answer"
              onClick={submitAnswer}
              disabled={selected === null}
            >
              Check answer
            </button>
          ) : (
            <button
              type="button"
              className="submit-answer"
              onClick={nextQuestion}
            >
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

function ExplanationText({ text }) {
  if (!text) return null;
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="formatted-explanation">
      {lines.map((line, index) => {
        const isBullet =
          line.startsWith("-") || line.startsWith("•") || /^\d+\./.test(line);

        if (isBullet) {
          return (
            <div key={index} className="explanation-point">
              {line}
            </div>
          );
        }

        return <p key={index}>{line}</p>;
      })}
    </div>
  );
}
