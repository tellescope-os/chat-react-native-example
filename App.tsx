/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import {
   SafeAreaView,
   Text,
} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { GestureHandlerRootView } from "react-native-gesture-handler"
 
import { 
  Flex,
  Logout,
  WithTheme,
} from "@tellescope/react-components"
import {
  useSession, 
  useEnduserSession, 
  WithSession,
  WithEnduserSession,
  UserLogin, 
  EnduserLogin, 
} from "@tellescope/react-components/lib/esm/authentication"
import { EnduserProvider } from "@tellescope/react-components/lib/esm/enduser_state"
import { UserProvider } from "@tellescope/react-components/lib/esm/user_state"
import { useChats, useChatRooms } from "@tellescope/react-components/lib/esm/state"
import { BottomNavigation } from "@tellescope/react-components/lib/esm/mui"
import { EndusersConversations, Messages, SendMessage } from "@tellescope/chat/lib/esm/chat"

import {
  REACT_APP_TELLESCOPE_BUSINESS_ID as businessId,
  REACT_APP_TELLESCOPE_API_ENDPOINT as host,
  REACT_APP_EXAMPLE_ENDUSER_EMAIL as enduserEmail,
  REACT_APP_EXAMPLE_ENDUSER_PASSWORD as enduserPassword,
} from "@env"

if (!businessId) {
  console.log(businessId)
  console.error('No businessId set. Enduser authentication will not work.')
  process.exit()
}

const Stack = createStackNavigator();
 
const Routes = {
  Home: undefined,
  User: undefined,
  Enduser: undefined,
}
type ViewType = '' | 'user' | 'enduser'
const App = () => { 
  return (
    <WithTheme>
    <GestureHandlerRootView style={{ minHeight: '100%' }}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Select User">
        <Stack.Screen name="Select User" component={Selector}/>
        <Stack.Screen name="User" component={UserAppRouter}/>
        <Stack.Screen name="Enduser" component={EnduserAppRouter}/>
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
    </WithTheme>
  );
};

const Selector = () => {
  const navigation = useNavigation<StackNavigationProp<typeof Routes>>()
  return (
    <SafeAreaView style={{ minHeight: '100%' }}>
      <Flex column flex={1}>
        <Flex flex={1} onClick={() => navigation.navigate('User')} style={{ backgroundColor: 'azure' }}> 
          <Text>User App</Text>
        </Flex>

        <Flex flex={1} onClick={() => navigation.navigate('Enduser')} style={{ backgroundColor: 'pink' }} > 
          <Text>Enduser App</Text>
        </Flex>
      </Flex>
    </SafeAreaView>
  )
}

const SelectEnduserConversation = () => {
  const session = useEnduserSession()
  const [, { updateElement: updateRoom }] = useChatRooms('enduser')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [messages, { createElement: addMessage }] = useChats(selectedRoom, 'enduser')

  if (selectedRoom) return (
    <Flex column flex={1}>
      <Flex flex={1}>
        <Messages
          messages={messages}
          chatUserId={session.userInfo.id}
        />
      </Flex>
      <Flex style={{ margin: 5 }}>
        <SendMessage type="enduser" roomId={selectedRoom}
          onNewMessage={m => { 
            addMessage(m)
            updateRoom(selectedRoom, { recentMessage: m.message, recentSender: m.senderId ?? '' })
          }}
        /> 
      </Flex>
    </Flex>
  )

  return (
    <Flex flex={1}>
      <EndusersConversations 
        enduserId={session.userInfo.id}
        selectedRoom={selectedRoom}
        onRoomSelect={setSelectedRoom}
      />
    </Flex>
  )
}

const EnduserApp = () => {
  const session = useEnduserSession()

  if (!session.authToken) return (
    <EnduserLogin fillEmail={enduserEmail} fillPassword={enduserPassword}/>
  )

  return (
    <BottomNavigation
      routes={[
        {
          key: 'chat',
          title: "Chat",
          icon: 'chat',
          Component: SelectEnduserConversation,
        },
        {
          key: 'logout',
          title: "Logout",
          icon: 'logout',
          Component: Logout,
        }
      ]} 
    />
  )
}
 
const EnduserAppRouter = () => {
  return (
    <WithEnduserSession sessionOptions={{ host, businessId }}>
    <EnduserProvider>
      <Stack.Navigator initialRouteName="EnduserHome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="EnduserHome" component={EnduserApp} />
        <Stack.Screen name="EnduserChat" component={EnduserApp} />
      </Stack.Navigator>
    </EnduserProvider>
    </WithEnduserSession>
  )
}

const SelectUserConversation = () => {
  const session = useSession()
  const [, { updateElement: updateRoom }] = useChatRooms('enduser')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [messages, { createElement: addMessage }] = useChats(selectedRoom, 'enduser')

  if (selectedRoom) return (
    <Flex column flex={1}>
      <Flex>
        <Messages
          messages={messages}
          chatUserId={session.userInfo.id}
        />
      </Flex>
      <Flex style={{ marginRight: 5, marginLeft: 5 }}>
        <SendMessage type="user" roomId={selectedRoom}
          onNewMessage={m => { 
            addMessage(m)
            updateRoom(selectedRoom, { recentMessage: m.message, recentSender: m.senderId ?? '' })
          }}
        /> 
      </Flex>
    </Flex>
  )

  return (
    <Flex flex={1}>
      <EndusersConversations 
        enduserId={session.userInfo.id}
        selectedRoom={selectedRoom}
        onRoomSelect={setSelectedRoom}
      />
    </Flex>
  )
}

const UserApp = () => {
  const session = useSession()

  if (!session.authToken) return <UserLogin/>
  return (
    <BottomNavigation
      routes={[
        {
          key: 'chat',
          title: "Chat",
          icon: 'chat',
          Component: SelectUserConversation,
        },
        {
          key: 'logout',
          title: "Logout",
          icon: 'logout',
          Component: Logout,
        }
      ]} 
    />
  )
}
 
const UserAppRouter = () => {
  return (
    <WithSession sessionOptions={{ host }}>
    <UserProvider>
      <Stack.Navigator initialRouteName="UserHome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="UserHome" component={UserApp} />
      </Stack.Navigator>
    </UserProvider>
    </WithSession>
  )
}

 
 export default App;
 