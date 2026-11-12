import { Heading } from "@/components/ui/Heading";

export function EnvTile({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex flex-col rounded-[22px] border border-line bg-cream p-[22px] sm:min-h-[212px]">
      <span
        aria-hidden
        className="flex size-11 items-center justify-center rounded-[14px] bg-mint text-lg leading-[27px] font-extrabold text-leaf"
      >
        {icon}
      </span>
      <Heading level="h4" className="pt-3.5">
        {title}
      </Heading>
      <p className="pt-1.5 text-sm leading-[21px] text-muted">{description}</p>
    </div>
  );
}
