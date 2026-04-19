FROM node:18-alpine

WORKDIR /app

# Copy root package.json (if needed for workspaces) or just server dependencies
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm install

# Copy server code
COPY server ./server

# Environment variables should be passed via docker-compose
ENV PORT=3001
ENV NODE_ENV=production

EXPOSE 3001

# Add a script to run seed then start server
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'node server/seed.js' >> /app/start.sh && \
    echo 'node server/index.js' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]