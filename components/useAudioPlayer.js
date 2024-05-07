import { useState } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import useLocalStorage from './useLocalStorage';



const useAudioPlayer = () => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const {downloadAndSaveAudio} = useLocalStorage();

  const playSound = async (chapter, verse, localFilePath, fileName, sound) => {

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
        console.log('Playing Sound');
        return [newSound, true];
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      // Download the audio file
      const audioUrl = `https://verses.quran.com/AbdulBaset/Mujawwad/mp3/${fileName}`;
      console.log('Downloading Sound', fileName);
      try {
        // const [ uri ] = downloadAndSaveAudio(audioUrl, fileName, localFilePath);
        const downloadResumable = FileSystem.createDownloadResumable(
          audioUrl,
          localFilePath
        );
        const { uri } = await downloadResumable.downloadAsync();
        console.log('Downloaded Sound', uri);
        if (sound) {
          await sound.unloadAsync();
        }
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );
        console.log('Playing Sound');
        return [newSound, true];
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return {
    playSound
  };
};

export default useAudioPlayer;
