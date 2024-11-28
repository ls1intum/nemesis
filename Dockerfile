FROM node:20-alpine AS artemis-module-metrics-dev

WORKDIR /app
EXPOSE 3000

# Skip npm install if node_modules exists.
CMD \[ -d "node_modules" \] && npm run dev || npm install && npm run dev

FROM node:20-alpine AS artemis-module-metrics-build

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
# See .npmrc for more information.
RUN npm install --legacy-peer-deps

COPY . /app
RUN npm run build

FROM node:20-alpine AS artemis-module-metrics

# install node
RUN apk add --no-cache nodejs=~20 npm=~10

WORKDIR /app

COPY --from=artemis-module-metrics-build /app/.next /app/.next
COPY --from=artemis-module-metrics-build /app/public /app/public
COPY --from=artemis-module-metrics-build /app/package.json /app/package.json
COPY --from=artemis-module-metrics-build /app/package-lock.json /app/package-lock.json
# See .npmrc for more information.
RUN npm install --omit=dev --legacy-peer-deps

ENV NODE_ENV=production

EXPOSE 3000
CMD npm run start
