const API_URL = "http://localhost:5000/api/study";

export async function generateStudyPack({ topic, difficulty, signal }) {
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic,
      difficulty,
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
