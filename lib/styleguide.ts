/** Reference data for /styleguide. Colour values are NOT duplicated here — they are read live from globals.css. */

export const sgNav = [
  { id: "principles", label: "Зарчим" },
  { id: "brand", label: "Брэнд" },
  { id: "color", label: "Өнгө" },
  { id: "type", label: "Үсэг" },
  { id: "spacing", label: "Зай" },
  { id: "shape", label: "Хэлбэр" },
  { id: "stroke", label: "Шугам" },
  { id: "shade", label: "Сүүдэр, бүрхүүл" },
  { id: "icons", label: "Дүрс" },
  { id: "components", label: "Компонент" },
  { id: "sections", label: "Хэсгүүд" },
  { id: "motion", label: "Хөдөлгөөн" },
] as const;

export const principles = [
  {
    title: "Нэг брэнд gradient",
    text: "Цэнхэрээс (#1a7fc1) ягаан (#3b2d8f) руу шилжих gradient нь гол үйлдлийг заана. Хуудас cream, карт цагаан; бараан navy зөвхөн онцлох мэдээлэлд.",
  },
  {
    title: "Montserrat гарчиг, Golos бичвэр",
    text: "Гарчиг, том тоо: Montserrat 700–800. Бичвэр, товч, label: Golos Text. Хоёулаа кирилл (Ө, Ү) бүрэн дэмжинэ.",
  },
  {
    title: "Нэг гол цэг",
    text: "Карт, хэсэг бүрт ганц онцлох зүйл (өнгө, хэмжээ, байрлалаар). Бусад нь бүдэгрэнэ. Өнцөг, налуу үсэг хэрэглэхгүй.",
  },
  {
    title: "Gestalt бүтэц",
    text: "Хамааралтай зүйл ойрхон (proximity), нэг гадаргуу дээр (common region), ижил хэв маягтай (similarity), шугамаар холбогдсон.",
  },
  {
    title: "Түүхий утга биш токен",
    text: "Өнгө, фонтыг globals.css-ийн @theme-ээс авна. Шинэ өнгө хэрэгтэй бол эхлээд токен болгож нэмнэ.",
  },
  {
    title: "Тайван хөдөлгөөн",
    text: "Хөдөлгөөн зөвхөн \"амьд\" мэдээлэлд: progress, carousel, chat. Reduced motion үед бүгд зогсож шууд харагдана.",
  },
];

/** Colour roles on the two surface types. Components pick the right column via their `tone` prop. */
export const semanticRoles: { role: string; light: { label: string; css: string }; dark: { label: string; css: string } }[] = [
  { role: "Бичвэр, гарчиг", light: { label: "ink", css: "var(--color-ink)" }, dark: { label: "white", css: "#ffffff" } },
  { role: "Туслах бичвэр", light: { label: "muted", css: "var(--color-muted)" }, dark: { label: "lavender", css: "var(--color-lavender)" } },
  { role: "Label, eyebrow", light: { label: "muted", css: "var(--color-muted)" }, dark: { label: "lavender-muted", css: "var(--color-lavender-muted)" } },
  { role: "Карт", light: { label: "white", css: "#ffffff" }, dark: { label: "white / 7%", css: "rgba(255,255,255,0.07)" } },
  { role: "Хүрээ", light: { label: "line", css: "var(--color-line)" }, dark: { label: "white / 12%", css: "rgba(255,255,255,0.12)" } },
  { role: "Гол үйлдэл", light: { label: "brand-gradient · primary", css: "var(--color-brand)" }, dark: { label: "white · inverse", css: "#ffffff" } },
  { role: "Tag", light: { label: "lilac + brand", css: "var(--color-lilac)" }, dark: { label: "white / 12% · glass", css: "rgba(255,255,255,0.12)" } },
];

export const lineHeights = [
  { value: "1.2", use: "Section гарчиг (h2)", cls: "leading-[1.2]" },
  { value: "1.5", use: "Картын гарчиг (h3, h4), товч, картын тайлбар", cls: "leading-[1.5]" },
  { value: "1.6", use: "Удаан уншигдах тайлбар, Бидний тухай догол мөр", cls: "leading-[1.6]" },
];

export const letterSpacings = [
  { value: "-0.02em", use: "h1, h2", sample: "Хүдрээс баяжмал хүртэл", cls: "font-display text-[22px] font-extrabold tracking-[-0.02em]" },
  { value: "0.52px", use: "SectionTag", sample: "ҮЙЛДВЭРЛЭЛ", cls: "text-[13px] font-semibold tracking-[0.52px]" },
  { value: "0.88–0.96px", use: "Panel label, contact label", sample: "ТЕХНОЛОГИЙН ДАМЖЛАГА", cls: "text-[11px] font-bold tracking-[0.88px]" },
  { value: "0.2–0.24em", use: "Hero хаалганы tag, footer tagline", sample: "ГОВЬСҮМБЭР · СҮМБЭР", cls: "text-xs font-semibold tracking-[0.2em]" },
];

export const overlays = [
  { name: "Hero photo", value: "black 25% → 5% → 55%", use: "Хаалганы зураг/gradient дээрх бичвэрийг уншигдахуйц болгоно (доод хэсэг хамгийн бараан)." },
  { name: "Hover dim", value: "brightness 0.6", use: "Hero-ийн нэг талыг hover хийхэд нөгөө тал бүдгэрнэ. Доорх зураг дээр hover хийж үзээрэй." },
  { name: "Dialog", value: "navy 60% · blur", use: "Хүсэлтийн dialog нээгдэх үеийн арын бүрхүүл." },
];

export const motions = [
  { name: "Hero хаалга", value: "700ms ease-out", use: "Hover хийсэн тал 1.3 дахин өргөсч, зураг 105% томорно, нөгөө тал бүдгэрнэ." },
  { name: "Carousel", value: "6s · 500ms fade", use: "Слайд 6 секунд тутам солигдоно; идэвхтэй цэг таймер шиг дүүрнэ, hover/focus үед зогсоно." },
  { name: "Progress fill", value: "700ms · 150ms delay", use: "StatProgress animateIn: слайд нээгдэхэд 0-ээс дүүрнэ." },
  { name: "Chat reveal", value: "500ms · 120ms алхам", use: "Мессежүүд дэлгэцэнд орохоор дараалан гарч ирнэ (ChatReveal)." },
  { name: "Hover", value: "150ms ease", use: "Primary товч brightness-110, бусад нь хүрээ/өнгө солино." },
  { name: "Reduced motion", value: "0.01ms · delay 0", use: "prefers-reduced-motion үед бүх transition, animation шууд дуусна (globals.css)." },
];

export type ColorToken = { name: string; utility: string; usage: string };

export const colorGroups: { title: string; note?: string; tokens: ColorToken[] }[] = [
  {
    title: "Бичвэр",
    tokens: [
      { name: "ink", utility: "text-ink", usage: "Үндсэн бичвэр, гарчиг" },
      { name: "body", utility: "text-body", usage: "Navbar холбоос" },
      { name: "muted", utility: "text-muted", usage: "Тайлбар, туслах бичвэр" },
      { name: "faint", utility: "text-faint", usage: "Placeholder, хоосон утга" },
    ],
  },
  {
    title: "Брэнд",
    tokens: [
      { name: "brand", utility: "text-brand", usage: "Гол өнгө: tag, тоо, холбоос" },
      { name: "brand-blue", utility: "from-brand-blue", usage: "Gradient эхлэл, focus ring" },
      { name: "brand-violet", utility: "to-brand-violet", usage: "Gradient төгсгөл, progress" },
      { name: "navy", utility: "bg-navy", usage: "Бараан хэсгийн суурь" },
    ],
  },
  {
    title: "Гадаргуу ба шугам",
    tokens: [
      { name: "cream", utility: "bg-cream", usage: "Хуудасны дэвсгэр" },
      { name: "sand", utility: "bg-sand", usage: "Preview, chat bubble" },
      { name: "line", utility: "border-line", usage: "Карт, товчны хүрээ" },
      { name: "line-soft", utility: "border-line-soft", usage: "Мөр хоорондын шугам" },
      { name: "track", utility: "bg-track", usage: "Progress bar-ийн суурь" },
    ],
  },
  {
    title: "Туслах",
    tokens: [
      { name: "lilac", utility: "bg-lilac", usage: "Tag, chip-ийн дэвсгэр" },
      { name: "lavender", utility: "text-lavender", usage: "Бараан дээрх тайлбар" },
      { name: "lavender-muted", utility: "text-lavender-muted", usage: "Бараан дээрх label" },
      { name: "mint", utility: "bg-mint", usage: "Байгаль орчны tag, icon" },
      { name: "leaf", utility: "text-leaf", usage: "Байгаль орчны бичвэр" },
    ],
  },
];

export const gradients = [
  { utility: "bg-brand-gradient", css: "165deg · brand-blue → brand", usage: "Primary товч, chat bubble" },
  { utility: "bg-brand-gradient-diagonal", css: "135deg · brand-blue → brand", usage: "Дугуй badge, илгээх товч" },
  { utility: "bg-night-gradient", css: "165deg · navy 8.5% → brand 91.5%", usage: "Онцлох карт, ФФ-97 preview" },
  { utility: "bg-contact-gradient", css: "173deg · navy → #2a2370", usage: "Холбоо барих блок" },
];

export const typeScale = [
  { cls: "text-[11px] leading-[16.5px]", px: "11 / 16.5", use: "Panel label, bubble тайлбар" },
  { cls: "text-[12px] leading-[18px]", px: "12 / 18", use: "Chip, contact label, badge, алхмын дугаар" },
  { cls: "text-[13px] leading-[19.5px]", px: "13 / 19.5", use: "Section tag" },
  { cls: "text-[14px] leading-[21px]", px: "14 / 21", use: "Жижиг товч, мөр, footer" },
  { cls: "text-[15px] leading-[22.5px]", px: "15 / 22.5", use: "Товч, картын тайлбар" },
  { cls: "text-[17px] leading-[25.5px]", px: "17 / 25.5", use: "Section тайлбар, lead" },
  { cls: "text-[19px] leading-[28.5px]", px: "19 / 28.5", use: "Hero тайлбар" },
  { cls: "font-display font-extrabold text-[22px] leading-[33px]", px: "22 / 33", use: "Картын гарчиг (h3)" },
  { cls: "font-display font-extrabold text-[34px] leading-[37.4px]", px: "34 / 37.4", use: "Preview доторх тоо" },
  { cls: "font-display font-extrabold text-[40px] leading-[48px] tracking-[-0.8px]", px: "40 / 48", use: "Section гарчиг (h2) · утсан дээр 32" },
  { cls: "font-display font-extrabold text-[40px] leading-[48px]", px: "30–40", use: "Hero хаалганы гарчиг" },
  { cls: "font-display font-extrabold text-[88px] leading-[96.8px]", px: "88 / 96.8", use: "Онцлох том тоо (BigStatCard)" },
];

export const spacing = [
  { px: 4, use: "Chip дотор (босоо)" },
  { px: 8, use: "Жижиг товч, мөрийн padding" },
  { px: 10, use: "Лого–бичвэр, MN–CTA, алхмын зай" },
  { px: 12, use: "Chat bubble хоорондын зай, contact картууд" },
  { px: 14, use: "Tag-аас гарчиг хүртэл" },
  { px: 16, use: "Картын padding, gutter" },
  { px: 22, use: "Preview, товчны хэвтээ padding" },
  { px: 24, use: "Grid-ийн зай" },
  { px: 28, use: "Chat картын padding" },
  { px: 40, use: "Гарчгаас grid хүртэл" },
  { px: 64, use: "Contact блокийн padding" },
  { px: 96, use: "Section-ийн босоо зай" },
];

export const layoutTokens = [
  { name: "Container", value: "Бүтэн өргөн, 24 / 40px gutter (≤ 2200px)", use: "Header-тэй ижил ирмэг (max-w-[2200px] px-6 lg:px-10)" },
  { name: "Navbar", value: "88px (утсан дээр 76px)", use: "Header-ийн өндөр, hero дээр тунгалаг" },
  { name: "Preview panel", value: "≤ 460px", use: "Өргөн карт дотор label, утга хоёр холдохгүй (proximity)" },
  { name: "Section", value: "96px (утсан дээр 64px)", use: "py-16 sm:py-24" },
  { name: "Breakpoint", value: "sm 640 · md 768 · lg 1024", use: "lg-ээс доош нэг/хоёр багана" },
];

export const radii = [
  { px: 12, use: "Алхмын дугаар (24px дугуй)" },
  { px: 14, use: "Preview panel, icon дэвсгэр" },
  { px: 18, use: "Chat bubble" },
  { px: 20, use: "Preview хэсэг, contact карт" },
  { px: 22, use: "Байгаль орчны tile" },
  { px: 28, use: "Үндсэн карт, dialog" },
  { px: 36, use: "Contact блок" },
  { px: 999, use: "Товч, tag, chip, input (pill)" },
];

export const glyphs = [
  { glyph: "♻", name: "Хог хаягдал", where: "EnvTile" },
  { glyph: "⚗", name: "Хяналт шинжилгээ", where: "EnvTile" },
  { glyph: "▦", name: "Химийн агуулах", where: "EnvTile" },
  { glyph: "✓", name: "Аюулгүй ажиллагаа, амжилт", where: "EnvTile, form" },
  { glyph: "→", name: "Илгээх", where: "ChatPreview" },
  { glyph: "☰", name: "Цэс нээх", where: "Navbar (утас)" },
  { glyph: "✕", name: "Хаах", where: "Navbar, dialog" },
  { glyph: "🌐", name: "Хэл", where: "Navbar" },
  { glyph: "📞", name: "Залгах", where: "Hero" },
];

export const pageSections = [
  { name: "Navbar", file: "components/layout/Navbar.tsx", href: "/", note: "Лого, 5 холбоос, хэл, CTA. xl-ээс (1280px) доош <details> цэс." },
  { name: "SplitHero", file: "components/sections/SplitHero.tsx", href: "/", note: "Бүтэн дэлгэц, 2 хаалга (худалдан авагч / нийлүүлэгч), гарчиг нь доод булангуудад, жоншны болор голд нь. Hover хийсэн тал өргөсч, нөгөө нь бүдгэрнэ." },
  { name: "About", file: "components/sections/AboutSection.tsx", href: "/#about", note: "SectionHeader, 3 догол мөр, доор нь 16:9 VideoFrame (components/ui/VideoFrame.tsx): дуугүй давталттай видео, дэлгэцэнд байхдаа л тоглоно, reduced motion үед poster зураг. Файлгүй үед live сайтад нуугдана." },
  { name: "Production", file: "components/sections/ProductionSection.tsx", href: "/#production", note: "Зүүн талд том visual, баруун талд FeatureCarousel: дамжлага, хүчин чадал, байршил." },
  { name: "Products", file: "components/sections/ProductsSection.tsx", href: "/#products", note: "Database-ээс уншдаг ФФ-95 / ФФ-97. Онцлох бүтээгдэхүүн badge + primary товчтой, хүсэлтийн карт variant=\"action\"." },
  { name: "Environment", file: "components/sections/EnvironmentSection.tsx", href: "/#environment", note: "BigStatCard + 2×2 EnvTile." },
  { name: "FAQ", file: "components/sections/FaqSection.tsx", href: "/#suppliers", note: "Текст + ChatPreview." },
  { name: "Contact", file: "components/sections/ContactSection.tsx", href: "/#contact", note: "Бараан блок, 3 ContactInfoCard." },
  { name: "Request dialog", file: "components/request/QuoteRequestDialog.tsx", href: "/#request", note: "#request холбоосоор нээгдэх form → POST /api/requests." },
  { name: "Footer", file: "components/layout/Footer.tsx", href: "/", note: "2 түвшин: лого + цэс + утас, доор нь зохиогчийн эрх." },
];
