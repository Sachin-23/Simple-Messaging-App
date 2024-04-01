import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text, Card, Button, Portal, Modal } from 'react-native-paper';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FlatList } from 'react-native';

import axios from 'axios';

import { AuthContext } from "../utils/auth.tsx";

import ErrDialog from "../components/errorDialog.tsx"

import ChatBox from "../components/errorDialog.tsx"

const Chat = ({data, setVisible, openChatBox, curUser}) => {

  return (
    <Card>
      <Card.Title 
        title={data.receiver} 
        titleVariant="headlineSmall"
        right={(props) => <Button mode="outlined" onPress={() => openChatBox(data.receiver)}>Open Message</Button>}
        subtitle={`${data.sender === curUser ? "You" : data.sender} : ${data.sender}`}
        subtitleVariant="titleMedium"
      />
    </Card>
  );
};


export default ChatsScreen = ({navigation}): React.JSX.Element => {

  const { curUser, url } = React.useContext(AuthContext);

  const [chats, setChats] = useState(null);

  const config = {
    headers: { Authorization: `Token ${curUser["token"]}` }
  };

  function loadChats() {
    if (chats === null) {
      axios.get(
        `${url}/api/chats/`,
        config
      )
      .then(res => { 
        const data = res.data.map(chat => {
          // misktake
          let receiver = chat.sender;

          if (chat.sender === curUser["username"]) {
            receiver = chat.receiver
          }

          return {  
                    id: chat.id,
                    sender: chat.sender, 
                    receiver: receiver, 
                    content: chat.recentMsg.content, 
                    time: new Date(chat.time)
                  }
        }).sort(chat => chat.time).reverse()
        console.log("Chats: ", data)
        setChats(data);
        return data
      })
      .catch(err => {
        console.log("Chat > useEffect", err);
      })
    }
  }


  useEffect(() => {
    loadChats();
    /*
    try {
      const socket = new WebSocket("ws://10.0.2.2:8000/ws/chat/", null, {
          "headers": {
            "token": curUser["token"]
          }
        })

      socket.onopen = () => console.log("Established.");

      socket.onmessage = msg => {

        console.log("Msg from ws:", msg);

        data = JSON.parse(msg["data"]);
        if (data["error"]) {
          console.warn("Error: ", data["error"])
        }
        else {
          console.log(curUser["username"], "Reload? ", data)
          if (data["msg"] === "reload") {
            loadChats(); 
          }
        }
      }

      socket.onclose = () => console.log("disconnect.");

      socket.onerror = (e) => console.log("error.");
    }
    catch (err) {
      console.log(err);
    }
      */
  });

  // refactor this
  const [errMsg, setErrMsg] = React.useState(null);
  const hideDialog = () => setErrMsg(null);

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  function openChatBox(receiver) {
    navigation.navigate({
      name: "ChatBox",
      params: { receiver: receiver }
    })
  }

  return (
    <View>
      <ErrDialog 
        title="Login error" 
        msg={errMsg}
        hideDialog={hideDialog}
      />
      {(chats && chats.length !== 0) ? 
      ( <FlatList
        data={chats}
        renderItem={({item}) => <Chat data={item} setVisible={setVisible} openChatBox={openChatBox} curUser={curUser["username"]}/>}
        keyExtractor={item => item.id}
      />
      ) : (
        <Text>No messages.</Text>
      )}
      <Button onPress={() => loadChats()}></Button>
    </View>
  );
}
