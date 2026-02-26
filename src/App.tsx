import { useState } from "react"

import { cn } from "@/utils/cn"

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Design System</h1>
      <button
        type="button"
        className={cn(
          "rounded-lg bg-zinc-900 px-4 py-2 text-white",
          "transition-colors hover:bg-zinc-800"
        )}
        onClick={() => setCount((count) => count + 1)}
      >
        count is {count}
      </button>
    </div>
  )
}
