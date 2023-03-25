import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Button, StyleSheet, TextInput, Text, View, SafeAreaView } from 'react-native'

import { Route } from '../../../constants/routes'

export default function LobbyScreen() {
  const [userName, setUserName] = useState('')
  const [roomName, setRoomName] = useState('')

  const router = useRouter()

  const handleUserNameChange = (text: string) => {
    setUserName(text || '')
  }

  const handleRoomNameChange = (text: string) => {
    setRoomName(text || '')
  }

  console.log(userName, roomName)

  const handleSubmit = () => {
    if (!userName || !roomName) {
      alert('Please enter a username and room name')
      return
    }

    /* TODO implement <Weather /> */
    router.push({
      pathname: Route.Chat,
      params: {
        userName,
        roomName,
      },
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Username</Text>
        <TextInput
          value={userName}
          placeholder="Enter username"
          onChangeText={handleUserNameChange}
        />
      </View>
      <View>
        <Text>Room</Text>
        <TextInput value={roomName} placeholder="Enter room" onChangeText={handleRoomNameChange} />
      </View>
      <Button disabled={!userName || !roomName} title="Join" onPress={handleSubmit} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 10,
    justifyContent: 'center',
  },
})
