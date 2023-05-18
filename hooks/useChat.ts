import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useCallback, useEffect, useState } from 'react'

import { MessageModel } from '../types/models'
import { ExtendedMessageDto } from '../types/dtos'
import { ChatHubMethod, CHAT_API_URL } from '../constants/connection'
import { transformMessage, transformMessages } from '../data/transformers/message'
import { toFormattedString } from 'libs/utils/string'

const useChat = (userName: string | null, roomName: string | null) => {
  const [messages, setMessages] = useState<MessageModel[]>([])
  const [connection, setConnection] = useState<HubConnection>()
  const [users, setUsers] = useState<string[]>([])

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
      console.error('Failed to leave room', error)
    }

    handleConnectionClosed()
  }, [handleConnectionClosed, connection])

  const createConnection = useCallback(() => {
    try {
      const newConnection = new HubConnectionBuilder()
        .withUrl(CHAT_API_URL)
        .configureLogging(LogLevel.Information)
        .build()

      newConnection.on(ChatHubMethod.ReceiveMessageHistory, (newMessages: ExtendedMessageDto[]) => {
        setMessages(transformMessages(newMessages))
      })
      newConnection.on(ChatHubMethod.ReceiveMessage, (message: ExtendedMessageDto) =>
        setMessages(previous => [...previous, transformMessage(message)]),
      )
      newConnection.on(ChatHubMethod.UsersInRoom, (users: string[]) => setUsers(users))
      newConnection.onclose(handleConnectionClosed)

      return newConnection
    } catch (error) {
      console.error('Failed to create a connection', error)
    }
  }, [handleConnectionClosed])

  useEffect(() => {
    if (!userName || !roomName) return

    const newConnection = createConnection()

    if (!newConnection) return

    newConnection.start().then(() =>
      newConnection.invoke(ChatHubMethod.JoinRoom, {
        UserName: userName,
        RoomName: roomName,
      }),
    )

    setConnection(newConnection)

    return () => {
      newConnection.stop().catch(error => console.error('Failed to stop connection', error))
    }
  }, [roomName, userName, createConnection])

  const sendMessage = useCallback(
    async (message: string) => {
      if (!connection) return

      try {
        await connection.invoke(ChatHubMethod.SendMessage, message)
      } catch (error) {
        alert(`Failed to send message. ${toFormattedString(error)}`)
      }
    },
    [connection],
  )

  return {
    users,
    messages,
    leaveRoom,
    sendMessage,
  }
}

export default useChat
