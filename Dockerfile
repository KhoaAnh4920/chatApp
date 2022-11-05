FROM node:13-alpine

WORKDIR /src

COPY . .

RUN npm install


# Development
CMD ["npm", "start"]

# Production
# RUN npm install -g pm2
# CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]
