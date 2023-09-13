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

import LoginPage from './App/Login';
import { store } from './App/Reducer';
import Home1 from './App/Home/Home1';
import Home2 from './App/Home/TrombiWrapper';
import Home3 from './App/Home/Home3';
import Home4 from './App/Home/WidgetWrapper';
import { Header as NavHeader } from './Components/Header';
import { MyTabBar as NavFooter } from './Components/Footer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserInfoScreen from './App/UserPage';
import { EmployeeFull } from './Api';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Chat from './App/Chat/Chat';
import TrombiWrapper from './App/Home/TrombiWrapper';
import WidgetWrapper from './App/Home/WidgetWrapper';

export type ChatScreenParams = NativeStackScreenProps<RootStackParamList, "Chat">

function Home(): JSX.Element {
  const Tab = createMaterialTopTabNavigator();
  return (
    <>
      <NavHeader />
      <Tab.Navigator
        initialRouteName="Trombi"
        tabBarPosition='bottom'
        tabBar={props => <NavFooter {...props} />}
      >
        <Tab.Screen name="Trombi" component={TrombiWrapper} />
        <Tab.Screen name="Widget" component={WidgetWrapper} />
      </Tab.Navigator>
    </>
  );
}

type RootStackParamList = {
  Home: undefined,
  Login: undefined
  UserInfo: {
    me: EmployeeFull,
    employee: EmployeeFull,
    img: string,
    meImg: string
  }
  Chat: {
    partner: {
      id: number,
      fullname: string,
    },
    employee: EmployeeFull,
    img: string,
  },
}

export type UserInfoScreenParams = NativeStackScreenProps<RootStackParamList, 'UserInfo'>;

function App(): JSX.Element {

  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <>
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
              <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
              <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
              <Stack.Group screenOptions={{ presentation: "transparentModal" }} >
                <Stack.Screen name="UserInfo" component={UserInfoScreen} options={{ headerShown: false }} />
              </Stack.Group>
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </Provider>
      <Toast />
    </>
  )
}

export default App;
