import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Slider from "@react-native-community/slider";
import React, { memo, useCallback } from "react";
import {
  ActivityIndicator,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import i18n from "@/i18n";
import { formatTime } from "@/lib/date";
import { colors } from "@/theme/colors";

import { useAudioPlayback } from "../hooks/use-audio-playback";

interface AudioPlayerProps {
  audioUri: string | null;
  duration: number; // seconds (from note)
}

function AudioPlayer({ audioUri, duration: noteDuration }: AudioPlayerProps) {
  const {
    isPlaying,
    isLoading,
    currentPosition,
    duration,
    playbackSpeed,
    play,
    pause,
    seekTo,
    skipForward,
    skipBackward,
    cyclePlaybackSpeed,
  } = useAudioPlayback(audioUri);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const handleSkipBack = useCallback(() => {
    skipBackward(10);
  }, [skipBackward]);

  const handleSkipForward = useCallback(() => {
    skipForward(10);
  }, [skipForward]);

  const handleSliderChange = useCallback(
    (value: number) => {
      seekTo(value);
    },
    [seekTo],
  );

  const handleShare = useCallback(async () => {
    if (!audioUri) return;
    try {
      await Share.share({
        url: audioUri,
        message: i18n.t("audioPlayer.shareMessage"),
      });
    } catch (err) {
      console.error("Failed to share", err);
    }
  }, [audioUri]);

  // Use note duration as fallback if player duration not yet loaded
  const displayDuration = duration > 0 ? duration : noteDuration * 1000;
  const currentSeconds = currentPosition / 1000;
  const totalSeconds = displayDuration / 1000;

  if (!audioUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.noAudioText}>{i18n.t("audioPlayer.noAudio")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress slider */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(currentSeconds)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={displayDuration}
          value={currentPosition}
          onSlidingComplete={handleSliderChange}
          minimumTrackTintColor={colors.cyan}
          maximumTrackTintColor={colors.secondary}
          thumbTintColor={colors.cyan}
        />
        <Text style={styles.timeText}>{formatTime(totalSeconds)}</Text>
      </View>

      {/* Controls row */}
      <View style={styles.controlsRow}>
        {/* Share button */}
        <TouchableOpacity onPress={handleShare} style={styles.sideButton}>
          <Feather name="share" size={22} color={colors.primary} />
        </TouchableOpacity>

        {/* Skip back */}
        <TouchableOpacity onPress={handleSkipBack} style={styles.skipButton}>
          <MaterialCommunityIcons
            name="rewind-10"
            size={28}
            color={colors.primary}
          />
        </TouchableOpacity>

        {/* Play/Pause */}
        <TouchableOpacity
          onPress={handlePlayPause}
          style={styles.playButton}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Feather
              name={isPlaying ? "pause" : "play"}
              size={28}
              color={colors.primary}
            />
          )}
        </TouchableOpacity>

        {/* Skip forward */}
        <TouchableOpacity onPress={handleSkipForward} style={styles.skipButton}>
          <MaterialCommunityIcons
            name="fast-forward-10"
            size={28}
            color={colors.primary}
          />
        </TouchableOpacity>

        {/* Speed toggle */}
        <TouchableOpacity
          onPress={cyclePlaybackSpeed}
          style={styles.sideButton}
        >
          <Text style={styles.speedText}>{playbackSpeed}x</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(AudioPlayer);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  noAudioText: {
    textAlign: "center",
    color: colors.primaryLight,
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
  },
  timeText: {
    fontSize: 14,
    color: colors.primaryLight,
    minWidth: 45,
    textAlign: "center",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  sideButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  skipButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  speedText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
});
