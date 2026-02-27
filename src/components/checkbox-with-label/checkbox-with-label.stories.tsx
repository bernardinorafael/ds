import type { Meta, StoryObj } from "@storybook/react-vite"

import { Card } from "@/components/card"
import { CheckboxWithLabel } from "@/components/checkbox-with-label"
import { Fieldset } from "@/components/fieldset"

const meta = {
  title: "CheckboxWithLabel",
  component: CheckboxWithLabel,
  tags: ["autodocs"],
  args: {
    id: "default",
    children: "Label",
  },
} satisfies Meta<typeof CheckboxWithLabel>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <CheckboxWithLabel id="without-desc" defaultChecked>
        Atualizações de produto
      </CheckboxWithLabel>
      <CheckboxWithLabel
        id="with-desc"
        description="Alertas sobre atividades suspeitas na sua conta"
      >
        Alertas de segurança
      </CheckboxWithLabel>
      <CheckboxWithLabel id="disabled-without-desc" disabled>
        Atualizações de produto
      </CheckboxWithLabel>
      <CheckboxWithLabel
        id="disabled-with-desc"
        disabled
        defaultChecked
        description="Alertas sobre atividades suspeitas na sua conta"
      >
        Alertas de segurança
      </CheckboxWithLabel>
    </div>
  ),
}

export const InsideFieldset: Story = {
  render: () => (
    <Card spacing="cozy" className="max-w-4xl">
      <Card.Body>
        <Card.Row>
          <Fieldset
            legend="Notificações por email"
            description="Escolha quais emails você gostaria de receber"
          >
            <div className="flex flex-col gap-3">
              <CheckboxWithLabel id="product" defaultChecked>
                Atualizações de produto
              </CheckboxWithLabel>
              <CheckboxWithLabel
                id="news"
                description="Novidades, promoções e ofertas exclusivas"
              >
                Novidades e promoções
              </CheckboxWithLabel>
              <CheckboxWithLabel id="security-alerts" defaultChecked>
                Alertas de segurança
              </CheckboxWithLabel>
            </div>
          </Fieldset>
        </Card.Row>
      </Card.Body>
    </Card>
  ),
}
