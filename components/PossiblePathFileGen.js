import * as FileSystem from 'expo-file-system';
import quranData from '../assets/HilaliTranslation.json';

const generatePossiblePathsFile = async () => {
  const PossiblePathsFileGen = {};

  quranData.quran.forEach(({ chapter, verse }) => {
    const chapterStr = chapter.toString().padStart(3, '0');
    const verseStr = verse.toString().padStart(3, '0');
    const key = `${chapterStr}${verseStr}`;
    PossiblePathsFileGen[key] = `../assets/${chapterStr}/${chapterStr}${verseStr}.mp3`;
  });

  const path = FileSystem.documentDirectory + 'PossiblePaths.json';

  // Convert PossiblePaths to a JSON string
  const jsonContent = JSON.stringify(PossiblePathsFileGen, null, 2);

  try {
    // Write the JSON string to a file
    await FileSystem.writeAsStringAsync(path, jsonContent);
    console.log('File created successfully.');
  } catch (error) {
    console.error('Error writing file:', error);
  }

  return PossiblePathsFileGen;
};

export default generatePossiblePathsFile;
