import React, { useState } from 'react';
import { Text } from 'react-native-paper';

import { AuthContext } from "../utils/auth.tsx";

export default Home = (): React.JSX.Element => {

  const { curUser } = React.useContext(AuthContext);

  return (
    <>
      <Text>Home</Text>
    </>
  );
}

