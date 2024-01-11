import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import GamesScreen from './GamesScreen';
import ProfileScreen from './ProfileScreen';
import AddProfileScreen from './AddProfileScreen';
import RoomsPage from './RoomsPage';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthProvider } from './AuthContext';
import { useAuth } from './AuthContext';
import RoomDetails from './RoomDetails';
import ChatScreen from './ChatScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const GamesStack = ({ games }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="  "
        options={{
          
        }}
      >
        {() => <GamesScreen games={games} />}
      </Stack.Screen>
      <Stack.Screen name="RoomsPage" component={RoomsPage} options={{ title: 'Rooms' }} />
      <Stack.Screen name="RoomDetails" component={RoomDetails} options={{ title: 'RoomDetails' }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Chat' }} />
    </Stack.Navigator>
  );
};

const App = () => {
  const [games, setGames] = useState([]);
  const { accessToken, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      fetchGames();
    }
  }, [isLoggedIn]);

  const fetchGames = async () => {
    try {
      const apiUrl = 'http://192.168.90.49:8000/games/';

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const apiData = await response.json();
      console.log('API Data:', apiData);
      setGames(apiData.games);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Login"
        screenOptions={{
          
          tabBarShowLabel: true,
          tabBarIconStyle: {
          justifyContent: "center",
          alignItems: "center"
          },
          tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center"
          },
          tabBarStyle: [
          {
          display: "flex"
          },
          null
        ]
        }}
      >
        <Tab.Screen
          name="Login"
          component={LoginScreen}
          options={{
            tabBarButton: () => null,
            tabBarStyle: { display: "none" }
          }} />
          <Tab.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            tabBarButton: () => null,
            tabBarStyle: { display: "none" }
          }} />
        <Tab.Screen
          name="Profile"
            component={ProfileScreen}
            options={{
            tabBarIcon: ({ color, size }) => (
      <Icon name="user" size={30} color={color} />
    ),
            
            headerTitle: () => (
              <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#000000' }}>
                Profile
              </Text>
            ),
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#fff', // Adjust the background color as needed
            },
          }}
        />
        <Tab.Screen
          name="GamesList"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="gamepad" size={30} color={color} />
            ),
            headerTitle: () => (
              <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#000000' }}>
                Games
              </Text>
            ),
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#fff', // Adjust the background color as needed
            },
          }}
        >
          {() => <GamesStack games={games} />}
        </Tab.Screen>
        <Tab.Screen
          name="AddProfileScreen"
          component={AddProfileScreen}
          options={{
            tabBarButton: () => null, 
          }} 
          />
      </Tab.Navigator> 
    </NavigationContainer>
  );
};

const styles = {
  shadow: {
    shadowColor: '#7f5df0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
