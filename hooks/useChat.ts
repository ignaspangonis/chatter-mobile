import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useCallback, useContext, useState } from 'react'

import { MessageModel } from '../types/models'
import { ExtendedMessageDto } from '../types/dtos'
import { ChatHubMethod, CHAT_API_URL } from '../constants/connection'
import ChatContext from '../containers/ChatProvider/ChatContext'
import { transformMessage, transformMessages } from '../data/transformers/message'

const useChat = () => {
  const [messages, setMessages] = useState<MessageModel[]>([])
  const { connection, setConnection, setRoomName, setUsers } = useContext(ChatContext)

  async function sendMessage(message: string) {
    if (!connection) return

    try {
      await connection.invoke(ChatHubMethod.SendMessage, message)
    } catch (error) {
      alert(`Failed to send message. ${toFormattedString(error)}`)
    }
  }

  const handleConnectionClosed = useCallback(() => {
    setConnection(null)
    setRoomName(null)
    setUsers([])
    setMessages([])
  }, [setConnection, setRoomName, setUsers, setMessages])

  async function leaveRoom() {
    if (!connection) return

    try {
      await connection.stop()

      handleConnectionClosed()
    } catch (error) {
      alert(`Failed to leave room. ${toFormattedString(error)}`)
    }
  }

  const handleGetMessage = useCallback((message: ExtendedMessageDto) => {
    const transformedMessage = transformMessage(message)

    setMessages(messages => [transformedMessage, ...messages])
  }, [])

  const handleReceiveMessageHistory = useCallback(
    (connection: HubConnection) => (messages: ExtendedMessageDto[]) => {
      const transformedMessages = transformMessages(messages)

      setMessages(messages => [...messages, ...transformedMessages])

      connection.off(ChatHubMethod.ReceiveMessageHistory)
    },
    [],
  )

  const joinRoom = useCallback(
    async (userName: string, roomName: string) => {
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
        newConnection.on(ChatHubMethod.UsersInRoom, (users: string[]) => setUsers(users))
        newConnection.onclose(handleConnectionClosed)

        await newConnection.start()
        await newConnection.invoke(ChatHubMethod.JoinRoom, {
          UserName: userName,
          RoomName: roomName,
        })

        setConnection(newConnection)
        setRoomName(roomName)
      } catch (error) {
        alert(`Failed to join room. ${toFormattedString(error)}`)
      }
    },
    [
      handleReceiveMessageHistory,
      handleConnectionClosed,
      handleGetMessage,
      setConnection,
      setRoomName,
      setUsers,
    ],
  )

  return {
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
  }
}

export default useChat
