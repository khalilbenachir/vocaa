import { useCallback, useEffect, useRef, useState } from "react";

import type { AudioPlayer } from "expo-audio";
import { AudioModule, setAudioModeAsync } from "expo-audio";

export interface PlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  currentPosition: number; // milliseconds
  duration: number; // milliseconds
  playbackSpeed: number;
}

const SPEED_OPTIONS = [0.5, 1, 1.5, 2] as const;

export function useAudioPlayback(audioUri: string | null) {
  const playerRef = useRef<AudioPlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [state, setState] = useState<PlaybackState>({
    isPlaying: false,
    isLoading: false,
    currentPosition: 0,
    duration: 0,
    playbackSpeed: 1,
  });

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    intervalRef.current = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.currentTime * 1000;
        const totalDuration = playerRef.current.duration * 1000;

        setState((prev) => ({
          ...prev,
          currentPosition: currentTime,
          duration: totalDuration,
        }));

        // Check if playback ended
        if (currentTime >= totalDuration && totalDuration > 0) {
          stopPolling();
          setState((prev) => ({
            ...prev,
            isPlaying: false,
            currentPosition: 0,
          }));
          playerRef.current?.seekTo(0);
        }
      }
    }, 100);
  }, [stopPolling]);

  const cleanup = useCallback(async () => {
    stopPolling();
    if (playerRef.current) {
      try {
        playerRef.current.remove();
      } catch {
        // ignore
      }
      playerRef.current = null;
    }
    setState({
      isPlaying: false,
      isLoading: false,
      currentPosition: 0,
      duration: 0,
      playbackSpeed: 1,
    });
  }, [stopPolling]);

  const initPlayer = useCallback(async () => {
    if (!audioUri) return;

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await cleanup();

      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      // eslint-disable-next-line import/namespace
      playerRef.current = new AudioModule.AudioPlayer(
        { uri: audioUri },
        100, // updateInterval in ms
        true, // keepAudioSessionActive
      );

      // Wait for player to be ready
      await new Promise<void>((resolve) => {
        const checkReady = setInterval(() => {
          if (playerRef.current && playerRef.current.duration > 0) {
            clearInterval(checkReady);
            resolve();
          }
        }, 50);
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkReady);
          resolve();
        }, 5000);
      });

      const duration = (playerRef.current?.duration ?? 0) * 1000;

      setState((prev) => ({
        ...prev,
        isLoading: false,
        duration,
      }));
    } catch (err) {
      console.error("Failed to init audio player", err);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [audioUri, cleanup]);

  useEffect(() => {
    initPlayer();
    return () => {
      cleanup();
    };
  }, [audioUri, initPlayer, cleanup]);

  const play = useCallback(async () => {
    if (!playerRef.current) return;
    try {
      playerRef.current.play();
      startPolling();
      setState((prev) => ({ ...prev, isPlaying: true }));
    } catch (err) {
      console.error("Failed to play", err);
    }
  }, [startPolling]);

  const pause = useCallback(async () => {
    if (!playerRef.current) return;
    try {
      playerRef.current.pause();
      stopPolling();
      setState((prev) => ({ ...prev, isPlaying: false }));
    } catch (err) {
      console.error("Failed to pause", err);
    }
  }, [stopPolling]);

  const seekTo = useCallback(
    async (positionMs: number) => {
      if (!playerRef.current) return;
      try {
        const positionSeconds = positionMs / 1000;
        playerRef.current.seekTo(positionSeconds);
        setState((prev) => ({ ...prev, currentPosition: positionMs }));
      } catch (err) {
        console.error("Failed to seek", err);
      }
    },
    [],
  );

  const skipForward = useCallback(
    async (seconds: number) => {
      const newPosition = Math.min(
        state.currentPosition + seconds * 1000,
        state.duration,
      );
      await seekTo(newPosition);
    },
    [state.currentPosition, state.duration, seekTo],
  );

  const skipBackward = useCallback(
    async (seconds: number) => {
      const newPosition = Math.max(state.currentPosition - seconds * 1000, 0);
      await seekTo(newPosition);
    },
    [state.currentPosition, seekTo],
  );

  const setPlaybackSpeed = useCallback(async (speed: number) => {
    if (!playerRef.current) return;
    try {
      playerRef.current.setPlaybackRate(speed);
      setState((prev) => ({ ...prev, playbackSpeed: speed }));
    } catch (err) {
      console.error("Failed to set playback speed", err);
    }
  }, []);

  const cyclePlaybackSpeed = useCallback(async () => {
    const currentIndex = SPEED_OPTIONS.indexOf(
      state.playbackSpeed as (typeof SPEED_OPTIONS)[number],
    );
    const nextIndex = (currentIndex + 1) % SPEED_OPTIONS.length;
    await setPlaybackSpeed(SPEED_OPTIONS[nextIndex]);
  }, [state.playbackSpeed, setPlaybackSpeed]);

  return {
    ...state,
    play,
    pause,
    seekTo,
    skipForward,
    skipBackward,
    setPlaybackSpeed,
    cyclePlaybackSpeed,
    cleanup,
  };
}
