import React from "react"

import * as RadixAvatar from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/cn"

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0][0].toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

const avatarVariants = cva(
  [
    // positioning
    "relative",

    // layout
    "inline-flex",
    "shrink-0",
  ],
  {
    variants: {
      size: {
        xs: "size-6",
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const fallbackVariants = cva(
  [
    // layout
    "flex",
    "size-full",
    "items-center",
    "justify-center",

    // visual
    "rounded-full",
    "bg-gray-300",
    "font-medium",
    "text-gray-1100",
    "select-none",
  ],
  {
    variants: {
      size: {
        xs: "text-2xs",
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const statusVariants = cva(
  [
    // positioning
    "absolute",
    "bottom-0",
    "right-0",

    // visual
    "rounded-full",
    "ring-2",
    "ring-background",
  ],
  {
    variants: {
      size: {
        xs: "size-1.5",
        sm: "size-2",
        md: "size-2.5",
        lg: "size-3",
      },
      status: {
        online: "bg-green-900",
        offline: "bg-gray-800",
        busy: "bg-orange-900",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export type AvatarProps = Pick<
  React.ComponentProps<"span">,
  "id" | "aria-label" | "className"
> &
  VariantProps<typeof avatarVariants> & {
    /** Full name — used for initials fallback and alt text */
    name: string
    /** Image URL */
    src?: string
    /** Online status indicator */
    status?: "online" | "offline" | "busy"
  }

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size, name, src, status, ...props }, forwardedRef) => {
    return (
      <span
        ref={forwardedRef}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        <RadixAvatar.Root className="flex size-full overflow-hidden rounded-full">
          {src && (
            <RadixAvatar.Image src={src} alt={name} className="size-full object-cover" />
          )}
          <RadixAvatar.Fallback className={fallbackVariants({ size })} delayMs={0}>
            {getInitials(name)}
          </RadixAvatar.Fallback>
        </RadixAvatar.Root>

        {status && (
          <span className={statusVariants({ size, status })} aria-label={status} />
        )}
      </span>
    )
  }
)

Avatar.displayName = "Avatar"
