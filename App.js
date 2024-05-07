import Main from './components/Main';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SurahScreen from './components/SurahScreen';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './components/reducers';
import storageMiddleware from './components/middleware/storageMiddleware';
import { useEffect } from 'react';
import { initializeApp } from './components/actions';
import thunk from 'redux-thunk';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your </Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

const Stack = createStackNavigator();

// const store = createStore(rootReducer, applyMiddleware(thunk, storageMiddleware));

const store = createStore(rootReducer);


// useEffect(() => {
//     const initializeApp = async () => {
//       // Dispatch an action to initialize the app with the loaded settings
//       store.dispatch(initializeApp());
//     };
//     initializeApp();
// }, []);



const App = () => {
  return (
    // <Provider store = {store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
          <Stack.Screen name="SurahScreen" component={SurahScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  // </Provider>
  );
};

export default App;