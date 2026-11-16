import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "inverse";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold transition duration-200 ease-out hover:-translate-y-px hover:shadow-[0_10px_24px_-10px_rgba(59,45,143,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";

const variants: Record<Variant, string> = {
  primary: "bg-brand-gradient text-white hover:brightness-110",
  secondary: "bg-brand-gradient text-white hover:brightness-110",
  outline: "bg-brand-gradient text-white hover:brightness-110",
  inverse: "bg-brand-gradient text-white hover:brightness-110",
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
