import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import quranData from '../assets/HilaliTranslation.json';
import AudioBar from './AudioBar';
import ScreenUI from './ScreenUI';
import useLocalStorage from './useLocalStorage';
import useAudioPlayer from './useAudioPlayer';

const SurahScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [sound, setSound] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedVerse, setSelectedVerse] = useState([]);
  const {downloadAndSaveAudio} = useLocalStorage();
  const {playSound} = useAudioPlayer();

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
          playSoundForChapterAndVerse(chapter, verse);
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

  const playSoundForChapterAndVerse = async (chapter, verse) => {
    setCurrentIndex(verse - 1);
    const chapterStr = chapter.toString().padStart(3, '0');
    const verseStr = verse.toString().padStart(3, '0');
    const fileName = `${chapterStr}${verseStr}.mp3`;
    const localFilePath = `${FileSystem.documentDirectory}${fileName}`;

    console.log("hello1");


    const [newSound, isPlaying] = await playSound(chapter, verse, localFilePath, fileName, sound);

    console.log("hello");

    setSound(newSound);
    setIsPlaying(isPlaying);
    updateSelectedVerse(chapter, verse);
    console.log("selected verse is: ", selectedVerse);
  };

  const handlePlayPause = async () => {
    if (!sound) {
      // Load the sound if it's not already loaded
      const { chapter, verse } = verses[currentIndex];
      await playSoundForChapterAndVerse(chapter, verse);
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
      playSoundForChapterAndVerse(chapter, verse);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const { chapter, verse } = verses[currentIndex - 1];
      playSoundForChapterAndVerse(chapter, verse);
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
    playSoundForChapterAndVerse(chapter, verse);
    updateSelectedVerse(chapter, verse);
  }

  const verses = quranData.quran.filter((verse) => verse.chapter === id);

  // const renderItem = ({ item }) => (
  //   <TouchableOpacity onPress={() => handleClick(item.chapter, item.verse)}>
  //     <View key={`${item.chapter}-${item.verse}`} style={selectedVerse == item.verse ? styles.selected:styles.verseContainer}>
  //       <Text>{item.verse}. {item.text} {selectedVerse}</Text>
  //     </View>
  //   </TouchableOpacity>
  // );

  return (
    <View style={styles.container}>
      <ScreenUI
        id = {id}
        verses={verses}
        selectedVerse={selectedVerse}
        handleClick = {handleClick}
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