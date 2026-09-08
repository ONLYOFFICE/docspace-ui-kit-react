FROM node:24-bookworm-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# System dependencies
RUN apt-get -y update && apt-get install -y --no-install-recommends \
    fonts-noto-cjk \
    fonts-noto-core \
    fonts-noto-ui-core \
    fonts-noto-color-emoji \
    fonts-noto-mono \
    fonts-noto-extra \
    fonts-roboto \
    fonts-open-sans \
    fonts-liberation \
    fontconfig \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PNPM
RUN npm install -g pnpm@11.19.0

WORKDIR /app

RUN pnpm config set store-dir /root/.local/share/pnpm/store

# Copy package manifests for layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY common/tests/package-lock.json ./common/tests/package-lock.json
COPY common/tests/package.json ./common/tests/package.json
COPY packages/client/package.json ./packages/client/package.json
COPY packages/client/onlyoffice-docspace-plugin-sdk-*.tgz ./packages/client/
COPY packages/client/onlyoffice-docspace-sdk-js-*.tgz ./packages/client/
COPY packages/shared/package.json ./packages/shared/package.json
COPY libs/ui-kit/package.json ./libs/ui-kit/package.json
COPY libs/ui-kit/*.tgz ./libs/ui-kit/

ENV NODE_OPTIONS="--max-old-space-size=8192"

# CI=true is scoped to this one command on purpose. It skips the
# `lefthook install` in the workspace prepare scripts, which cannot work
# because the image has no .git. A persistent `ENV CI=true` would be wrong
# here twice over: it flips Playwright's runtime defaults (retries,
# workers, forbidOnly) and it makes copy-locales emit empty locale stubs
# and copy-images skip altogether, so the image would build without assets.
RUN CI=true pnpm install --frozen-lockfile

# Install Playwright browsers
RUN npm uninstall -g playwright playwright-core @playwright/test
# CI=true only silences the prepare scripts of the dependency check pnpm
# runs before exec; it does not reach Playwright's own config here.
RUN cd /app/libs/ui-kit && CI=true pnpm exec playwright install chromium --with-deps

# Copy source code
COPY common/ ./common/
COPY packages/client/ ./packages/client/
COPY packages/shared/ ./packages/shared/
COPY libs/ui-kit/ ./libs/ui-kit/
COPY public/ ./public/

# Copy locales needed by Storybook
# Deliberately no CI=true here: copy-locales writes empty locale stubs and
# copy-images exits early when CI is set, which would ship the image
# without any assets.
RUN pnpm --filter @docspace/ui-kit run copy-assets

WORKDIR /app/libs/ui-kit

# Build Storybook static for test:ci mode (not needed for local dev mode)
# RUN pnpm run storybook-build
