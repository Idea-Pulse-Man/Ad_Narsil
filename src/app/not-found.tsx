import { Crest } from "@/components/Crest";
import { PageShell } from "@/components/PageShell";
import { COPY } from "@/content/copy";

export default function NotFound() {
  return (
    <PageShell center>
      <div className="grid justify-items-center gap-6">
        <Crest size={112} className="crest-glow" />
        <h1 className="display-2">{COPY.notFound.title}</h1>
        <a href="/" className="btn-gold">
          {COPY.notFound.back}
        </a>
      </div>
    </PageShell>
  );
}
