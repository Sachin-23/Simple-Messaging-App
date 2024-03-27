import React, { useState, useEffect } from 'react';

import { FlatList } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

import { authcontext } from "../utils/auth.tsx";

import { text
        , textinput 
        , button } from "react-native-paper";

import axios from 'axios';

import data from "../utils/env.json";

import { AuthContext } from "../utils/auth.tsx";

import ErrDialog from "../components/errorDialog.tsx"

import EncryptedStorage from 'react-native-encrypted-storage';

/*
*/

const Msg = ({sender, data}) => {

  return (
    <Card>
      <Card.Content>
        <Text variant="titleMedium">{data.sender == sender ? "You" : data.sender}: {data.content}</Text>
        <Text>{data.time.getDate()}-{data.time.getMonth()}-{data.time.getFullYear()} {data.time.getHours()}:{data.time.getMinutes()}</Text>
      </Card.Content>
    </Card>
  );
};

export default function ChatBox({navigation, route}) {

  const [msgs, setMsgs] = useState(null);

  const { curUser } = React.useContext(AuthContext);

  const config = {
    headers: { Authorization: `Token ${curUser["token"]}` }
  };
 
  useEffect(() => {
    console.log("Msg: ", msgs)
    if (msgs === null) {
      axios.get(
        "http://10.0.2.2:8000/api/chat/?receiver=" + route.params["receiver"],
        config,
      )
      .then(res => { 
        const data = res.data.map(chat => { return {  id: chat.id, sender: chat.sender, receiver: chat.receiver, content: chat.content, time: new Date(chat.time) } }).sort(chat => chat.time).reverse()
        console.log("Setting up messages:", data);
        setMsgs(data);
      })
      .catch(err => {
        console.log("Chat > useEffect", err);
      })
    }
  })

  return (
    <>
      <Text>{route.params["reciever"]}</Text>
      <FlatList
        data={msgs}
        renderItem={({item}) => <Msg sender={curUser["username"]} data={item} />}
        keyExtractor={item => item.id}
      />
    </>
  );
}
