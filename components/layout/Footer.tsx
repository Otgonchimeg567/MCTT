import { company } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer>
      <Container className="flex flex-col gap-4 pt-10 pb-12 sm:flex-row sm:items-center sm:justify-between">
        <Logo size="md" muted />
        <p className="text-sm leading-[21px] text-muted">
          © 2026 {company.name} {company.suffix}. Бүх эрх хуулиар хамгаалагдсан.
        </p>
      </Container>
    </footer>
  );
}
