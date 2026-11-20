/**
 * Extracted by hand from museum-app/src/lib/quiz/engine/fetch.ts: only
 * normalizeItem and the checks it needs (the rest of that file loads member
 * sessions from storage). Keep these in step with the app.
 */
import {
  ENGINE_ANSWER_TYPES,
  type AnswerType,
  type ChoiceAnswer,
  type ItemOption,
  type MatchAnswer,
  type NumericAnswer,
  type OrderAnswer,
  type QuizItem,
  type TextAnswer,
} from "./types";

const SUPPORTED = new Set<string>(ENGINE_ANSWER_TYPES);

function asJson<T>(raw: unknown, fallback: T): T {
  if (raw == null) return fallback;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
  return raw as T;
}

/** Whether `item` has everything its renderer needs. */
export function isRenderable(item: QuizItem): boolean {
  if (!SUPPORTED.has(item.answer_type) || !item.prompt || !item.media?.label) {
    return false;
  }
  const ids = new Set(item.options.map((o) => o.id));
  const okOptions = item.options.every((o) => typeof o.id === "string" && (o.label || o.image_url));
  if (!okOptions) return false;
  switch (item.answer_type) {
    case "single":
    case "binary":
    case "multi": {
      const correct = (item.answer as ChoiceAnswer).correct;
      return Array.isArray(correct) && correct.length > 0 && correct.every((id) => ids.has(id)) && item.options.length >= 2;
    }
    case "order": {
      const order = (item.answer as OrderAnswer).order;
      return Array.isArray(order) && order.length === ids.size && order.every((id) => ids.has(id));
    }
    case "match": {
      const pairs = (item.answer as MatchAnswer).pairs;
      const targets = new Set((item.media.targets ?? []).map((t) => t.id));
      return !!pairs && targets.size >= 2 && Object.entries(pairs).every(([k, v]) => ids.has(k) && targets.has(v));
    }
    case "numeric": {
      const a = item.answer as NumericAnswer;
      const s = item.media.slider;
      return !!s && Number.isFinite(a.value) && s.min < s.max;
    }
    case "text": {
      const a = item.answer as TextAnswer;
      return Array.isArray(a.accept) && a.accept.length > 0;
    }
    default:
      return false;
  }
}

/** Raw Supabase row → `QuizItem`, or null when it can't be shown. */
export function normalizeItem(raw: Record<string, unknown>): QuizItem | null {
  const item: QuizItem = {
    id: String(raw.id ?? ""),
    style: String(raw.style ?? ""),
    answer_type: String(raw.answer_type ?? "") as AnswerType,
    prompt: String(raw.prompt ?? ""),
    media: asJson(raw.media, { label: "" }),
    options: asJson<ItemOption[]>(raw.options, []),
    answer: asJson(raw.answer, { correct: [] }),
    explain: raw.explain ? String(raw.explain) : null,
    difficulty: raw.difficulty ? String(raw.difficulty) : undefined,
    artwork_ids: Array.isArray(raw.artwork_ids) ? raw.artwork_ids.map(String) : [],
  };
  if (!item.id || !Array.isArray(item.options)) return null;
  return isRenderable(item) ? item : null;
}
