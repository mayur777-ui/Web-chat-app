#!/usr/bin/env bash

echo "🔧 Starting custom frontend build script..."

corepack enable
corepack prepare yarn@4.9.2 --activate

# Prevent Render from installing with the wrong Yarn version
export YARN_IGNORE_NODE=1

echo "📦 Installing dependencies using Yarn 4..."
yarn install --immutable

echo "🏗️  Building Frontend..."
yarn workspace Frontend run build

echo "✅ Frontend build completed."
