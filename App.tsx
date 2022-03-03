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
  REACT_APP_TELLESCOPE_BUSINESS_ID as businessId,
  REACT_APP_TELLESCOPE_API_ENDPOINT as host,
  REACT_APP_EXAMPLE_ENDUSER_EMAIL as enduserEmail,
  REACT_APP_EXAMPLE_ENDUSER_PASSWORD as enduserPassword,
} from "@env" 

import { 
  Flex,
  Logout,
  WithTheme,
  EnduserProvider,
  UserProvider,
  useEnduserSession, 
  WithSession,
  WithEnduserSession,
  UserLogin, 
  EnduserLogin,
  BottomNavigation, 
  Typography,
  useChats, 
  useSession, 
  useChatRooms,
  useResolvedSession, 
} from "@tellescope/react-components"
import { Conversations, Messages, SendMessage, user_display_name } from "@tellescope/chat"


import { ChatRoom, UserDisplayInfo } from '@tellescope/types-client';
import { SessionType } from '@tellescope/types-utilities';

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

const ViewConversation = () => {
  const session = useResolvedSession()
  const [, { updateElement: updateRoom }] = useChatRooms(session.type)
  const [selectedRoom, setSelectedRoom] = useState('')
  const [messages, { createElement: addMessage }] = useChats(selectedRoom, session.type)

  if (selectedRoom) return (
    <Flex column flex={1}>
      <Flex flex={1}>
        <Messages
          messages={messages}
          chatUserId={session.userInfo.id}
        />
      </Flex>
      <Flex style={{ margin: 5 }}>
        <SendMessage roomId={selectedRoom} type={session.type}
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
      <CustomRoomSelect selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} type={session.type} />
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
          Component: ViewConversation,
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

/* Assuming 1-1 user-enduser chat room */
const resolve_chat_room_name = (room: ChatRoom, displayInfo: { [index: string]: UserDisplayInfo }, userType: SessionType, currentUserId: string) => {
  if (room.recentSender !== currentUserId) {
    return user_display_name(displayInfo[room.recentSender ?? ''])
  }
  if (userType === 'user') {
    return user_display_name(displayInfo[room?.enduserIds?.[0] ?? room.creator ?? ''])
  }
  if (userType === 'enduser') {
    console.log(room.recentSender, room.creator, displayInfo[room.creator])
    return user_display_name(displayInfo[room?.userIds?.[0] ?? room.creator ?? ''])
  }
  return ''
}

interface WithSessionType { type: SessionType }
interface RoomSelector { selectedRoom: string, setSelectedRoom: (s: string) => void }
const CustomRoomSelect = ({ type, selectedRoom, setSelectedRoom } : WithSessionType & RoomSelector) => {
  const [loadingRooms] = useChatRooms(type)
  const session = useResolvedSession()

  return (
    <Conversations rooms={loadingRooms} selectedRoom={selectedRoom} onRoomSelect={setSelectedRoom} 
      style={{ backgroundColor: 'white' }}
      PreviewComponent={({ onClick, selected, room, displayInfo }) => (
        <Flex flex={1} column onClick={() => !selected && onClick?.(room)} 
          style={{ 
            padding: 5, 
            cursor: 'pointer',
            backgroundColor: selected ? '#999999' : undefined,
            borderBottom: '1px solid black',
          }}
        >

        {!room.recentMessage &&
          <Typography>New Chat Room</Typography>
        }

        <Typography>
          {resolve_chat_room_name(room, displayInfo, type, session.userInfo.id)}
        </Typography>
  
        <Typography>
          {room.recentMessage ?? room.title}
        </Typography>
        </Flex>
      )
    }
    />
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
          Component: ViewConversation,
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
 