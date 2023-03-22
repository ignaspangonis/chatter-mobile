import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useRouter } from 'expo-router'
import { useContext, useState } from 'react'

import { MessageModel } from '../types/models'
import { ExtendedMessageDto } from '../types/dtos'
import { ChatHubMethod, CHAT_API_URL } from '../constants/connection'
import ChatContext from '../containers/ChatProvider/ChatContext'
import { Route } from '../constants/routes'
import { transformMessage, transformMessages } from '../data/transformers/message'

const useChat = () => {
  const [messages, setMessages] = useState<MessageModel[]>([])
  const { connection, setConnection, setRoomName, setUsers } = useContext(ChatContext)

  const router = useRouter()

  async function handleSendMessage(message: string) {
    if (!connection) return

    try {
      await connection.invoke(ChatHubMethod.SendMessage, message)
    } catch (error) {
      console.log(error)
      alert('Failed to send message')
    }
  }

  function handleConnectionClosed() {
    setConnection(null)
    setRoomName(null)
    setUsers([])
    setMessages([])

    router.push(Route.Lobby)
  }

  function handleConnectionOpened(newConnection: HubConnection, roomName: string) {
    setConnection(newConnection)
    setRoomName(roomName)

    router.push(Route.Chat)
  }

  function handleGetUsersInRoom(users: string[]) {
    setUsers(users)
  }

  const handleReceiveMessageHistory =
    (connection: HubConnection) => (messages: ExtendedMessageDto[]) => {
      const transformedMessages = transformMessages(messages)

      setMessages(messages => [...messages, ...transformedMessages])

      connection.off(ChatHubMethod.ReceiveMessageHistory)
    }

  function handleGetMessage(message: ExtendedMessageDto) {
    const transformedMessage = transformMessage(message)

    setMessages(messages => [transformedMessage, ...messages])
  }

  async function handleLeaveRoom() {
    if (!connection) return

    try {
      await connection.stop()

      handleConnectionClosed()
    } catch (error) {
      console.log(error)
      alert('Failed to leave room')
    }
  }

  async function handleJoinRoom(userName: string, roomName: string) {
    try {
      const newConnection = new HubConnectionBuilder()
        .withUrl(CHAT_API_URL)
        .configureLogging(LogLevel.Information)
        .build()

      newConnection.on(
        ChatHubMethod.ReceiveMessageHistory,
        handleReceiveMessageHistory(newConnection),
      )
      newConnection.on(ChatHubMethod.ReceiveMessage, handleGetMessage)
      newConnection.on(ChatHubMethod.UsersInRoom, handleGetUsersInRoom)
      newConnection.onclose(handleConnectionClosed)

      await newConnection.start()
      await newConnection.invoke(ChatHubMethod.JoinRoom, {
        UserName: userName,
        RoomName: roomName,
      })

      handleConnectionOpened(newConnection, roomName)
    } catch (error) {
      console.log(error)
      alert('Failed to join room')
    }
  }

  return {
    messages,
    handleJoinRoom,
    handleLeaveRoom,
    handleSendMessage,
  }
}

export default useChat
