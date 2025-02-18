FROM node:lts AS builder
COPY ./ /app
WORKDIR /app
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm run build
RUN pnpm prune --ignore-scripts --prod

FROM node:lts
LABEL app=node-server-demo arch=backend
WORKDIR /app
COPY --from=builder  /app/dist ./dist
COPY --from=builder  /app/node_modules ./node_modules
COPY --from=builder  /app/prisma ./prisma
USER node

EXPOSE 3000
ENTRYPOINT ["node", "./dist/src/index.js"]
