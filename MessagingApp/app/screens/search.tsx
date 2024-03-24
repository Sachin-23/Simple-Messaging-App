import React, { useState, useEffect } from 'react';
import { FlatList } from "react-native";
import { Text, 
        Searchbar, 
        Card,
        Button } from 'react-native-paper';

import { AuthContext } from "../utils/auth.tsx";

import axios from 'axios';

import ErrDialog from "../components/errorDialog.tsx"


type ItemProps = { title: string};

const Item = ({title}: ItemProps) => (
  <Card>
    <Card.Title/>
    <Card.Content>
      <Text variant="titleLarge">{title}</Text>
    </Card.Content>
    <Card.Actions>
      <Button>Send friend request</Button>
    </Card.Actions>
  </Card>
);

export default Search = (): React.JSX.Element => {

  const { curUser } = React.useContext(AuthContext);

  const [searchQuery, setSearchQuery] = React.useState('');

  const [users, setUsers] = useState([]);

  const config = {
    headers: { Authorization: `Token ${curUser}` }
  };

  // refactor this
  const [errMsg, setErrMsg] = React.useState(null);
  const hideDialog = () => setErrMsg(null);

  useEffect(() => {
    if (searchQuery.length < 1) {
      setUsers([]);
      return;
    }
    axios.get(
      "http://10.0.2.2:8000/api/users/?search=" + searchQuery,
      config
    )
    .then(res => {
      const data = res.data["results"].map(user => user["username"])
      setUsers(data);
    })
    .catch(err => {
      console.log(err);
    })
  }, [searchQuery])

  return (
    <>
      <ErrDialog 
        title="Login error" 
        msg={errMsg}
        hideDialog={hideDialog}
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
            renderItem={({item}) => <Item title={item} />}
            keyExtractor={item => item}
          />
        )}
      </>
    </>
  );
  }

