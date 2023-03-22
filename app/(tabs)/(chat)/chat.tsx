import React, { useContext, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'expo-router'
import { View, Text, Button, FlatList } from 'react-native'

import { Route } from '../../../constants/routes'
import { MessageModel } from '../../../types/models'
import useAdminActions from '../../../hooks/useAdminActions'
import SendMessage from '../../../components/SendMessage'
import ChatContext from '../../../containers/ChatProvider/ChatContext'
import useChat from '../../../hooks/useChat'

type Props = {
  messages: MessageModel[]
  onLeaveRoom: () => void
  onSendMessage: (message: string) => void
}

export default function ChatScreen() {
  const messageRef = useRef<View>(null)
  const { connection, users, roomName: contextRoomName } = useContext(ChatContext)
  const {
    messages,
    handleJoinRoom,
    handleLeaveRoom: onLeaveRoom,
    handleSendMessage: onSendMessage,
  } = useChat()
  const {
    uiState: deleteRoomUiState,
    handleDeleteRoom,
    handleMakeAdmin,
    isAdmin,
  } = useAdminActions(onLeaveRoom)

  const { push } = useRouter()

  const { userName, roomName } = useSearchParams()

  useEffect(() => {
    if (contextRoomName && !connection) {
      alert('Connection was not found!')
      push(Route.Lobby)
    }
  }, [contextRoomName, connection, push])

  useEffect(() => {
    if (!userName || !roomName || connection || contextRoomName) {
      // alert('Username or room name was not found!')
      // onLeaveRoom()
      // push(Route.Lobby)
      return
    }

    handleJoinRoom(String(userName), String(roomName))

    return () => {
      onLeaveRoom()
    }
  }, [handleJoinRoom, roomName, userName])

  useEffect(() => {
    if (!messageRef.current) return

    // TODO scroll to bottom
    // messageRef.current.scrollTo({
    //   top: messageRef.current.scrollHeight - messageRef.current.clientHeight,
    //   behavior: 'smooth',
    //   left: 0,
    // })
  }, [messages])

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

  return (
    <View>
      <View>
        <Text>Room: {roomName}</Text>
        {renderAdminAction()}
        <Button onPress={onLeaveRoom} title="Leave Room" />
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
          keyExtractor={(user, index) => index.toString()}
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
          <SendMessage onSubmit={onSendMessage} />
        </View>
      </View>
    </View>
  )
}
