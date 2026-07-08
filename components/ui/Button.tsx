"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-lg font-medium " +
  "transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-accent select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_0_0_1px_rgba(59,130,246,0.6)] " +
    "hover:bg-accent-bright hover:shadow-[0_8px_30px_-8px_rgba(59,130,246,0.7)]",
  outline:
    "border border-line bg-surface/40 text-fg hover:border-accent/60 " +
    "hover:text-accent hover:bg-accent/5",
  ghost: "text-muted hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm sm:text-[0.95rem]",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  className?: string;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
  onClick?: never;
  type?: never;
};

type ButtonAsButton = CommonProps & {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

type ButtonProps = ButtonAsLink | ButtonAsButton;

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    icon: Icon,
    iconRight: IconRight,
    className,
  } = props;

  const classes = cn(base, variants[variant], sizes[size], className);

  const inner = (
    <>
      {Icon && (
        <Icon className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
      )}
      <span>{children}</span>
      {IconRight && (
        <IconRight className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </>
  );

  const motionProps = {
    whileHover: { y: -1 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 400, damping: 25 },
  };

  if ("href" in props && props.href) {
    const external = props.external;
    return (
      <motion.a
        {...motionProps}
        href={props.href}
        className={classes}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {inner}
      </motion.a>
    );
  }

  const { onClick, type, disabled } = props as ButtonAsButton;
  return (
    <motion.button
      {...motionProps}
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled}
      className={cn(classes, disabled && "opacity-50 pointer-events-none")}
    >
      {inner}
    </motion.button>
  );
}
