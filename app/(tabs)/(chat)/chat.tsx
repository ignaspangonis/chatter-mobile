import React, { useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'expo-router'
import { View, Text, Button, FlatList } from 'react-native'

import { Route } from '../../../constants/routes'
import useAdminActions from '../../../hooks/useAdminActions'
import SendMessage from '../../../components/SendMessage'
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
        <Button
          onPress={deleteRoom}
          disabled={deleteRoomUiState === 'loading'}
          title="Delete room"
        />
      )

    return <Button onPress={handleMakeAdmin} title="Make me admin" />
  }

  return (
    <View>
      <View>
        <Text>Room: {roomName}</Text>
        {renderAdminAction()}
        <Button onPress={handleLeaveRoom} title="Leave Room" />
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
            keyExtractor={(message, index) => String(message.id.timestamp * index)}
          />
          <SendMessage onSubmit={sendMessage} />
        </View>
      </View>
    </View>
  )
}
