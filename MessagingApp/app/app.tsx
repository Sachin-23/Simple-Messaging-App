import React, { useState, 
                useEffect,
                useRef } from 'react';

import { useColorScheme } from "react-native";

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { 
  PaperProvider
  , Text
  , Icon
  , MD3LightTheme
  , MD3DarkTheme
} from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';

import Navigator from "./navigation/navigator.tsx";

import { AuthContext } from "./utils/auth.tsx";

import EncryptedStorage from 'react-native-encrypted-storage';

function App(): React.JSX.Element { 
  const theme = useColorScheme() === "dark" ? MD3DarkTheme : MD3LightTheme;

  const [curUser, setCurUser] = useState();

  useEffect(() => {
    EncryptedStorage.getItem("userSession")
      .then(res => {
        res = JSON.parse(res);
        console.log("token: ", res);
        setCurUser(res["token"]);
      })
      .catch(err => {
        console.err("getToken:", err);
      });
  }, []);

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={{ curUser, setCurUser }}>
        <PaperProvider theme={theme}>
          <NavigationContainer theme={theme}>
            <Navigator />
          </NavigationContainer>
        </PaperProvider>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}


export default App;