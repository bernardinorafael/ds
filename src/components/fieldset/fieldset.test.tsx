import { createRef } from "react"

import { render, screen } from "@testing-library/react"

import { Fieldset } from "@/components/fieldset"

describe("Fieldset", () => {
  it("should render a fieldset with legend", () => {
    render(
      <Fieldset legend="Profile" description="Manage your profile">
        <input />
      </Fieldset>
    )
    expect(screen.getByRole("group")).toBeInTheDocument()
    expect(screen.getByText("Profile")).toBeInTheDocument()
  })

  it("should forward ref", () => {
    const ref = createRef<HTMLFieldSetElement>()
    render(
      <Fieldset ref={ref} legend="Profile" description={["Description"]}>
        <input />
      </Fieldset>
    )
    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement)
  })

  it("should merge custom className", () => {
    render(
      <Fieldset legend="Profile" description={["Description"]} className="custom-class">
        <input />
      </Fieldset>
    )
    expect(screen.getByRole("group")).toHaveClass("custom-class")
  })

  it("should render all description lines", () => {
    render(
      <Fieldset legend="Profile" description={["First line", "Second line"]}>
        <input />
      </Fieldset>
    )
    expect(screen.getByText("First line")).toBeInTheDocument()
    expect(screen.getByText("Second line")).toBeInTheDocument()
  })

  it("should render description lines as paragraphs", () => {
    render(
      <Fieldset legend="Profile" description={["Line one", "Line two"]}>
        <input />
      </Fieldset>
    )
    expect(screen.getByText("Line one").tagName).toBe("P")
    expect(screen.getByText("Line two").tagName).toBe("P")
  })

  it("should render children in the form area", () => {
    render(
      <Fieldset legend="Profile" description={["Description"]}>
        <input aria-label="Name" />
      </Fieldset>
    )
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument()
  })

  it("should render the legend element", () => {
    render(
      <Fieldset legend="Settings" description={["Description"]}>
        <input />
      </Fieldset>
    )
    expect(screen.getByText("Settings").tagName).toBe("LEGEND")
  })

  it("should accept a single string as description", () => {
    render(
      <Fieldset legend="Profile" description="Single line">
        <input />
      </Fieldset>
    )
    expect(screen.getByText("Single line")).toBeInTheDocument()
    expect(screen.getByText("Single line").tagName).toBe("P")
  })

  it("should render without description", () => {
    render(
      <Fieldset legend="Profile">
        <input />
      </Fieldset>
    )
    expect(screen.getByRole("group")).toBeInTheDocument()
    expect(screen.getByText("Profile")).toBeInTheDocument()
  })

  it("should pass id to the fieldset", () => {
    render(
      <Fieldset id="profile-section" legend="Profile" description="Description">
        <input />
      </Fieldset>
    )
    expect(screen.getByRole("group")).toHaveAttribute("id", "profile-section")
  })
})
