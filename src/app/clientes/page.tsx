'use client'
import { Box, Button, Table, Badge, Stack, Flex, IconButton } from "@chakra-ui/react"
import { Play, Settings, FolderOpen } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardSagres() {
    const [clientes, setClientes] = useState([])
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter(); // <-- Hook de navegação do Next.js adicionado

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        fetch(`${API_URL}/api/clientes`)
            .then(res => res.json())
            .then(data => setClientes(data))
    }, [API_URL])

    const handleRodarRobo = async (clienteId: string) => {
        setLoading(clienteId)
        try {
            const hoje = new Date().setHours(0, 0, 0, 0) / 1000;

            await fetch(`${API_URL}/api/pipeline`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clienteId, timestamp: hoje.toString() })
            })
            alert("O robô começou a trabalhar na Droplet! Pode fechar esta aba.")
        } catch (e) {
            alert("Erro ao acordar o robô.")
        } finally {
            setLoading(null)
        }
    }

    return (
        <Flex flexDir={'column'} px={8} py={8}>
            <Stack gap={8}>
                <Box display="flex" justifyContent="end" alignItems="center">
                    {/* Botão Novo Cliente agora leva pra tela de cadastro */}
                    <Button 
                        colorPalette="blue" 
                        variant="solid"
                        onClick={() => router.push('/clientes/novo')}
                    >
                        Novo Cliente
                    </Button>
                </Box>

                <Table.Root variant="line" stickyHeader>
                    <Table.Header>
                        <Table.Row bg="gray.50">
                            <Table.ColumnHeader>Empresa</Table.ColumnHeader>
                            <Table.ColumnHeader>E-mail de Notificação</Table.ColumnHeader>
                            <Table.ColumnHeader align="center">Status</Table.ColumnHeader>
                            <Table.ColumnHeader align="right">Ações</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {clientes.map((cliente: { _id: string; nome: string; emailNotificacao: string }) => (
                            <Table.Row key={cliente._id}>
                                <Table.Cell fontWeight="medium">{cliente.nome}</Table.Cell>
                                <Table.Cell color="gray.600">{cliente.emailNotificacao}</Table.Cell>
                                <Table.Cell align="center">
                                    <Badge colorPalette="green">Pronto</Badge>
                                </Table.Cell>
                                <Table.Cell align="right">
                                    <Stack direction="row" gap={2} justify="end">
                                        <Button
                                            size="sm"
                                            colorPalette="orange"
                                            loading={loading === cliente._id}
                                            onClick={() => handleRodarRobo(cliente._id)}
                                        >
                                            <Play size={14} style={{ marginRight: '8px' }} /> Rodar Robô
                                        </Button>
                                        
                                        {/* NOVO BOTÃO: Direciona para a página de detalhes/histórico do cliente */}
                                        <Button 
                                            size="sm" 
                                            colorPalette="blue" 
                                            variant="solid"
                                            onClick={() => router.push(`/clientes/${cliente._id}`)}
                                        >
                                            <FolderOpen size={14} style={{ marginRight: '8px' }} /> 
                                            Ver Cliente
                                        </Button>

                                        <IconButton aria-label="Configurações" variant="ghost" size="sm">
                                            <Settings size={18} />
                                        </IconButton>
                                    </Stack>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Stack>
        </Flex>
    )
}