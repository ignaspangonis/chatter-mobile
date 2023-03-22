import { useRouter, useSearchParams } from 'expo-router'
import { useContext, useState } from 'react'

import ChatContext from '../containers/ChatProvider/ChatContext'
import { UiState } from '../types/ui'
import { deleteMessageRoom } from '../data/api'

const useAdminActions = (handleLeaveRoom: () => void) => {
  const { roomName } = useContext(ChatContext)
  const [uiState, setUiState] = useState<UiState>('idle')

  const { setParams } = useRouter()
  const { admin } = useSearchParams()
  const isAdmin = admin === 'true'

  const handleDeleteRoom = async () => {
    if (!roomName) return

    setUiState('loading')

    const response = await deleteMessageRoom(roomName)

    if ('error' in response) {
      setUiState('error')
      alert(`Failed to delete room: ${response.error}`)
      return
    }

    setUiState('idle')

    alert('Room deleted successfully')
    handleLeaveRoom()
  }

  const handleMakeAdmin = () => setParams({ admin: 'true' })

  return {
    uiState,
    handleDeleteRoom,
    handleMakeAdmin,
    isAdmin,
  }
}

export default useAdminActions
