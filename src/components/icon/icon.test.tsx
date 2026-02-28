import { createRef, type ReactNode } from "react"

import { render, screen } from "@testing-library/react"

import { Icon, IconSprite } from "@/components/icon"

const WithSprite = ({ children }: { children: ReactNode }) => (
  <>
    <IconSprite />
    {children}
  </>
)

describe("Icon", () => {
  it("should render an SVG element", () => {
    const { container } = render(
      <WithSprite>
        <Icon name="info" />
      </WithSprite>
    )
    expect(container.querySelector("[data-icon]")).toBeInTheDocument()
  })

  it("should forward ref to SVGSVGElement", () => {
    const ref = createRef<SVGSVGElement>()
    render(
      <WithSprite>
        <Icon ref={ref} name="info" />
      </WithSprite>
    )
    expect(ref.current).toBeInstanceOf(SVGSVGElement)
  })

  it("should reference the correct sprite symbol", () => {
    const { container } = render(
      <WithSprite>
        <Icon name="info" size="md" />
      </WithSprite>
    )
    expect(container.querySelector("[data-icon] use")).toHaveAttribute(
      "href",
      "#icon__info--md"
    )
  })

  it("should reference the sm symbol when size is sm", () => {
    const { container } = render(
      <WithSprite>
        <Icon name="info" size="sm" />
      </WithSprite>
    )
    expect(container.querySelector("[data-icon] use")).toHaveAttribute(
      "href",
      "#icon__info--sm"
    )
  })

  it("should reference the lg symbol when size is lg", () => {
    const { container } = render(
      <WithSprite>
        <Icon name="info" size="lg" />
      </WithSprite>
    )
    expect(container.querySelector("[data-icon] use")).toHaveAttribute(
      "href",
      "#icon__info--lg"
    )
  })

  it("should apply size-3.5 for sm", () => {
    const { container } = render(
      <WithSprite>
        <Icon name="info" size="sm" />
      </WithSprite>
    )
    expect(container.querySelector("[data-icon]")).toHaveClass("size-3.5")
  })

  it("should apply size-4.5 for md", () => {
    const { container } = render(
      <WithSprite>
        <Icon name="info" size="md" />
      </WithSprite>
    )
    expect(container.querySelector("[data-icon]")).toHaveClass("size-4.5")
  })

  it("should apply size-5.5 for lg", () => {
    const { container } = render(
      <WithSprite>
        <Icon name="info" size="lg" />
      </WithSprite>
    )
    expect(container.querySelector("[data-icon]")).toHaveClass("size-5.5")
  })

  it("should be aria-hidden by default", () => {
    const { container } = render(
      <WithSprite>
        <Icon name="info" />
      </WithSprite>
    )
    expect(container.querySelector("[data-icon]")).toHaveAttribute("aria-hidden", "true")
  })

  it("should remove aria-hidden when aria-label is provided", () => {
    render(
      <WithSprite>
        <Icon name="info" aria-label="Information" />
      </WithSprite>
    )
    expect(screen.getByRole("img", { name: "Information" })).not.toHaveAttribute(
      "aria-hidden"
    )
  })

  it("should add role img when aria-label is provided", () => {
    render(
      <WithSprite>
        <Icon name="info" aria-label="Information" />
      </WithSprite>
    )
    expect(screen.getByRole("img", { name: "Information" })).toBeInTheDocument()
  })

  it("should inherit color from parent", () => {
    const { container } = render(
      <WithSprite>
        <span className="text-red-500">
          <Icon name="info" />
        </span>
      </WithSprite>
    )
    expect(container.querySelector("span")).toHaveClass("text-red-500")
  })
})
