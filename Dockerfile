# syntax=docker/dockerfile:1

# Pakai target platform agar image final ikut arsitektur host saat buildx multi-arch.
FROM --platform=$TARGETPLATFORM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
# Aktifkan corepack untuk pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
# Pastikan pnpm-lock.yaml ada di root project kamu
COPY package.json pnpm-lock.yaml* ./

COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Define ARG and ENV for public variables required during build
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_SITE_EMAIL
ARG NEXT_PUBLIC_POSTHOG_HOST
ARG NEXT_PUBLIC_POSTHOG_API_KEY

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_EMAIL=$NEXT_PUBLIC_SITE_EMAIL
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_POSTHOG_API_KEY=$NEXT_PUBLIC_POSTHOG_API_KEY

# Skip env validation during image build (runtime will use real envs)
ENV SKIP_ENV_VALIDATION=1
# Batasi RAM saat build agar tidak crash di GitHub runner
ENV NODE_OPTIONS="--max-old-space-size=1024"
# Prisma butuh env URL saat generate (dummy untuk build)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL_UNPOOLED="postgresql://dummy:dummy@localhost:5432/dummy"
# better-auth dummy values untuk build (runtime akan pakai .env di VPS)
ENV BETTER_AUTH_SECRET="dummy-secret-for-build-only-will-be-replaced-at-runtime"
ENV BETTER_AUTH_URL="http://localhost:3000"

# Generate Prisma Client (config default)
RUN pnpm run db:generate
RUN pnpm build

# --- BAGIAN PRISMA (Hapus jika tidak pakai Prisma) ---
# ENV DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy"
# ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
# RUN pnpm prisma generate
# ---------------------------------------------------


FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl curl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install Prisma CLI agar bisa dipakai saat startup (db push)
RUN npm install -g prisma@6.10.1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set izin folder agar user nextjs bisa nulis (penting untuk cache/logs)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema agar prisma CLI bisa jalan di runtime
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Copy entrypoint (sebelum switch user)
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck agar Docker tahu jika app hang
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["./entrypoint.sh"]
