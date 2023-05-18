import React, { useState } from 'react'
import { Button, TextInput, View } from 'react-native'

type Props = {
  onSubmit: (message: string) => void
}

/**
 * @description This is a component that allows the user to send a message to the chat
 * @deprecated This component is deprecated and will be removed
 * @param param0
 * @returns
 */
export default function SendMessage({ onSubmit }: Props) {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (!message) return

    onSubmit(message)
    setMessage('')
  }

  const handleMessageInput = (text: string) => {
    setMessage(text)
  }

  return (
    <View>
      <TextInput
        value={message}
        placeholder="Aa"
        onChangeText={handleMessageInput}
        multiline
        numberOfLines={2}
      />
      <View>
        <Button disabled={!message} onPress={handleSubmit} title="Send" />
      </View>
    </View>
  )
}
