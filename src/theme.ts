import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e6f2ff" },
          500: { value: "#0078ff" }, // Azul Sagres
          900: { value: "#003d80" },
        },
      },
    },
    semanticTokens: {
      colors: {
        accent: { value: "{colors.brand.500}" },
      },
    },
  },
})