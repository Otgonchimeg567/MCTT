import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "inverse";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";

const variants: Record<Variant, string> = {
  primary: "bg-brand-gradient text-white hover:brightness-110",
  secondary: "border border-line bg-white text-ink hover:border-brand/30",
  outline: "border border-line bg-white text-brand hover:border-brand/30",
  inverse: "bg-white text-brand hover:bg-lilac",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm leading-[21px]",
  md: "px-[22px] py-3 text-[15px] leading-[22.5px]",
};

type Props = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & (
  | ({ href: string } & Omit<ComponentPropsWithoutRef<"a">, "className" | "children">)
  | ({ href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">)
);

export function Button({ variant = "primary", size = "md", className = "", children, ...rest }: Props) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as ComponentPropsWithoutRef<"a">)}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...(rest as ComponentPropsWithoutRef<"button">)}>
      {children}
    </button>
  );
}
