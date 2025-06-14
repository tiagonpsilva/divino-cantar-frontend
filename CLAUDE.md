# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DivinoCantar is a web application for managing musical repertoire for Catholic celebrations. The project uses React with TypeScript, Vite, TailwindCSS, and includes an intelligent AI assistant for musical guidance.

## Initial Setup Commands

Since this is a new project, you'll need to initialize it first:

```bash
# Initialize React project with Vite (recommended for better performance)
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react
npm install @radix-ui/themes class-variance-authority clsx tailwind-merge

# Initialize TailwindCSS
npx tailwindcss init -p

# Install Shadcn/UI CLI
npx shadcn-ui@latest init

# Initialize Git with Git-flow
git init
git flow init

# Configure Conventional Commits
npm install -D @commitlint/config-conventional @commitlint/cli
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

## Git Flow & Development Workflow

This project follows **Git-flow** methodology with **Conventional Commits**.

### Branch Structure
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature development branches
- `release/*` - Release preparation branches
- `hotfix/*` - Critical fixes for production

### Git Flow Commands
```bash
# Initialize git flow (first time only)
git flow init

# Start a new feature
git flow feature start feature-name

# Finish a feature
git flow feature finish feature-name

# Start a release
git flow release start 1.0.0

# Finish a release
git flow release finish 1.0.0

# Start a hotfix
git flow hotfix start hotfix-name

# Finish a hotfix
git flow hotfix finish hotfix-name
```

### Conventional Commits Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples:**
- `feat(assistant): add intelligent chat assistant`
- `fix(theme): resolve dark mode toggle bug in settings`
- `docs(readme): update installation instructions`
- `refactor(components): migrate to composition API`

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter (after ESLint is configured)
npm run lint

# Run tests (after test setup)
npm test
```

## Project Architecture

### Implemented Features ✅
1. **🎵 Musical Repertoire Management**: Complete CRUD operations for songs with all mass moments
2. **🎼 Real-time Chord Transposition**: Automatic chord transposition with visual feedback
3. **⭐ Favorites System**: Like/unlike songs with localStorage persistence
4. **📄 PDF Export**: Export repertoires and specific moments to formatted PDFs
5. **🔗 Advanced Sharing**: WhatsApp, email, clipboard, and file download options
6. **🎭 Song Details Modal**: Full lyrics and chords viewer with transposition controls
7. **⚡ Interactive Mass Planning**: Drag-and-drop song selection for each mass moment
8. **🔔 Toast Notifications**: User feedback system for all actions
9. **⚙️ Functional Settings**: Theme, notifications, audio, and behavior controls
10. **🤖 AI Musical Assistant**: ChatGPT-style intelligent assistant for repertoire guidance
11. **🎨 Complete Dark Mode**: Full light/dark theme support with auto-detection
12. **📱 Responsive Design**: Mobile-first approach with modern UI/UX

### Future Features to Implement
1. **Authentication**: Google OAuth integration
2. **Music Playback**: Real audio player integration
3. **Cloud Sync**: Firebase/Supabase integration for data persistence
4. **Import/Export**: CifraClub, YouTube import capabilities
5. **Collaborative Planning**: Real-time collaboration on mass planning
6. **Advanced Search**: Full-text search with filters and AI-powered suggestions

### Current Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── Card.tsx        # Base card component
│   ├── FavoriteButton.tsx
│   ├── Layout.tsx      # Main layout with navigation
│   ├── ShareModal.tsx  # Sharing functionality
│   ├── SongDetailModal.tsx
│   ├── SongModal.tsx   # Add/edit song form
│   └── Toast.tsx       # Notification system
├── contexts/           # React contexts
│   └── ToastContext.tsx
├── features/           # Feature-specific components
│   ├── assistant/      # AI Musical Assistant
│   ├── auth/          # Authentication (placeholder)
│   ├── chords/        # Chord viewer with transposition
│   ├── home/          # Dashboard/home page
│   ├── library/       # User's music library
│   ├── liturgy/       # Daily liturgy viewer
│   ├── planning/      # Interactive mass planning
│   ├── repertoire/    # Repertoire management
│   ├── search/        # Music search functionality
│   └── settings/      # User preferences
├── hooks/             # Custom React hooks
│   ├── useFavorites.ts
│   ├── useSettings.ts
│   ├── useTheme.ts
│   └── useToast.ts
├── lib/               # Utilities and helpers
│   └── utils.ts       # TailwindCSS utilities
├── types/             # TypeScript type definitions
│   └── index.ts       # Core types (Song, User, etc.)
├── utils/             # Utility functions
│   ├── assistantAI.ts # AI assistant logic
│   ├── chordTransposer.ts # Musical transposition
│   └── pdfExporter.ts # PDF generation
├── data/              # Mock data and constants
│   └── mock.ts        # Sample songs and liturgy
└── App.tsx            # Main application component
```

### Mass Moments to Support
- Entrada (Entrance)
- Perdão (Penitential Act)
- Glória (Glory)
- Salmo (Psalm)
- Aclamação (Acclamation)
- Ofertório (Offertory)
- Santo (Holy)
- Cordeiro (Lamb of God)
- Comunhão (Communion)
- Ação de Graças (Thanksgiving)
- Final (Recessional)
- Special moments: Quaresma (Lent), Natal (Christmas), etc.

## UI/UX Guidelines
- Use conversational interfaces for data entry and searches
- Implement both light and dark modes
- Ensure responsive design for desktop and mobile
- Keep the interface clean and minimalist
- Use Shadcn/UI components for consistency
- Lucide icons for visual elements

## Mock Data Structure
When implementing, create mock data for:
- Users (with Google profile info)
- Repertoire (songs with metadata)
- Músicas (individual songs)
- Cifras (chord charts with transposition)
- Playlists (collections for specific dates)
- Compartilhamentos (sharing history)