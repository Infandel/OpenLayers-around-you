# Openlayers around you

A modern, interactive map application built with React, Vite, OpenLayers, and TailwindCSS, following Feature-Sliced Design architecture.

## Features

- 🗺️ Interactive map powered by OpenLayers with OpenStreetMap tiles
- 📍 Add and remove markers dynamically
- 💬 Popup information on marker click
- 📋 Sidebar with marker list and zoom-to-marker functionality
- 🎨 Modern, responsive UI with TailwindCSS
- 🔄 State management with Redux Toolkit
- 🌐 Mock API integration with RTK Query
- 📦 Feature-Sliced Design architecture

## Technologies

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **OpenLayers 9** - Interactive maps
- **TailwindCSS 4** - Utility-first CSS
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching
- **React Router** - Routing
- **Lucide React** - Icons

# Getting Started

## Prerequisitions

- node `18.0+` version
- `npm` for installing deps

## Install dependencies

`npm install`

# Development

## Start development server

`npm run dev`

Open your browser and navigate to `http://localhost:5173`

## Build for production

`npm run build`

## Preview production build

`npm run preview`

## Architecture

This project follows **Feature-Sliced Design (FSD)** principles:

- **app/** - Application initialization and global configuration
- **pages/** - Full-page components and routing
- **widgets/** - Large, self-contained UI blocks
- **features/** - User interactions and business logic
- **entities/** - Business entities
- **shared/** - Reusable utilities and API clients
