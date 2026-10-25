import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { io } from 'socket.io-client';
import { useUser } from '../components/providers/UserContext';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  Heading,
} from '@gluestack-ui/themed';

const SERVER_URL = 'http://192.168.5.196:3000';
const socket = io(SERVER_URL);


export default function ChatScreen({ navigation }) {
  const { nin } = useUser();
  const myId = nin;
  const [recipientId, setRecipientId] = useState('');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState ([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const registerDevice = () => {
      console.log('Connected to server with ID:', socket.id);
      setIsConnected(true);
      const safeMyId = String(myId).trim();
      socket.emit('register_user', safeMyId);
    };
    const handleDisconnect = () => setIsConnected(false);

    if (socket.connected) {
      registerDevice();
    }

    socket.on('connect', registerDevice);
    socket.on('disconnect', handleDisconnect);
    socket.on('receive_message', (data) => {
      setChatMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('connect', registerDevice);
      socket.off('disconnect', handleDisconnect);
      socket.off('receive_message');
    };
  }, [myId]);

  const sendMessage = () => {
    const safeMyId = String(myId).trim();
    const safeRecipientId = String(recipientId).trim();

    if (message.trim() === '' || safeRecipientId === '') return;

    const messageData = {
      id: Math.random().toString(),
      text: message,
      sender: safeMyId,
      recipientId: safeRecipientId,
      timestamp: new Date().toLocaleTimeString(),
    };

    socket.emit('send_message', messageData);
    setChatMessages((prevMessages) => [...prevMessages, messageData]);
    setMessage('');
  };

  
  const renderItem = ({ item }) => {
    const isMe = item.sender === myId;

    return (
      <Box
        bg={isMe ? '#6D3CE9' : '$white'}
        alignSelf={isMe ? 'flex-end' : 'flex-start'}
        px="$4"
        py="$3"
        mb="$3"
        maxWidth="84%"
        borderRadius="$2xl"
        borderBottomRightRadius={isMe ? 4 : '$2xl'}
        borderBottomLeftRadius={!isMe ? 4 : '$2xl'}
        borderWidth={isMe ? 0 : 1}
        borderColor="$borderLight200"
      >
        {!isMe && (
          <Text fontSize="$xs" color="#6D3CE9" fontWeight="$semibold" mb="$1">
            {item.sender}
          </Text>
        )}
        <Text color={isMe ? '$white' : '$textLight900'} fontSize="$md" lineHeight="$xl">
          {item.text}
        </Text>
        <Text
          fontSize="$2xs"
          color={isMe ? '#E7DDFE' : '$textLight500'}
          mt="$2"
          alignSelf="flex-end"
        >
          {item.timestamp}
        </Text>
      </Box>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ddd2e8' }}
      edges={['right','bottom','left']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <VStack
          bg="$white"
          px="$5"
          pt="$4"
          pb="$5"
          space="md"
          borderBottomWidth={1}
          borderColor="$borderLight200"
        >
          
          <HStack alignItems="center" space="md">
            <Box
              width={48}
              height={40}
              borderRadius="$full"
              bg="#F0EAFE"
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons name="chatbubbles" size={22} color="#6D3CE9" />
            </Box>
            <VStack flex={1} space="xs">
              <Heading size="lg" color="$textLight900">
                Messages
              </Heading>
              <Text fontSize="$sm" color="$textLight500">
                Signed in as {myId || 'Guest'}
              </Text>
            </VStack>
            <Box
              width={10}
              height={10}
              borderRadius="$full"
              bg={isConnected ? '#22C55E' : '#F59E0B'}
            />
            <Text fontSize="$xs" color="$textLight500">
              {isConnected ? 'Online' : 'Connecting'}
            </Text>
          </HStack>

          <VStack space="xs">
            <Text fontSize="$xs" color="$textLight500" fontWeight="$semibold">
              SEND TO
            </Text>
            <Input
              variant="outline"
              size="md"
              borderRadius="$xl"
              bg="#FAF9FC"
              borderColor="$borderLight300"
            >
              <InputField
                accessibilityLabel="Recipient identity"
                placeholder="Enter recipient ID"
                value={recipientId}
                onChangeText={setRecipientId}
                autoCapitalize="none"
                returnKeyType="next"
              />
            </Input>
          </VStack>
        </VStack>

        <Box flex={1} px="$5" pt="$5">
          <FlatList
            data={chatMessages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: chatMessages.length ? 'flex-end' : 'center',
              paddingBottom: 12,
            }}
            ListEmptyComponent={
              <VStack alignItems="center" space="md" px="$6">
                <Box
                  width={72}
                  height={72}
                  borderRadius="$full"
                  bg="#F0EAFE"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={32} color="#6D3CE9" />
                </Box>
                <VStack alignItems="center" space="xs">
                  <Heading size="md" color="$textLight900">
                    Start your conversation
                  </Heading>
                  <Text color="$textLight500" textAlign="center">
                    Enter a recipient ID above, then send your first message.
                  </Text>
                </VStack>
              </VStack>
            }
          />
        </Box>

        <HStack
          bg="$white"
          px="$4"
          py="$3"
          space="sm"
          alignItems="center"
          borderTopWidth={1}
          borderColor="$borderLight200"
        >
          <Input
            flex={1}
            variant="outline"
            size="md"
            borderRadius="$2xl"
            bg="#FAF9FC"
            borderColor="$borderLight300"
          >
            <InputField
              accessibilityLabel="Message"
              placeholder="Write a message..."
              value={message}
              onChangeText={setMessage}
              editable={Boolean(recipientId.trim())}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
          </Input>
          <Button
            size="md"
            variant="default"
            action="primary"
            bg="#6D3CE9"
            borderRadius="$2xl"
            px="$4"
            isDisabled={!recipientId.trim() || !message.trim()}
            onPress={sendMessage}
            accessibilityLabel="Send message"
          >
            <ButtonText>Send</ButtonText>
          </Button>
        </HStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}