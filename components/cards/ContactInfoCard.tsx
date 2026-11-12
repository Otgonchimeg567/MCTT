export function ContactInfoCard({ label, value, href }: { label: string; value: string; href?: string }) {
  const valueClass = "text-[17px] leading-[25.5px] font-bold text-white";
  return (
    <div className="rounded-[20px] border border-white/12 bg-white/7 px-[22px] py-[18px]">
      <p className="pb-1 text-xs leading-[18px] tracking-[0.96px] text-lavender-muted">{label}</p>
      {href ? (
        <a href={href} className={`${valueClass} hover:underline`}>
          {value}
        </a>
      ) : (
        <p className={valueClass}>{value}</p>
      )}
    </div>
  );
}
