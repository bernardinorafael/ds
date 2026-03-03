import type { Meta, StoryObj } from "@storybook/react-vite"

import { Breadcrumb } from "@/components/breadcrumb"
import { IconSprite } from "@/components/icon"

const meta = {
  title: "Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <IconSprite />
        <Story />
      </>
    ),
  ],
} satisfies Meta<typeof Breadcrumb>

export default meta

type Story = StoryObj<typeof meta>

export const TwoLevels: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.Link href="/users">Users</Breadcrumb.Link>
      <Breadcrumb.Page>John Doe</Breadcrumb.Page>
    </Breadcrumb>
  ),
}

export const ThreeLevels: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      <Breadcrumb.Link href="/products">Products</Breadcrumb.Link>
      <Breadcrumb.Page>Running Shoes</Breadcrumb.Page>
    </Breadcrumb>
  ),
}

export const WithEllipsis: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      <Breadcrumb.Ellipsis />
      <Breadcrumb.Link href="/products/shoes">Shoes</Breadcrumb.Link>
      <Breadcrumb.Page>Nike Air Max</Breadcrumb.Page>
    </Breadcrumb>
  ),
}

export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumb separator="/">
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      <Breadcrumb.Link href="/settings">Settings</Breadcrumb.Link>
      <Breadcrumb.Page>Profile</Breadcrumb.Page>
    </Breadcrumb>
  ),
}
