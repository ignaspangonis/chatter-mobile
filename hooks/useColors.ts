import { useColorScheme } from 'react-native'

import Colors from '../constants/Colors'

export default function useColors() {
  const colorScheme = useColorScheme()

  return Colors[colorScheme ?? 'light']
}
