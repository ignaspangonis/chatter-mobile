import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link, Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import InfoIcon from '../../components/common/InfoIcon'

import Colors from '../../constants/Colors'

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chatter',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <InfoIcon />
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  )
}
