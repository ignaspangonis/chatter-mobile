/* eslint-disable react-native/no-color-literals */
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Image,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native'

import { Route } from '../../../constants/routes'

// TODO fix this, works on runtime
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import backImage from '../../../assets/images/backImage.png'
import Weather from '../../../components/Weather'

export default function LobbyScreen() {
  const [userName, setUserName] = useState('')
  const [roomName, setRoomName] = useState('')

  const isSubmitDisabled = !userName || !roomName

  const router = useRouter()

  const handleUserNameChange = (text: string) => {
    setUserName(text || '')
  }

  const handleRoomNameChange = (text: string) => {
    setRoomName(text || '')
  }

  const handleSubmit = () => {
    if (!userName || !roomName) {
      alert('Please enter a username and room name')
      return
    }

    router.push({
      pathname: Route.Chat,
      params: {
        userName,
        roomName,
      },
    })
  }

  /* TODO implement <Weather /> */
  return (
    <View style={styles.container}>
      <Image source={backImage} style={styles.backImage} />
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Chatter</Text>
        <Weather />
        <TextInput
          style={styles.input}
          value={userName}
          placeholder="Enter username"
          onChangeText={handleUserNameChange}
          autoCapitalize="none"
          autoFocus={true}
          textContentType="username"
        />
        <TextInput
          style={styles.input}
          value={roomName}
          placeholder="Enter room"
          onChangeText={handleRoomNameChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          activeOpacity={0.6}
          disabled={isSubmitDisabled}
        >
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Join</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
    </View>
  )
}

const styles = StyleSheet.create({
  backImage: {
    height: 340,
    position: 'absolute',
    resizeMode: 'cover',
    top: 0,
    width: '100%',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#f57c00',
    borderRadius: 10,
    height: 58,
    justifyContent: 'center',
    marginTop: 40,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  input: {
    backgroundColor: '#F6F7FB',
    borderRadius: 10,
    fontSize: 16,
    height: 58,
    marginBottom: 20,
    padding: 12,
  },
  title: {
    alignSelf: 'center',
    color: 'orange',
    fontSize: 36,
    fontWeight: 'bold',
    paddingBottom: 24,
  },
  whiteSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
    bottom: 0,
    height: '75%',
    position: 'absolute',
    width: '100%',
  },
})
