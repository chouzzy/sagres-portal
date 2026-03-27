'use client'
import { Box, Button, Table, Badge, Stack, Flex, IconButton, Spinner } from "@chakra-ui/react"
import { Play, Settings, FolderOpen, LoaderCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toaster } from "@/components/ui/toaster" // Importando o Toaster!

export default function DashboardSagres() {
    const [clientes, setClientes] = useState<any[]>([])
    const router = useRouter(); 

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        const fetchClientes = () => {
            fetch(`${API_URL}/api/clientes?t=${Date.now()}`)
                .then(res => res.json())
                .then(data => setClientes(data))
        };

        fetchClientes();
        const interval = setInterval(fetchClientes, 5000); 
        return () => clearInterval(interval);
    }, [API_URL])

    const handleRodarRobo = async (clienteId: string) => {
        // 1. Já atualiza a tela instantaneamente para o botão girar
        setClientes(prev => prev.map(c => c._id === clienteId ? { ...c, isProcessing: true } : c));

        try {
            const hoje = new Date().setHours(0, 0, 0, 0) / 1000;
            const timestampStr = hoje.toString();

            // 2. Dá uma espiada rápida no histórico para ver se já rodou hoje
            const resHist = await fetch(`${API_URL}/api/clientes/${clienteId}/historico?t=${Date.now()}`);
            const historico = await resHist.json();
            const jaRodouHoje = historico.some((t: any) => String(t) === String(timestampStr));

            // 3. Dispara o Toaster de acordo com o histórico
            if (jaRodouHoje) {
                toaster.create({
                    title: "Atenção",
                    description: "Uma busca já foi realizada hoje. A IA irá reprocessar e atualizar a planilha.",
                    type: "warning", // Isso vai deixar ele amarelinho
                    closable: true,
                });
            } else {
                toaster.create({
                    title: "Robô em Ação",
                    description: "A extração e análise da IA foram iniciadas em background.",
                    type: "success", // Verdinho de sucesso
                    closable: true,
                });
            }

            // 4. Manda o backend trabalhar
            await fetch(`${API_URL}/api/pipeline`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clienteId, timestamp: timestampStr })
            });

        } catch (e) {
            // Se der erro de rede (backend fora do ar, etc)
            toaster.create({
                title: "Erro de Conexão",
                description: "Não foi possível acordar o robô na Droplet. Verifique o servidor.",
                type: "error", // Vermelho
                closable: true,
            });
            // Destrava o botão
            setClientes(prev => prev.map(c => c._id === clienteId ? { ...c, isProcessing: false } : c));
        } 
    }

    return (
        <Flex flexDir={'column'} px={8} py={8}>
            <Stack gap={8}>
                <Box display="flex" justifyContent="end" alignItems="center">
                    <Button colorPalette="blue" onClick={() => router.push('/clientes/novo')}>Novo Cliente</Button>
                </Box>

                <Table.Root variant="outline" stickyHeader>
                    <Table.Header>
                        <Table.Row bg="blue.900" color='white'>
                            <Table.ColumnHeader color='white'>Empresa</Table.ColumnHeader>
                            <Table.ColumnHeader color='white'>E-mail de Notificação</Table.ColumnHeader>
                            <Table.ColumnHeader color='white' align="center">Status</Table.ColumnHeader>
                            <Table.ColumnHeader color='white' align="right">Ações</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {clientes.map((cliente) => (
                            <Table.Row key={cliente._id}>
                                <Table.Cell fontWeight="medium">{cliente.nome}</Table.Cell>
                                <Table.Cell color="gray.600">{cliente.emailNotificacao}</Table.Cell>
                                <Table.Cell align="center">
                                    {cliente.isProcessing ? (
                                        <Badge colorPalette="yellow" display="flex" alignItems="center" gap={1} width="fit-content" mx="auto">
                                            <Spinner boxSize={4}  /> Processando
                                        </Badge>
                                    ) : (
                                        <Badge colorPalette="green">Pronto</Badge>
                                    )}
                                </Table.Cell>
                                <Table.Cell align="right">
                                    <Stack direction="row" gap={2} justify="end">
                                        <Button
                                            size="sm"
                                            colorPalette={cliente.isProcessing ? "gray" : "orange"}
                                            disabled={cliente.isProcessing}
                                            onClick={() => handleRodarRobo(cliente._id)}
                                        >
                                            {cliente.isProcessing ? (
                                                <><Spinner boxSize={4} style={{ marginRight: '8px' }} /> Analisando...</>
                                            ) : (
                                                <><Play size={14} style={{ marginRight: '8px' }} /> Rodar Robô</>
                                            )}
                                        </Button>
                                        
                                        <Button size="sm" colorPalette="blue" onClick={() => router.push(`/clientes/${cliente._id}`)}>
                                            <FolderOpen size={14} style={{ marginRight: '8px' }} /> Ver Cliente
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