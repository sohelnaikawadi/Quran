const loadSettings = async () => {
    try {
        // Load settings from storage (e.g., AsyncStorage)
        const settings = await AsyncStorage.getItem('settings');
        if (settings !== null) {
            return JSON.parse(settings);
        }
        return {};
    } catch (error) {
        console.error('Error loading settings:', error);
        return {};
    }
};

export default loadSettings;