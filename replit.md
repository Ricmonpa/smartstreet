# SmartStreet AI

## Overview
A React-based navigation application that provides smart street routing with risk intelligence. Uses Google Maps API for mapping and navigation features.

## Project Architecture
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with PostCSS
- **Routing**: React Router DOM v6
- **Maps**: Google Maps API (@react-google-maps/api)

## Project Structure
```
SmartStreet ai/
├── public/          # Static assets (logos, images)
├── src/
│   ├── components/  # Reusable UI components
│   │   └── Map/     # Map-related components
│   ├── context/     # React context providers
│   ├── data/        # Static data files
│   ├── pages/       # Page components
│   ├── services/    # API services
│   └── utils/       # Utility functions
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Development Setup
- **Dev Server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Deployment**: Static deployment from `dist` folder

## Required Environment Variables
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API key for map functionality

## Recent Changes
- 2026-01-09: Initial Replit setup, configured Vite for port 5000 with proxy support
