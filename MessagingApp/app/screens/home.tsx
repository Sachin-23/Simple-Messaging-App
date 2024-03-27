import React, { useState, useEffect } from 'react';
import { Text, Card, Button, Portal, Modal } from 'react-native-paper';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FlatList } from 'react-native';

import axios from 'axios';

import { AuthContext } from "../utils/auth.tsx";

import ErrDialog from "../components/errorDialog.tsx"

import ChatsScreen from "../components/chats.tsx"
import ChatBox from "../components/chat.tsx"

const Stack = createNativeStackNavigator();

export default Home = () => {

  const [receiver, setReceiver] = useState(null);

  return (
    <Stack.Navigator initialRouteName="Chats">
      <Stack.Screen name="Chats" component={ChatsScreen} />
      <Stack.Screen 
        name="ChatBox" 
        component={ChatBox} 
        options={({route}) => ({title: route.params.receiver})}
      />
    </Stack.Navigator>
  );
}
