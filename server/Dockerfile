# Build
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY nest-cli.json tsconfig.json tsconfig.build.json ./

COPY src ./

RUN npm run build

# Production
FROM node:22-alpine AS production

ENV NODE_ENV=production
ENV PORT=80
EXPOSE ${PORT}

ENV STATIC_ASSETS_PATH=/app/uploads

WORKDIR /app

RUN --mount=type=bind,source=package.json,target=./package.json \
    --mount=type=bind,source=package-lock.json,target=./package-lock.json \
    npm ci --omit=dev && \
    npm cache clean --force

COPY --from=build /app/dist ./dist
CMD ["node", "dist/main.js"]
