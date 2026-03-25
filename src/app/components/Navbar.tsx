'use client';

import { useState } from 'react';
import { Box, Flex, Button, Link, Stack, Text, Avatar, IconButton, Menu, Heading } from '@chakra-ui/react';
import { DoorOpen, CalendarClock, CalendarDays, ShieldCheck, LayoutDashboard, Users, X, LogOut, MenuIcon } from 'lucide-react';

export default function Navbar() {
    const isAdmin = true;

    const session = {
        user: {
            name: 'Sagres',
            email: 'Email@sagrespro.com.br'
        }
    }

    // Estado para controlar o menu no celular
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const closeMenu = () => setIsMobileOpen(false);

    // Componente que renderiza os links comuns
    const PublicLinks = () => (
        <>
            {/* <Link href="/salas" onClick={closeMenu}>
                <Button _hover={{ bgColor: 'gray.700' }} variant="ghost" size="md" h={{ base: 12, lg: 16 }} w="full" justifyContent={{ base: "flex-start", lg: "center" }} fontWeight="normal">
                    <DoorOpen /> Salas
                </Button>
            </Link>
            <Link href="/calendario" onClick={closeMenu}>
                <Button _hover={{ bgColor: 'gray.700' }} variant="ghost" size="md" h={{ base: 12, lg: 16 }} w="full" justifyContent={{ base: "flex-start", lg: "center" }} fontWeight="normal">
                    <CalendarClock /> Calendário
                </Button>
            </Link>
            <Link href="/minhas-reservas" onClick={closeMenu}>
                <Button _hover={{ bgColor: 'gray.700' }} variant="ghost" size="md" h={{ base: 12, lg: 16 }} w="full" justifyContent={{ base: "flex-start", lg: "center" }} fontWeight="normal">
                    <CalendarDays /> Minhas Reservas
                </Button>
            </Link> */}
        </>
    );

    // Componente que renderiza os links de Admin
    const AdminLinks = () => (
        <>
            {/* <Link href="/admin/dashboard" onClick={closeMenu}>
                <Button variant="ghost" size="md" h={{ base: 12, lg: 16 }} w="full" justifyContent={{ base: "flex-start", lg: "center" }} color={'purple.500'} _hover={{ bgColor: 'purple.800', color: 'purple.100' }}>
                    <ShieldCheck /> Aprovações
                </Button>
            </Link>
            <Link href="/admin/salas" onClick={closeMenu}>
                <Button variant="ghost" size="md" h={{ base: 12, lg: 16 }} w="full" justifyContent={{ base: "flex-start", lg: "center" }} color={'purple.500'} _hover={{ bgColor: 'purple.800', color: 'purple.100' }}>
                    <LayoutDashboard /> Gerir Salas
                </Button>
            </Link>
            <Link href="/admin/usuarios" onClick={closeMenu}>
                <Button variant="ghost" size="md" h={{ base: 12, lg: 16 }} w="full" justifyContent={{ base: "flex-start", lg: "center" }} color={'purple.500'} _hover={{ bgColor: 'purple.800', color: 'purple.100' }}  >
                    <Users /> Usuários
                </Button>
            </Link> */}
        </>
    );

    return (
        <Flex
            borderBottomWidth="1px"
            borderColor={'gray.200'}
            color={'gray.100'}
            bgGradient="to-r"
            gradientFrom="{colors.brand.500}"
            gradientTo="{colors.brand.700}"
            position="sticky"
            top={0}
            zIndex={50}
            flexDir={'column'}
            w="100%"
            boxShadow={'2xl'}
            px={8}
            py={8}
        >
            <Flex alignItems="center" justifyContent="space-between" w="100%" >

                {/* Logo / Título */}
                {/* <Link
                    href="/"
                    _hover={{ textDecoration: 'none' }}
                    fontSize="xl"
                    fontWeight="bold"
                    color="blue.600"
                    bgImage={isAdmin ? 'url(/logo-admin.png)' : 'url(/logo.png)'}
                    bgRepeat="no-repeat"
                    bgSize="contain"
                    bgPos="center"
                    minW={28}
                    h={16}
                    my={2}
                /> */}


                <Heading size="lg">Portal de Inteligência Sagres</Heading>

                {/* Menu Principal (Desktop) - Só mostra em telas grandes (lg) para não quebrar botões */}
                <Stack direction="row" gap={2} display={{ base: 'none', lg: 'flex' }} position="absolute" left="50%" transform="translateX(-50%)">
                    <PublicLinks />
                    {isAdmin && (
                        <>
                            <Box w="1px" h="20px" bg="border.muted" alignSelf="center" mx={2} />
                            <AdminLinks />
                        </>
                    )}
                </Stack>

                {/* Área do Usuário + Hamburger Menu (Direita) */}
                <Flex align="center" gap={4}>
                    <Flex align="center" gap={3}>
                        <Box textAlign="left">
                            <Flex align="center" gap={2} justify="flex-end">
                                <Text fontSize="sm" fontWeight="medium" lineHeight="1.2" display={{ base: 'none', sm: 'block' }}>
                                    {session.user.name}
                                </Text>
                                {isAdmin && (
                                    <Box px={1.5} py={0.5} bg="purple.700" color="purple.100" fontSize="2xs" fontWeight="bold" borderRadius="sm">
                                        ADMIN
                                    </Box>
                                )}

                            </Flex>
                            <Text fontSize="xs" color="fg.muted" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap" maxW={40} display={{ base: 'none', sm: 'block' }}>
                                {session.user.email}
                            </Text>
                        </Box>

                        <Avatar.Root bgColor={isAdmin ? 'purple.700' : 'brand.700'} size="sm" mr={{ base: 0, lg: 8 }}>
                            <Avatar.Fallback name={session.user.name || 'User'} />
                            <Avatar.Image />
                        </Avatar.Root>


                        {/* Botão Hambúrguer (Apenas Mobile/Tablet) */}
                        <Button
                            display={{ base: 'flex', lg: 'none' }}
                            variant="ghost"
                            size="sm"
                            px={2}
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                        >
                            {isMobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
                        </Button>

                    </Flex>
                </Flex>
            </Flex>

            {/* Menu Suspenso (Dropdown) para Mobile */}
            {isMobileOpen && (
                <Box
                    display={{ base: 'block', lg: 'none' }}
                    bgGradient="to-b"
                    gradientFrom="#1a1a1a"
                    gradientTo="#0d0d0d"
                    position="absolute"
                    top="100%"
                    left={0}
                    w="full"
                    shadow="lg"
                    borderBottomWidth="1px"
                    p={4}
                >
                    <Stack gap={2}>
                        <PublicLinks />

                        {isAdmin && (
                            <>
                                <Box h="1px" w="full" bg="border.muted" my={2} />
                                <Text fontSize="xs" fontWeight="bold" color="brand.600" textTransform="uppercase" ml={4}>
                                    Administração
                                </Text>
                                <AdminLinks />
                            </>
                        )}

                        <Box h="1px" w="full" bg="border.muted" my={2} />


                    </Stack>
                </Box>
            )}
        </Flex>
    );
}