import React from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity} from 'react-native';

const  ScreenUI = ({ id , verses, selectedVerse, handleClick}) => {

    // console.log("id is this: 1212 ", id);


const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleClick(item.chapter, item.verse)}>
        <View key={`${item.chapter}-${item.verse}`} style={selectedVerse == item.verse ? styles.selected:styles.verseContainer}>
            <Text>{item.verse}. {item.text}</Text>
        </View>
    </TouchableOpacity>
);

  return (
    <>
      <Text style={styles.heading}>Verses of Chapter {id}</Text>
      <FlatList
        data={verses}
        extraData={selectedVerse}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.chapter}-${item.verse}`}
      />
    </>
  )
        // return (<Text>Hello</Text>);

}

const styles = StyleSheet.create({
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
})

export default ScreenUI;
