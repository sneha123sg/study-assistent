import express from "express";

import { generateStudyPack, elaborateExplanation } from "../services/llm.js";

import {
  validateStudyPack,
  validateElaboration,
} from "../validation/studySchema.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { topic, difficulty, flashcardCount, quizCount } = req.body;

    // console.log("REQUEST:", req.body);

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please enter a topic.",
      });
    }

    const allowedDifficulty = ["beginner", "intermediate", "interview"];

    if (!allowedDifficulty.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        error: "Invalid difficulty level.",
      });
    }

    const requestedFlashcardCount =
      flashcardCount === undefined ? 6 : Number(flashcardCount);

    const requestedQuizCount = quizCount === undefined ? 6 : Number(quizCount);

    if (
      !Number.isInteger(requestedFlashcardCount) ||
      requestedFlashcardCount < 3 ||
      requestedFlashcardCount > 10
    ) {
      return res.status(400).json({
        success: false,
        error: "Flashcard count must be between 3 and 10.",
      });
    }

    if (
      !Number.isInteger(requestedQuizCount) ||
      requestedQuizCount < 3 ||
      requestedQuizCount > 10
    ) {
      return res.status(400).json({
        success: false,
        error: "Quiz count must be between 3 and 10.",
      });
    }

    console.log(
      `Generating ${requestedFlashcardCount} flashcards and ${requestedQuizCount} quizzes`,
    );

    const rawStudyPack = await generateStudyPack(
      topic.trim(),
      difficulty,
      requestedFlashcardCount,
      requestedQuizCount,
    );

    const validation = validateStudyPack(rawStudyPack);

    if (!validation.success) {
      console.error("Zod validation error:", validation.error);

      return res.status(422).json({
        success: false,
        error: "AI returned an unexpected study pack format.",
      });
    }

    const validated = validation.data;

    if (validated.flashcards.length !== requestedFlashcardCount) {
      return res.status(422).json({
        success: false,
        error:
          `AI generated ${validated.flashcards.length} flashcards, ` +
          `but ${requestedFlashcardCount} were requested.`,
      });
    }

    if (validated.quiz.length !== requestedQuizCount) {
      return res.status(422).json({
        success: false,
        error:
          `AI generated ${validated.quiz.length} quizzes, ` +
          `but ${requestedQuizCount} were requested.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: validated,
    });
  } catch (error) {
    console.error("Study generation error:", error);

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        "Something went wrong while generating your study pack.",
    });
  }
});

router.post("/elaborate", async (req, res) => {
  try {
    const { question, options, correctAnswer, explanation } = req.body;

    if (
      !question ||
      !Array.isArray(options) ||
      options.length !== 4 ||
      typeof correctAnswer !== "number" ||
      correctAnswer < 0 ||
      correctAnswer > 3 ||
      !explanation
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid quiz question data.",
      });
    }

    const rawElaboration = await elaborateExplanation({
      question,
      options,
      correctAnswer,
      explanation,
    });

    const validation = validateElaboration(rawElaboration);

    if (!validation.success) {
      console.error("Elaboration Zod error:", validation.error);

      return res.status(422).json({
        success: false,
        error: "AI returned an invalid elaboration format.",
      });
    }

    return res.status(200).json({
      success: true,
      explanation: validation.data,
    });
  } catch (error) {
    console.error("Elaboration error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Unable to elaborate explanation.",
    });
  }
});

export default router;
