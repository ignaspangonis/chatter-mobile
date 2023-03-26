import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useCallback, useEffect, useState } from 'react'

import { MessageModel } from '../types/models'
import { ExtendedMessageDto } from '../types/dtos'
import { ChatHubMethod, CHAT_API_URL } from '../constants/connection'

import { transformMessage, transformMessages } from '../data/transformers/message'

const useChat = (userName: string | null, roomName: string | null) => {
  const [messages, setMessages] = useState<MessageModel[]>([])
  const [connection, setConnection] = useState<HubConnection>()
  const [users, setUsers] = useState<string[]>([])

  async function sendMessage(message: string) {
    if (!connection) return

    try {
      await connection.invoke(ChatHubMethod.SendMessage, message)
    } catch (error) {
      alert(`Failed to send message. ${toFormattedString(error)}`)
    }
  }

  const handleConnectionClosed = useCallback(() => {
    setConnection(undefined)
    setUsers([])
    setMessages([])
  }, [])

  const leaveRoom = useCallback(async () => {
    if (!connection) return

    try {
      await connection.stop()
    } catch (error) {
      alert(`Failed to leave room. ${toFormattedString(error)}`)
    }

    handleConnectionClosed()
  }, [handleConnectionClosed, connection])

  const handleGetMessage = useCallback((message: ExtendedMessageDto) => {
    const transformedMessage = transformMessage(message)

    setMessages(messages => [...messages, transformedMessage])
  }, [])

  const handleReceiveMessageHistory = useCallback(
    (connection: HubConnection) => (messages: ExtendedMessageDto[]) => {
      console.log('received message history', messages)

      const transformedMessages = transformMessages(messages)

      setMessages(messages => [...messages, ...transformedMessages])

      connection.off(ChatHubMethod.ReceiveMessageHistory)
    },
    [],
  )

  const createConnection = useCallback(
    (userName: string, roomName: string) => {
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

        console.log(
          'joining room',
          roomName,
          userName,
          `connection id: ${newConnection.connectionId}`,
        )

        return newConnection
      } catch (error) {
        alert(`Failed to join room. ${toFormattedString(error)}`)
      }
    },
    [handleReceiveMessageHistory, handleConnectionClosed, handleGetMessage],
  )

  useEffect(() => {
    // TODO anksciau buvo if connection, bet dabar nebe
    if (!userName || !roomName) {
      return
    }

    const newConnection = createConnection(String(userName), String(roomName))

    newConnection?.start().then(() =>
      newConnection.invoke(ChatHubMethod.JoinRoom, {
        UserName: userName,
        RoomName: roomName,
      }),
    )

    setConnection(newConnection)

    return () => {
      try {
        newConnection?.stop()
      } catch (error) {
        alert(`Failed to stop connection. ${toFormattedString(error)}`)
      }
    }
  }, [roomName, userName, createConnection, leaveRoom])

  return {
    users,
    messages,
    joinRoom: createConnection,
    leaveRoom,
    sendMessage,
  }
}

export default useChat
