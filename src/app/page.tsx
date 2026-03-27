'use client';

import { Box, Container, Heading, Text, Flex, Button, Stack, SimpleGrid } from "@chakra-ui/react";
import { Users, FileSpreadsheet, Bot, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <Box bg="gray.50" minH="calc(100vh - 70px)" py={10}>
      <Container maxW="container.xl">
        
        {/* Cabeçalho da Home */}
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "start", md: "center" }} mb={10} gap={4}>
          <Box>
            <Heading size="xl" color="gray.800" mb={2}>
              Bem-vindo ao Sagres Pro
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Painel de controle do robô de inteligência e extração tributária.
            </Text>
          </Box>
          <Link href="/clientes/novo">
            <Button colorPalette="blue" size="lg">
              <Bot style={{ marginRight: '8px' }} /> Novo Robô / Cliente
            </Button>
          </Link>
        </Flex>

        {/* Cards de Acesso Rápido */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          
          <Box p={6} bg="white" borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="gray.100">
            <Flex align="center" justify="center" w={12} h={12} bg="blue.50" color="blue.600" borderRadius="lg" mb={4}>
              <Users size={24} />
            </Flex>
            <Heading size="md" mb={2} color="gray.800">Meus Clientes</Heading>
            <Text color="gray.500" mb={4} fontSize="sm">
              Gerencie a lista de clientes monitorados, edite contextos da IA e e-mails de notificação.
            </Text>
            <Link href="/clientes">
              <Button variant="ghost" colorPalette="blue" w="full" justifyContent="space-between">
                Acessar Lista <ArrowRight size={16} />
              </Button>
            </Link>
          </Box>

          <Box p={6} bg="white" borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="gray.100">
            <Flex align="center" justify="center" w={12} h={12} bg="green.50" color="green.600" borderRadius="lg" mb={4}>
              <FileSpreadsheet size={24} />
            </Flex>
            <Heading size="md" mb={2} color="gray.800">Relatórios Gerados</Heading>
            <Text color="gray.500" mb={4} fontSize="sm">
              Acesse as planilhas extraídas e processadas pelo motor de Inteligência Artificial.
            </Text>
            <Link href="/clientes">
              <Button variant="ghost" colorPalette="green" w="full" justifyContent="space-between">
                Ver Relatórios <ArrowRight size={16} />
              </Button>
            </Link>
          </Box>

          <Box p={6} bg="white" borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="gray.100">
            <Flex align="center" justify="center" w={12} h={12} bg="purple.50" color="purple.600" borderRadius="lg" mb={4}>
              <Activity size={24} />
            </Flex>
            <Heading size="md" mb={2} color="gray.800">Status do Robô</Heading>
            <Text color="gray.500" mb={4} fontSize="sm">
              Acompanhe a fila de execução, status do crawler e consumo de tokens da API do Gemini.
            </Text>
            <Button variant="ghost" colorPalette="purple" w="full" justifyContent="space-between" disabled>
              Em breve <ArrowRight size={16} />
            </Button>
          </Box>

        </SimpleGrid>

      </Container>
    </Box>
  );
}