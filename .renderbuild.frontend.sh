#!/usr/bin/env bash

echo "🔧 Starting custom build for frontend..."

corepack enable
corepack prepare yarn@4.9.2 --activate

yarn install --immutable
yarn workspace Frontend run build

echo "✅ Frontend build completed."
