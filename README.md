# Clario - AI Interview Coach

![preview](https://github.com/Cdlmt/clario-ai/blob/main/assets/preview.png?raw=true 'Apple Store Preview')

An AI-powered mobile application that helps users practice and improve their interview skills through voice recording, transcription, and intelligent feedback analysis.

## Overview

Clario records voice answers to interview questions, sends the audio to a backend server for transcription and AI-powered analysis, then displays structured feedback to help users improve their responses.

### Key Features

- **Voice Recording**: Record answers to interview questions directly in the app
- **AI Transcription**: Automatic speech-to-text using OpenAI Whisper
- **Intelligent Feedback**: Get detailed analysis on:
  - Clarity
  - Response length
  - Weak words detection
  - Conciseness
  - Confidence level
- **Industry-specific Questions**: Questions tailored to different job industries
- **Multi-language Support**: Internationalized interface with i18next
- **Session History**: Track progress over time with saved sessions

## Architecture

This is a monorepo managed with pnpm workspaces:

```
clario-ai-interview-coach/
├── app/                    # Expo React Native mobile app
│   ├── app/                # Expo Router routes
│   └── src/
│       ├── features/       # Feature modules
│       └── shared/         # Shared components & utilities
├── server/                 # Express TypeScript API
│   ├── prisma/             # Database schema
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Auth, usage limits, etc.
│   │   └── schemas/        # Zod validation schemas
│   └── package.json
└── package.json            # Root workspace config
```

## Tech Stack

### Mobile App (`app/`)

- **Framework**: Expo SDK 53 with React Native 0.79
- **Navigation**: Expo Router
- **Authentication**: Supabase Auth + Apple Authentication
- **Audio**: expo-audio, expo-av
- **Payments**: expo-superwall
- **Internationalization**: i18next, react-i18next
- **Language**: TypeScript

### Backend (`server/`)

- **Runtime**: Node.js 20
- **Framework**: Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase
- **AI/ML**: OpenAI API (Whisper for transcription, GPT for analysis)
- **Audio Processing**: ffmpeg, fluent-ffmpeg
- **Validation**: Zod
- **Language**: TypeScript

## Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL database (or Supabase project)
- OpenAI API key
- Expo CLI (for mobile development)
- ffmpeg (for audio processing)

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/Cdlmt/clario-ai
cd clario-ai
pnpm install
```

### 2. Configure Environment

**Server** (`server/.env`):

```env
PORT=3000
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://user:password@host:5432/database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

**App** (`app/.env`):

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database

```bash
cd server
pnpm prisma generate
pnpm prisma db push
```

### 4. Run Development

```bash
# Run both app and server concurrently
pnpm dev

# Or run separately:
pnpm app      # Start Expo dev server
pnpm server   # Start Express server
```

## API Endpoints

| Method | Endpoint      | Description                         |
| ------ | ------------- | ----------------------------------- |
| GET    | `/health`     | Health check                        |
| POST   | `/transcribe` | Transcribe audio file to text       |
| POST   | `/analyze`    | Analyze transcript and get feedback |
| GET    | `/questions`  | Get interview questions             |
| POST   | `/onboarding` | User onboarding                     |
| GET    | `/sessions`   | Get user's interview sessions       |
| GET    | `/statistics` | Get user statistics                 |
| GET    | `/membership` | Get membership status               |
| GET    | `/account`    | Get account information             |

## Database Schema

The main entities include:

- **User**: User profile with job industry preference
- **Question**: Interview questions with categories and translations
- **InterviewSession**: Recorded practice sessions
- **Feedback**: AI-generated feedback with detailed metrics
- **UserMembership**: Subscription/plan information
- **DailyUsage**: Usage tracking for rate limiting

## Deployment

### Server (Docker)

```bash
docker build -t clario-server .
docker run -p 3000:3000 --env-file server/.env clario-server
```

### Mobile App

```bash
cd app
pnpm build  # Build with EAS for iOS
```

## Scripts

| Command             | Description                      |
| ------------------- | -------------------------------- |
| `pnpm dev`          | Run app and server concurrently  |
| `pnpm app`          | Start Expo development server    |
| `pnpm server`       | Start Express server in dev mode |
| `pnpm build:server` | Build server for production      |
| `pnpm start:server` | Start production server          |
| `pnpm build:app`    | Build mobile app with EAS        |

## Project Structure Guidelines

- **Routes in `app/`**: Only import and render pages from `features/`
- **Business logic**: Lives in `features/` organized by domain
- **Shared code**: Reusable components in `shared/`
- **Services**: Handle external interactions (HTTP, storage, etc.)

## License

Private project.
