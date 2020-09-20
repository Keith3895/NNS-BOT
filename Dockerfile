FROM node:lts-alpine3.12
# Create the directory!
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot
# Copy and Install the bot dependencies
COPY package.json .
RUN npm install --production
# Copy the build(dist) folder
COPY . .
# Starting the bot
CMD ["npm","start"]
