import { navLinks } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Container } from "./Container";

/** `overlay` floats the bar transparently over a dark full-screen hero. */
export function Navbar({ overlay = false }: { overlay?: boolean }) {
  const link = overlay ? "text-white/80 hover:text-white" : "text-body hover:text-brand";
  const pill = overlay ? "border-white/20 bg-white/10 text-white backdrop-blur" : "border-line bg-white text-ink";

  return (
    <header className={overlay ? "absolute inset-x-0 top-0 z-30" : undefined}>
      <Container className="relative flex h-[76px] items-center justify-between">
        <a href="#" aria-label="Нүүр хуудас">
          <Logo tone={overlay ? "dark" : "light"} />
        </a>

        <nav aria-label="Үндсэн цэс" className="hidden items-center gap-[30px] lg:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className={`text-[15px] leading-[22.5px] font-medium transition ${link}`}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 sm:flex">
          <span className={`rounded-full border px-3.5 py-2 text-[13px] leading-[19.5px] font-semibold ${pill}`}>🌐 MN</span>
          <Button href="#request" variant={overlay ? "inverse" : "primary"}>
            Үнийн санал авах
          </Button>
        </div>

        {/* Mobile menu — native <details>, no client JS needed */}
        <details className="group lg:hidden sm:ml-3">
          <summary
            aria-label="Цэс нээх"
            className={`flex size-10 cursor-pointer list-none items-center justify-center rounded-full border [&::-webkit-details-marker]:hidden ${pill}`}
          >
            <span className="text-lg leading-none group-open:hidden">☰</span>
            <span className="hidden text-lg leading-none group-open:inline">✕</span>
          </summary>
          <nav
            aria-label="Гар утасны цэс"
            className="absolute inset-x-4 top-[72px] z-20 flex flex-col gap-1 rounded-[20px] border border-line bg-white p-3 shadow-[0_12px_30px_rgba(59,45,143,0.12)]"
          >
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="rounded-xl px-3 py-2.5 text-[15px] font-medium text-body hover:bg-cream">
                {l.label}
              </a>
            ))}
            <Button href="#request" className="mt-2 sm:hidden">
              Үнийн санал авах
            </Button>
          </nav>
        </details>
      </Container>
    </header>
  );
}
