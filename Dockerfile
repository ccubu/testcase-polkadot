FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

FROM gcr.io/distroless/nodejs20 AS runner

WORKDIR /app

COPY --from=builder /app .

USER nonroot

EXPOSE 3000

CMD ["src/index.js"]