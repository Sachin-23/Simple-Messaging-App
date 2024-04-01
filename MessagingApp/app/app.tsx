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

  const [curUser, setCurUser] = useState(null);

  const [url, setUrl] = React.useState("");

  useEffect(() => {
    EncryptedStorage.getItem("userSession")
      .then(res => {
        console.log("token: ", res);
        if (res !== undefined) {
          res = JSON.parse(res);
          setCurUser(res);
        }
      })
      .catch(err => {
        console.warn("getToken:", err);
      });
    EncryptedStorage.getItem("url")
      .then(res => {
        if (res !== undefined) {
          console.log(JSON.parse(res)["url"]);
          setUrl(JSON.parse(res)["url"]);
        }
        else {
          setUrl("10.0.0.2:8000");
        }
      })
      .catch(err => {
        console.warn("Get Url:", err);
      });
  }, []);

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={{ curUser, setCurUser, url, setUrl }}>
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
