import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// console.log("Gemini API key loaded:", Boolean(process.env.GEMINI_API_KEY));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3.5-flash-lite";

function buildPrompt(topic, difficulty, flashcardCount, quizCount) {
  return `
You are StudyFlow, an expert AI study assistant.

The user wants to learn:

"${topic}"

Difficulty:
"${difficulty}"

Generate a complete interactive study pack.

Generate EXACTLY ${flashcardCount} flashcards.

Generate EXACTLY ${quizCount} quiz questions.

Return ONLY valid JSON.

The JSON must follow this structure:

{
  "topic": "string",
  "difficulty": "beginner | intermediate | interview",
  "summary": "string",
  "keyPoints": [
    "string"
  ],
  "flashcards": [
    {
      "id": "unique string",
      "question": "string",
      "answer": "string"
    }
  ],
  "quiz": [
    {
      "id": "unique string",
      "question": "string",
      "options": [
        "string",
        "string",
        "string",
        "string"
      ],
      "correctAnswer": 0,
      "explanation": "string"
    }
  ]
}

Rules:

- Generate EXACTLY ${flashcardCount} flashcards.
- Generate EXACTLY ${quizCount} quiz questions.
- Exactly 4 options per quiz question.
- correctAnswer must be a zero-based index.
- Every quiz must have exactly one correct answer.
- Keep flashcard answers concise: 1-3 sentences.
- Keep quiz explanations concise: 1-3 sentences.
- Keep the summary under 80 words.
- Keep each key point concise.
- Avoid duplicate questions.
- Keep content technically accurate.
- Adapt the content to ${difficulty}.
- Return ONLY valid JSON.
`;
}

export async function generateStudyPack(
  topic,
  difficulty,
  flashcardCount,
  quizCount,
) {
  const prompt = buildPrompt(topic, difficulty, flashcardCount, quizCount);

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text;

  if (!text || !text.trim()) {
    throw new Error("Gemini returned an empty response.");
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini raw response:", text);

    throw new Error("Gemini returned invalid JSON.");
  }
}

export async function elaborateExplanation({
  question,
  options,
  correctAnswer,
  explanation,
}) {
  const prompt = `
You are an expert AI tutor.

A student answered this multiple-choice question and clicked
"Elaborate" because they did not understand the explanation.

Question:
"${question}"

Options:
${options.map((option, index) => `${index}. ${option}`).join("\n")}

Correct answer:
"${options[correctAnswer]}"

Original explanation:
"${explanation}"

Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "concept": "Short name of the concept being tested",
  "simpleExplanation": "Explain the concept in simple language.",
  "whyCorrect": "Clearly explain why the correct option is correct.",
  "whyOthersWrong": [
    "Explain why option 1 is wrong.",
    "Explain why option 2 is wrong.",
    "Explain why option 3 is wrong."
  ],
  "example": "Give a simple practical example or analogy.",
  "takeaway": "Give one short thing the student should remember."
}

Rules:

- Do not return markdown.
- Do not return code fences.
- Return valid JSON only.
- Keep the language simple and student-friendly.
- Do not repeat the original explanation word-for-word.
- Explain the underlying concept.
- The whyOthersWrong array must contain exactly 3 items.
- Keep each section concise.
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text;

  if (!text || !text.trim()) {
    throw new Error("Gemini returned an empty elaboration.");
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini elaboration response:", text);

    throw new Error("Gemini returned invalid elaboration JSON.");
  }
}
