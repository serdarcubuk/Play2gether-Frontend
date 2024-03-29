import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,FlatList, TouchableOpacity, Alert, TextInput, ScrollView, BackHandler } from 'react-native';
import { useAuth } from './AuthContext';
import { useNavigation} from '@react-navigation/native';
import ChatScreen from './ChatScreen';
import config from './config';

const RoomDetails = ({ route }) => {
  const { roomId } = route.params;
  const [roomDetails, setRoomDetails] = useState(null);
  const { accessToken, username } = useAuth();
  const [showChatButton, setShowChatButton] = useState(false);
  const token = accessToken;
  const navigation = useNavigation();
  const [joinButtonVisible, setJoinButtonVisible] = useState(true);
  const [leaveButtonVisible, setLeaveButtonVisible] = useState(false);

  const fetchData = async () => {
    try {
      const apiUrl = `http://${config.ip}:8000/rooms/look/${roomId}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const apiData = await response.json();

      if (response.ok) {
        setRoomDetails(apiData);
      } 
      else if(response.status==404) {
        Alert.alert('Room is Closed');
        navigation.goBack();
      }  
      else {
        const errorMessage = joinData.error || JSON.stringify(joinData);
        Alert.alert('Error Joining Room', errorMessage);
      }
    } catch (error) {
      console.error('Error fetching room details:', error.message);
    }
  };

  const handleChatButtonPress = () => {
    navigation.navigate('ChatScreen', { roomId, username });
  };

  const handleJoinRoom = async () => {
    try {
      const joinApiUrl = `http://${config.ip}:8000/rooms/join/${roomId}`;

      const joinResponse = await fetch(joinApiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const joinData = await joinResponse.json();

      if (joinResponse.ok) {
        Alert.alert('Joined Successfully!');
        fetchData();
        setShowChatButton(true);
        setJoinButtonVisible(false);
        setLeaveButtonVisible(true);
        navigation.setOptions({
          headerLeft: null,
        });
      } else {
        const errorMessage = joinData.error || JSON.stringify(joinData);
        Alert.alert('Error Joining Room', errorMessage);
      }

      console.log('Room Join API Response:', joinData);
    } catch (error) {
      console.error('Error joining room:', error.message);
    }
  };

  const handleLeaveRoom = async () => {
    try {
      const leaveApiUrl = `http://${config.ip}:8000/rooms/`;

      const leaveResponse = await fetch(leaveApiUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (leaveResponse.ok) {
        fetchData();
        Alert.alert('Left Successfully!');
        navigation.goBack();
      } else {
        let errorMessage = 'Error Leaving Room';
        try {
          const leaveData = await leaveResponse.json();
          errorMessage = leaveData.error || JSON.stringify(leaveData);
        } catch (error) {
          // Ignore JSON parsing errors if the response is not in JSON format
        }
        Alert.alert('Error leaving Room:', errorMessage);
      }
    } catch (error) {
      console.error('Error leaving room:', error.message);
    }
  };

  const onChange = () => {
    fetchData();
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleLeaveRoom();
      return false;
    });

    return () => {
      backHandler.remove();
    };
  }, []); 

  useEffect(() => {
    fetchData();
  }, [roomId, token]);

  useEffect(() => {
    const fetchDataInterval = setInterval(() => {
      fetchData();
    }, 2000); // gerçi gösterdim galiba
  
    // Cleanup function to clear the interval when the component is unmounted
    return () => {
      clearInterval(fetchDataInterval);
    };
  }, [roomId, token]);

  if (!roomDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} onChange={onChange}>
      <Text style={styles.roomName}>{roomDetails.room_name}</Text>
      <Text style={styles.roomDetails}>
        Lobby {roomDetails.number_of_users}/{roomDetails.room_size}
      </Text>

      <FlatList
        data={roomDetails.user_profiles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <Text style={styles.userName}>Nickname: {item.user_nickname}</Text>
            <Text style={styles.userRank}>Rank: {item.user_rank}</Text>
          </View>
        )}
      />

      {showChatButton && (
        <TouchableOpacity style={styles.chatButton} onPress={handleChatButtonPress}>
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
      )}

      <View style={styles.buttonContainer}>
      {joinButtonVisible && (
        <TouchableOpacity style={styles.joinButton} onPress={handleJoinRoom}>
          <Text style={styles.buttonText}>Join Room</Text>
        </TouchableOpacity>
      )}

      {leaveButtonVisible && (
        <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveRoom}>
          <Text style={styles.buttonText}>Leave Room</Text>
        </TouchableOpacity>
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',  // Updated from 'center'
  alignItems: 'center',
  backgroundColor:'white',
  },
  roomName: {
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: '#a2cffe',
    fontWeight: 'bold',
    marginBottom: 10,
    borderWidth:1,
    borderRadius:8,
    width: '98%',
    marginTop:10,
  },
  roomDetails: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor:'#98FB98',
    borderWidth: 1,
    borderRadius: 20,
    width: '35%',
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 15,
    marginBottom: 10,
    width: '80%',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userRank: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  joinButton: {
    backgroundColor: '#2ecc71', // Green color for "Join Room" button
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    flex: 1, // Take equal space in the container
    marginRight: 5, // Add some margin between buttons
  },
  leaveButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    flex: 1, // Take equal space in the container
    marginLeft: 5, // Add some margin between buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  chatButton: {
    backgroundColor: '#3498db', // Blue color for "Chat" button
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
  },
});

export default RoomDetails;