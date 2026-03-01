import type { Meta, StoryObj } from "@storybook/react-vite"

import { toast, Toaster } from "@/components/toast"

function ToastStoryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-3">{children}</div>
    </>
  )
}

function TriggerButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-gray-1200 rounded-md px-3 py-1.5 text-sm font-medium text-white"
    >
      {label}
    </button>
  )
}

const meta = {
  title: "Toast",
  component: Toaster,
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

export const Intents: Story = {
  render: () => (
    <ToastStoryWrapper>
      <TriggerButton label="Info" onClick={() => toast("This is an info message")} />
      <TriggerButton
        label="Success"
        onClick={() => toast.success("Operation completed")}
      />
      <TriggerButton
        label="Warning"
        onClick={() => toast.warning("Approaching rate limit")}
      />
      <TriggerButton label="Error" onClick={() => toast.error("Something went wrong")} />
    </ToastStoryWrapper>
  ),
}

export const WithAction: Story = {
  render: () => (
    <ToastStoryWrapper>
      <TriggerButton
        label="Show toast with action"
        onClick={() =>
          toast.success("Item created", {
            action: { label: "Undo", onClick: () => toast("Undone!") },
          })
        }
      />
    </ToastStoryWrapper>
  ),
}

export const WithConfirmDeny: Story = {
  render: () => (
    <ToastStoryWrapper>
      <TriggerButton
        label="Show confirm/deny toast"
        onClick={() =>
          toast("Unsaved changes", {
            duration: Infinity,
            confirm: { label: "Save", onClick: () => toast.success("Saved!") },
            deny: { label: "Discard", onClick: () => toast("Discarded") },
            disableCloseAction: true,
          })
        }
      />
    </ToastStoryWrapper>
  ),
}

export const WithIconButtons: Story = {
  render: () => (
    <ToastStoryWrapper>
      <TriggerButton
        label="Show icon button toast"
        onClick={() =>
          toast("Delete this item?", {
            duration: Infinity,
            confirmIcon: {
              label: "Confirm",
              onClick: () => toast.success("Deleted"),
            },
            denyIcon: { label: "Cancel" },
          })
        }
      />
    </ToastStoryWrapper>
  ),
}

export const WithMutedAction: Story = {
  render: () => (
    <ToastStoryWrapper>
      <TriggerButton
        label="Show muted action toast"
        onClick={() =>
          toast.success("File exported", {
            action: { label: "Open", onClick: () => toast("Opening...") },
            mutedAction: {
              label: "Copy link",
              onClick: () => toast("Link copied!"),
            },
          })
        }
      />
    </ToastStoryWrapper>
  ),
}

export const AutoDismiss: Story = {
  render: () => (
    <ToastStoryWrapper>
      <TriggerButton
        label="Show toast (3s auto-dismiss)"
        onClick={() => toast("This will disappear in 3 seconds")}
      />
      <TriggerButton
        label="Show toast (1s auto-dismiss)"
        onClick={() => toast("Quick flash", { duration: 1000 })}
      />
    </ToastStoryWrapper>
  ),
}

export const Persistent: Story = {
  render: () => (
    <ToastStoryWrapper>
      <TriggerButton
        label="Show persistent toast"
        onClick={() =>
          toast("This toast stays until dismissed", {
            duration: Infinity,
            action: { label: "Dismiss" },
          })
        }
      />
    </ToastStoryWrapper>
  ),
}

export const Jiggle: Story = {
  render: () => {
    let toastId: string
    return (
      <ToastStoryWrapper>
        <TriggerButton
          label="Create toast"
          onClick={() => {
            toastId = toast("Watch me jiggle", { duration: Infinity })
          }}
        />
        <TriggerButton
          label="Trigger jiggle"
          onClick={() => {
            if (toastId) toast.update(toastId, { jiggle: true })
          }}
        />
      </ToastStoryWrapper>
    )
  },
}

export const ToastLimit: Story = {
  render: () => {
    let count = 0
    return (
      <ToastStoryWrapper>
        <TriggerButton
          label="Add toast (max 3)"
          onClick={() => {
            count++
            toast(`Toast #${count}`, { duration: Infinity })
          }}
        />
      </ToastStoryWrapper>
    )
  },
}
