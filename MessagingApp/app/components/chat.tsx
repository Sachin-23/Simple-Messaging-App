import React, { useState, useEffect } from 'react';

import { FlatList } from 'react-native';
import { Text, Card, Button, TextInput, Icon, HelperText } from 'react-native-paper';

import axios from 'axios';

import data from "../utils/env.json";

import { AuthContext } from "../utils/auth.tsx";

import ErrDialog from "../components/errorDialog.tsx"

import EncryptedStorage from 'react-native-encrypted-storage';

const Msg = ({sender, data}) => {

  function getTime(time) {
    const d = time.getDate()
    const m = time.getMonth()
    const y = time.getFullYear()
    const h = time.getHours()
    const min = time.getMinutes()

    return `${d}-${m}-${y} ${h < 10 ? "0" + h : h}:${min < 10 ? "0" + min : min}`
  }

  return (
    <Card>
      <Card.Content>
        <Text variant="titleMedium">{data.sender == sender ? "You" : data.sender}: {data.content}</Text>
        <Text>{getTime(data.time)}</Text>
      </Card.Content>
    </Card>
  );
};

export default function ChatBox({navigation, route}) {

  const [msgs, setMsgs] = useState(null);

  const [msg, setMsg] = useState('');

  const [render, setRender] = useState(true);

  const { curUser, url } = React.useContext(AuthContext);

  const config = {
    headers: { Authorization: `Token ${curUser["token"]}` }
  };

  function loadMsgs() {
    if (render === true) {
      setRender(false);
      axios.get(
        `${url}/api/chat/?receiver=` + route.params["receiver"],
        config,
      )
      .then(res => { 
        const data = res.data.map(chat => { return {  id: chat.id, sender: chat.sender, receiver: chat.receiver, content: chat.content, time: new Date(chat.time) } }).sort((a, b) => b.time - a.time)
        //console.log("Setting up messages:", data);
        setMsgs(data);
      })
      .catch(err => {
        setErrMsg("Chat > useEffect", err);
      })
    }
  }
 
  useEffect(() => {
    loadMsgs();
    console.log("Msg: ", msgs)

  }, [render])

  function sendMsg() {
      if (msg.length < 1) {
      setHelperMsg("Cannot send empty message.");
      return;
    }
    axios.post(
      `${url}/api/chat/`, {
        receiver: route.params["receiver"],
        content: msg 
      },
      config,
    )
    .then(res => {
      console.log(res.data["msg"]); 
      if (res.data["msg"] == "success") {
        setRender(true);
        setMsg("");
      }
    })
    .catch(err => {
      setErrMsg("Network Error");
      console.warn(err);
    })
  }

  // refactor this
  const [errMsg, setErrMsg] = React.useState(null);
  const hideDialog = () => setErrMsg(null);

  const [helperMsg, setHelperMsg] = React.useState("");

  return (
    <>
      <ErrDialog 
        title="Login error" 
        msg={errMsg}
        hideDialog={hideDialog}
      />
      <FlatList
        inverted={true}
        data={msgs}
        renderItem={({item}) => <Msg sender={curUser["username"]} data={item} />}
        keyExtractor={item => item.id}
      />
      {helperMsg && 
       <HelperText visible={helperMsg !== ""}>
           {helperMsg}
       </HelperText>
      }
      <TextInput
        label=""
        placeholder="Enter your message"
        value={msg}
        onChangeText={text => setMsg(text)}
        right={<TextInput.Icon icon="send" onPress={() => sendMsg()}/>}
      />
      <Button onPress={() => loadMsgs()}></Button>
    </>
  );
}
