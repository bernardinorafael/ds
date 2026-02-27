import { act, renderHook } from "@testing-library/react"

import { useControllableState } from "@/hooks/use-controllable-state"

describe("useControllableState", () => {
  it("should use defaultProp when uncontrolled", () => {
    const { result } = renderHook(() => useControllableState({ defaultProp: false }))

    expect(result.current[0]).toBe(false)
  })

  it("should update internal state when uncontrolled", () => {
    const { result } = renderHook(() => useControllableState({ defaultProp: false }))

    act(() => {
      result.current[1](true)
    })

    expect(result.current[0]).toBe(true)
  })

  it("should use prop when controlled", () => {
    const { result } = renderHook(() =>
      useControllableState({ prop: true, defaultProp: false })
    )

    expect(result.current[0]).toBe(true)
  })

  it("should call onChange when setValue is called", () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      useControllableState({ defaultProp: false, onChange })
    )

    act(() => {
      result.current[1](true)
    })

    expect(onChange).toHaveBeenCalledWith(true)
  })

  it("should call onChange when controlled and value differs", () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      useControllableState({ prop: false, defaultProp: false, onChange })
    )

    act(() => {
      result.current[1](true)
    })

    expect(onChange).toHaveBeenCalledWith(true)
  })

  it("should not call onChange when controlled and value is same", () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      useControllableState({ prop: false, defaultProp: false, onChange })
    )

    act(() => {
      result.current[1](false)
    })

    expect(onChange).not.toHaveBeenCalled()
  })

  it("should accept function updater", () => {
    const { result } = renderHook(() => useControllableState({ defaultProp: 0 }))

    act(() => {
      result.current[1]((prev) => (prev ?? 0) + 1)
    })

    expect(result.current[0]).toBe(1)
  })
})
