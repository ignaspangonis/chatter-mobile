import { ReactNode, useMemo, useState } from 'react'

import { HubConnection } from '@microsoft/signalr'
import ChatContext from './ChatContext'

type Props = {
  children: ReactNode
}

const ChatProvider = ({ children }: Props) => {
  const [connection, setConnection] = useState<HubConnection | null>(null)
  const [roomName, setRoomName] = useState<string | null>(null)
  const [users, setUsers] = useState<string[]>([])

  const contextValue = useMemo(
    () => ({ connection, setConnection, roomName, setRoomName, users, setUsers }),
    [connection, users, roomName],
  )

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
}

export default ChatProvider
