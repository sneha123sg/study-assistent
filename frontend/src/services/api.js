const API_URL = "http://localhost:5000/api/study";

export async function generateStudyPack({
  topic,
  difficulty,
  flashcardCount,
  quizCount,
  signal,
}) {
  const response = await fetch("http://localhost:5000/api/study/generate", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      topic,
      difficulty,
      flashcardCount,
      quizCount,
    }),

    signal,
  });

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Server returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(result?.error || "Unable to generate study pack.");
  }

  if (!result.success || !result.data) {
    throw new Error("Invalid study pack received.");
  }

  return result.data;
}

export async function elaborateQuizExplanation({
  question,
  options,
  correctAnswer,
  explanation,
}) {
  const response = await fetch("http://localhost:5000/api/study/elaborate", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      question,
      options,
      correctAnswer,
      explanation,
    }),
  });

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Server returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(result?.error || "Unable to elaborate explanation.");
  }

  if (!result.success || !result.explanation) {
    throw new Error("Invalid elaboration response.");
  }

  return result.explanation;
}
