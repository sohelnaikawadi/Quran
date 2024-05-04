import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, AsyncStorage } from 'react-native';

const SettingsScreen = () => {
  const [translationEnabled, setTranslationEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    // Load settings from AsyncStorage when the component mounts
    loadSettings();
  }, []);

  useEffect(() => {
    // Save settings to AsyncStorage whenever they change
    saveSettings();
  }, [translationEnabled, audioEnabled]);

  const loadSettings = async () => {
    try {
      const translationSetting = await AsyncStorage.getItem('translationEnabled');
      const audioSetting = await AsyncStorage.getItem('audioEnabled');
      setTranslationEnabled(translationSetting === 'true');
      setAudioEnabled(audioSetting === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('translationEnabled', translationEnabled.toString());
      await AsyncStorage.setItem('audioEnabled', audioEnabled.toString());
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.setting}>
        <Text>Translation</Text>
        <Switch
          value={translationEnabled}
          onValueChange={(value) => setTranslationEnabled(value)}
        />
      </View>
      <View style={styles.setting}>
        <Text>Audio</Text>
        <Switch
          value={audioEnabled}
          onValueChange={(value) => setAudioEnabled(value)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default SettingsScreen;
