import type { ComponentProps } from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/cn"

const buttonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",

    "rounded-md",
    "font-medium",

    "transition-colors",

    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-offset-2",

    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: ["bg-primary", "text-primary-foreground", "hover:bg-primary/90"],
        secondary: ["bg-secondary", "text-secondary-foreground", "hover:bg-secondary/80"],
        outline: [
          "border",
          "border-border",
          "bg-transparent",
          "hover:bg-secondary",
          "hover:text-secondary-foreground",
        ],
        ghost: ["hover:bg-secondary", "hover:text-secondary-foreground"],
        destructive: [
          "bg-destructive",
          "text-destructive-foreground",
          "hover:bg-destructive/90",
        ],
        link: ["text-primary", "underline-offset-4", "hover:underline"],
      },
      size: {
        sm: ["h-8", "px-3", "text-sm"],
        md: ["h-10", "px-4", "text-sm"],
        lg: ["h-12", "px-6", "text-base"],
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
