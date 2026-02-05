# Vocaa

A voice notes app with AI-powered transcription and smart categorization.

## Features

- **Voice Recording** - Record audio notes with real-time waveform visualization
- **AI Transcription** - Automatic speech-to-text using OpenAI Whisper
- **Smart Titles** - Auto-generated titles based on transcript content
- **Category Detection** - Automatically categorizes notes (meetings, ideas, work, etc.)
- **Search & Filter** - Find notes by text search or filter by category
- **Audio Playback** - Listen back to your recordings with playback controls
- **Offline Storage** - Notes and audio files persist locally on device

## Tech Stack

- [Expo](https://expo.dev) (SDK 54)
- [React Native](https://reactnative.dev) 0.81
- [Expo Router](https://docs.expo.dev/router/introduction/) for file-based navigation
- [Zustand](https://zustand-demo.pmnd.rs/) for state management
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) for animations
- [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text) for transcription

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up your OpenAI API key (required for transcription)

3. Start the app

   ```bash
   npx expo start
   ```

## Running on Device

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: Scan the QR code with Expo Go

## Project Structure

```
app/                    # Expo Router pages
  _components/          # Page-specific components
  note/[id].tsx         # Note detail view
  index.tsx             # Home screen
features/
  notes/                # Notes feature module
  recording/            # Recording feature module
  playback/             # Audio playback module
components/             # Shared UI components
lib/                    # Services and utilities
```
