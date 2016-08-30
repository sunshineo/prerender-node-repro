FROM node:6.3.1

ENV NODE_ENV dev
EXPOSE 80

WORKDIR /home/

ADD package.json ./
RUN npm install

ADD server.js ./
ADD index.html ./

CMD ["npm", "start"]
