/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import LoginPage from './App/Login';
import { store } from './App/Reducer';
import Home2 from './App/Home/Home2';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Home() {
  const Tab = createNativeStackNavigator();
  return (
    <Tab.Navigator initialRouteName="Home2">
      <Tab.Screen name="Home1" component={Home2} options={{headerShown: false, gestureEnabled: false}} />
      <Tab.Screen name="Home2" component={Home2} options={{headerShown: false, gestureEnabled: false}} />
      <Tab.Screen name="Home3" component={Home2} options={{headerShown: false, gestureEnabled: false}} />
      <Tab.Screen name="Home4" component={Home2} options={{headerShown: false, gestureEnabled: false}} />
    </Tab.Navigator>
  );
}

function App(): JSX.Element {

  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
