import { Stack } from 'expo-router'
import React from 'react'

import ChatProvider from '../../../containers/ChatProvider/ChatProvider'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure any route can link back to `/lobby`
  initialRouteName: 'lobby',
}

export default function RootLayout() {
  return (
    <ChatProvider>
      <Stack>
        <Stack.Screen name="lobby" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ presentation: 'modal' }} />
      </Stack>
    </ChatProvider>
  )
}
