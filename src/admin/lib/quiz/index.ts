/**
 * Web stand-in for museum-app/src/lib/quiz/index.ts: re-exports only the
 * quiz names the admin screens use (the app's barrel loads the member quiz).
 */
export { MODE_LABEL, QUIZ_MODES, type QuizMode, type QuizQuestion } from "./types";
export { CANONICAL_EMPIRES, QUIZ_DIFFICULTIES, type QuizDifficulty, type TopicKind } from "./topic";
