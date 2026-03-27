'use client'
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Box, Flex, Heading, Text, Table, Button, Stack, Textarea, Field, IconButton, Input } from "@chakra-ui/react"
import { Download, Brain, History, ArrowLeft, LoaderCircle, Edit2, Check, X, Building2 } from "lucide-react"
import { toaster } from "@/components/ui/toaster"

export default function DetalhesCliente() {
    
    const params = useParams()
    const router = useRouter()
    const clienteId = params.id as string
    
    const [cliente, setCliente] = useState<any>(null)
    const [historico, setHistorico] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    // ESTADOS PARA A EDIÇÃO
    const [isEditing, setIsEditing] = useState(false)
    const [editContexto, setEditContexto] = useState("")
    const [editEmail, setEditEmail] = useState("")
    const [salvando, setSalvando] = useState(false)

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        const carregarDados = () => {
            Promise.all([
                fetch(`${API_URL}/api/clientes/${clienteId}?t=${Date.now()}`).then(res => res.json()),
                fetch(`${API_URL}/api/clientes/${clienteId}/historico?t=${Date.now()}`).then(res => res.json())
            ])
            .then(([dadosCliente, dadosHistorico]) => {
                setCliente(dadosCliente)
                
                // Preenche os campos de edição na primeira vez que carrega
                if (!isEditing) {
                    setEditContexto(dadosCliente.contextoIA)
                    setEditEmail(dadosCliente.emailNotificacao)
                }

                setHistorico(dadosHistorico)
            })
            .finally(() => setLoading(false))
        };

        carregarDados();
        const interval = setInterval(carregarDados, 5000); 
        return () => clearInterval(interval);
    }, [clienteId, API_URL, isEditing]) // Adicionamos isEditing na dependência para ele não sobrescrever o que estamos digitando

    const handleBaixarExcel = (timestamp: string) => {
        window.open(`${API_URL}/api/reports/download/${clienteId}/${timestamp}`, '_blank');
    };

    const formatarData = (timestamp: string) => {
        return new Date(Number(timestamp) * 1000).toLocaleDateString('pt-BR');
    }

    // FUNÇÃO PARA SALVAR A EDIÇÃO NO BACKEND
    const handleSalvarEdicao = async () => {
        setSalvando(true);
        try {
            const res = await fetch(`${API_URL}/api/clientes/${clienteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contextoIA: editContexto,
                    emailNotificacao: editEmail
                })
            });

            if (res.ok) {
                const clienteAtualizado = await res.json();
                setCliente(clienteAtualizado); // Atualiza a tela com os dados novos
                setIsEditing(false); // Sai do modo edição
                
                toaster.create({
                    title: "Sucesso!",
                    description: "As informações do cérebro da IA foram atualizadas.",
                    type: "success",
                });
            } else {
                throw new Error("Falha ao salvar");
            }
        } catch (error) {
            toaster.create({
                title: "Erro",
                description: "Não foi possível salvar as alterações. Tente novamente.",
                type: "error",
            });
        } finally {
            setSalvando(false);
        }
    }

    // Função para cancelar a edição e voltar ao texto original
    const handleCancelarEdicao = () => {
        setEditContexto(cliente?.contextoIA);
        setEditEmail(cliente?.emailNotificacao);
        setIsEditing(false);
    }

    if (loading) return (
        <Flex justify="center" align="center" height="100vh">
            <LoaderCircle size={40} className="animate-spin" />
        </Flex>
    )

    return (
        <Flex flexDir={'column'} px={8} py={8}>
            <Stack gap={8}>
                <Flex align="center" gap={4}>
                    <IconButton aria-label="Voltar" variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft />
                    </IconButton>
                    <Heading size="lg">Monitoramento Tributário: {cliente?.nome}</Heading>
                </Flex>

                {/* CAIXA DO CONTEXTO DA IA */}
                <Box p={6} borderWidth="1px" borderRadius="xl" bg="blue.900" boxShadow="sm">
                    <Stack gap={4}>
                        <Flex align="center" justify="space-between" w="full">
                            <Flex align="center" gap={2} color="gray.50">
                                <Building2 />
                                <Heading size="md" color="gray.50">Resumo da Atividade do Cliente</Heading>
                            </Flex>
                            
                            {/* BOTÕES DE EDIÇÃO */}
                            {!isEditing ? (
                                <Button size="sm" variant="solid" colorPalette="blue" onClick={() => setIsEditing(true)}>
                                    <Edit2 size={16} style={{ marginRight: '6px' }} /> Editar Resumo
                                </Button>
                            ) : (
                                <Flex gap={2}>
                                    <Button size="sm" variant="solid" colorPalette="red" onClick={handleCancelarEdicao} disabled={salvando}>
                                        <X size={16} /> Cancelar
                                    </Button>
                                    <Button size="sm" colorPalette="green" onClick={handleSalvarEdicao} loading={salvando}>
                                        <Check size={16} style={{ marginRight: '6px' }} /> Salvar
                                    </Button>
                                </Flex>
                            )}
                        </Flex>

                        <Field.Root>
                            <Textarea 
                                value={isEditing ? editContexto : cliente?.contextoIA} 
                                onChange={(e) => setEditContexto(e.target.value)}
                                readOnly={!isEditing} 
                                height={isEditing ? "250px" : "150px"} // Aumenta a caixa quando vai editar
                                bg={isEditing ? "white" : "gray.50"}
                                borderWidth={isEditing ? "2px" : "1px"}
                                borderColor={isEditing ? "blue.400" : "gray.200"}
                                resize="vertical"
                            />
                            <Field.HelperText color='gray.50'>Este é o contexto usado pelo Gemini para filtrar as leis.</Field.HelperText>
                        </Field.Root>

                        <Field.Root>
                            <Flex align="center" gap={2}>
                                <Text color="gray.50" whiteSpace="nowrap">E-mail de Notificação:</Text>
                                {isEditing ? (
                                    <Input 
                                        size="sm"
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        bg="white"
                                        borderColor="blue.400"
                                        borderWidth="2px"
                                    />
                                ) : (
                                    <Text fontWeight="bold" color="gray.50">{cliente?.emailNotificacao}</Text>
                                )}
                            </Flex>
                        </Field.Root>

                    </Stack>
                </Box>

                {/* CAIXA DO HISTÓRICO (Continua igual) */}
                <Box p={6} borderWidth="1px" borderRadius="xl" bg="white" boxShadow="sm">
                    <Stack gap={4}>
                        <Flex align="center" gap={2} color="orange.500">
                            <History />
                            <Heading size="md" color="gray.800">Histórico de Relatórios Gerados</Heading>
                        </Flex>

                        {cliente?.isProcessing && (
                            <Box p={4} bg="yellow.50" borderWidth="1px" borderColor="yellow.200" borderRadius="md">
                                <Flex align="center" gap={3} color="yellow.700">
                                    <LoaderCircle size={20} className="animate-spin" />
                                    <Box>
                                        <Text fontWeight="bold" fontSize="sm">Busca de hoje em andamento...</Text>
                                        <Text fontSize="xs">A extração dos diários e análise da IA pode levar alguns minutos. A planilha aparecerá aqui quando concluída.</Text>
                                    </Box>
                                </Flex>
                            </Box>
                        )}

                        {historico.length === 0 && !cliente?.isProcessing ? (
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