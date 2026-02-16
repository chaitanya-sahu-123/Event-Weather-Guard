# ---- Base Image ----
FROM node:20-alpine

# ---- Set Working Directory ----
WORKDIR /app

# ---- Copy package files first (better layer caching) ----
COPY package*.json ./

# ---- Install dependencies ----
RUN npm ci --only=production

# ---- Copy rest of the application ----
COPY . .

# ---- Expose port ----
EXPOSE 5000

# ---- Set environment ----
ENV NODE_ENV=production

# ---- Start server ----
CMD ["node", "server.js"]