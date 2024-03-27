import React, { useState, useEffect } from 'react';
import { Text, Card, Button, Portal, Modal } from 'react-native-paper';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FlatList } from 'react-native';

import axios from 'axios';

import { AuthContext } from "../utils/auth.tsx";

import ErrDialog from "../components/errorDialog.tsx"

import ChatBox from "../components/errorDialog.tsx"

const Chat = ({data, setVisible, openChatBox}) => {
  return (
    <Card>
      <Card.Title title={data.sender} titleVariant="titleLarge" />
      <Card.Content>
        <Text variant="titleMedium">Msg: {data.content}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => openChatBox(data.sender)}>Open Message</Button>
      </Card.Actions>
    </Card>
  );
};


export default ChatsScreen = ({navigation}): React.JSX.Element => {

  const { curUser } = React.useContext(AuthContext);

  const [chats, setChats] = useState(null);

  const config = {
    headers: { Authorization: `Token ${curUser["token"]}` }
  };

  useEffect(() => {
    if (chats === null) {
      axios.get(
        "http://10.0.2.2:8000/api/chats/",
        config
      )
      .then(res => { 
        const data = res.data.map(chat => {
          return {  
                    id: chat.id,
                    sender: chat.sender, 
                    receiver: chat.receiver, 
                    content: chat.recentMsg.content, 
                    time: new Date(chat.time)
                  }
        }).sort(chat => chat.time).reverse()

        //console.log("Chats: ", data)
        setChats(data);
        return data
      })
      .catch(err => {
        console.log("Chat > useEffect", err);
      })
    }
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
    <>
      <ErrDialog 
        title="Login error" 
        msg={errMsg}
        hideDialog={hideDialog}
      />
      <FlatList
        data={chats}
        renderItem={({item}) => <Chat data={item} setVisible={setVisible} openChatBox={openChatBox}/>}
        keyExtractor={item => item.id}
      />
    </>
  );
}
