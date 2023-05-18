# syntax=docker/dockerfile:1
FROM node:18-slim

# Use Dockerfile Labels w/ predefined annotation keys
LABEL org.opencontainers.image.description="Easily organize and view the IT infrastructure in your organization."
LABEL org.opencontainers.image.author="confused-Techie"
LABEL org.opencontainers.image.license="MIT"
LABEL org.opencontainers.image.source="https://github.com/confused-Techie/org-map"

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy local code to the container image.
COPY . ./

# Create a Volume that can be used by hosters
VOLUME /usr/src/app/data

# Expose the port we can listen on by default
EXPOSE 8080

# Run the start script
CMD [ "npm", "start" ]
