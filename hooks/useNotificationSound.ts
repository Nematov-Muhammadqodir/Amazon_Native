import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { useCallback, useEffect, useRef } from "react";

// Pre-load the sound for instant playback
let cachedSound: Audio.Sound | null = null;

export function useNotificationSound() {
  const isReady = useRef(false);

  useEffect(() => {
    // Configure audio to play even in silent mode (like KakaoTalk)
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    // Pre-load notification beep
    const loadSound = async () => {
      try {
        if (!cachedSound) {
          const { sound } = await Audio.Sound.createAsync(
            require("@/assets/sounds/notification.wav")
          );
          cachedSound = sound;
        }
        isReady.current = true;
      } catch (err) {
        console.log("Failed to load notification sound:", err);
      }
    };

    loadSound();
  }, []);

  const playNotification = useCallback(async () => {
    try {
      // 1. Vibration: two short bursts
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }, 150);

      // 2. Play beep sound
      if (cachedSound) {
        await cachedSound.setPositionAsync(0);
        await cachedSound.playAsync();
      }

      // 3. Say "시장" in Korean after the beep
      setTimeout(() => {
        Speech.speak("시장", {
          language: "ko-KR",
          pitch: 1.1,
          rate: 1.2,
        });
      }, 300);
    } catch (err) {
      console.log("Notification sound error:", err);
    }
  }, []);

  return { playNotification };
}
