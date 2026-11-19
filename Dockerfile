FROM node:26-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:26-slim AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_IMAGE_STORAGE_MODE
ARG NEXT_PUBLIC_VERCEL_ENV
ENV NEXT_PUBLIC_IMAGE_STORAGE_MODE=$NEXT_PUBLIC_IMAGE_STORAGE_MODE \
    NEXT_PUBLIC_VERCEL_ENV=$NEXT_PUBLIC_VERCEL_ENV \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:26-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN mkdir -p /app/data /app/generated-images /app/.next && chown -R node:node /app
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
