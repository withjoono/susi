# Build stage
FROM node:24-bookworm AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.6.2 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/hizen-ai-be/package.json ./apps/hizen-ai-be/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Go to the app directory
WORKDIR /app/apps/hizen-ai-be

# Generate Prisma client
RUN pnpm prisma generate

# Set environment variables for build
ENV NODE_ENV=build

# Build the application
RUN pnpm build

# Production stage
FROM node:24-bookworm-slim AS runner

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.6.2 --activate

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/apps/hizen-ai-be/dist ./dist
COPY --from=builder /app/apps/hizen-ai-be/package.json ./
COPY --from=builder /app/apps/hizen-ai-be/prisma ./prisma

# Install runtime dependencies
RUN pnpm install --prod --ignore-scripts && pnpm store prune

# Set environment variables for development
ENV NODE_ENV=development

# Start the application
CMD ["node", "dist/main"]
