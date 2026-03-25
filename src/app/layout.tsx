import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { Provider } from "@/components/ui/provider";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sagres Crawler",
  description: "Criado para facilitar a reserva de salas e recursos, o Sagres Crawler é uma ferramenta inovadora que automatiza o processo de busca e reserva, garantindo que os usuários encontrem as melhores opções disponíveis de forma rápida e eficiente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider>
          <Flex flexDir={'column'}>
            <Navbar/>
            {children}
          </Flex>
        </Provider>
      </body>
    </html>
  );
}
