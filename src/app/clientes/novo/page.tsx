'use client'
import { Box, Button, Container, Heading, Input, Stack, Textarea, Field } from "@chakra-ui/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NovoCliente() {
    const router = useRouter()
    
    // Estados do formulário
    const [cnpj, setCnpj] = useState("")
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [contexto, setContexto] = useState("")
    
    // Estados de carregamento
    const [loading, setLoading] = useState(false)
    const [buscandoCnpj, setBuscandoCnpj] = useState(false)

    // Função para buscar o CNPJ na BrasilAPI
    const buscarCNPJ = async () => {
        const cnpjLimpo = cnpj.replace(/\D/g, ''); // Tira pontos e traços

        if (cnpjLimpo.length !== 14) {
            alert("Por favor, digite um CNPJ válido com 14 números.");
            return;
        }

        setBuscandoCnpj(true);
        try {
            const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
            
            if (!response.ok) {
                throw new Error("CNPJ não encontrado");
            }

            const data = await response.json();

            // Preenche os campos
            setNome(data.razao_social);
            
            // Adiciona a atividade no contexto, preservando se o usuário já digitou algo
            const novoContexto = `Empresa do segmento de: ${data.cnae_fiscal_descricao}.\n\n${contexto}`.trim();
            setContexto(novoContexto);

        } catch (error) {
            alert("Erro ao buscar o CNPJ. Verifique se o número está correto.");
            console.error(error);
        } finally {
            setBuscandoCnpj(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        // Agora usamos os estados diretamente em vez do FormData
        const payload = {
            nome: nome,
            emailNotificacao: email,
            contextoIA: contexto,
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
            <Box p={8} borderWidth="1px" borderRadius="xl" boxShadow="sm" bg="white">
                <form onSubmit={handleSubmit} >
                    <Stack gap={6}>
                        <Heading size="md" mb={4}>Configuração de Novo Cliente - Sagres</Heading>

                        {/* NOVO CAMPO: Busca de CNPJ */}
                        <Field.Root>
                            <Field.Label>Buscar por CNPJ (Opcional mas recomendado)</Field.Label>
                            <Stack direction="row" gap={2} width="full">
                                <Input 
                                    placeholder="00.000.000/0000-00" 
                                    value={cnpj}
                                    onChange={(e) => setCnpj(e.target.value)}
                                />
                                <Button 
                                    type="button" // Essencial para não dar submit no formulário inteiro
                                    onClick={buscarCNPJ} 
                                    loading={buscandoCnpj}
                                    colorPalette="gray"
                                    variant="outline"
                                >
                                    Buscar
                                </Button>
                            </Stack>
                        </Field.Root>

                        <Field.Root required>
                            <Field.Label>Nome da Empresa (Razão Social)</Field.Label>
                            <Input 
                                name="nome" 
                                placeholder="Ex: AB Brasil (AB MAURI)" 
                                variant="outline" 
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </Field.Root>

                        <Field.Root required>
                            <Field.Label>E-mail para Alertas</Field.Label>
                            <Input 
                                name="email" 
                                type="email" 
                                placeholder="tributario@cliente.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Field.HelperText>Aonde o relatório consolidado será enviado.</Field.HelperText>
                        </Field.Root>

                        <Field.Root required>
                            <Field.Label>Cérebro da IA (Contexto Tributário)</Field.Label>
                            <Textarea
                                name="contexto"
                                placeholder="Descreva aqui o que é relevante para este cliente..."
                                height="250px"
                                resize="vertical"
                                value={contexto}
                                onChange={(e) => setContexto(e.target.value)}
                            />
                            <Field.HelperText>
                                Dica: A busca por CNPJ já preenche a atividade principal da empresa. Sinta-se livre para adicionar NCMs e regimes de interesse abaixo.
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