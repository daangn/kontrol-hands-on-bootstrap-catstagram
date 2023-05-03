FROM node:18-alpine
 
WORKDIR /app
 
COPY jsconfig.json next.config.js package.json yarn.lock ./
COPY src ./src
COPY public ./public

RUN yarn install
RUN yarn build
 
ENV NODE_ENV=production
CMD ["yarn", "start"]