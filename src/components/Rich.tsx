/** Renders copy with its one *italic* word as <em>. */
export function Rich({ text }: { text: string }) {
  return text
    .split(/(\*[^*]+\*)/)
    .map((part, i) => (part.length > 2 && part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : part));
}
