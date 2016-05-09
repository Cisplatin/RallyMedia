FROM mhart/alpine-node:6.1.0

RUN mkdir -p /app
WORKDIR /app

RUN apk add -U git && npm install -g bower

ADD package.json bower.json /app/

RUN npm install && bower install --allow-root

ADD . /app/

CMD ["node", "app.js"]