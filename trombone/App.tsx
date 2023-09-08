/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import 'react-native-gesture-handler';
import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  StyleSheet,
} from 'react-native';

import LoginPage from './App/Login';
import { store } from './App/Reducer';
import Home1 from './App/Home/Home1';
import Home2 from './App/Home/Home2';
import Home3 from './App/Home/Home3';
import Home4 from './App/Home/Home4';
import { Header as NavHeader } from './Components/Header';
import { MyTabBar as NavFooter } from './Components/Footer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserInfoScreen from './App/UserPage';
import { EmployeeFull } from './Api';
import Toast from 'react-native-toast-message';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Home(): JSX.Element {
  const Tab = createMaterialTopTabNavigator();
  return (
    <>
      <NavHeader />
      <Tab.Navigator initialRouteName="Home2" tabBarPosition='bottom' tabBar={props => <NavFooter {...props} />}>
        <Tab.Screen name="Home1" component={Home1} />
        <Tab.Screen name="Home2" component={Home2} />
        <Tab.Screen name="Home3" component={Home3} />
        <Tab.Screen name="Home4" component={Home4} />
      </Tab.Navigator>
    </>
  );
}

type RootStackParamList = {
  Home: undefined,
  Login: undefined
  UserInfo: {
    employee: EmployeeFull,
    img: string,
  }
}

export type UserInfoScreenParams = NativeStackScreenProps<RootStackParamList, 'UserInfo'>;

function App(): JSX.Element {

  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Group screenOptions={{ presentation: "transparentModal" }} >
              <Stack.Screen name="UserInfo" component={UserInfoScreen} options={{ headerShown: false }} />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
      <Toast />
    </>
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
