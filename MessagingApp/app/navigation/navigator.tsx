import React, { useState } from 'react';
import { View } from "react-native";
import { useColorScheme } from "react-native";

import { Text, Icon
        , useTheme 
        , adaptNavigationTheme } from 'react-native-paper';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';

import { AuthContext } from "../utils/auth.tsx";

import Home from "../screens/home.tsx";
import Search from "../screens/search.tsx";
import Profile from "../screens/profile.tsx";

import Login from "../screens/login.tsx";
import Register from "../screens/register.tsx";

import { SafeAreaView } from "react-native-safe-area-context";

export default Navigator = (): React.JSX.Element => {

  const { curUser } = React.useContext(AuthContext);

  const Stack = createNativeStackNavigator();
  const Tab = createMaterialBottomTabNavigator();

  console.log("Navigator: ", curUser);

  return (
    <>
      {curUser == null ? ( 
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={Login} 
            options= {{
            }}
          />
          <Stack.Screen 
            name="Register" 
            component={Register} 
            options= {{
            }}
          />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator initialRouteName="Home">
          <Tab.Screen 
            name="Search" 
            component={Search} 
            options={{
              tabBarIcon:() => <Icon source="magnify" size={30}/>, 
              headerShown: false,
            }}
           />
          <Tab.Screen 
            name="Home" 
            component={Home} 
            options={{
              tabBarLabel: "Chats",
              tabBarIcon:() => <Icon source="message-outline" size={30}/>, 
              headerShown: false,
             }}
          />
          <Tab.Screen 
            name="Profile" 
            component={Profile} 
            options={{
              tabBarIcon:() => <Icon source="account-outline" size={30}/>, 
              headerShown: false,
            }}
            />
        </Tab.Navigator>
      )}
    </>
  );
}

