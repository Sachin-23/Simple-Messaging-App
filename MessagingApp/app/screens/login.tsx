import React, { useState } from 'react';

import { AuthContext } from "../utils/auth.tsx";

import { useColorScheme } from "react-native";

import { Text
        , TextInput 
        , Button } from "react-native-paper";

import axios from 'axios';

import data from "../utils/env.json";

import ErrDialog from "../components/errorDialog.tsx"

import EncryptedStorage from 'react-native-encrypted-storage';

export default Login = ({ navigation }): React.JSX.Element => {

  const { curUser, setCurUser } = React.useContext(AuthContext);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const isDarkTheme = useColorScheme() === "dark";

  function login() {
    if (username === "" || password === "") {
      setErrMsg("Enter the correct credentials.");
      return;
    }
    axios.post("http://10.0.2.2:8000/api/login/", {
        username: username,
        password: password 
    })
    .then((res) => {
      (async () => {
        try {
          await EncryptedStorage.setItem(
            "userSession", 
            JSON.stringify({
              bio: res.data["bio"],
              token: res.data["token"],
              username: username})
          )
          console.log("test", res.data);
          setCurUser(res.data);
        }
        catch (error) {
          console.warn("Storage: ", error); 
          setErrMsg("Error: App > Login > Login > storage");
        }
      })()
    })
    .catch(err => console.warn(err))
  }

  // refactor this
  const [errMsg, setErrMsg] = React.useState(null);
  const hideDialog = () => setErrMsg(null);

  return (
    <>
      <ErrDialog 
        title="Login error" 
        msg={errMsg}
        hideDialog={hideDialog}
      />
      <TextInput
        label="Username"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        label="password"
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <Button
        mode="contained-tonal"
        mode="elevated"
        value={password}
        onPress={login}
      >
      Login
      </Button>
      <Button
        mode="elevated"
        value={password}
        onPress={() => navigation.navigate('Register') }
      >
       Register 
      </Button>
    </>
  );
}

