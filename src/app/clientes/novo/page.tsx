'use client'
import { Box, Button, Container, Heading, Input, Stack, Textarea, Field } from "@chakra-ui/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NovoCliente() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const payload = {
            nome: formData.get("nome"),
            emailNotificacao: formData.get("email"),
            contextoIA: formData.get("contexto"),
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) router.push("/clientes")
        } catch (error) {
            console.error("Erro ao salvar cliente", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container maxW="container.md" py={20}>
            <Box as="form" p={8} borderWidth="1px" borderRadius="xl" boxShadow="sm" bg="white">
                <form onSubmit={handleSubmit} >
                    <Stack gap={6}>
                        <Heading size="md" mb={4}>Configuração de Novo Cliente - Sagres</Heading>

                        <Field.Root required>
                            <Field.Label>Nome da Empresa</Field.Label>
                            <Input name="nome" placeholder="Ex: AB Brasil (AB MAURI)" variant="outline" />
                        </Field.Root>

                        <Field.Root required>
                            <Field.Label>E-mail para Alertas</Field.Label>
                            <Input name="email" type="email" placeholder="tributario@cliente.com" />
                            <Field.HelperText>Aonde o relatório consolidado será enviado.</Field.HelperText>
                        </Field.Root>

                        <Field.Root required>
                            <Field.Label>Cérebro da IA (Contexto Tributário)</Field.Label>
                            <Textarea
                                name="contexto"
                                placeholder="Descreva aqui o que é relevante para este cliente..."
                                height="250px"
                                resize="vertical"
                            />
                            <Field.HelperText>
                                Dica: Mencione estados de interesse, produtos (NCMs) e regime tributário.
                            </Field.HelperText>
                        </Field.Root>

                        <Button type="submit" colorPalette="blue" loading={loading} width="full">
                            Salvar e Ativar Robô
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Container>
    )
}