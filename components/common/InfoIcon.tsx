import React, { ForwardedRef, forwardRef } from 'react'
import { Pressable, PressableProps, useColorScheme, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'

import Colors from '../../constants/Colors'

const InfoIcon = forwardRef((props: PressableProps, ref: ForwardedRef<View> | undefined) => {
  const colorScheme = useColorScheme()

  return (
    <Pressable ref={ref} {...props}>
      {({ pressed }) => (
        <FontAwesome
          name="info-circle"
          size={25}
          color={Colors[colorScheme ?? 'light'].text}
          style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
        />
      )}
    </Pressable>
  )
})

export default InfoIcon
