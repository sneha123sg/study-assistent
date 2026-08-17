import { z } from "zod";

const FlashcardSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});

const QuizQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),

  options: z.array(z.string().min(1)).length(4),

  correctAnswer: z.number().int().min(0).max(3),

  explanation: z.string().min(1),
});

export const StudyPackSchema = z.object({
  topic: z.string().min(1),

  difficulty: z.enum(["beginner", "intermediate", "interview"]),

  summary: z.string().min(1),

  keyPoints: z.array(z.string().min(1)).min(3).max(8),

  flashcards: z.array(FlashcardSchema).min(3).max(10),

  quiz: z.array(QuizQuestionSchema).min(3).max(10),
});

const ElaborationSchema = z.object({
  concept: z.string().min(1),

  simpleExplanation: z.string().min(1),

  whyCorrect: z.string().min(1),

  whyOthersWrong: z.array(z.string().min(1)).length(3),

  example: z.string().min(1),

  takeaway: z.string().min(1),
});

export function validateStudyPack(data) {
  return StudyPackSchema.safeParse(data);
}

export function validateElaboration(data) {
  return ElaborationSchema.safeParse(data);
}
