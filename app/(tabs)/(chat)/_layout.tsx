import { Stack } from 'expo-router'
import React from 'react'

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
    <Stack>
      <Stack.Screen name="lobby" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ presentation: 'modal' }} />
    </Stack>
  )
}
