import React, { useState } from 'react';
import { Text, Button } from 'react-native-paper';

import { AuthContext } from "../utils/auth.tsx";

import ErrDialog from "../components/errorDialog.tsx"
import EncryptedStorage from 'react-native-encrypted-storage';

export default Navigator = (): React.JSX.Element => {

  const { curUser, setCurUser } = React.useContext(AuthContext);

  // refactor this
  const [errMsg, setErrMsg] = React.useState(null);
  const hideDialog = () => setErrMsg(null);

  function logOut() {
    try {
        (async () => {
          await EncryptedStorage.removeItem("userSession");
        })()
        setCurUser(null);
    } catch (error) {
      setErrMsg("App > profile > logOut", error);
    }
  }

  return (
    <>
      <ErrDialog 
        title="Login error" 
        msg={errMsg}
        hideDialog={hideDialog}
      />
      <Text>Profile</Text>
      <Button
        mode="elevated"
        onPress={logOut} 
      >
      Log out
      </Button>
    </>
  );
}

