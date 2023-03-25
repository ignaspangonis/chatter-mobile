import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'expo-router'
import { View, Text, Button, FlatList } from 'react-native'

import { Route } from '../../../constants/routes'
import useAdminActions from '../../../hooks/useAdminActions'
import SendMessage from '../../../components/SendMessage'
import useChat from '../../../hooks/useChat'

export default function ChatScreen() {
  const {
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
    users,
    roomName: contextRoomName,
    connection,
  } = useChat()
  const {
    uiState: deleteRoomUiState,
    handleDeleteRoom,
    handleMakeAdmin,
    isAdmin,
  } = useAdminActions(leaveRoom, contextRoomName)

  const router = useRouter()

  const { userName, roomName } = useSearchParams()

  useEffect(() => {
    if (contextRoomName && !connection) {
      alert('Connection was not found!')
      router.push(Route.Lobby)
    }
  }, [contextRoomName, connection, router])

  useEffect(() => {
    if (!userName || !roomName || connection || contextRoomName) {
      return
    }

    joinRoom(String(userName), String(roomName))

    return () => {
      leaveRoom()
    }
  }, [joinRoom, roomName, userName, leaveRoom, connection, contextRoomName])

  // TODO scroll to new message

  const renderAdminAction = () => {
    if (isAdmin)
      return (
        <Button
          onPress={handleDeleteRoom}
          disabled={deleteRoomUiState === 'loading'}
          title="Delete room"
        />
      )

    return <Button onPress={handleMakeAdmin} title="Make me admin" />
  }

  function handleLeaveRoomButtonClick() {
    leaveRoom()

    router.push(Route.Lobby)
  }

  return (
    <View>
      <View>
        <Text>Room: {roomName}</Text>
        {renderAdminAction()}
        <Button onPress={handleLeaveRoomButtonClick} title="Leave Room" />
      </View>

      <View>
        <Text>Connected users</Text>
        <FlatList
          data={users}
          alwaysBounceVertical={false}
          renderItem={user => (
            <View>
              <Text>{user.item}</Text>
            </View>
          )}
          keyExtractor={(user, index) => String(index)}
        />

        <View>
          <FlatList
            data={messages}
            alwaysBounceVertical={true}
            renderItem={({ item: message }) => (
              <View>
                <Text>{message.userName}</Text>
                <Text>{message.content}</Text>
              </View>
            )}
            inverted
            keyExtractor={message => message.id}
          />
          <SendMessage onSubmit={sendMessage} />
        </View>
      </View>
    </View>
  )
}
