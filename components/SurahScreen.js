import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import quranData from '../assets/HilaliTranslation.json';
import AudioBar from './AudioBar';

const SurahScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [sound, setSound] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedVerse, setSelectedVerse] = useState([]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (sound && isMounted) {
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isPlaying) {
          setProgress(status.positionMillis / status.durationMillis);
        }
        if (status.didJustFinish && currentIndex + 1 < verses.length) {
          setCurrentIndex(prevIndex => prevIndex + 1);
          const { chapter, verse } = verses[currentIndex + 1];
          playSound(chapter, verse);
        }
      });
    }
  }, [sound, currentIndex, isMounted]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (sound) {
        sound.unloadAsync();
      }
    });
    return unsubscribe;
  }, [navigation, sound]);

  const playSound = async (chapter, verse) => {
    setCurrentIndex(verse - 1);
    const chapterStr = chapter.toString().padStart(3, '0');
    const verseStr = verse.toString().padStart(3, '0');
    const fileName = `${chapterStr}${verseStr}.mp3`;
    const localFilePath = `${FileSystem.documentDirectory}${fileName}`;

    // Check if the audio file exists locally
    const localFileExists = await FileSystem.getInfoAsync(localFilePath);
    if (localFileExists.exists) {
      console.log('Using local audio file:', fileName);
      try {
        if (sound) {
          await sound.unloadAsync();
        }
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: localFilePath },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
        console.log('Playing Sound');
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      // Download the audio file
      const audioUrl = `https://verses.quran.com/AbdulBaset/Mujawwad/mp3/${fileName}`;
      console.log('Downloading Sound', fileName);
      try {
        const downloadResumable = FileSystem.createDownloadResumable(
          audioUrl,
          localFilePath
        );
        const { uri } = await downloadResumable.downloadAsync();
        console.log('Downloaded Sound', fileName);
        if (sound) {
          await sound.unloadAsync();
        }
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
        console.log('Playing Sound');
      } catch (error) {
        console.error('Error:', error);
      }
    }
    updateSelectedVerse(chapter, verse);
  };

  const handlePlayPause = async () => {
    if (!sound) {
      // Load the sound if it's not already loaded
      const { chapter, verse } = verses[currentIndex];
      await playSound(chapter, verse);
    }
    else if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < verses.length) {
      const { chapter, verse } = verses[currentIndex + 1];
      playSound(chapter, verse);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const { chapter, verse } = verses[currentIndex - 1];
      playSound(chapter, verse);
    }
  };

  const onSeek = async (value) => {
    if (sound) {
      try {
        const newPositionMillis = value * (await sound.getStatusAsync()).durationMillis;
        await sound.setPositionAsync(newPositionMillis);
        setProgress(value);
      } catch (error) {
        console.error('Error seeking:', error);
      }
    }
  };

  const updateSelectedVerse = async (chapter, verse) => {
    if (selectedVerse.includes(verse)) {
      setSelectedVerse(prevIds => prevIds.filter(itemId => itemId !== verse));
    } else {
      setSelectedVerse(prevIds => [verse]);
    }
  }

  const handleClick = async(chapter, verse) => {
    playSound(chapter, verse);
    updateSelectedVerse(chapter, verse);
  }

  const verses = quranData.quran.filter((verse) => verse.chapter === id);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleClick(item.chapter, item.verse)}>
      <View key={`${item.chapter}-${item.verse}`} style={selectedVerse == item.verse ? styles.selected:styles.verseContainer}>
        <Text>{item.verse}. {item.text} {selectedVerse}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verses of Chapter {id}</Text>
      <FlatList
        data={verses}
        extraData={selectedVerse}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.chapter}-${item.verse}`}
      />
      <AudioBar
        isPlaying={isPlaying}
        progress={progress}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
        onSeek={onSeek}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  verseContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  selected: {
    backgroundColor: 'rgba(120, 120, 120, 0.5)',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
  }
});

export default SurahScreen;
