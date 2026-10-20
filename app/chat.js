import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { io } from 'socket.io-client';
import { Platform } from 'react-native';

const SERVER_URL = 'http://192.168.5.196:3000'; 

//connect react app to the backend using socket.io
const socket = io(SERVER_URL);

export default function App() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id, "PLatform : ", Platform.OS);
    });

    // incoming messages from the server
    socket.on('receive_message', (data) => {
      setChatMessages((prevMessages) => [...prevMessages, data]);
    });

    
    return () => {
      socket.off('connect');
      socket.off('receive_message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === '') return;

    const messageData = {
      id: Math.random().toString(), //unique ID
      text: message,
      sender: socket.id,
      timestamp: new Date().toLocaleTimeString(),
    };

    // send the message to the server
    socket.emit('send_message', messageData);
   setChatMessages((prevMessages) => [...prevMessages, messageData]);
    setMessage('');

  };
  const renderItem = ({ item }) => {
    const isMe = item.sender === socket.id;
    return (
      <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timeText}>{item.timestamp}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  chatContainer: { padding: 10 },
  messageBubble: { padding: 12, borderRadius: 10, marginBottom: 10, maxWidth: '80%' },
  myMessage: { backgroundColor: '#d781ff"', alignSelf: 'flex-end' },
  theirMessage: { backgroundColor: '#e4b0f0', alignSelf: 'flex-start' },
  messageText: { fontSize: 16 },
  timeText: { fontSize: 10, color: '#888', marginTop: 4, alignSelf: 'flex-end' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 2, borderWidth: 1, borderColor: '#450e6a', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 },
});