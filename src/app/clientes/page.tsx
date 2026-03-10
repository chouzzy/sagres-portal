'use client'
import { Box, Button, Table, Heading, Badge, Stack, Text, IconButton } from "@chakra-ui/react"
import { Play, Download, Settings } from "lucide-react"
import { useState, useEffect } from "react"

export default function DashboardSagres() {
    const [clientes, setClientes] = useState([])
    // Agora o TS entende: "Pode ser uma string ou null"
    const [loading, setLoading] = useState<string | null>(null);
    // Busca os clientes da sua API na Droplet (ou localhost por enquanto)
    useEffect(() => {
        fetch('http://localhost:3001/api/clientes')
            .then(res => res.json())
            .then(data => setClientes(data))
    }, [])

    const handleRodarRobo = async (clienteId: string) => {
        setLoading(clienteId)
        try {
            // Mandamos o timestamp de HOJE (meia-noite) para o crawler
            const hoje = new Date().setHours(0, 0, 0, 0) / 1000;

            await fetch('http://localhost:3001/api/pipeline', {
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
        <Box p={10}>
            <Stack gap={8}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Heading size="lg">Portal de Inteligência Sagres</Heading>
                    <Button colorPalette="blue" variant="solid">Novo Cliente</Button>
                </Box>

                <Table.Root variant="outline" stickyHeader>
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
                                        <IconButton aria-label="Settings" variant="ghost" size="sm">
                                            <Settings size={18} />
                                        </IconButton>
                                    </Stack>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Stack>
        </Box>
    )
}