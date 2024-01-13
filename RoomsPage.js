import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Button,
  Alert,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useAuth } from './AuthContext';
import config from './config';

const RoomsPage = ({ route }) => {
  const { gameId } = route.params;
  const [rooms, setRooms] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // useIsFocused hook'unu ekleyin
  const { accessToken } = useAuth();
  const token = accessToken;
  const [isModalVisible, setModalVisible] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomSize, setRoomSize] = useState('');

  // useCallback kullanarak fonksiyonu memoize edin
  const fetchData = useCallback(() => {
    const apiUrl = `http://${config.ip}:8000/rooms/list?page=1&size=50&sort=id&order=asc&game_id=${gameId}`;

    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(apiData => {
        console.log('API Data:', apiData);
        setRooms(apiData.rooms);
      })
      .catch(error => {
        console.error('Error fetching data:', error.message);
      });
  }, [gameId, token]);

  useEffect(() => {
    fetchData(); // İlk render'da fetch işlemini yap
  }, [fetchData, isFocused]); // isFocused'u dependency array'e ekleyin

  const handleRoomPress = (roomId) => {
    if (navigation && isFocused) {
      navigation.navigate("RoomDetails", { roomId });
    }
  };

  const handleFloatingButtonPress = () => {
    // Bu fonksiyon şu an hiçbir şey yapmıyor, sadece butona basıldığında çağrılıyor.
    // İleride butona bir işlev ekleyebilirsiniz.
  };

  const handleCreateRoomPress = () => {
    // TODO: API'ye POST isteği gönder
    const apiUrl = `http://${config.ip}:8000/rooms/`;
    const requestBody = {
      game_id: gameId,
      room_name: roomName,
      room_size: parseInt(roomSize),
    };
    console.log(requestBody);

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(apiData => {
        console.log('Room created:', apiData);

        // Sadece detail içindeki mesajı alert olarak ekrana yansıt
        if (apiData.detail) {
          alert(apiData.detail);
        } else {
          alert('Room created successfully');
          fetchData();
          const roomId = apiData.id; // API'nin döndüğü ID'yi alın
          navigateToRoomIn(roomId);
        }
      })
      .catch(error => {
        console.error('Error creating room:', error.message);
        // TODO: Hata durumunda isteğe bağlı olarak başka bir işlem yapabilirsiniz
      });

    // Modal'ı kapat
    setModalVisible(false);
};

const navigateToRoomIn = (roomId) => {
  // Bu kısım, React Navigation kullanıyorsanız uygun navigasyon fonksiyonu olacaktır
  navigation.navigate('RoomIn', { roomId });
};

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roomBox}
      onPress={() => handleRoomPress(item.id)}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.roomName}>{item.room_name}</Text>
        <Text style={styles.roomDetails}>Lobby {item.number_of_users}/{item.room_size}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1}}
        data={rooms}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={1}
      />

      {/* Sağ alt köşedeki buton */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      {/* Oda oluşturma modal'ı */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create a Room</Text>
            <TextInput
              style={styles.input}
              placeholder="Room Name"
              value={roomName}
              onChangeText={setRoomName}
            />
            <TextInput
              style={styles.input}
              placeholder="Room Size"
              value={roomSize}
              onChangeText={setRoomSize}
              keyboardType="numeric"
            />
            <Button title="Create" onPress={handleCreateRoomPress} />
            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

  const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
      flex: 1,
      padding: 30,
      backgroundColor: "#fff",
      justifyContent: 'center',
    },
    roomBox: {
      margin: 3,
      borderRadius: 10,
      overflow: "hidden",
      elevation: 10,
      marginBottom: 10,
      width: '98%',
      height: 40, // Set a fixed height
      backgroundColor: '#a2cffe'
    },
    innerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    roomName: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    roomDetails: {
      fontSize: 12,
      textAlign: "center",
    },
    floatingButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#3498db', // İstediğiniz rengi seçebilirsiniz
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
    },
    floatingButtonText: {
      fontSize: 24,
      color: '#fff', // Buton metni rengi
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
    },
  });

export default RoomsPage;
