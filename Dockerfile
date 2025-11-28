FROM node:20-slim

# Puppeteer 의존성 설치
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# server 폴더의 package.json 복사 및 의존성 설치
COPY server/package*.json ./
RUN npm ci --only=production

# server 폴더의 소스 코드 복사
COPY server/ ./

# backend/json_results 폴더 복사 (캐시 데이터)
# 서버 코드가 ../../backend/json_results를 참조하므로
# /app/services/../../backend/json_results = /backend/json_results
RUN mkdir -p /backend
COPY backend/json_results/ /backend/json_results/

# Puppeteer가 시스템 Chromium 사용하도록 설정
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# 포트 설정 (Cloud Run은 PORT 환경변수를 자동으로 설정)
ENV PORT=8080
EXPOSE 8080

# 서버 시작
CMD ["node", "index.js"]

