import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, {
  globalCss: {
    "html, body": {
      margin: '0',
      padding: '0',
      bgColor: '{colors.gray.100}',
      color: 'gray.800'
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#07457e" },
          100: { value: "#07457e" },
          200: { value: "#07457e" },
          300: { value: "#07457e" },
          400: { value: "#07457e" },
          500: { value: "#07457e" },
          600: { value: "#07457e" },
          700: { value: "#063561" },
          800: { value: "#07457e" },
          900: { value: "#07457e" },
        },
      },
    },
    semanticTokens: {
      colors: {
        bodyBg: {
          value: { base: "{colors.green.500}", _dark: "{colors.green.500}" }
        },
        textPrimary: {
          value: { base: "{colors.whiteAlpha.900}", _dark: "{colors.whiteAlpha.900}" }
        },
      }
    }
  },
})

