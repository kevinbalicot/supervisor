FROM alpine:3.15

RUN apk add --upgrade --no-cache nodejs npm vim bash git openssh

WORKDIR /home/app

COPY . /home/app

EXPOSE 9099

CMD ["npm", "start"]
