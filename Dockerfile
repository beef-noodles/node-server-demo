FROM node:20.16.0-alpine AS builder
COPY ./ /app
WORKDIR /app
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm run build
RUN pnpm prune --ignore-scripts --prod

FROM node:20.16.0-alpine
LABEL app=node-server-demo arch=backend
WORKDIR /app
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/prisma ./prisma
USER node

EXPOSE 3000
ENTRYPOINT ["node", "./dist/src/index.js"]
