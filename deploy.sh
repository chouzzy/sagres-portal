#!/bin/bash

# 1. Puxa as novidades do Git
echo "📥 Puxando código do repositório..."
git pull origin main

# 2. Instala dependências (limpando o que não precisa)
echo "📦 Instalando dependências..."
npm install --production

# 3. Build do TypeScript
echo "🏗️ Compilando TypeScript..."
npm run build

# 4. Sobe o Banco (caso esteja parado)
echo "🐳 Garantindo que o Docker esteja Up..."
docker compose up -d

# 5. Reinicia o Processo no PM2
# O --name ajuda a identificar o processo na lista
echo "🚀 Reiniciando o servidor..."
pm2 restart sagres-api || pm2 start dist/server.js --name "sagres-api"

# 6. Salva a lista do PM2 para iniciar com o Boot da Droplet
pm2 save

echo "✅ Deploy finalizado com sucesso, mano!"