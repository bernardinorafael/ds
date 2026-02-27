import React from "react"

import * as RadixTooltip from "@radix-ui/react-tooltip"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/utils/cn"

export type CopyTriggerProps = {
  /**
   * Element that triggers the copy action when clicked
   */
  children: React.ReactNode
  /**
   * Text to copy to the clipboard
   */
  text: string
  /**
   * Tooltip label shown before copying @default "Copiar"
   */
  label?: string
  /**
   * Tooltip label shown after copying @default "Copiado"
   */
  copiedLabel?: string
  /**
   * Tooltip placement relative to the trigger @default "top"
   */
  side?: "top" | "right" | "bottom" | "left"
  /**
   * Callback fired after a successful copy with the copied text
   */
  onCopy?: (text: string) => void
}

export const CopyTrigger = React.forwardRef<HTMLButtonElement, CopyTriggerProps>(
  (
    { children, text, label = "Copiar", copiedLabel = "Copiado", side, onCopy },
    forwardedRef
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [copied, setCopied] = React.useState(false)
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(null)

    const open = isOpen || copied

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
      }
    }, [])

    async function copy() {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => setCopied(false), 800)
        onCopy?.(text)
      } catch (err) {
        console.error("Failed to copy text: ", err)
      }
    }

    return (
      <RadixTooltip.Provider>
        <RadixTooltip.Root delayDuration={200} open={open} onOpenChange={setIsOpen}>
          <RadixTooltip.Trigger
            ref={forwardedRef}
            asChild
            className="relative cursor-pointer"
            aria-label="Copy text"
            onClick={copy}
          >
            {children}
          </RadixTooltip.Trigger>
          <AnimatePresence>
            {open && (
              <RadixTooltip.Portal forceMount>
                <RadixTooltip.Content
                  asChild
                  side={side}
                  sideOffset={5}
                  collisionPadding={5}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 28,
                      mass: 0.8,
                    }}
                    className={cn(
                      "origin-(--radix-tooltip-content-transform-origin)",
                      "z-40 font-medium text-white shadow-lg will-change-transform",
                      "bg-gray-1200 rounded-[0.3125rem] px-2 py-1 text-xs"
                    )}
                  >
                    {copied ? copiedLabel : label}
                  </motion.div>
                </RadixTooltip.Content>
              </RadixTooltip.Portal>
            )}
          </AnimatePresence>
        </RadixTooltip.Root>
      </RadixTooltip.Provider>
    )
  }
)

CopyTrigger.displayName = "CopyTrigger"
