FROM node:10

COPY package.json .
COPY tsconfig.json .
COPY /src ./src

RUN npm install
RUN npm install typescript -g
RUN tsc

CMD [ "node", "./../dist/index.js" ]

