export const company = {
  name: "Эм Си Ти Ти",
  suffix: "ХХК",
  phoneDisplay: "+976 9999 8208",
  phoneShort: "9999 8208",
  phoneHref: "tel:+97699998208",
};

// "/#…" rather than "#…" so the links also work from other pages (e.g. /bomt).
export const navLinks = [
  { label: "Бидний тухай", href: "/#about" },
  { label: "Технологи", href: "/#production" },
  { label: "Бүтээгдэхүүн", href: "/#products" },
  { label: "Байгаль орчин", href: "/#environment" },
  { label: "Байршил", href: "/#location" },
  { label: "БОМТ тайлан", href: "/bomt" },
];

/** Location section (map of Govisümber). The marker is on Choir station — the plant is ~10 km from it. */
export const location = {
  tag: "БАЙРШИЛ",
  title: "Говьсүмбэр аймаг, Сүмбэр сум",
  description: "Үйлдвэр маань Тэвшийн хөндийд, Чойр өртөөнөөс 10 км-т байрладаг тул баяжмалыг төмөр замаар тээвэрлэхэд дөхөм.",
  // OpenStreetMap embed: bounding box around the aimag, marker on Choir.
  map: {
    bbox: [107.55, 45.95, 109.25, 46.75] as const, // west, south, east, north
    marker: [46.3546, 108.3626] as const, // lat, lon — Choir
  },
  facts: [
    { label: "Аймаг", value: "Говьсүмбэр" },
    { label: "Сум, баг", value: "Сүмбэр сум, 4-р баг" },
    { label: "Газар", value: "Тэвшийн хөндий" },
    { label: "Улаанбаатараас", value: "200 км" },
    { label: "Чойр өртөөнөөс", value: "10 км" },
  ],
};

/**
 * Environmental management plan (БОМТ) documents: /bomt lists them, /bomt/<year> shows one.
 * Figures are copied from the PDFs in public/reports/ (amounts in мянган төгрөг).
 */
export type BomtReport = {
  year: number;
  kind: string;
  title: string;
  summary: string;
  file: string;
  pages: number;
  stats: { value: string; label: string }[];
  /** Budget table; `spent` only on the year-end performance report. */
  budget: { item: string; planned: number; spent?: number }[];
  highlights: string[];
};

export const bomt = {
  tag: "БАЙГАЛЬ ОРЧИН",
  title: "БОМТ тайлан",
  description:
    "Байгаль орчны менежментийн төлөвлөгөө (БОМТ) болон түүний биелэлтийг жил бүр батлуулж, олон нийтэд нээлттэй тайлагнадаг.",
  reports: [
    {
      year: 2026,
      kind: "Төлөвлөгөө",
      title: "“Эм Си Ти Ти” ХХК-ний жонш баяжуулах үйлдвэрийн 2026 оны байгаль орчны менежментийн төлөвлөгөө",
      summary:
        "Жоншны баяжуулах үйлдвэрийн 2026 оны үйл ажиллагаанаас байгаль орчинд үзүүлэх сөрөг нөлөөллийг бууруулах, хянах арга хэмжээ, тэдгээрийн төсөв.",
      file: "/reports/bomt-2026.pdf",
      pages: 21,
      stats: [
        { value: "9.17 сая ₮", label: "Нийт төсөв" },
        { value: "2,000", label: "Тарих мод" },
        { value: "90,000 тн", label: "Боловсруулах хүдэр" },
        { value: "240 хоног", label: "Ажиллах хугацаа" },
      ],
      budget: [
        { item: "Сөрөг нөлөөллийг бууруулах арга хэмжээ", planned: 750 },
        { item: "Дүйцүүлэн хамгаалах төлөвлөгөө", planned: 5000 },
        { item: "Эрсдлийн менежмент", planned: 750 },
        { item: "Хог хаягдлын менежмент", planned: 950 },
        { item: "Удирдлага, зохион байгуулалт", planned: 500 },
        { item: "Орчны хяналт шинжилгээ", planned: 1220 },
      ],
      highlights: [
        "Орон нутгийн БОАЖГ-тай тохиролцож заасан газарт 2,000 мод тарина.",
        "Агаар, хөрс, ус, хаягдлын далангаас дээж авч стандартын дагуу шинжлүүлнэ.",
        "Хог хаягдлыг ангилан ялгаж, хоёрдогч түүхий эдийн цэгт хүргэнэ.",
        "Үйлдвэр 05/01-ээс 12/30 хүртэл ажиллаж, нийт 36,000 м³ ус хэрэглэхээр тооцсон.",
        "Хэрэгжилтийг 2026 оны 11-р сард орон нутгийн иргэд, байгууллагуудад тайлагнана.",
      ],
    },
    {
      year: 2025,
      kind: "Биелэлтийн тайлан",
      title: "2025 оны байгаль орчны менежментийн тайлан",
      summary:
        "Говьсүмбэр аймгийн Сүмбэр сумын нутаг дахь Хайлуур жонш баяжуулах үйлдвэрийн 2025 оны БОМТ-ний биелэлт, гүйцэтгэсэн ажлын зураг, баримт.",
      file: "/reports/bomt-2025.pdf",
      pages: 49,
      stats: [
        { value: "62.0 сая ₮", label: "Зарцуулсан зардал" },
        { value: "430", label: "Тарьсан хайлаас мод" },
        { value: "15,452 тн", label: "Үйлдвэрлэсэн баяжмал" },
        { value: "3 удаа", label: "Байгаль орчны сургалт" },
      ],
      budget: [
        { item: "Сөрөг нөлөөллийг бууруулах арга хэмжээ", planned: 450, spent: 6094 },
        { item: "Дүйцүүлэн хамгаалах төлөвлөгөө", planned: 1500, spent: 3300 },
        { item: "Эрсдлийн менежмент", planned: 750, spent: 48826.6 },
        { item: "Хог хаягдлын менежмент", planned: 350, spent: 1540.72 },
        { item: "Удирдлага, зохион байгуулалт", planned: 300, spent: 1420 },
        { item: "Орчны хяналт шинжилгээ", planned: 620, spent: 825 },
      ],
      highlights: [
        "Орон нутгаас заасан газарт 430 ширхэг хайлаас мод тарьсан.",
        "Ангилдаг хогийн сав суурилуулж, хог хаягдлын 2 цэгийн суурийг цементлэн хашаалсан.",
        "Химийн бодисын агуулахын шалыг бүрэн цементлэж, хөрсөнд нэвчихээс хамгаалсан.",
        "Агаар, хөрс, усны шинжилгээг MNS стандартын дагуу хийлгэсэн.",
        "Ажилчдыг ХАБЭА, химийн бодисын аюулгүй ажиллагааны сургалтад хамруулсан.",
      ],
    },
  ] as BomtReport[],
};

export const hero = {
  eyebrow: "2005 ОНООС",
  title: "Эм Си Ти Ти",
  tagline: "ЖОНШНЫ БАЯЖМАЛ",
  /** Chips orbiting the crystal. */
  orbit: ["CaF₂", "95–97%", "ФФ-95", "ФФ-97"],
  /** Scrolling strip along the bottom of the hero. */
  ticker: [
    "2005 оноос",
    "ФФ-95 · ФФ-97 баяжмал",
    "95–97% CaF₂",
    "Жилд 90,000 тн хүдэр",
    "2025 онд 15,452 тн баяжмал",
    "Флотацийн технологи",
    "Говьсүмбэр · Сүмбэр",
    "430 мод тарьсан",
  ],
  /** Split-screen entry points — one per audience. */
  doors: [
    { href: "#products", tag: "ФФ-95 · ФФ-97", title: "Баяжмал худалдан авах", cta: "Бүтээгдэхүүн үзэх", tone: "night" },
    {
      href: "#request",
      tag: "ГОВЬСҮМБЭР · СҮМБЭР",
      title: "Хүдэр нийлүүлэх",
      cta: "Нөхцөл үзэх",
      // Same surface as the buyer door so the two halves read as one hero; the crystal on the seam is the focal point.
      // To bring the photo back: tone "brand" + image: "/images/hero-supply.jpg".
      tone: "night",
    },
  ] as const,
};

export const about = {
  tag: "БИДНИЙ ТУХАЙ",
  title: "2005 оноос хойш Сүмбэрт",
  /**
   * 16:9 block under the paragraphs. Drop the files into public/ and set the paths:
   * video — public/video/plant.mp4 (1920×1080, H.264, muted, 10–15 s, ≲ 6 MB);
   * poster — public/images/plant-poster.jpg (first frame, or the photo alone if there is no video).
   * Leave both empty and the block is hidden on the live site.
   */
  media: {
    // Placeholder stock footage (Pexels, free licence) until the plant's own video is shot.
    video: "/video/plant.mp4" as string,
    poster: "/images/plant-poster.jpg" as string,
    label: "Хүдэр туузан дамжуургаар бутлалт руу орж буй нь",
  },
  /** Paragraphs, shown side by side. Wrap a phrase in **…** to set it in bold. */
  paragraphs: [
    "**Эм Си Ти Ти ХХК** нь 2005 оноос хойш Говьсүмбэр аймгийн Сүмбэр суманд жоншны хүдэр боловсруулах чиглэлээр үйл ажиллагаа явуулж байна.",
    "Монгол Улсын Засгийн газраас хэрэгжүүлж буй ашигт малтмалын ордыг ашиглах, эдийн засгийн эргэлтэд оруулах бодлогыг хэрэгжүүлэх зорилгоор **агуулга бага жоншны хүдрийг** худалдан авч, **флотацийн аргаар** баяжуулдаг.",
    "Бид олон улсын стандартын шаардлага хангасан **95–97%-ийн агуулгатай** жоншны баяжмал үйлдвэрлэн **экспортлох** зорилго тавин ажиллаж байна.",
  ],
};

export const production = {
  tag: "ҮЙЛДВЭРЛЭЛ",
  title: "Хүдрээс баяжмал хүртэл",
  /** Word of `title` drawn in the brand gradient. */
  titleAccent: "баяжмал",
  description:
    "Өөрийн уурхай болон жижиг олборлогчдоос авсан хүдрийг Сүмбэр сум дахь үйлдвэртээ боловсруулдаг.",
  /** Figures overlaid on the visual panel. `key` marks the one figure that leads (the product grade). */
  visualStats: [
    { value: "97%", label: "CaF₂ хүртэл", key: true },
    { value: "90K", label: "тн хүдэр / жил" },
    { value: "15,452", label: "тн баяжмал · 2025" },
  ] as { value: string; label: string; key?: boolean }[],
  visualPin: "Сүмбэр, Говьсүмбэр",
  /** Placeholder stock photo (Pexels) until the plant's own photo is available. */
  visualImage: "/images/production-plant.jpg",
  visualImageAlt: "Хүдэр бутлах, туузан дамжуургын байгууламж",
  mapHref: "https://maps.google.com/?q=Сүмбэр+Говьсүмбэр",
  steps: [
    "Хүлээн авах, холих",
    "Бутлалт · 350 → 15 мм",
    "Нунтаглалт · 0.074 мм",
    "Флотаци · 6 цэвэрлэгээ",
    "Өтгөрүүлэх, хатаах",
  ],
  /** Index in `steps` of the core stage, emphasised in the step list. */
  stepsHighlight: 3,
  capacityRows: [
    { label: "Ажлын улирал", value: "5–12 сар" },
    { label: "Ээлж", value: "2 × 12 цаг" },
    { label: "Жилд", value: "240 хоног" },
  ],
  locationRows: [
    { label: "Үйлдвэр", value: "Сүмбэр, Тэвшийн хөндий" },
    // onRoute: shown by the route strip on the location slide, so that slide leaves them out of the table.
    { label: "Улаанбаатараас", value: "200 км", onRoute: true },
    { label: "Чойр өртөөнөөс", value: "10 км", highlight: true, onRoute: true },
    { label: "Уурхай", value: "Айраг сум, 12605" },
  ],
  locationChips: ["Төмөр зам", "Экспорт"],
  /** Route strip on the location slide. Distances are to the plant, as in locationRows. */
  route: {
    stops: ["Улаанбаатар", "Чойр өртөө", "Үйлдвэр"],
    total: "Улаанбаатараас 200 км",
    lastLeg: "10 км",
  },
};

export const products = {
  tag: "БҮТЭЭГДЭХҮҮН",
  title: "Флотацийн жоншны баяжмал",
  description: "Нарийвчилсан үзүүлэлт болон үнийн саналыг хүсэлтээр илгээнэ.",
  requestRows: [
    { label: "Компани", value: "—", muted: true },
    { label: "Бүтээгдэхүүн", value: "FF-97" },
    { label: "Хэмжээ", value: "500 тн" },
  ],
};

export const environment = {
  tag: "БАЙГАЛЬ ОРЧИН",
  title: "Хариуцлагатай үйлдвэрлэл",
  description:
    "Жил бүр БОМТ батлуулж, биелэлтээ төрийн байгууллага, орон нутгийн иргэдэд тайлагнадаг.",
  highlight: {
    tag: "2025 ОН",
    value: "430",
    unit: "мод",
    /** Placeholder stock photo (Pexels) until a photo of the company's own planting is available. */
    image: "/images/environment-trees.jpg",
    imageAlt: "Эгнээгээр тарьсан залуу моднууд",
    description:
      "Орон нутгийн заасан газарт хайлаас мод тарьсан. 2026 онд 2,000 мод тарихаар төлөвлөсөн.",
    /** Gives the headline number context: 430 planted vs the 2026 target. */
    goal: { label: "2026 оны зорилт", current: 430, target: 2000, unit: "мод" },
  },
  tiles: [
    { icon: "recycle", title: "Хог хаягдал", description: "Ангилдаг сав, цементэн суурьтай 2 цэг." },
    { icon: "lab", title: "Хяналт шинжилгээ", description: "Агаар, хөрс, усыг MNS стандартын дагуу шинжилсэн." },
    { icon: "storage", title: "Химийн агуулах", description: "Шалыг цементлэж хөрсний бохирдлоос хамгаалсан." },
    { icon: "safety", title: "Аюулгүй ажиллагаа", description: "Өдөр бүр зааварчилгаа, ХАБЭА-н сургалт, гэрчилгээ." },
  ] as const,
};

export const faq = {
  tag: "АСУУЛТ",
  title: "Танд асуулт байна уу?",
  description:
    "Хүдэр нийлүүлэх, баяжмал худалдан авах, хамтран ажиллах талаар бидэнтэй холбогдоорой.",
  cta: "Хүдэр нийлүүлэх",
  /** Hierarchy in the card: visitor question (1) → company answer (2) → suggested questions (3). */
  question: "ФФ-97-ийн үнийн санал авч болох уу?",
  answer: "Тийм ээ. Хэмжээ, хүргэлтийн нөхцөлөө бичээд хүсэлт илгээнэ үү — үнийн саналаа танд илгээнэ.",
  status: "Онлайн",
  suggestionsLabel: "Бусад асуулт",
  suggestions: [
    "Хүдэр нийлүүлэхэд ямар шаардлагатай вэ?",
    "Тээвэрлэлтийг хэрхэн зохион байгуулдаг вэ?",
    "Байгаль орчны тайлангаа хаанаас үзэх вэ?",
  ],
  placeholder: "Асуултаа бичнэ үү…",
};

export const contact = {
  tag: "ХОЛБОО БАРИХ",
  title: "Хамтран ажиллая",
  description: "Баяжмал худалдан авах эсвэл хүдрээ нийлүүлэх хүсэлтээ илгээнэ үү.",
  cta: "Хүсэлт илгээх",
  visualAlt: "Флюорит (жонш) талст",
  servicesTitle: "Хамтын ажиллагаа",
  services: [
    { icon: "gem", title: "Баяжмал худалдан авах", text: "ФФ-95, ФФ-97 жоншны баяжмал" },
    { icon: "ore", title: "Хүдэр нийлүүлэх", text: "Жонш хүдрээ үйлдвэрт нийлүүлэх" },
    { icon: "train", title: "Тээвэр, ложистик", text: "Чойр өртөөнөөс төмөр замаар" },
    { icon: "contract", title: "Урт хугацааны гэрээ", text: "Тогтмол нийлүүлэлтийн нөхцөл" },
  ] as const,
  contactTitle: "Холбоо барих",
  items: [
    { icon: "phone", label: "УТАС", value: company.phoneDisplay, href: company.phoneHref, primary: true, hint: "Залгах" },
    {
      icon: "office",
      label: "ОФФИС",
      value: "УБ, Хан-Уул, 19-р хороо, Туул ван 29-97",
      href: "https://maps.google.com/?q=Хан-Уул+19-р+хороо+Улаанбаатар",
    },
    {
      icon: "plant",
      label: "ҮЙЛДВЭР",
      value: "Говьсүмбэр, Сүмбэр сум, Тэвшийн хөндий",
      href: "https://maps.google.com/?q=Сүмбэр+Говьсүмбэр",
    },
  ] as const,
};
