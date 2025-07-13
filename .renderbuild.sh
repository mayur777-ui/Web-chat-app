#!/usr/bin/env bash

echo "🛠️ Starting custom Render build script..."

# Ensure Corepack is enabled and Yarn 4.9.2 is activated
echo "🔧 Enabling Corepack and preparing Yarn 4.9.2..."
corepack enable || { echo "Failed to enable Corepack"; exit 1; }
corepack prepare yarn@4.9.2 --activate || { echo "Failed to activate Yarn 4.9.2"; exit 1; }

# Verify Yarn version
echo "🔍 Verifying Yarn version..."
yarn --version || { echo "Yarn version check failed"; exit 1; }

# Install all workspace dependencies
echo "📦 Installing dependencies using Yarn 4..."
yarn install --immutable || { echo "Yarn install failed"; exit 1; }

# Build shared workspace (if needed)
echo "🔨 Building shared-huffman (optional)..."
yarn workspace shared-huffman build || echo "shared-huffman has no build step"

# Build backend
echo "🔨 Building Backend..."
yarn workspace Backend build || { echo "Backend build failed"; exit 1; }

# # Build frontend
# echo "🎨 Building Frontend..."
# yarn workspace Frontend build || { echo "Frontend build failed"; exit 1; }

echo "✅ Render custom build script completed."