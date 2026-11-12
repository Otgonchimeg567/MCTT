import type { ReactNode } from "react";

/** Use `fieldErrorId(name)` as the control's aria-describedby when `error` is set. */
export const fieldErrorId = (name: string) => `${name}-error`;

type Props = {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
};

/** Label + control + error message. The control is wrapped in the <label>, so no id wiring is needed. */
export function Field({ label, name, error, optional, children }: Props) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-ink">
        {label}
        {optional && <span className="font-normal text-faint"> (заавал биш)</span>}
      </span>
      {children}
      {error && (
        <span id={fieldErrorId(name)} className="text-[13px] text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}
