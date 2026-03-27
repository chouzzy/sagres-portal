'use client';

import { useState } from 'react';
import { Box, Flex, Button, Stack, Text, Avatar, Heading, Image } from '@chakra-ui/react';
import { LayoutDashboard, Users, X, MenuIcon, Database, Activity } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
    const isAdmin = true;

    const session = {
        user: {
            name: 'Admin Sagres',
            email: 'admin@sagrespro.com.br'
        }
    }

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const closeMenu = () => setIsMobileOpen(false);

    // Links reais do sistema Sagres
    const NavLinks = () => (
        <>
            <Link href="/" onClick={closeMenu}>
                <Button variant="ghost" size="md" color="gray.600" _hover={{ bg: 'blue.900', color: 'gray.50' }} w="full" justifyContent={{ base: "flex-start", lg: "center" }}>
                    <LayoutDashboard size={18} style={{ marginRight: '8px' }} /> Dashboard
                </Button>
            </Link>
            <Link href="/clientes" onClick={closeMenu}>
                <Button variant="ghost" size="md" color="gray.600" _hover={{ bg: 'blue.900', color: 'gray.50' }} w="full" justifyContent={{ base: "flex-start", lg: "center" }}>
                    <Users size={18} style={{ marginRight: '8px' }} /> Clientes
                </Button>
            </Link>
            <Link href="/clientes/novo" onClick={closeMenu}>
                <Button variant="ghost" size="md" color="gray.600" _hover={{ bg: 'blue.900', color: 'gray.50' }} w="full" justifyContent={{ base: "flex-start", lg: "center" }}>
                    <Database size={18} style={{ marginRight: '8px' }} /> Novo Cliente
                </Button>
            </Link>
        </>
    );

    return (
        <Flex
            as="nav"
            bg="white"
            borderBottomWidth="1px"
            borderColor="gray.200"
            position="sticky"
            top={0}
            zIndex={50}
            w="100%"
            boxShadow="xs"
            px={{ base: 4, lg: 8 }}
            py={3}
            alignItems="center"
            justifyContent="space-between"
        >
            {/* Logo / Título */}
            <Flex align="center" gap={4}>
                <Link href="/">
                    <Image
                        src="/logo-rmbg.png"
                        alt="Logo Sagres"
                        h="40px"
                    />
                </Link>
            </Flex>

            {/* Menu Principal (Desktop) */}
            <Stack direction="row" gap={2} display={{ base: 'none', lg: 'flex' }} position="absolute" left="50%" transform="translateX(-50%)">
                <NavLinks />
            </Stack>

            {/* Área do Usuário + Hamburger Menu */}
            <Flex align="center" gap={4}>
                <Flex align="center" gap={3}>
                    <Box textAlign="right" display={{ base: 'none', sm: 'block' }}>
                        <Flex align="center" gap={2} justify="flex-end">
                            {/* <Text fontSize="sm" fontWeight="bold" color="gray.800">
                                {session.user.name}
                            </Text> */}
                            {isAdmin && (
                                <Box px={2} py={0.5} bg="blue.100" color="blue.700" fontSize="2xs" fontWeight="bold" borderRadius="md">
                                    ADMIN
                                </Box>
                            )}
                        </Flex>
                        {/* <Text fontSize="xs" color="gray.500">
                            {session.user.email}
                        </Text> */}
                    </Box>

                    <Avatar.Root bgColor="blue.50" size="sm">
                        <Avatar.Fallback name={'sagres'} />
                    </Avatar.Root>

                    {/* Botão Mobile */}
                    <Button
                        display={{ base: 'flex', lg: 'none' }}
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        color="gray.600"
                    >
                        {isMobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
                    </Button>
                </Flex>
            </Flex>

            {/* Menu Mobile Suspenso */}
            {isMobileOpen && (
                <Box
                    display={{ base: 'block', lg: 'none' }}
                    bg="white"
                    position="absolute"
                    top="100%"
                    left={0}
                    w="full"
                    shadow="lg"
                    borderBottomWidth="1px"
                    borderColor="gray.200"
                    p={4}
                >
                    <Stack gap={2}>
                        <NavLinks />
                    </Stack>
                </Box>
            )}
        </Flex>
    );
}