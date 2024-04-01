import React from "react";
import { Text
        , Button
        , Dialog 
        , Portal } from "react-native-paper";

export default ErrDialog = ({ title, msg, hideDialog }): React.JSX.Element => {

  const visible = msg === null ? false : true; 

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{ msg }</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Clear</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
