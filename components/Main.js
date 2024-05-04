import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import data from '../assets/HilaliTranslation.json';
import listOfSurah from '../assets/ListOfSurahs.json'
import SurahListComponent from './SurahListComponent';

const Main = () => {
//   const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
    const [chapterNumbers, setChapterNumbers] = useState([]);

//   const [chapterNames, setChapterNames] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

    //   console.log("fetching")
    //   const response = await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/eng-muhammadtaqiudd/1.json');

    //   const json = await response.json();

    // function onlyUnique(value, index, array) {
    //     return array.indexOf(value) === index;
    //   }

    // const getChapters = (item) => {
    //     // console.log(item.chapter);
    //     return item.chapter
    // }

    // let chapters = data.quran;
    // const arr = chapters.map(getChapters);
    // const chaptersSet = [...new Set(arr)];
    // console.log(chaptersSet);
    // setChapterNumbers(chaptersSet);
    


    // console.log(chapters);
       
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <Text>{item.title}</Text>
      <Text>{item.description}</Text>
    </View>
  );

  const renderItem1 = ({ item }) => (
    <View >
      <Text>{item.id} {item.name}</Text>
    </View>
  );



   return (
    <SafeAreaView style={{ flex: 1, marginTop: 150, marginBottom: 30 }}>
      <ScrollView contentContainerStyle={{ justifyContent: 'left', alignItems: 'left' }}>
        <FlatList
          data={listOfSurah?.listOfSurahs}
          renderItem={({ item }) => <SurahListComponent data={item} />}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
    </SafeAreaView>
  );
};


export default Main;


