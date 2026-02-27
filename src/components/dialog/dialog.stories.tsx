import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/button"
import { Dialog } from "@/components/dialog"

const meta = {
  title: "Dialog",
  component: Dialog,
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Dialog size="sm" trigger={<Button intent="secondary">Small</Button>}>
        <Dialog.Content>
          <Dialog.Header title="Small dialog" />
          <Dialog.Section>
            <p className="text-word-secondary text-base">Small dialog content (420px).</p>
          </Dialog.Section>
        </Dialog.Content>
        <Dialog.Footer>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Footer>
      </Dialog>

      <Dialog size="base" trigger={<Button intent="secondary">Base</Button>}>
        <Dialog.Content>
          <Dialog.Header title="Base dialog" />
          <Dialog.Section>
            <p className="text-word-secondary text-base">Base dialog content (490px).</p>
          </Dialog.Section>
        </Dialog.Content>
        <Dialog.Footer>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Footer>
      </Dialog>

      <Dialog size="lg" trigger={<Button intent="secondary">Large</Button>}>
        <Dialog.Content>
          <Dialog.Header title="Large dialog" />
          <Dialog.Section>
            <p className="text-word-secondary text-base">Large dialog content (610px).</p>
          </Dialog.Section>
        </Dialog.Content>
        <Dialog.Footer>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Footer>
      </Dialog>
    </div>
  ),
}

export const Centered: Story = {
  render: () => (
    <Dialog centeredLayout trigger={<Button intent="secondary">Centered</Button>}>
      <Dialog.Content>
        <Dialog.Header
          title="Confirm action"
          description="Are you sure you want to continue?"
        />
        <Dialog.Section>
          <p className="text-word-secondary text-base">
            This dialog is vertically centered in the viewport.
          </p>
        </Dialog.Section>
      </Dialog.Content>
      <Dialog.Footer>
        <Dialog.Close>Cancel</Dialog.Close>
        <Button>Confirm</Button>
      </Dialog.Footer>
    </Dialog>
  ),
}

export const WithNotice: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Dialog trigger={<Button intent="secondary">Warning</Button>}>
        <Dialog.Content>
          <Dialog.Header
            title="Change plan"
            description="You are changing your current plan"
          />
          <Dialog.Section>
            <p className="text-word-secondary text-base">
              By downgrading, some premium features will be disabled.
            </p>
            <Dialog.Notice intent="warning">
              Your active integrations will be disconnected at the end of the cycle.
            </Dialog.Notice>
          </Dialog.Section>
        </Dialog.Content>
        <Dialog.Footer>
          <Dialog.Close>Cancel</Dialog.Close>
          <Button>Confirm</Button>
        </Dialog.Footer>
      </Dialog>

      <Dialog trigger={<Button intent="danger">Danger</Button>}>
        <Dialog.Content>
          <Dialog.Header
            title="Delete account"
            description="This action is irreversible"
          />
          <Dialog.Section>
            <p className="text-word-secondary text-base">
              By deleting your account, all your data will be permanently removed.
            </p>
            <Dialog.Notice intent="danger">
              All projects and associated data will be permanently deleted.
            </Dialog.Notice>
          </Dialog.Section>
        </Dialog.Content>
        <Dialog.Footer>
          <Dialog.Close>Cancel</Dialog.Close>
          <Button intent="danger">Delete</Button>
        </Dialog.Footer>
      </Dialog>

      <Dialog trigger={<Button intent="secondary">Neutral</Button>}>
        <Dialog.Content>
          <Dialog.Header
            title="Export data"
            description="Export your data in CSV format"
          />
          <Dialog.Section>
            <p className="text-word-secondary text-base">
              The export may take a few minutes depending on the data volume.
            </p>
            <Dialog.Notice intent="neutral">
              You will receive an email when the export is ready.
            </Dialog.Notice>
          </Dialog.Section>
        </Dialog.Content>
        <Dialog.Footer>
          <Dialog.Close>Cancel</Dialog.Close>
          <Button>Export</Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  ),
}
