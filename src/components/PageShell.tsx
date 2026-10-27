import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SkipLinks } from "./SkipLinks";

/** Pages outside the exhibition: /get, /support, /credits, /joined, 404. */
export function PageShell({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <>
      <SkipLinks content="main" />
      <Header exhibition={false} />
      <main
        id="main"
        className={`spotlight min-h-svh px-4 pb-24 pt-28 min-[390px]:px-5 lg:px-12 lg:pt-36 ${center ? "grid place-items-center text-center" : ""}`}
      >
        <div className={`mx-auto w-full ${center ? "max-w-xl" : "max-w-3xl"}`}>{children}</div>
      </main>
      <Footer />
    </>
  );
}
