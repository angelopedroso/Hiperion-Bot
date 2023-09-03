FROM node:18

WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y wget gnupg ffmpeg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* 

COPY package*.json ./

COPY . .

RUN npm install

RUN npm install -g typescript

RUN npm run build

RUN npm run

ENV BOT_NAME=
ENV OWNER_NUM=
ENV BOT_NUM=

#pt/en
ENV LANGUAGE= 

ENV API_SIGHTENGINE_USER=
ENV API_SIGHTENGINE_SECRET=

ENV OPENAI_API_KEY=

ENV ACR_HOST=
ENV ACR_KEY=
ENV ACR_SECRET_KEY=

ENV REDIS_URI=

ENV DATABASE_URL=

ENV WWEBJS_PATH='wwebjs_auth'

EXPOSE 5000

USER root

CMD ["npm", "run", "start"]
