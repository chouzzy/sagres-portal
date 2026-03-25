'use client'
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Box, Flex, Heading, Text, Table, Button, Badge, Stack, Textarea, Field, IconButton } from "@chakra-ui/react"
import { Download, Brain, History, ArrowLeft, LoaderCircle } from "lucide-react"

export default function DetalhesCliente() {
    const params = useParams()
    const router = useRouter()
    const clienteId = params.id as string
    
    const [cliente, setCliente] = useState<any>(null)
    const [historico, setHistorico] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        // Busca os dados do cliente e o histórico em paralelo
        Promise.all([
            fetch(`${API_URL}/api/clientes/${clienteId}`).then(res => res.json()),
            fetch(`${API_URL}/api/clientes/${clienteId}/historico`).then(res => res.json())
        ])
        .then(([dadosCliente, dadosHistorico]) => {
            setCliente(dadosCliente)
            setHistorico(dadosHistorico)
        })
        .finally(() => setLoading(false))
    }, [clienteId, API_URL])

    const handleBaixarExcel = (timestamp: string) => {
        // Abre a rota de download específica para AQUELA DATA
        window.open(`${API_URL}/api/reports/download/${clienteId}/${timestamp}`, '_blank');
    };

    // Função auxiliar para formatar o timestamp Unix em data brasileira
    const formatarData = (timestamp: string) => {
        return new Date(Number(timestamp) * 1000).toLocaleDateString('pt-BR');
    }

    if (loading) return (
        <Flex justify="center" align="center" height="100vh">
            <LoaderCircle size={40} className="animate-spin" />
        </Flex>
    )

    return (
        <Flex flexDir={'column'} px={8} py={8}>
            <Stack gap={8}>
                {/* Cabeçalho com Botão Voltar */}
                <Flex align="center" gap={4}>
                    <IconButton aria-label="Voltar" variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft />
                    </IconButton>
                    <Heading size="lg">Monitoramento Tributário: {cliente?.nome}</Heading>
                </Flex>

                {/* Seção 1: Cérebro da IA (Contexto) */}
                <Box p={6} borderWidth="1px" borderRadius="xl" bg="white" boxShadow="sm">
                    <Stack gap={4}>
                        <Flex align="center" gap={2} color="brand.500">
                            <Brain />
                            <Heading size="md" color="gray.800">Cérebro da IA (Contexto Tributário)</Heading>
                        </Flex>
                        <Field.Root>
                            <Textarea 
                                value={cliente?.contextoIA} 
                                readOnly // No MVP deixamos readOnly, na v2 fazemos editar
                                height="150px" 
                                bg="gray.50"
                                resize="none"
                            />
                            <Field.HelperText>Este é o contexto usado pelo Gemini para filtrar as leis.</Field.HelperText>
                        </Field.Root>
                        <Text color="gray.600">E-mail de Notificação: <b>{cliente?.emailNotificacao}</b></Text>
                    </Stack>
                </Box>

                {/* Seção 2: Histórico de Consultas */}
                <Box p={6} borderWidth="1px" borderRadius="xl" bg="white" boxShadow="sm">
                    <Stack gap={4}>
                        <Flex align="center" gap={2} color="orange.500">
                            <History />
                            <Heading size="md" color="gray.800">Histórico de Relatórios Gerados</Heading>
                        </Flex>

                        {historico.length === 0 ? (
                            <Text color="gray.500" py={4} textAlign="center">Nenhum relatório foi gerado para este cliente ainda.</Text>
                        ) : (
                            <Table.Root variant="line" size="sm">
                                <Table.Header>
                                    <Table.Row bg="gray.50">
                                        <Table.ColumnHeader>Data da Busca</Table.ColumnHeader>
                                        <Table.ColumnHeader align="right">Ação</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {historico.map(timestamp => (
                                        <Table.Row key={timestamp}>
                                            <Table.Cell fontWeight="medium">
                                                {formatarData(timestamp)}
                                            </Table.Cell>
                                            <Table.Cell align="right">
                                                <Button 
                                                    size="xs" 
                                                    colorPalette="green" 
                                                    variant="solid"
                                                    onClick={() => handleBaixarExcel(timestamp)}
                                                >
                                                    <Download size={12} style={{ marginRight: '6px' }} /> 
                                                    Baixar Excel
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        )}
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}