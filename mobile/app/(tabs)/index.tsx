import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';

const ROUND_DURATION = 18; // seconds
const HALF_TIME = 9; // seconds
const FINAL_COUNTDOWN_START = 5; // seconds before end

export default function HomeScreen() {
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const soundRef = useRef<Audio.Sound | null>(null);

  // Initialize audio context
  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });
      } catch (error) {
        console.log('Audio mode error:', error);
      }
    })();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Generate and play beep
  const playBeep = async (frequency: number = 800, duration: number = 100) => {
    try {
      // Create a simple beep using a data URI (web audio format converted to base64)
      // For simplicity, we'll use the native sound system
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Generate a simple sine wave and play it
      // This is a simplified approach - for production, pre-record the beep sounds
      const oscillator = new AudioContext();
      const osc = oscillator.createOscillator();
      const gain = oscillator.createGain();

      osc.connect(gain);
      gain.connect(oscillator.destination);

      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.3, oscillator.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        oscillator.currentTime + duration / 1000
      );

      osc.start(oscillator.currentTime);
      osc.stop(oscillator.currentTime + duration / 1000);
    } catch (error) {
      // Fallback: use native audio
      console.log('Beep error:', error);
    }
  };

  // Timer loop
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(async () => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;

        // Half time beep (9 seconds)
        if (newTime === HALF_TIME) {
          playBeep(800, 150);
        }

        // Final countdown (5, 4, 3, 2, 1 seconds)
        if (newTime > 0 && newTime <= FINAL_COUNTDOWN_START) {
          playBeep(600, 100);
        }

        // End of round - 3 short beeps
        if (newTime === 0) {
          playBeep(1000, 80);
          setTimeout(() => playBeep(1000, 80), 150);
          setTimeout(() => playBeep(1000, 80), 300);

          // Restart the loop
          return ROUND_DURATION;
        }

        return newTime;
      });

      setTotalElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleRestart = () => {
    setTimeLeft(ROUND_DURATION);
    setTotalElapsed(0);
    setIsRunning(true);
  };

  const minutes = Math.floor(totalElapsed / 60);
  const seconds = totalElapsed % 60;
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CCAT Timer</Text>
          <Text style={styles.totalTime}>
            {minutes}:{String(seconds).padStart(2, '0')}
          </Text>
        </View>

        {/* Timer Display */}
        <View style={styles.timerDisplay}>
          <Text style={styles.time}>{String(timeLeft).padStart(2, '0')}</Text>
          <Text style={styles.unit}>sec</Text>
        </View>

        {/* Large RE Button */}
        <TouchableOpacity
          style={[styles.restartButton, isRunning && styles.restartButtonRunning]}
          onPress={handleRestart}
        >
          <Text style={styles.restartButtonText}>RE</Text>
        </TouchableOpacity>

        {/* Control Buttons */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.startButton, isRunning && styles.disabled]}
            onPress={handleStart}
            disabled={isRunning}
          >
            <Text
              style={[styles.controlButtonText, styles.startButtonText, isRunning && styles.disabledText]}
            >
              START
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.stopButton, !isRunning && styles.disabled]}
            onPress={handleStop}
            disabled={!isRunning}
          >
            <Text
              style={[styles.controlButtonText, styles.stopButtonText, !isRunning && styles.disabledText]}
            >
              STOP
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status */}
        <Text style={styles.status}>{isRunning ? '⏱️ Running' : '⏸️ Stopped'}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  totalTime: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontWeight: 'bold',
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginVertical: 30,
  },
  time: {
    fontSize: 100,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    minWidth: 130,
    textAlign: 'right',
  },
  unit: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 10,
    marginBottom: 15,
  },
  restartButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  restartButtonRunning: {
    opacity: 0.85,
  },
  restartButtonText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#667eea',
  },
  controls: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
    marginTop: 20,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: 'white',
  },
  startButton: {
    borderColor: '#4CAF50',
  },
  stopButton: {
    borderColor: '#f44336',
  },
  controlButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  startButtonText: {
    color: '#4CAF50',
  },
  stopButtonText: {
    color: '#f44336',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
  },
  status: {
    fontSize: 14,
    color: 'white',
    marginTop: 15,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
});
