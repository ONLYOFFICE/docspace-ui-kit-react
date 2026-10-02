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
RUN npm install -g pnpm@12.4.1

WORKDIR /app

RUN pnpm config set store-dir /root/.local/share/pnpm/store

# Manifests first, for layer caching. The ai-chat tarball has to come with
# them: package.json depends on it as `file:onlyoffice-ai-chat-*.tgz`, so the
# install fails without it.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY onlyoffice-ai-chat-*.tgz ./

ENV NODE_OPTIONS="--max-old-space-size=8192"

# CI=true is scoped to this one command on purpose. It skips the
# `lefthook install` in the prepare script, which cannot work because the
# image has no .git. A persistent `ENV CI=true` would be wrong here: it flips
# Playwright's runtime defaults (retries, workers, forbidOnly), which the
# container is meant to take from the invocation, not from the image.
RUN CI=true pnpm install --frozen-lockfile

# Install Playwright browsers
RUN npm uninstall -g playwright playwright-core @playwright/test
RUN CI=true pnpm exec playwright install chromium --with-deps

# Copy source code. Everything Storybook needs is committed -- locales/en,
# assets/icons, css/fonts.css and fonts/ -- so the image builds with no
# DocSpace checkout anywhere near it. `pnpm sync-locales` is a manual refresh
# against a client checkout and is deliberately not run here.
COPY . .

# Storybook is started by playwright.config.ts' webServer on port 6007, so the
# image deliberately ships no storybook-static build.
