/* eslint-disable @typescript-eslint/no-explicit-any */
import type * as React from "react"

export function composeRef<T = any>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null>
): React.RefCallback<T> {
  return (v) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(v)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<T | null>).current = v
      }
    })
  }
}
