/* eslint-disable react-native/no-color-literals */
import React, { useMemo } from 'react'
import { useRouter, useSearchParams } from 'expo-router'
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'

import { Route } from '../../../constants/routes'
import useAdminActions from '../../../hooks/useAdminActions'
import useChat from '../../../hooks/useChat'

export default function ChatScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [userName, roomName] = useMemo(() => {
    const { userName, roomName } = searchParams

    if (!userName || !roomName) return [null, null]

    return [String(userName), String(roomName)]
  }, [searchParams])

  const { messages, users, leaveRoom, sendMessage } = useChat(userName, roomName)

  const usersText = useMemo(() => {
    return users.join(', ')
  }, [users])

  function handleLeaveRoom() {
    leaveRoom()

    router.push(Route.Lobby)
  }

  const {
    uiState: deleteRoomUiState,
    deleteRoom,
    handleMakeAdmin,
    isAdmin,
  } = useAdminActions(handleLeaveRoom, roomName)

  // TODO scroll to new message

  const renderAdminAction = () => {
    if (isAdmin)
      return (
        <TouchableOpacity
          style={styles.button}
          disabled={deleteRoomUiState === 'loading'}
          activeOpacity={0.6}
          onPress={deleteRoom}
        >
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 16 }}>Delete messages</Text>
        </TouchableOpacity>
      )

    return (
      <TouchableOpacity style={styles.button} onPress={handleMakeAdmin} activeOpacity={0.6}>
        <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 16 }}>Make me admin</Text>
      </TouchableOpacity>
    )
  }

  if (!userName || !roomName)
    return (
      <View>
        <Text>Invalid room</Text>
        <Button onPress={() => router.push(Route.Lobby)} title="Back to lobby" />
      </View>
    )

  return (
    <GiftedChat
      messages={messages}
      user={{
        _id: userName,
        name: userName,
        avatar: 'https://placeimg.com/140/140/any',
      }}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={messages => messages.forEach(message => sendMessage(message.text))}
      messagesContainerStyle={{
        backgroundColor: '#fff',
      }}
      renderUsernameOnMessage
      renderChatEmpty={() => <Text>Loading...</Text>}
      renderFooter={() => (
        <View style={styles.chatFooter}>
          <Text style={styles.text}>Users in room: {usersText}.</Text>
          {renderAdminAction()}
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#555',
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    marginLeft: 'auto',
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 16,
  },
  chatFooter: {
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexGrow: 1,
    gap: 4,
    padding: 10,
  },
  text: {
    alignSelf: 'center',
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
