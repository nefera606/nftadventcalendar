FROM mhart/alpine-node

RUN npm install -g serve
COPY ./build /app

EXPOSE 3000

ENTRYPOINT [ "serve", "-p", "80", "-s", "/app" ]