FROM node:18-alpine
 
WORKDIR /app
 
ENV CI=true

COPY .yarn ./.yarn
COPY jsconfig.json next.config.js package.json yarn.lock .yarnrc.yml .pnp.cjs .pnp.loader.mjs ./
COPY src ./src
COPY public ./public

RUN yarn set version berry
RUN yarn install --immutable

RUN yarn build
 
ENV NODE_ENV=production
CMD ["yarn", "start"]