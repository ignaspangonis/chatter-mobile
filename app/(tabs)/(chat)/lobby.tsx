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
    if (!userName || !roomName) return

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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
