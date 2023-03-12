import React, { ForwardedRef, forwardRef } from 'react'
import { Pressable, PressableProps, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'

import useColors from '../../hooks/useColors'

const InfoIcon = forwardRef((props: PressableProps, ref: ForwardedRef<View> | undefined) => {
  const colors = useColors()

  return (
    <Pressable ref={ref} {...props}>
      {({ pressed }) => (
        <FontAwesome
          name="info-circle"
          size={25}
          color={colors.text}
          style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
        />
      )}
    </Pressable>
  )
})

export default InfoIcon
