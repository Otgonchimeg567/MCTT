export function StatBubble({ value, label, className = "" }: { value: string; label: string; className?: string }) {
  return (
    <div
      className={`absolute flex size-[92px] flex-col items-center justify-center rounded-full border border-line bg-white text-center drop-shadow-[0px_12px_15px_rgba(59,45,143,0.14)] ${className}`}
    >
      <span className="font-display text-[17px] leading-[18.7px] font-bold text-brand">{value}</span>
      <span className="text-[11px] leading-[16.5px] text-muted">{label}</span>
    </div>
  );
}
