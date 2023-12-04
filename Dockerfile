FROM mhart/alpine-node

RUN npm install -g serve
COPY ./build /app/build
COPY ./server.js /app/server.js
COPY ./serverPackage.json /app/package.json
COPY ./src/lib/abi.js /app/src/lib/abi.js
COPY ./claimedTokens.json /app/claimedTokens.json
WORKDIR /app
RUN npm install

EXPOSE 3000

# ENTRYPOINT [ "serve", "-p", "80", "-s", "/app" ]
ENTRYPOINT ["npm","run","production"]