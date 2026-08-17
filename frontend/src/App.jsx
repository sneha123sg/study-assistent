import { useRef, useState } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import TopicForm from "./components/TopicForm";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import StudyDashboard from "./components/StudyDashboard";
import Results from "./components/Results";

import { generateStudyPack } from "./services/api";

export default function App() {
  const [studyPack, setStudyPack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRequest, setLastRequest] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [retryQuestions, setRetryQuestions] = useState([]);
  const abortControllerRef = useRef(null);

  async function handleGenerate({
    topic,
    difficulty,
    flashcardCount,
    quizCount,
  }) {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setLoading(true);
    setError(null);
    setStudyPack(null);
    setQuizResult(null);
    setRetryQuestions([]);
    setLastRequest({
      topic,
      difficulty,
      flashcardCount,
      quizCount,
    });

    try {
      const data = await generateStudyPack({
        topic,
        difficulty,
        flashcardCount,
        quizCount,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      setStudyPack(data);
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }

  function handleRetry() {
    if (lastRequest) {
      handleGenerate(lastRequest);
    }
  }

  function handleNewTopic() {
    setStudyPack(null);
    setQuizResult(null);
    setRetryQuestions([]);
    setError(null);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleReviewMistakes(wrongQuestions) {
    if (!wrongQuestions || wrongQuestions.length === 0) {
      return;
    }

    setRetryQuestions(wrongQuestions);

    setQuizResult(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleRetryComplete() {
    setRetryQuestions([]);
  }

  return (
    <div className="App">
      <Header onLogoClick={handleNewTopic} />

      {!studyPack && !loading && <Hero />}

      <main className="main-container">
        {!studyPack && !loading && (
          <div id="topic-form">
            <TopicForm onGenerate={handleGenerate} loading={loading} />
          </div>
        )}
        {loading && <LoadingState />}
        {error && !loading && (
          <ErrorState message={error} onRetry={handleRetry} />
        )}
        {!studyPack && !loading && !error && <EmptyState />}
        {studyPack && !loading && !error && (
          <>
            <StudyDashboard
              studyPack={studyPack}
              quizResult={quizResult}
              setQuizResult={setQuizResult}
              retryQuestions={retryQuestions}
              onRetryComplete={() => setRetryQuestions([])}
            />

            {quizResult && !retryQuestions.length && (
              <Results
                result={quizResult}
                onRetry={handleReviewMistakes}
                onNewTopic={handleNewTopic}
              />
            )}

            <button className="floating-new-topic" onClick={handleNewTopic}>
              + New topic
            </button>
          </>
        )}
      </main>

      <footer>
        <div>
          <strong>Your-Study-Assistent</strong>
          <br />
          <span>Built for active learning with AI.</span>
        </div>
      </footer>
    </div>
  );
}
