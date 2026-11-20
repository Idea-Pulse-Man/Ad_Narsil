/**
 * Extracted by hand from museum-app/src/lib/quiz/topic.ts (the rest of that
 * file builds member quizzes from the catalog). Keep these in step with the app.
 */
import type { QuizMode } from "./types";

export type QuizDifficulty = "apprentice" | "scholar" | "master";
export type TopicKind = "age" | "empire";

export interface DifficultySpec {
  id: QuizDifficulty;
  /** Court rank shown on the medal. */
  label: string;
  rank: 1 | 2 | 3;
  questionCount: number;
  modes: QuizMode[];
}

/**
 * Empires always listed in the badge case (grayed until unlocked), matching
 * the personalize-your-museum civilisation list.
 */
export const CANONICAL_EMPIRES = [
  "Roman",
  "Greek",
  "Egyptian",
  "Chinese",
  "Japanese",
  "Indian",
  "Mesoamerican",
  "Persian",
  "Byzantine",
] as const;

export const QUIZ_DIFFICULTIES: DifficultySpec[] = [
  {
    id: "apprentice",
    label: "Apprentice",
    rank: 1,
    questionCount: 5,
    modes: ["what", "who", "subject", "where"],
  },
  {
    id: "scholar",
    label: "Scholar",
    rank: 2,
    questionCount: 7,
    modes: ["what", "who", "medium", "period", "museum"],
  },
  {
    id: "master",
    label: "Master",
    rank: 3,
    questionCount: 10,
    modes: ["who", "age", "period", "medium", "museum"],
  },
];
