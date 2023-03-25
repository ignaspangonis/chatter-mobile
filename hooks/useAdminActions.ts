import { useRouter, useSearchParams } from 'expo-router'
import { useState } from 'react'

import { UiState } from '../types/ui'
import { deleteMessageRoom } from '../data/api'

const useAdminActions = (handleLeaveRoom: () => void, roomName: string | null) => {
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
