import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useAuth } from './AuthContext';

const ChatScreen = ({ route }) => {
  const { roomId, username } = route.params;
  const [serverState, setServerState] = useState('Connecting...');
  const [messageText, setMessageText] = useState('');
  const [inputFieldEmpty, setInputFieldEmpty] = useState(true);
  const [serverMessages, setServerMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const scrollViewRef = useRef();
  const inputFieldRef = useRef();
  const { accessToken } = useAuth();

  useEffect(() => {
    const websocket = new WebSocket(encodeURI(`ws://192.168.90.49:8000/chat/?Authorization=Bearer ${accessToken}`));
    setWs(websocket);

    websocket.onopen = () => {
      setServerState('Connected');
    };

    websocket.onmessage = (e) => {
      setServerMessages(prevMessages => [...prevMessages, { text: e.data, sender: 'other' }]);
    };

    websocket.onerror = (e) => {
      setServerState(`Error: ${e.message}`);
    };

    websocket.onclose = (e) => {
      setServerState(`Connection closed: ${e.code}, ${e.reason}`);
      setServerState('Disconnected');
    };

    // Cleanup function
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [roomId, username]);

  const submitMessage = () => {
    if (ws) {
      setServerMessages(prevMessages => [...prevMessages, { text: messageText, sender: 'me' }]);
      ws.send(`${messageText}`);
      setMessageText('');
      setInputFieldEmpty(true);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      scrollViewRef.current.scrollToEnd({ animated: true });
    });

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const onFocusTextInput = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{serverState}</Text>
      </View>
      <ScrollView
  ref={scrollViewRef}
  onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
  style={styles.messagesContainer}
>
  {serverMessages.map((item, ind) => (
    <View
      key={ind}
      style={[
        styles.messageContainer,
        item.sender === 'me' ? styles.myMessageContainer : styles.otherMessageContainer,
      ]}
    >
      <Text style={item.sender === 'me' ? styles.myMessageText : styles.otherMessageText}>
        {item.text}
      </Text>
    </View>
  ))}
</ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.inputContainer}
      >
        <TextInput
          style={[styles.inputField, { flex: 1 }]}
          placeholder={'Type your message'}
          onChangeText={(text) => {
            setMessageText(text);
            setInputFieldEmpty(text.length > 0 ? false : true);
          }}
          value={messageText}
          multiline={true}
          maxHeight={80}
          onFocus={onFocusTextInput}
          ref={inputFieldRef}
        />
        <Button onPress={submitMessage} title={'Send'} disabled={inputFieldEmpty} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingTop: 30,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderColor: '#3498db',
    borderWidth: 2,
    borderRadius: 10,
  },
  header: {
    height: 30,
    backgroundColor: '#3498db',
    padding: 5,
    marginBottom: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#3498db',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#95a5a6',
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000', // You can adjust the color for other users' messages
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#3498db',
    flexGrow: 1,
    padding: 8,
    marginRight: 8,
    borderRadius: 5,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    maxWidth: '70%',
  },
});

export default ChatScreen;
