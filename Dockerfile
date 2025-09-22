# --- Etapa de construção (builder) ---
# Usa uma imagem Node.js completa para instalar dependências e compilar a aplicação
FROM node:20-alpine AS builder

# Instala o pnpm globalmente
RUN npm install -g pnpm

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copia os arquivos de configuração do pnpm e do Node para aproveitar o cache do Docker
COPY package.json pnpm-lock.yaml ./

# Instala todas as dependências do projeto usando pnpm
RUN pnpm install

# Copia o restante do código-fonte da aplicação
COPY . .

# Compila a aplicação NestJS para JavaScript
RUN pnpm run build

# --- Etapa de produção (final) ---
# Usa uma imagem Node.js minimalista para a imagem final, mais leve e segura
FROM node:20-alpine

# Instala o pnpm globalmente para poder executar o comando de start
RUN npm install -g pnpm

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos necessários da etapa de construção
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Expõe a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação em modo de produção
CMD ["pnpm", "start:prod"]