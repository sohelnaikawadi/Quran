import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { debounce } from 'lodash';

const AudioBar = ({ isPlaying, onPlayPause, onNext, onPrev, progress, onSeek }) => {
  const [currentProgress, setCurrentProgress] = useState(progress); // State to track the current progress
  const [isSliding, setIsSliding] = useState(false); // State to track slider sliding

  useEffect(() => {
    setCurrentProgress(progress); // Update the current progress state
  }, [progress]);

  // Debounced function to handle slider value change
  const handleSliderChange = debounce((value) => {
    // if (!isSliding) {
      setCurrentProgress(value);
      onSeek(value);
    // }
  }, 100);

  // Function to handle sliding start
  const handleSlidingStart = () => {
    setIsSliding(true);
  };

  // Function to handle sliding end
  const handleSlidingComplete = (value) => {
    setIsSliding(false);
    setCurrentProgress(value);
    onSeek(value);
  };

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={currentProgress}
        minimumTrackTintColor="#1a73e8"
        maximumTrackTintColor="#b0b0b0"
        thumbTintColor="#1a73e8"
        onValueChange={handleSliderChange}
        onSlidingStart={handleSlidingStart}
        onSlidingComplete={handleSlidingComplete}
        step={0.01}
      />
      <View style={styles.controls}>
        <TouchableOpacity onPress={onPrev}>
          <Ionicons name="play-skip-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPlayPause}>
          {isPlaying ? (
            <Ionicons name="pause-circle-outline" size={36} color="black" />
          ) : (
            <Ionicons name="play-circle-outline" size={36} color="black" />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext}>
          <Ionicons name="play-skip-forward-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  slider: {
    width: '90%',
    marginBottom: 10,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '90%',
  },
});

export default AudioBar;
