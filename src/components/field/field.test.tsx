import { createRef, useState } from "react"

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Field, useFieldControl } from "@/components/field"

// Helper component that exposes useFieldControl results via data attributes
const ControlProbe = () => {
  const fieldProps = useFieldControl()
  return (
    <input
      {...fieldProps}
      aria-invalid={fieldProps["aria-invalid"] ? "true" : undefined}
      data-testid="control"
    />
  )
}

describe("Field", () => {
  it("should render with label and children", () => {
    render(
      <Field label="Email">
        <input />
      </Field>
    )
    expect(screen.getByText("Email")).toBeInTheDocument()
  })

  it("should render description when provided", () => {
    render(
      <Field label="Email" description="We will never share your email">
        <input />
      </Field>
    )
    expect(screen.getByText("We will never share your email")).toBeInTheDocument()
  })

  it("should render children", () => {
    render(
      <Field label="Email">
        <input data-testid="input" />
      </Field>
    )
    expect(screen.getByTestId("input")).toBeInTheDocument()
  })

  it("should apply omitLabel as sr-only on the label wrapper", () => {
    render(
      <Field label="Email" omitLabel>
        <input />
      </Field>
    )
    const labelWrapper = screen.getByText("Email").closest("[data-field-label]")
    expect(labelWrapper).toHaveClass("sr-only")
  })

  it("should forward ref to root HTMLDivElement", () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Field ref={ref} label="Email">
        <input />
      </Field>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute("data-field")
  })

  it("should render message when message prop is set", async () => {
    render(
      <Field label="Email" message="This field is required">
        <input />
      </Field>
    )
    await waitFor(() => {
      expect(screen.getByText("This field is required")).toBeInTheDocument()
    })
  })

  it("should remove message when message prop is cleared", async () => {
    const user = userEvent.setup()

    const Wrapper = () => {
      const [msg, setMsg] = useState<string | undefined>("Error message")
      return (
        <>
          <Field label="Email" message={msg}>
            <input />
          </Field>
          <button onClick={() => setMsg(undefined)}>Clear</button>
        </>
      )
    }

    render(<Wrapper />)

    await waitFor(() => {
      expect(screen.getByText("Error message")).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: "Clear" }))

    await waitFor(() => {
      expect(screen.queryByText("Error message")).not.toBeInTheDocument()
    })
  })
})

describe("useFieldControl", () => {
  it("should return control id wired to the label htmlFor", () => {
    render(
      <Field id="email-field" label="Email">
        <ControlProbe />
      </Field>
    )
    const control = screen.getByTestId("control")
    expect(control).toHaveAttribute("id", "email-field-control")
    expect(screen.getByText("Email")).toHaveAttribute("for", "email-field-control")
  })

  it("should include description id in aria-describedby when description is present", () => {
    render(
      <Field id="email-field" label="Email" description="Your email address">
        <ControlProbe />
      </Field>
    )
    expect(screen.getByTestId("control")).toHaveAttribute(
      "aria-describedby",
      "email-field-description"
    )
  })

  it("should not set aria-describedby when no description and no message", () => {
    render(
      <Field id="email-field" label="Email">
        <ControlProbe />
      </Field>
    )
    expect(screen.getByTestId("control")).not.toHaveAttribute("aria-describedby")
  })

  it("should set aria-invalid when messageIntent is error", async () => {
    render(
      <Field id="email-field" label="Email" message="Required" messageIntent="error">
        <ControlProbe />
      </Field>
    )
    await waitFor(() => {
      expect(screen.getByTestId("control")).toHaveAttribute("aria-invalid", "true")
    })
  })

  it("should not set aria-invalid for warning message", async () => {
    render(
      <Field id="email-field" label="Email" message="Check this" messageIntent="warning">
        <ControlProbe />
      </Field>
    )
    await waitFor(() => {
      expect(screen.getByTestId("control")).not.toHaveAttribute("aria-invalid")
    })
  })
})
