import React from "react"

import { Icon } from "@/components/icon"
import { cn } from "@/utils/cn"
import { Slot, type AsChildProp } from "@/utils/slot"

// ─── Types ───────────────────────────────────────────────────────────────────

type BreadcrumbRootProps = Pick<
  React.ComponentProps<"nav">,
  "id" | "aria-label" | "className" | "children"
> & {
  /**
   * Custom separator between items.
   * @default chevron-right icon
   */
  separator?: React.ReactNode
}

type BreadcrumbLinkProps = Pick<
  React.ComponentProps<"a">,
  "id" | "href" | "aria-label" | "className" | "children"
> &
  AsChildProp

type BreadcrumbPageProps = Pick<
  React.ComponentProps<"span">,
  "id" | "aria-label" | "className" | "children"
>

type BreadcrumbEllipsisProps = Pick<
  React.ComponentProps<"span">,
  "id" | "aria-label" | "className"
>

type BreadcrumbSeparatorProps = Pick<React.ComponentProps<"li">, "className" | "children">

// ─── Internal markers ────────────────────────────────────────────────────────

const BREADCRUMB_CHILD = Symbol("breadcrumb-child")

type BreadcrumbChild = React.ReactElement & {
  [BREADCRUMB_CHILD]?: true
}

function markAsBreadcrumbChild<T extends React.FC>(component: T): T {
  ;(component as unknown as Record<symbol, boolean>)[BREADCRUMB_CHILD] = true
  return component
}

function isBreadcrumbChild(child: React.ReactNode): child is BreadcrumbChild {
  if (!React.isValidElement(child)) return false
  const type = child.type
  return (
    type != null &&
    (typeof type === "function" || typeof type === "object") &&
    BREADCRUMB_CHILD in type
  )
}

// ─── Separator ───────────────────────────────────────────────────────────────

const BreadcrumbSeparator = ({ className, children }: BreadcrumbSeparatorProps) => (
  <li role="presentation" aria-hidden="true" className={cn("text-gray-500", className)}>
    {children ?? (
      <span className="text-word-tertiary">
        <Icon name="chevron-right-outline" size="sm" />
      </span>
    )}
  </li>
)

BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

// ─── Root ────────────────────────────────────────────────────────────────────

const BreadcrumbRoot = React.forwardRef<HTMLElement, BreadcrumbRootProps>(
  ({ className, children, separator, ...props }, forwardedRef) => {
    const items = React.Children.toArray(children).filter(isBreadcrumbChild)

    return (
      <nav ref={forwardedRef} aria-label="breadcrumb" {...props}>
        <ol
          className={cn(
            "text-primary flex flex-wrap items-center gap-1 text-sm font-medium",
            className
          )}
        >
          {items.map((child, index) => (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
              {child}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    )
  }
)

BreadcrumbRoot.displayName = "BreadcrumbRoot"

// ─── Link ────────────────────────────────────────────────────────────────────

const BreadcrumbLink = markAsBreadcrumbChild(
  React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
    ({ asChild, className, ...rest }, forwardedRef) => {
      const Component = asChild ? Slot : "a"

      return (
        <li className="inline-flex items-center">
          <Component
            ref={forwardedRef}
            className={cn("hover:text-word-primary transition-colors", className)}
            {...rest}
          />
        </li>
      )
    }
  )
)

BreadcrumbLink.displayName = "BreadcrumbLink"

// ─── Page ────────────────────────────────────────────────────────────────────

const BreadcrumbPage = markAsBreadcrumbChild(
  React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
    ({ className, ...rest }, forwardedRef) => (
      <li className="inline-flex items-center">
        <span
          ref={forwardedRef}
          aria-current="page"
          className={cn("text-word-tertiary", className)}
          {...rest}
        />
      </li>
    )
  )
)

BreadcrumbPage.displayName = "BreadcrumbPage"

// ─── Ellipsis ────────────────────────────────────────────────────────────────

const BreadcrumbEllipsisInner = ({ className, ...rest }: BreadcrumbEllipsisProps) => (
  <li className="inline-flex items-center">
    <span
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-6 items-center justify-center", className)}
      {...rest}
    >
      <Icon name="more-horizontal-outline" size="sm" />
      <span className="sr-only">More</span>
    </span>
  </li>
)

BreadcrumbEllipsisInner.displayName = "BreadcrumbEllipsis"

const BreadcrumbEllipsis = markAsBreadcrumbChild(BreadcrumbEllipsisInner)

// ─── Compound export ─────────────────────────────────────────────────────────

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Ellipsis: BreadcrumbEllipsis,
  Separator: BreadcrumbSeparator,
})

export type {
  BreadcrumbRootProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbEllipsisProps,
  BreadcrumbSeparatorProps,
}
