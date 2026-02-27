import type { Meta, StoryObj } from "@storybook/react-vite"

import { Card } from "@/components/card"
import { CheckboxWithLabel } from "@/components/checkbox-with-label"
import { Fieldset } from "@/components/fieldset"

const meta = {
  title: "Fieldset",
  component: Fieldset,
  tags: ["autodocs"],
  args: {
    legend: "Fieldset",
    description: "Description",
  },
} satisfies Meta<typeof Fieldset>

export default meta

type Story = StoryObj<typeof meta>

export const InsideCard: Story = {
  render: () => (
    <Card spacing="cozy" className="max-w-4xl">
      <Card.Header>
        <Card.Title>Configurações do Perfil</Card.Title>
        <Card.Description>
          Gerencie suas informações pessoais e preferências de conta
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <Card.Row>
          <Fieldset
            legend="Este é o seu avatar"
            description="Para melhores resultados, use uma imagem quadrada com menos de 3MB"
          >
            <div className="flex flex-col gap-2">
              <p className="text-word-primary text-base font-medium">Avatar</p>
              <p className="text-word-secondary text-sm">
                Formatos suportados: PNG, JPG, JPEG
              </p>
            </div>
          </Fieldset>
        </Card.Row>
        <Card.Row>
          <Fieldset
            legend="Este é seu nome de exibição"
            description="Selecione um nome que você gostaria que outras pessoas vissem no seu perfil"
          >
            <div className="flex flex-col gap-2">
              <p className="text-word-primary text-base font-medium">Nome</p>
              <input
                type="text"
                defaultValue="rafael bernardino"
                className="border-border rounded-md border bg-white px-3 py-2 text-sm"
              />
            </div>
          </Fieldset>
        </Card.Row>
        <Card.Row>
          <Fieldset
            legend="Altere seu username"
            description={[
              "Sua próxima oportunidade de alterá-lo será:",
              "sábado, 12 de abril de 2025 às 19:40",
            ]}
          >
            <div className="flex flex-col gap-2">
              <p className="text-word-primary text-base font-medium">Username</p>
              <p className="text-word-secondary text-sm">
                Podem conter apenas letras, números, sublinhados e pontos
              </p>
              <input
                type="text"
                defaultValue="bernardino"
                className="border-border rounded-md border bg-white px-3 py-2 text-sm"
              />
            </div>
          </Fieldset>
        </Card.Row>
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
                description="Receba novidades sobre lançamentos, promoções e ofertas exclusivas diretamente no seu email"
              >
                Novidades e promoções
              </CheckboxWithLabel>
              <CheckboxWithLabel
                id="security"
                defaultChecked
                description="Alertas sobre atividades suspeitas na sua conta"
              >
                Alertas de segurança
              </CheckboxWithLabel>
            </div>
          </Fieldset>
        </Card.Row>
      </Card.Body>
    </Card>
  ),
}
