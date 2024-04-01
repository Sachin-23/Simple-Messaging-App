import React, { useState } from 'react';

import { AuthContext } from "../utils/auth.tsx";

import { useColorScheme } from "react-native";

import { Text
        , TextInput 
        , Button } from "react-native-paper";

import axios from 'axios';

import ErrDialog from "../components/errorDialog.tsx"

import EncryptedStorage from 'react-native-encrypted-storage';


export default Register = (): React.JSX.Element => {

  const { curUser, setCurUser, url } = React.useContext(AuthContext);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [bio, setBio] = React.useState("");

  // refactor this
  const [errMsg, setErrMsg] = React.useState(null);
  const hideDialog = () => setErrMsg(null);

  const isDarkTheme = useColorScheme() === "dark";

  function register() {
    if (username === "" || password === "" || password2 == "" || bio == "") {
      setErrMsg("Enter the correct credentials.");
      return;
    }
    if (password !== password2) {
      setErrMsg("Passwords do not match.");
      return;
    } 
    axios.post(`${url}/api/register/`, {
        username: username,
        password: password,
        bio: bio, 
    })
    .then((res) => {
      console.log(res.data["token"]);
      (async () => {
        try {
          await EncryptedStorage.setItem(
            "userSession", 
            JSON.stringify({
              bio: res.data["bio"],
              token: res.data["token"],
              username: username})
          )
          setCurUser(res.data);
        }
        catch (error) {
          setErrMsg("Register > Storage > ");
          console.warn("Storage: ", error);
        }
      })()
    })
    .catch(err => console.warn(err))
  }

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
        label="Bio"
        value={bio}
        onChangeText={text => setBio(text)}
      />
      <TextInput
        label="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
      />
      <TextInput
        label="Confirm Password"
        value={password2}
        secureTextEntry={true}
        onChangeText={text => setPassword2(text)}
      />
      <Button
        mode="elevated"
        value={password}
        onPress={register}
      >
       Register 
      </Button>
    </>
  );
}

