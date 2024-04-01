import React, { useState, useEffect } from 'react';
import { FlatList } from "react-native";
import { Text, 
        Searchbar, 
        Card,
        Button,
        Divider, 
        Modal,
        TextInput,
        Portal,
        HelperText } from 'react-native-paper';

import { AuthContext } from "../utils/auth.tsx";

import axios from 'axios';

import ErrDialog from "../components/errorDialog.tsx"

const Item = ({title, showModal}) => (
  <>
    <Card>
      <Card.Title/>
      <Card.Content>
        <Text variant="titleLarge">{title}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => showModal(title)}>Send a message</Button>
      </Card.Actions>
    </Card>
  <Divider />
  </>
);

const MsgDialog = ({msg, setMsg, receiver, visible, hideModal, sendMsg, helperMsg}) => {
 const containerStyle = {padding: 20};

 return (
   <>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
        <Text>Send msg to {receiver}</Text>
        <TextInput
          label="Type your msg."
          text={msg}
          onChangeText={text => setMsg(text)}
        />
        <HelperText type="info" visible={helperMsg !== ""}>
          {helperMsg}
        </HelperText>
      <Button onPress={sendMsg}>Send</Button>
      </Modal>
      </Portal>
    </>
  );
}

export default Search = (): React.JSX.Element => {

  const { curUser, url } = React.useContext(AuthContext);

  const [searchQuery, setSearchQuery] = React.useState('');

  const [msg, setMsg] = useState("");

  const [receiver, setReceiver] = useState("");

  const [users, setUsers] = useState([]);

  const [visible, setVisible] = useState(false);
  
  const [helperMsg, setHelperMsg] = useState("");

  const showModal = (receiver) => { 
    // msg should be cleared here ? 
    setMsg("");
    setReceiver(receiver);
    setHelperMsg("");
    setVisible(true); 
  }

  const hideModal = () => setVisible(false);

  const config = {
    headers: { Authorization: `Token ${curUser["token"]}` }
  };

  // refactor this
  const [errMsg, setErrMsg] = React.useState(null);
  const hideDialog = () => setErrMsg(null);

  useEffect(() => {
    if (searchQuery.length < 1 && users !== []) {
      setUsers([]);
      return;
    }
    axios.get(
      `${url}/api/users/?search=` + searchQuery,
      config
    )
    .then(res => {
      // const data = res.data["results"].map(user => user["username"]).filter(name => name != curUser["username"])
      const data = res.data.map(user => user["username"]).filter(name => name != curUser["username"])
      setUsers(data);
    })
    .catch(err => {
      console.log(err);
    })
  }, [searchQuery])

  function sendMsg() {
    if (msg.length < 1) {
      setHelperMsg("Cannot send empty message.");
      return;
    }
    setHelperMsg("Sending...");
    axios.post(`${url}/api/chat/`, {
        receiver: receiver,
        content: msg 
      },
      config,
    )
    .then(res => {
      console.log(res.data["msg"]); 
      if (res.data["msg"] == "success") {
        setHelperMsg("Done...");
        // NOTE:
        setTimeout(() => hideModal(false), 1000);
      }
    })
    .catch(err => {
      setErrMsg("Network Error");
      console.warn(err);
    })
  /*
    axios.post(
      "http://10.0.2.2:8000/api/chat",
      config
    )
    .then(res => {
      const data = res.data["results"].map(user => user["username"])
      setUsers(data);
    })
    .catch(err => {
      console.log(err);
    })      <HelperText type="error" visible={hasErrors()}>
        Email address is invalid!
      </HelperText>
    */
  }

  return (
    <>
      <ErrDialog 
        title="Login error" 
        msg={errMsg}
        hideDialog={hideDialog}
      />
      <MsgDialog 
        msg={msg} 
        setMsg={setMsg}
        receiver={receiver}
        sendMsg={sendMsg}
        visible={visible}
        hideModal={hideModal}
        helperMsg={helperMsg}
      />
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        onClearIconPress={() => setUsers([])}
      />
      <>
        {users.length === 0 ? ( 
          <Text>Type to search usernames.</Text>
          ) : (
          <FlatList
            data={users}
            renderItem={({item}) => <Item showModal={showModal} title={item} />}
            keyExtractor={item => item}
          />
        )}
      </>
    </>
  );
  }

