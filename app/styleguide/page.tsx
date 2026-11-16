import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { production, environment, contact } from "@/lib/content";
import {
  colorGroups,
  glyphs,
  gradients,
  layoutTokens,
  letterSpacings,
  lineHeights,
  motions,
  overlays,
  pageSections,
  principles,
  radii,
  semanticRoles,
  spacing,
  typeScale,
} from "@/lib/styleguide";
import { getProducts } from "@/lib/server/products";
import { pageGutter } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProductionSection } from "@/components/sections/ProductionSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { EnvironmentSection } from "@/components/sections/EnvironmentSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SgSection, SgSub, SgDemo, Code, PropRow, LiveSection } from "@/components/styleguide/Sg";
import { SgNav } from "@/components/styleguide/SgNav";
import { TokenSwatch } from "@/components/styleguide/TokenSwatch";
import { LiveSpec } from "@/components/styleguide/LiveSpec";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { SectionTag } from "@/components/ui/SectionTag";
import { Chip } from "@/components/ui/Chip";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Heading } from "@/components/ui/Heading";
import { Field, fieldErrorId } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { FeatureCarousel } from "@/components/cards/FeatureCarousel";
import { PreviewPanel } from "@/components/cards/preview/PreviewPanel";
import { StepList } from "@/components/cards/preview/StepList";
import { StatProgress } from "@/components/cards/preview/StatProgress";
import { InfoRows } from "@/components/cards/preview/InfoRows";
import { StatBubble } from "@/components/cards/StatBubble";
import { EnvTile } from "@/components/cards/EnvTile";
import { BigStatCard } from "@/components/cards/BigStatCard";
import { ChatPreview } from "@/components/cards/ChatPreview";
import { ContactInfoCard } from "@/components/cards/ContactInfoCard";

export const metadata: Metadata = {
  title: "Styleguide — Эм Си Ти Ти дизайн систем",
  description: "MCTT вэб сайтын токен, үсэг, компонентын лавлах.",
  robots: { index: false },
};

// Section 11 renders the live products section, which reads the database on each request.
export const dynamic = "force-dynamic";

export default async function StyleguidePage() {
  const products = await getProducts();

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-cream/95 backdrop-blur">
        <div className={`flex h-16 items-center justify-between ${pageGutter}`}>
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Нүүр хуудас">
              <Image src="/images/logo.png" alt="" width={40} height={30} className="object-cover" />
            </Link>
            <div className="leading-tight">
              <p className="text-[11px] tracking-[0.12em] text-muted">DESIGN SYSTEM</p>
              <p className="text-[15px] font-semibold text-ink">Styleguide</p>
            </div>
          </div>
          <Button href="/" variant="secondary" size="sm">
            ← Сайт руу
          </Button>
        </div>
      </header>

      <div className={`grid gap-10 pb-32 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-20 ${pageGutter}`}>
        <SgNav />

        <main className="min-w-0">
          <div className="max-w-[720px] pt-12 lg:pt-16">
            <h1 className="font-display text-[40px] leading-[1.1] font-extrabold tracking-[-0.02em] text-ink sm:text-[56px]">
              Эм Си Ти Ти <span className="text-brand-gradient">дизайн систем</span>
            </h1>
            <p className="pt-5 text-[17px] leading-[1.6] text-muted">
              Сайтын бодит код дээрээс зурагдсан токен, үсэг, компонентын сан. Өнгөний утга, үсгийн хэмжээг хөтөч дотроос
              шууд уншдаг тул <Code>app/globals.css</Code> өөрчлөгдөхөд энэ хуудас автоматаар шинэчлэгдэнэ. Доорх компонентууд
              нүүр хуудсанд ашиглагдаж буй яг тэр React компонентууд.
            </p>
          </div>

          {/* 01 */}
          <SgSection id="principles" num={1} title="Зарчим">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {principles.map((p) => (
                <div key={p.title} className="rounded-[20px] bg-sand p-5">
                  <h3 className="font-semibold text-ink">{p.title}</h3>
                  <p className="pt-2 text-sm leading-[1.6] text-muted">{p.text}</p>
                </div>
              ))}
            </div>
          </SgSection>

          {/* 02 */}
          <SgSection id="brand" num={2} title="Брэнд">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { bg: "bg-cream border border-line", label: "Цайвар дээр · bg-cream", muted: false },
                { bg: "bg-white border border-line", label: "Карт дээр · bg-white", muted: true },
                { bg: "bg-night-gradient", label: "Бараан дээр · bg-night-gradient", dark: true },
              ].map((b) => (
                <div key={b.label} className={`flex aspect-[4/3] flex-col items-center justify-center gap-4 rounded-[20px] p-6 ${b.bg}`}>
                  {b.dark ? <Logo size="lg" tone="dark" /> : <Logo size="lg" muted={b.muted} />}
                  <span className={`font-mono text-[11px] ${b.dark ? "text-lavender" : "text-muted"}`}>{b.label}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted">
              <Code>public/images/logo.png</Code> · <Code>components/ui/Logo.tsx</Code>. Хэмжээ: <Code>lg</Code> 62×46, утсан дээр 54×40 (Navbar),{" "}
              <Code>md</Code> 46×34 (Footer). Нэр <Code>text-ink</Code>, «ХХК» үргэлж <Code>text-brand</Code>. Бараан дээр{" "}
              <Code>tone=&quot;dark&quot;</Code>: тэмдэг цагаан хавтан дээр, нэр цагаан, «ХХК» lavender.
            </p>
          </SgSection>

          {/* 03 */}
          <SgSection id="color" num={3} title="Өнгө">
            {colorGroups.map((group) => (
              <SgSub key={group.title} title={group.title} code="@theme · globals.css">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 rounded-[20px] border border-line bg-white p-5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                  {group.tokens.map((t) => (
                    <TokenSwatch key={t.name} {...t} />
                  ))}
                </div>
              </SgSub>
            ))}

            <SgSub
              title="Gradient"
              code="@utility"
              description="Gradient нь токен биш utility class. Шинэ gradient нэмэх бол globals.css-д @utility болгон нэмнэ."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {gradients.map((g) => (
                  <div key={g.utility} className="overflow-hidden rounded-[20px] border border-line bg-white">
                    <div className={`h-24 ${g.utility}`} />
                    <div className="p-4">
                      <code className="font-mono text-[13px] font-semibold text-brand">{g.utility}</code>
                      <p className="pt-1 font-mono text-[11px] text-muted">{g.css}</p>
                      <p className="pt-1 text-xs text-muted">{g.usage}</p>
                    </div>
                  </div>
                ))}
                <div className="flex flex-col justify-center rounded-[20px] border border-line bg-white p-6">
                  <p className="font-display text-[40px] leading-none font-extrabold text-brand-gradient">Жонш</p>
                  <code className="pt-3 font-mono text-[13px] font-semibold text-brand">text-brand-gradient</code>
                  <p className="pt-1 text-xs text-muted">Зөвхөн hero гарчгийн онцлох үг</p>
                </div>
              </div>
            </SgSub>

            <SgSub
              title="Семантик үүрэг · гадаргуугаар"
              description={
                <>
                  Нэг брэндтэй тул палитр солигддоггүй; харин цайвар ба бараан гадаргуу дээр үүрэг бүр өөр токен авна. Компонент нь{" "}
                  <Code>tone=&quot;dark&quot;</Code> prop-оор баруун баганыг сонгоно.
                </>
              }
            >
              <div className="overflow-x-auto rounded-[20px] border border-line bg-white">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <th scope="col" className="px-5 py-3.5 font-semibold text-ink">Үүрэг</th>
                      <th scope="col" className="px-5 py-3.5 font-semibold text-ink">Цайвар дэвсгэр</th>
                      <th scope="col" className="bg-navy px-5 py-3.5 font-semibold text-white">Бараан дэвсгэр</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semanticRoles.map((r) => (
                      <tr key={r.role} className="border-b border-line-soft last:border-b-0">
                        <th scope="row" className="px-5 py-3 font-medium text-ink">{r.role}</th>
                        <td className="px-5 py-3">
                          <span className="flex items-center gap-3">
                            <span className="size-6 shrink-0 rounded-full border border-black/10" style={{ background: r.light.css }} />
                            <code className="font-mono text-xs text-muted">{r.light.label}</code>
                          </span>
                        </td>
                        <td className="bg-navy px-5 py-3">
                          <span className="flex items-center gap-3">
                            <span className="size-6 shrink-0 rounded-full border border-white/20" style={{ background: r.dark.css }} />
                            <code className="font-mono text-xs text-lavender">{r.dark.label}</code>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SgSub>

            <SgSub title="Харьцааны дүрэм" description="Contrast-ийг цагаан дэвсгэр дээр тооцсон (WCAG). Энгийн бичвэрт 4.5:1-ээс дээш шаардлагатай.">
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <p className="rounded-2xl bg-mint/60 p-4 text-ink">
                  ✓ <b>ink, body, muted, brand, brand-blue, leaf</b> (≥ 4.5:1): ямар ч хэмжээний бичвэрт ашиглаж болно. Цагаан
                  бичвэр brand gradient-ийн аль ч хэсэг дээр 4.5:1-ээс дээш. Leaf нь mint дэвсгэр дээр ч 4.5:1 хүрнэ.
                </p>
                <p className="rounded-2xl bg-sand p-4 text-ink">
                  ⚠ <b>faint, lavender</b>: зөвхөн placeholder, чимэглэл эсвэл бараан дэвсгэр дээр.
                </p>
              </div>
            </SgSub>
          </SgSection>

          {/* 04 */}
          <SgSection id="type" num={4} title="Үсэг">
            <SgSub title="Үсгийн гэр бүл" code="next/font/google · app/layout.tsx">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[20px] border border-line bg-white p-6">
                  <p className="font-display text-[44px] leading-none font-extrabold text-ink">Аа Өө Үү 0123</p>
                  <p className="pt-4 font-semibold text-ink">Montserrat · Display</p>
                  <p className="pt-1 text-sm text-muted">
                    700, 800 · <Code>font-display</Code> · h1–h4, том тоо, лого
                  </p>
                </div>
                <div className="rounded-[20px] border border-line bg-white p-6">
                  <p className="text-[44px] leading-none font-medium text-ink">Аа Өө Үү 0123</p>
                  <p className="pt-4 font-semibold text-ink">Golos Text · Sans</p>
                  <p className="pt-1 text-sm text-muted">
                    400–800 · <Code>font-sans</Code> (анхдагч) · бичвэр, товч, label
                  </p>
                </div>
              </div>
            </SgSub>

            <SgSub title="Хэмжээний шатлал" description="Figma-ийн тогтмол px утгууд. Section гарчиг бүгд нэг хэмжээтэй (40px, утсан дээр 32px).">
              <div className="flex flex-col gap-5 overflow-hidden rounded-[20px] border border-line bg-white p-5 sm:p-6">
                {typeScale.map((t) => (
                  <div key={t.px} className="grid gap-1 border-b border-line-soft pb-4 last:border-b-0 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-6">
                    <div>
                      <p className="font-mono text-xs font-semibold text-brand">{t.px}</p>
                      <p className="text-xs text-muted">{t.use}</p>
                    </div>
                    <p className={`truncate text-ink ${t.cls}`}>Хүдрээс баяжмал хүртэл</p>
                  </div>
                ))}
              </div>
            </SgSub>

            <SgSub title="Бичвэрийн хэв маяг" description="Доорх утгуудыг хөтөч дээр хэмжиж харуулсан. Цонхны өргөнийг өөрчлөхөд шинэчлэгдэнэ.">
              <div className="flex flex-col gap-6 rounded-[20px] border border-line bg-white p-5 sm:p-8">
                <LiveSpec label="<SectionTag>">
                  <SectionTag>ҮЙЛДВЭРЛЭЛ</SectionTag>
                </LiveSpec>
                <LiveSpec label="Hero хаалга · h1 нь sr-only">
                  <p className="font-display text-[30px] leading-tight font-extrabold text-ink sm:text-[40px]">Хүдэр нийлүүлэх</p>
                </LiveSpec>
                <LiveSpec label={'<Heading level="h2"> · SectionHeader'}>
                  <Heading level="h2" as="p">
                    Хүдрээс баяжмал хүртэл
                  </Heading>
                </LiveSpec>
                <LiveSpec label={'<Heading level="h3"> · FeatureCard'}>
                  <Heading level="h3" as="p">
                    Флотацийн технологи
                  </Heading>
                </LiveSpec>
                <LiveSpec label={'<Heading level="h4"> · EnvTile'}>
                  <Heading level="h4" as="p">
                    Хяналт шинжилгээ
                  </Heading>
                </LiveSpec>
                <LiveSpec label="Lead · section тайлбар">
                  <p className="max-w-[420px] text-[17px] leading-[25.5px] text-muted">{production.description}</p>
                </LiveSpec>
                <LiveSpec label="Body · картын тайлбар">
                  <p className="max-w-[330px] text-[15px] leading-[22.5px] text-muted">
                    Хоёр шатны бутлалт, нунтаглалт, үндсэн ба 6 шатны цэвэрлэгээний флотаци.
                  </p>
                </LiveSpec>
                <LiveSpec label="Panel label">
                  <p className="text-[11px] leading-[16.5px] font-bold tracking-[0.88px] text-muted">ТЕХНОЛОГИЙН ДАМЖЛАГА</p>
                </LiveSpec>
              </div>
            </SgSub>

            <SgSub title="Мөрийн өндөр">
              <div className="grid gap-4 md:grid-cols-2">
                {lineHeights.map((l) => (
                  <div key={l.value} className="rounded-[20px] border border-line bg-white p-5">
                    <p className="flex items-baseline gap-3">
                      <code className="font-mono text-xs font-semibold text-brand">{l.cls}</code>
                      <span className="text-xs text-muted">{l.use}</span>
                    </p>
                    <p className={`max-w-[460px] pt-3 text-[15px] text-body ${l.cls}`}>
                      Өөрийн уурхай болон жижиг олборлогчдоос авсан хүдрийг Сүмбэр сум дахь үйлдвэртээ флотацийн аргаар баяжуулдаг.
                    </p>
                  </div>
                ))}
              </div>
            </SgSub>

            <SgSub title="Үсэг хоорондын зай">
              <div className="rounded-[20px] border border-line bg-white px-5">
                {letterSpacings.map((l) => (
                  <div
                    key={l.value}
                    className="grid items-center gap-2 border-b border-line-soft py-4 last:border-b-0 sm:grid-cols-[140px_200px_minmax(0,1fr)] sm:gap-6"
                  >
                    <code className="font-mono text-xs font-semibold text-brand">{l.value}</code>
                    <span className="text-xs text-muted">{l.use}</span>
                    <span className={`text-ink ${l.cls}`}>{l.sample}</span>
                  </div>
                ))}
              </div>
            </SgSub>
          </SgSection>

          {/* 05 */}
          <SgSection id="spacing" num={5} title="Зай">
            <SgSub title="Ашиглагдаж буй алхмууд" description="Figma-аас шууд авсан утгууд. Tailwind-ийн 4px шатлалд (p-4 = 16px) таарахгүй утгад arbitrary class (p-[22px]) хэрэглэнэ.">
              <div className="flex flex-col gap-2.5 rounded-[20px] border border-line bg-white p-5 sm:p-6">
                {spacing.map((s) => (
                  <div key={s.px} className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[48px_100px_minmax(0,1fr)]">
                    <code className="font-mono text-xs font-semibold text-brand">{s.px}px</code>
                    <div className="h-3 rounded-sm bg-brand-gradient" style={{ width: s.px }} />
                    <span className="col-span-2 text-xs text-muted sm:col-span-1">{s.use}</span>
                  </div>
                ))}
              </div>
            </SgSub>
            <SgSub title="Байршил">
              <div className="rounded-[20px] border border-line bg-white px-5">
                {layoutTokens.map((l) => (
                  <PropRow key={l.name} name={`${l.name} · ${l.value}`}>
                    {l.use}
                  </PropRow>
                ))}
              </div>
            </SgSub>
          </SgSection>

          {/* 06 */}
          <SgSection id="shape" num={6} title="Хэлбэр">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {radii.map((r) => (
                <div key={r.px} className="flex flex-col">
                  <div className="h-24 border border-line bg-sand" style={{ borderRadius: r.px }} />
                  <code className="pt-2.5 font-mono text-xs font-semibold text-brand">
                    {r.px === 999 ? "rounded-full" : `rounded-[${r.px}px]`}
                  </code>
                  <span className="text-xs text-muted">{r.use}</span>
                </div>
              ))}
            </div>
          </SgSection>

          {/* 07 */}
          <SgSection id="stroke" num={7} title="Шугам">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[20px] border border-line bg-white p-5">
                <p className="font-semibold text-ink">Хүрээ</p>
                <p className="pt-1 text-sm text-muted">
                  1px <Code>border-line</Code> · карт, товч, input
                </p>
              </div>
              <div className="rounded-[20px] bg-white p-5">
                <p className="font-semibold text-ink">Мөрийн тусгаарлагч</p>
                <div className="mt-2 border-b border-line-soft pb-2 text-sm text-muted">Ажлын улирал</div>
                <div className="pt-2 text-sm text-muted">
                  1px <Code>border-line-soft</Code> · InfoRows, ChatPreview
                </div>
              </div>
              <div className="rounded-[20px] border border-line bg-white p-5">
                <p className="font-semibold text-ink">Холбох шугам</p>
                <div className="mt-3 max-w-[260px]">
                  <StepList steps={production.steps.slice(0, 3)} />
                </div>
                <p className="pt-2 text-sm text-muted">
                  1px <Code>bg-lavender</Code> / <Code>bg-line</Code> · зөвхөн дараалалд: StepList (uniform connectedness)
                </p>
              </div>
              <div className="rounded-[20px] border border-dashed border-lavender-muted bg-cream p-5">
                <p className="font-semibold text-ink">Тасархай хүрээ</p>
                <p className="pt-1 text-sm text-muted">
                  1px dashed <Code>border-lavender-muted</Code> · <Code>FeatureCard variant=&quot;action&quot;</Code>: бүтээгдэхүүн биш, үйлдэл хүссэн карт
                </p>
              </div>
              <div className="rounded-[20px] bg-contact-gradient p-5">
                <div className="rounded-2xl border border-white/12 bg-white/7 p-4">
                  <p className="font-semibold text-white">Бараан дээрх хүрээ</p>
                  <p className="pt-1 font-mono text-xs text-lavender">border-white/12 · bg-white/7</p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 rounded-[20px] border border-line bg-white p-5">
                <p className="font-semibold text-ink">Focus ring</p>
                <span className="rounded-full bg-brand-gradient px-[22px] py-3 text-[15px] font-semibold text-white outline-2 outline-offset-2 outline-brand-blue">
                  Үнийн санал авах
                </span>
                <p className="text-sm text-muted">
                  Цайвар дэвсгэр: 2px <Code>outline-brand-blue</Code>, offset 2px · <Code>:focus-visible</Code>. Товч, carousel цэг, footer
                  холбоос. Tab дарж шалгаарай.
                </p>
                <div className="mt-1 rounded-2xl bg-night-gradient p-4">
                  <span className="inline-block rounded-sm text-[15px] font-medium text-white outline-2 outline-offset-4 outline-white">
                    Бидний тухай
                  </span>
                  <p className="pt-3 text-sm text-lavender">
                    Бараан дэвсгэр, зураг: <Code>outline-white</Code>. Navbar холбоос, газрын зургийн pin, утасны карт. Hero хаалга
                    дотогшоо <Code>-outline-offset-8</Code>.
                  </p>
                </div>
              </div>
            </div>
          </SgSection>

          {/* 08 */}
          <SgSection id="shade" num={8} title="Сүүдэр, бүрхүүл">
            <div className="grid gap-6 rounded-[20px] bg-sand p-6 sm:grid-cols-3 sm:p-8">
              <div>
                <div className="h-24 rounded-[14px] bg-white drop-shadow-[0px_8px_10px_rgba(20,20,43,0.06)]" />
                <p className="pt-3 text-sm font-semibold text-ink">Panel</p>
                <p className="font-mono text-[11px] text-muted">0 8px 10px ink 6% · PreviewPanel</p>
              </div>
              <div>
                <div className="flex h-24 items-center justify-center">
                  <div className="size-[92px] rounded-full border border-line bg-white drop-shadow-[0px_12px_15px_rgba(59,45,143,0.14)]" />
                </div>
                <p className="pt-3 text-sm font-semibold text-ink">Float</p>
                <p className="font-mono text-[11px] text-muted">0 12px 15px brand 14% · StatBubble</p>
              </div>
              <div>
                <div className="h-24 rounded-[14px] bg-white shadow-[0_12px_30px_rgba(59,45,143,0.12)]" />
                <p className="pt-3 text-sm font-semibold text-ink">Menu</p>
                <p className="font-mono text-[11px] text-muted">0 12px 30px brand 12% · утасны цэс</p>
              </div>
            </div>
            <SgSub title="Зураг дээрх бүрхүүл" description="Hero-ийн хоёр тал. Аль нэг дээр hover хийж үзээрэй: нөгөө нь бүдгэрнэ.">
              <div className="group/split flex h-72 overflow-hidden rounded-[20px]">
                {[
                  { bg: "bg-night-gradient", label: "Баяжмал худалдан авах", image: null },
                  { bg: "bg-brand-gradient", label: "Хүдэр нийлүүлэх", image: "/images/hero-supply.jpg" },
                ].map((d) => (
                  <div
                    key={d.label}
                    className={`group/door relative flex flex-1 items-end p-5 transition-[flex-grow,filter] duration-700 ease-out hover:grow-[1.3] group-hover/split:not-hover:brightness-[0.6] ${d.bg}`}
                  >
                    {d.image && <Image src={d.image} alt="" fill sizes="50vw" className="object-cover object-[50%_65%]" />}
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/5 to-black/55" />
                    <p className="relative font-display text-xl font-extrabold text-white">{d.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-[20px] border border-line bg-white px-5">
                {overlays.map((o) => (
                  <PropRow key={o.name} name={`${o.name} · ${o.value}`}>
                    {o.use}
                  </PropRow>
                ))}
              </div>
            </SgSub>

            <SgSub title="Бүрхүүл">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative h-32 overflow-hidden rounded-[20px] bg-[url('/images/crystal.svg')] bg-contain bg-center bg-no-repeat bg-white">
                  <div className="absolute inset-0 flex items-end bg-navy/60 p-4 backdrop-blur-sm">
                    <p className="font-mono text-xs text-white">backdrop:bg-navy/60 · blur · Dialog</p>
                  </div>
                </div>
                <div className="relative h-32 overflow-hidden rounded-[20px] bg-white">
                  <div className="absolute inset-0 [background-image:radial-gradient(closest-side,rgba(106,79,209,0.22)_0%,rgba(81,94,204,0.16)_25%,rgba(26,127,193,0.1)_50%,rgba(26,127,193,0)_100%)]" />
                  <p className="absolute bottom-4 left-4 font-mono text-xs text-muted">Radial glow · Hero</p>
                </div>
              </div>
            </SgSub>
          </SgSection>

          {/* 09 */}
          <SgSection id="icons" num={9} title="Дүрс">
            <p className="max-w-[680px] text-[15px] leading-[1.6] text-muted">
              Одоогоор icon сан ашиглаагүй, Figma-д байгаа Unicode тэмдэгтүүдийг шууд бичсэн. Чимэглэлийн тэмдэгтэд{" "}
              <Code>aria-hidden</Code> тавина. Icon нэмэгдвэл <Code>lucide-react</Code> зэрэг нэг санг сонгож нэгтгэхийг санал болгоно.
            </p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
              {glyphs.map((g) => (
                <div key={g.glyph} className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-3 text-center">
                  <span aria-hidden className="flex size-11 items-center justify-center rounded-[14px] bg-mint text-lg font-extrabold text-leaf">
                    {g.glyph}
                  </span>
                  <span className="text-[11px] leading-tight text-ink">{g.name}</span>
                  <span className="font-mono text-[10px] text-muted">{g.where}</span>
                </div>
              ))}
            </div>
            <SgSub title="Зураглал" code="public/images/crystal.svg">
              <div className="flex items-center gap-6 rounded-[20px] border border-line bg-white p-6">
                <Image src="/images/crystal.svg" alt="" width={100} height={120} />
                <p className="text-sm text-muted">
                  Hero-ийн голд, 2 хаалганы заагт. 300×360 SVG, өнгийг нь өөрчлөхгүй (opacity, filter хэрэглэхгүй). Зөвхөн нэг удаа гарна.
                </p>
              </div>
            </SgSub>
          </SgSection>

          {/* 10 */}
          <SgSection id="components" num={10} title="Компонент">
            <SgDemo name="Button" file="components/ui/Button.tsx" note={<>Pill хэлбэр. <Code>href</Code> өгвөл {"<a>"}, үгүй бол {"<button>"} болно.</>}>
              <div className="flex flex-wrap items-center gap-3">
                <Button>primary</Button>
                <Button variant="secondary">secondary</Button>
                <Button variant="outline">outline</Button>
                <Button variant="primary" size="sm">
                  primary · sm
                </Button>
                <Button variant="outline" size="sm">
                  outline · sm
                </Button>
              </div>
              <div className="mt-6 rounded-[20px] bg-contact-gradient p-5">
                <Button variant="inverse">inverse</Button>
              </div>
              <div className="mt-6">
                <PropRow name="primary">Гол үйлдэл: үнийн санал, илгээх. Нэг дэлгэцэд ганцыг тавина.</PropRow>
                <PropRow name="secondary">Хоёрдогч үйлдэл, ink бичвэртэй (Залгах).</PropRow>
                <PropRow name="outline">Картын доорх холбоос, brand бичвэртэй (Дэлгэрэнгүй).</PropRow>
                <PropRow name="inverse">Бараан дэвсгэр дээрх гол үйлдэл.</PropRow>
                <PropRow name="size">md (анхдагч) 22×12 · sm 16×8</PropRow>
              </div>
            </SgDemo>

            <SgDemo name="SectionTag · Chip" file="components/ui/SectionTag.tsx · Chip.tsx">
              <div className="flex flex-wrap items-center gap-3">
                <SectionTag>purple</SectionTag>
                <SectionTag tone="green">green</SectionTag>
                <span className="rounded-full bg-navy p-2">
                  <SectionTag tone="glass">glass</SectionTag>
                </span>
                <Chip>Төмөр зам</Chip>
                <Chip>Экспорт</Chip>
              </div>
            </SgDemo>

            <SgDemo name="SectionHeader" file="components/ui/SectionHeader.tsx" note="Tag → гарчиг → тайлбар дээрээс доош ойрхон (Proximity). Өргөн дэлгэцэд тайлбар гарчгаасаа холдохгүй.">
              <SectionHeader tag="ҮЙЛДВЭРЛЭЛ" title="Хүдрээс баяжмал хүртэл" description={production.description} />
            </SgDemo>

            <SgDemo
              name="FeatureCard"
              file="components/cards/FeatureCard.tsx"
              note={
                <>
                  Preview хэсэг нь <Code>preview</Code> prop-оор ямар ч агуулга авна. Онцлох бүтээгдэхүүнд <Code>previewTone=&quot;dark&quot;</Code> +{" "}
                  <Code>badge</Code> + <Code>actionVariant=&quot;primary&quot;</Code>. Үйлдэл хүссэн карт (хүсэлт г.м.) <Code>variant=&quot;action&quot;</Code> — тасархай хүрээ.
                  StepList <Code>highlight</Code>, InfoRows мөрийн <Code>highlight</Code> нь нэг гол зүйлийг онцолно.
                </>
              }
            >
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <FeatureCard
                  title="Флотацийн технологи"
                  description="StepList · highlight={3}"
                  action={{ label: "Дэлгэрэнгүй", href: "#components" }}
                  preview={
                    <PreviewPanel label="StepList">
                      <StepList steps={production.steps} highlight={production.stepsHighlight} highlightLabel="ГОЛ ШАТ" />
                    </PreviewPanel>
                  }
                />
                <FeatureCard
                  title="ФФ-97 баяжмал"
                  description={'previewTone="dark" · badge · actionVariant="primary"'}
                  action={{ label: "Үнийн санал", href: "#components" }}
                  previewTone="dark"
                  badge="Онцлох"
                  actionVariant="primary"
                  preview={
                    <PreviewPanel label="StatProgress">
                      <StatProgress value="≥ 97%" unit="CaF₂" percent={97} />
                      <div className="pt-4">
                        <InfoRows rows={[{ label: "Хэрэглээ", value: "Химийн үйлдвэр" }]} />
                      </div>
                    </PreviewPanel>
                  }
                />
                <FeatureCard
                  variant="action"
                  title="Байршил ба тээвэр"
                  description={'variant="action" · InfoRows highlight'}
                  action={{ label: "Газрын зураг", href: "#components" }}
                  preview={
                    <PreviewPanel label="InfoRows">
                      <InfoRows rows={production.locationRows.slice(0, 3)} spaced />
                    </PreviewPanel>
                  }
                />
              </div>
            </SgDemo>

            <SgDemo
              name="FeatureCarousel"
              file="components/cards/FeatureCarousel.tsx"
              note={<>Нэг картанд хэд хэдэн preview ээлжлэн харуулна. 6 секунд тутамд солигдох ба hover/focus үед зогсоно. Идэвхтэй цэг таймер шиг дүүрнэ. <Code>StatProgress animateIn</Code> слайд нээгдэхэд дүүрнэ.</>}
            >
              <div className="max-w-[560px]">
                <FeatureCarousel
                  label="Жишээ"
                  slides={[
                    {
                      title: "Флотацийн технологи",
                      description: "StepList",
                      action: { label: "Дэлгэрэнгүй", href: "#components" },
                      preview: (
                        <PreviewPanel label="StepList">
                          <StepList steps={production.steps} />
                        </PreviewPanel>
                      ),
                    },
                    {
                      title: "Байршил ба тээвэр",
                      description: "InfoRows · spaced",
                      action: { label: "Газрын зураг", href: "#components" },
                      preview: (
                        <PreviewPanel label="InfoRows">
                          <InfoRows rows={production.locationRows} spaced />
                        </PreviewPanel>
                      ),
                    },
                  ]}
                />
              </div>
            </SgDemo>

            <SgDemo name="StatBubble" file="components/cards/StatBubble.tsx" note="Absolute байрлалтай. Эцэг элемент нь relative байх ёстой.">
              <div className="flex flex-wrap gap-6">
                {[
                  ["97%", "CaF₂"],
                  ["90K", "тн / жил"],
                  ["2005", "оноос"],
                ].map(([v, l]) => (
                  <div key={v} className="relative size-[92px]">
                    <StatBubble value={v} label={l} className="top-0 left-0" />
                  </div>
                ))}
              </div>
            </SgDemo>

            <SgDemo name="BigStatCard · EnvTile" file="components/cards/BigStatCard.tsx · EnvTile.tsx">
              <div className="grid gap-6 lg:grid-cols-2">
                <BigStatCard {...environment.highlight} />
                <div className="grid gap-4 sm:grid-cols-2">
                  {environment.tiles.map((t) => (
                    <EnvTile key={t.title} {...t} />
                  ))}
                </div>
              </div>
            </SgDemo>

            <SgDemo name="ChatPreview" file="components/cards/ChatPreview.tsx · ChatReveal.tsx" note="Static зураглал, оролт нь ажиллахгүй. Дэлгэцэнд орохоор мессежүүд дараалан гарч ирнэ.">
              <div className="max-w-[560px]">
                <ChatPreview />
              </div>
            </SgDemo>

            <SgDemo name="ContactInfoCard" file="components/cards/ContactInfoCard.tsx" dark note={<><Code>href</Code> өгвөл утга нь холбоос болно. <Code>primary</Code> + <Code>hint</Code> — гол холбоо барих суваг: тод карт, том утга, бүтэн карт холбоос.</>}>
              <div className="flex max-w-[480px] flex-col gap-3">
                {contact.items.map((item) => (
                  <ContactInfoCard key={item.label} {...item} />
                ))}
              </div>
            </SgDemo>

            <SgDemo
              name="Field · Input · Select · Textarea"
              file="components/ui/Field.tsx · Input.tsx"
              note={
                <>
                  Хүсэлтийн form эдгээрийг ашигладаг. <Code>invalid</Code> өгвөл улаан хүрээ болон <Code>aria-invalid</Code> нэмэгдэнэ.
                  Бодит form-ыг <Code>/#request</Code> дээрээс нээнэ.
                </>
              }
            >
              <div className="grid max-w-[560px] gap-4 sm:grid-cols-2">
                <Field label="Байгууллага" name="sg-company">
                  <Input name="sg-company" placeholder="Default" />
                </Field>
                <Field label="Утас" name="sg-phone" error="Утасны дугаар буруу байна.">
                  <Input name="sg-phone" defaultValue="12" invalid aria-describedby={fieldErrorId("sg-phone")} />
                </Field>
                <Field label="Бүтээгдэхүүн" name="sg-product">
                  <Select name="sg-product" defaultValue="ff-97">
                    <option value="ff-95">FF-95</option>
                    <option value="ff-97">FF-97</option>
                  </Select>
                </Field>
                <Field label="Имэйл" name="sg-email" optional>
                  <Input name="sg-email" type="email" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Нэмэлт мэдээлэл" name="sg-message" optional>
                    <Textarea name="sg-message" rows={2} />
                  </Field>
                </div>
              </div>
            </SgDemo>

            <SgDemo name="Heading" file="components/ui/Heading.tsx" note={<>Сайтын бүх гарчиг. <Code>level</Code> нь хэмжээ болон tag-ийг, <Code>as</Code> нь зөвхөн tag-ийг солино. <Code>tone=&quot;dark&quot;</Code> бараан дэвсгэрт.</>}>
              <div className="flex flex-col gap-3">
                <Heading level="h1" as="p">h1 · Hero</Heading>
                <Heading level="h2" as="p">h2 · Section</Heading>
                <Heading level="h3" as="p">h3 · Карт</Heading>
                <Heading level="h4" as="p">h4 · Tile</Heading>
              </div>
            </SgDemo>

            <SgSub title="Layout компонент" description="Хуудас бүрт нэг удаа гардаг тул энд жишээгүй, тайлбар л байна. Доорх 11-р хэсэгт амьдаар нь харна.">
              <div className="rounded-[20px] border border-line bg-white px-5">
                <PropRow name="Navbar.tsx">
                  Hero дээр тунгалаг (<Code>overlay</Code>), бүтэн өргөн. Лого, 5 холбоос, хэл, «Үнийн санал авах». xl-ээс (1280px) доош{" "}
                  <Code>{"<details>"}</Code> цэс.
                </PropRow>
                <PropRow name="Container.tsx">
                  <Code>pageGutter</Code>: header болон бүх хэсэг ижил ирмэгтэй (24 / 40px, ≤ 2200px).
                </PropRow>
                <PropRow name="Footer.tsx">2 түвшин: лого + tagline, цэс, утас; доор нь 13px зохиогчийн эрх.</PropRow>
                <PropRow name="QuoteRequestDialog.tsx">
                  <Code>#request</Code> холбоосоор нээгдэх form → <Code>POST /api/requests</Code>.
                </PropRow>
              </div>
            </SgSub>
          </SgSection>

          {/* 11 */}
          <SgSection id="sections" num={11} title="Хэсгүүд">
            <p className="max-w-[680px] text-[15px] leading-[1.6] text-muted">
              Нүүр хуудасны хэсгүүд энд бодит компонентоороо, бодит өгөгдлөөрөө харагдана. <Code>app/page.tsx</Code> тэдгээрийг
              дарааллаар угсардаг; текст нь <Code>lib/content.ts</Code>-д, бүтээгдэхүүн нь database-д.
            </p>

            {/* Hero is full-screen by design, so it is shown through a framed window onto the real page. */}
            <LiveSection
              name={`${pageSections[0].name} · ${pageSections[1].name}`}
              file={`${pageSections[0].file} · ${pageSections[1].file}`}
              note={pageSections[1].note}
              href="/"
            >
              <iframe src="/" title="Нүүр хуудас · Navbar ба hero" loading="lazy" className="block h-[560px] w-full" />
            </LiveSection>
            {[
              { i: 2, el: <AboutSection /> },
              { i: 3, el: <ProductionSection /> },
              { i: 4, el: <ProductsSection products={products} /> },
              { i: 5, el: <EnvironmentSection /> },
              { i: 6, el: <FaqSection /> },
              { i: 7, el: <ContactSection /> },
              { i: 9, el: <Footer /> },
            ].map(({ i, el }) => (
              <LiveSection key={pageSections[i].name} name={pageSections[i].name} file={pageSections[i].file} note={pageSections[i].note} href={pageSections[i].href}>
                {el}
              </LiveSection>
            ))}
          </SgSection>

          {/* 12 */}
          <SgSection id="motion" num={12} title="Хөдөлгөөн">
            <p className="max-w-[680px] text-[15px] leading-[1.6] text-muted">
              Хөдөлгөөн зөвхөн өөрчлөгдөж буй мэдээлэлд (progress, carousel, chat) болон hover-т. Чимэглэлийн хөдөлгөөн хэрэглэхгүй.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {motions.map((m) => (
                <div key={m.name} className="rounded-[20px] border border-line bg-white p-5">
                  <p className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-semibold text-ink">{m.name}</span>
                    <code className="font-mono text-xs text-brand">{m.value}</code>
                  </p>
                  <p className="pt-1.5 text-sm text-muted">{m.use}</p>
                </div>
              ))}
            </div>
            <div>
              <Button size="sm">Hover хийж үзээрэй</Button>
            </div>
          </SgSection>
        </main>
      </div>
    </>
  );
}
