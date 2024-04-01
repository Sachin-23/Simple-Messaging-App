import React, { usestate } from 'react';

import { AuthContext } from "../utils/auth.tsx";

import { useColorScheme } from "react-native";

import { Text
        , TextInput 
        , Button
        , Icon } from "react-native-paper";

import axios from 'axios';

import data from "../utils/env.json";

import ErrDialog from "../components/errorDialog.tsx"

import EncryptedStorage from 'react-native-encrypted-storage';

export default Login = ({ navigation }): React.JSX.Element => {

  const { curUser, setCurUser, url, setUrl } = React.useContext(AuthContext);
  console.log("Data", curUser, url)

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const isDarkTheme = useColorScheme() === "dark";

  const [urlBox, setUrlBox] = React.useState(false);

  async function saveUrl() {
    if (url === "") {
      setErrMsg("Enter the correct url.");
    }
    try {
      await EncryptedStorage.setItem(
        "url", 
        JSON.stringify({
          url: url
        })
      )
      setUrl(url);
      setUrlBox(false);
    }
    catch (error) {
      setErrMsg("Error: App > Url > storage");
    }
  }

  function login() {
    if (username === "admin" || password === "setUrl") {
      setUrlBox(true);
      return ;
    }
    if (username === "" || password === "") {
      setErrMsg("Enter the correct credentials.");
      return;
    }
    axios.post(`${url}/api/login/`, {
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
          console.log("After Login: ", res.data);
          setCurUser(res.data);
        }
        catch (error) {
          setErrMsg("Error: App > Login > storage");
        }
      })()
    })
    .catch(err => {
      console.warn("Storage: ", err); 
      setErrMsg("Error: App > Login > axios");
    })
  }

  // refactor this
  const [errMsg, setErrMsg] = React.useState(null);
  const hideDialog = () => setErrMsg(null);

  return (
    <>
    {urlBox === true ? 
    (
      <>
        <TextInput
          placeholder="Save url with PORT number - http://url:port"
          value={url}
          onChangeText={text => setUrl(text)}
        />
        <Button mode="outlined" onPress={() => saveUrl()}>Save Url</Button>
      </>
      ) : (
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
        secureTextEntry={true}
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
        onPress={() => navigation.navigate('Register')}
      >
       Register 
      </Button>
    </>)
    }
    </>
  );
}

