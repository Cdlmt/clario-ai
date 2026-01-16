FROM node:20-bookworm

# ffmpeg pour conversion audio
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /repo

# pnpm via corepack
RUN corepack enable

# Copier uniquement ce qui est nécessaire pour installer deps (cache efficace)
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY server/package.json server/package.json

# Installer uniquement les deps du serveur
RUN pnpm install --frozen-lockfile --filter ./server...

# Copier le reste
COPY . .

# Build si nécessaire (si TS)
# RUN pnpm --filter ./server... build

WORKDIR /repo/server

RUN pnpm prisma generate

EXPOSE 3000
CMD ["pnpm", "prod"]