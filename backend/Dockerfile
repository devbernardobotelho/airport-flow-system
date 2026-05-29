FROM node:22-trixie

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++

COPY package*.json ./

RUN npm install --build-from-source sqlite3

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]