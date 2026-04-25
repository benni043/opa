FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

CMD ["node", ".output/server/index.mjs"]
