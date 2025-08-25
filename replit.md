# Overview

PulseBeat is a modern, feature-rich metronome application built with React and Express. The application provides visual, audio, and tactile metronome functionality with extensive customization options. Users can create and manage presets, track practice sessions, and enjoy both pendulum and pulse visualizations. The app features a clean, responsive design with dark/light theme support and comprehensive settings for tempo, sound types, vibration intensity, and visual customization.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for type safety and modern development
- **Vite** as the build tool and development server for fast hot reloading
- **TailwindCSS** for utility-first styling with custom design system
- **Shadcn/ui** component library for consistent UI elements
- **Wouter** for lightweight client-side routing
- **TanStack Query** for state management and data fetching

## Component Structure
- Modular component architecture with separate concerns:
  - `MetronomeController` - Main tempo controls and play/pause functionality
  - `VisualMetronome` - Animated pendulum and pulse visualizations
  - `AudioSettings` - Sound type selection and volume controls
  - `TactileSettings` - Vibration intensity configuration
  - `ProgressTracker` - Session timing and beat counting
  - `Presets` - Save/load custom metronome configurations

## State Management
- Custom `useMetronome` hook centralizes all metronome state and logic
- Local storage persistence for user settings and presets
- Real-time audio engine using Web Audio API
- Browser vibration API integration for tactile feedback

## Backend Architecture
- **Express.js** server with TypeScript
- Modular route registration system
- In-memory storage implementation with interface for future database integration
- Middleware for request logging and error handling
- Development-optimized Vite integration for SSR-like experience

## Data Layer
- **Drizzle ORM** configured for PostgreSQL with type-safe schema definitions
- Database schema includes:
  - `metronome_presets` - User-saved metronome configurations
  - `progress_sessions` - Practice session tracking and analytics
- Local storage fallback for client-side data persistence
- Type-safe data models using Zod validation schemas

## Audio System
- Custom `AudioEngine` class using Web Audio API
- Multiple sound types: click, beep, wood, cowbell, tick
- Precise timing using oscillators and gain nodes
- Volume control and audio context management
- Browser compatibility handling for audio playback

## Styling and Theming
- CSS custom properties for dynamic theming
- Comprehensive color system with primary, accent, and semantic colors
- Responsive design with mobile-first approach
- Dark/light theme toggle with system preference detection
- Smooth animations and transitions for metronome visualizations

# External Dependencies

## Core Framework Dependencies
- **React 18** - Frontend framework with modern hooks and concurrent features
- **Express.js** - Backend web framework for API routes
- **TypeScript** - Type safety across frontend and backend
- **Vite** - Build tool and development server

## UI and Styling
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Headless component primitives for accessibility
- **Lucide React** - Icon library with consistent design
- **Class Variance Authority** - Component variant management

## Database and Storage
- **Drizzle ORM** - Type-safe database ORM
- **Neon Database** - Serverless PostgreSQL database
- **Browser LocalStorage** - Client-side data persistence

## State Management and Data Fetching
- **TanStack Query** - Server state management and caching
- **React Hook Form** - Form state management
- **Zod** - Runtime type validation

## Audio and Interaction
- **Web Audio API** - Browser audio synthesis
- **Vibration API** - Tactile feedback on mobile devices
- **Date-fns** - Date manipulation and formatting

## Development Tools
- **ESBuild** - Fast JavaScript bundler for production
- **PostCSS** - CSS processing with Autoprefixer
- **Replit Integration** - Development environment optimization