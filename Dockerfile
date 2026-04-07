FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
# Aktifkan corepack untuk pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
# Pastikan pnpm-lock.yaml ada di root project kamu
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Batasi RAM saat build agar tidak crash di GitHub runner
ENV NODE_OPTIONS="--max-old-space-size=1024"

# --- BAGIAN PRISMA (Hapus jika tidak pakai Prisma) ---
# ENV DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy"
# ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
# RUN pnpm prisma generate
# ---------------------------------------------------

RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl curl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set izin folder agar user nextjs bisa nulis (penting untuk cache/logs)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Jika pakai Prisma, salin generated client-nya (sesuaikan path jika berbeda)
# COPY --from=builder --chown=nextjs:nodejs /app/lib/generated/prisma ./lib/generated/prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck agar Docker tahu jika app hang
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]