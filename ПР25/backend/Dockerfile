FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create data directory for SQLite
RUN mkdir -p /var/data

# Make data directory writable
RUN chown -R node:node /var/data

USER node

EXPOSE 10000

CMD ["npm", "start"]