import { COPY } from "@/content/copy";

const link =
  "sr-only-focusable fixed left-4 top-4 z-[60] rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink";

/** "Skip to content" and, on the exhibition, "Skip to download" (the doors). */
export function SkipLinks({ content, download = false }: { content: string; download?: boolean }) {
  return (
    <>
      <a href={`#${content}`} className={link}>
        {COPY.skip.content}
      </a>
      {download && (
        <a href="#doors" className={link}>
          {COPY.skip.download}
        </a>
      )}
    </>
  );
}
