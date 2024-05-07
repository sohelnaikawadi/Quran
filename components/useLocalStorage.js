import AsyncStorage from 'react-native';
import * as FileSystem from 'expo-file-system';

const useLocalStorage = () => {
  // Function to download and save audio file
  const downloadAndSaveAudio = (url, fileName) => {
    try {
      const downloadResumable = FileSystem.createDownloadResumable(url, FileSystem.documentDirectory + fileName);
      const { uri } = downloadResumable.downloadAsync();
      console.log("Printing uri after success: ", uri)
      return [uri]; // Return the local file URI
    } catch (error) {
      console.error('Error downloading audio:', error);
      return null;
    }
  };

  // Function to save JSON data in local storage
  const saveJSONData = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving JSON data:', error);
    }
  };

  // Function to retrieve JSON data from local storage
  const getJSONData = async (key) => {
    try {
      const jsonData = await AsyncStorage.getItem(key);
      return jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
      console.error('Error retrieving JSON data:', error);
      return null;
    }
  };

  return {
    downloadAndSaveAudio,
    saveJSONData,
    getJSONData,
  };
};

export default useLocalStorage;
