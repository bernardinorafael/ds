import { createRef } from "react"

import { composeRef } from "@/utils/compose-ref"

describe("composeRef", () => {
  it("should call function refs with the value", () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    const composed = composeRef([fn1, fn2])

    composed("hello")

    expect(fn1).toHaveBeenCalledWith("hello")
    expect(fn2).toHaveBeenCalledWith("hello")
  })

  it("should set .current on mutable ref objects", () => {
    const ref = createRef<string>()
    const composed = composeRef([ref])

    composed("world")

    expect(ref.current).toBe("world")
  })

  it("should skip null and undefined refs", () => {
    const fn = vi.fn()
    const composed = composeRef([null, undefined, fn])

    composed("ok")

    expect(fn).toHaveBeenCalledWith("ok")
  })
})
