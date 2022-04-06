FROM node:16.2.0-stretch as base

# ---------- Builder ----------
# Creates:
# - node_modules: production dependencies (no dev dependencies)
# - dist: A production build compiled with Babel
FROM base AS builder

WORKDIR /usr/src/build-app

ENV NODE_ENV production

# Install Node.js dependencies
COPY package*.json /usr/src/build-app/
RUN npm install
RUN npm install -g @babel/core @babel/cli
COPY src /usr/src/build-app/src

RUN npm run build

RUN npm prune --production # Remove dev dependencies

# ---------- Release ----------
FROM base AS release

# Install envsubst
RUN apt-get update && apt-get install -y gettext

WORKDIR /usr/src/app

COPY --from=builder /usr/src/build-app/node_modules /usr/src/app/node_modules
COPY --from=builder /usr/src/build-app/dist /usr/src/app/

COPY docker/custom-entrypoint /usr/local/bin/
RUN chmod u+x /usr/local/bin/custom-entrypoint
ENTRYPOINT ["custom-entrypoint"]


RUN mkdir /usr/src/app/config/
# Copy config files
COPY config/*.tmp /tmp/config/


# Install Node.js dependencies
COPY package*.json /usr/src/app/
RUN npm ci --only=production

# Copy Node.js files
COPY css /usr/src/app/css
COPY views /usr/src/app/views

# Expose port 8080 and start Node.js server
EXPOSE 8080
CMD ["node", "server.js"]
