#!/usr/bin/env bash

echo "🛠️ Starting custom Render build script..."

# Enable Corepack and activate the correct Yarn version
echo "🔧 Enabling Corepack and preparing Yarn 4.9.2..."
corepack enable
corepack prepare yarn@4.9.2 --activate

# Install all workspace dependencies
echo "📦 Installing dependencies using Yarn 4..."
yarn install --immutable

# Build shared workspace (optional step)
echo "🔨 Building shared-huffman (optional)..."
yarn workspace shared-huffman build || echo "shared-huffman has no build step"

# Build backend (if needed)
echo "🔨 Building Backend..."
yarn workspace Backend build

# ✅ NEW: Build frontend
echo "🎨 Building Frontend..."
yarn workspace Frontend build

echo "✅ Render custom build script completed."
