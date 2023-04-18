import { StyleSheet } from 'react-native'
import React from 'react'

import { Text, View } from '../../components/Themed'

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODO</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.description}>TODO</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    marginVertical: 30,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})
