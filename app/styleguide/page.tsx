import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { production, environment, contact } from "@/lib/content";
import {
  colorGroups,
  glyphs,
  gradients,
  layoutTokens,
  pageSections,
  principles,
  radii,
  spacing,
  typeScale,
} from "@/lib/styleguide";
import { SgSection, SgSub, SgDemo, Code, PropRow } from "@/components/styleguide/Sg";
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

export default function StyleguidePage() {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-cream/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 lg:px-8">
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

      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 pb-32 lg:grid-cols-[200px_minmax(0,1fr)] lg:px-8">
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
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                  {b.dark ? (
                    <span className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2">
                      <Logo size="md" />
                    </span>
                  ) : (
                    <Logo size="lg" muted={b.muted} />
                  )}
                  <span className={`font-mono text-[11px] ${b.dark ? "text-lavender" : "text-muted"}`}>{b.label}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted">
              <Code>public/images/logo.png</Code> · <Code>components/ui/Logo.tsx</Code>. Хэмжээ: <Code>lg</Code> 46×34 (Navbar),{" "}
              <Code>md</Code> 36×27 (Footer). Нэр <Code>text-ink</Code>, «ХХК» үргэлж <Code>text-brand</Code>. Лого нь бараан дэвсгэрт
              зориулсан хувилбаргүй тул бараан дээр цагаан pill дотор байрлуулна.
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

            <SgSub title="Харьцааны дүрэм" description="Contrast-ийг цагаан дэвсгэр дээр тооцсон (WCAG). Энгийн бичвэрт 4.5:1-ээс дээш шаардлагатай.">
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <p className="rounded-2xl bg-mint/60 p-4 text-ink">
                  ✓ <b>ink, body, muted, brand, leaf</b> (≥ 4.5:1): ямар ч хэмжээний бичвэрт ашиглаж болно. Leaf нь mint дэвсгэр
                  дээр ч 4.5:1 хүрнэ.
                </p>
                <p className="rounded-2xl bg-sand p-4 text-ink">
                  ⚠ <b>brand-blue</b> (≈ 4.3:1): зөвхөн 18px+ эсвэл тод бичвэрт. <b>faint, lavender</b>: зөвхөн placeholder,
                  чимэглэл эсвэл бараан дэвсгэр дээр.
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

            <SgSub title="Хэмжээний шатлал" description="Figma-ийн тогтмол px утгууд. Утсан дээр 48 → 32, 56 → 36 болж багасна.">
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
                <LiveSpec label={'<Heading level="h1"> · Hero'}>
                  <Heading level="h1" as="p">
                    Эм Си Ти Ти Жонш
                  </Heading>
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
                  1px <Code>border-line-soft</Code> · InfoRows, StepList
                </div>
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
                  2px <Code>outline-brand-blue</Code>, offset 2px · <Code>:focus-visible</Code>. Tab дарж шалгаарай.
                </p>
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
                <p className="text-sm text-muted">Hero-ийн жоншны болор. 300×360 SVG, өнгийг нь өөрчлөхгүй.</p>
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

            <SgDemo name="SectionHeader" file="components/ui/SectionHeader.tsx" note="Tag + гарчиг зүүн талд, тайлбар баруун талд (lg-ээс доош доороо).">
              <SectionHeader tag="ҮЙЛДВЭРЛЭЛ" title="Хүдрээс баяжмал хүртэл" description={production.description} />
            </SgDemo>

            <SgDemo
              name="FeatureCard"
              file="components/cards/FeatureCard.tsx"
              note={<>Preview хэсэг нь <Code>preview</Code> prop-оор ямар ч агуулга авна. <Code>previewTone=&quot;dark&quot;</Code> онцлох бүтээгдэхүүнд.</>}
            >
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <FeatureCard
                  title="Флотацийн технологи"
                  description="Хоёр шатны бутлалт, нунтаглалт, үндсэн ба 6 шатны цэвэрлэгээний флотаци."
                  action={{ label: "Дэлгэрэнгүй", href: "#components" }}
                  preview={
                    <PreviewPanel label="StepList">
                      <StepList steps={production.steps} />
                    </PreviewPanel>
                  }
                />
                <FeatureCard
                  title="ФФ-97 баяжмал"
                  description={'previewTone="dark" · StatProgress + InfoRows'}
                  action={{ label: "Үнийн санал", href: "#components" }}
                  previewTone="dark"
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
                  title="Байршил ба тээвэр"
                  description="InfoRows · spaced"
                  action={{ label: "Газрын зураг", href: "#components" }}
                  preview={
                    <PreviewPanel label="InfoRows">
                      <InfoRows rows={production.locationRows.slice(0, 3)} spaced />
                    </PreviewPanel>
                  }
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

            <SgDemo name="ChatPreview" file="components/cards/ChatPreview.tsx" note="Static зураглал, оролт нь ажиллахгүй.">
              <div className="max-w-[560px]">
                <ChatPreview />
              </div>
            </SgDemo>

            <SgDemo name="ContactInfoCard" file="components/cards/ContactInfoCard.tsx" dark note={<><Code>href</Code> өгвөл утга нь холбоос болно.</>}>
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
          </SgSection>

          {/* 11 */}
          <SgSection id="sections" num={11} title="Хэсгүүд">
            <p className="max-w-[680px] text-[15px] leading-[1.6] text-muted">
              Нүүр хуудас <Code>app/page.tsx</Code> нь эдгээр хэсгийг дарааллаар нь угсардаг. Текст нь <Code>lib/content.ts</Code>-д,
              бүтээгдэхүүн нь database-д хадгалагдана.
            </p>
            <ol className="grid gap-3 md:grid-cols-2">
              {pageSections.map((s, i) => (
                <li key={s.name}>
                  <a href={s.href} className="flex h-full gap-4 rounded-[20px] border border-line bg-white p-5 transition hover:border-brand/30">
                    <span className="font-mono text-xs text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex flex-col">
                      <span className="font-semibold text-ink">{s.name} ↗</span>
                      <code className="pt-0.5 font-mono text-[11px] text-brand">{s.file}</code>
                      <span className="pt-1.5 text-sm text-muted">{s.note}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </SgSection>

          {/* 12 */}
          <SgSection id="motion" num={12} title="Хөдөлгөөн">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[20px] border border-line bg-white p-5">
                <p className="font-semibold text-ink">Hover</p>
                <p className="pt-1 text-sm text-muted">
                  <Code>transition</Code> 150ms ease. Primary товч гэрэлтэнэ (<Code>brightness-110</Code>), бусад нь хүрээ/өнгө солино.
                </p>
                <div className="pt-4">
                  <Button size="sm">Hover хийж үзээрэй</Button>
                </div>
              </div>
              <div className="rounded-[20px] border border-line bg-white p-5">
                <p className="font-semibold text-ink">Smooth scroll</p>
                <p className="pt-1 text-sm text-muted">
                  Anchor холбоос (<Code>#production</Code>) зөөлөн гүйлгэнэ. Хэсэг бүр <Code>scroll-mt-6</Code>-тай.
                </p>
              </div>
              <div className="rounded-[20px] border border-line bg-white p-5">
                <p className="font-semibold text-ink">Reduced motion</p>
                <p className="pt-1 text-sm text-muted">
                  <Code>prefers-reduced-motion</Code> үед гүйлгэлт, transition бүгд зогсоно (globals.css).
                </p>
              </div>
            </div>
          </SgSection>
        </main>
      </div>
    </>
  );
}
