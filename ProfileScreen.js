import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import config from './config';

const ProfileScreen = ({ navigation, route }) => {
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleAddProfilePress = () => {
    navigation.navigate('AddProfileScreen');
  };
  const { token } = route.params;

  const fetchData = useCallback(() => {
    // Fetch user data
    fetch(`http://${config.ip}:8000/users/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    // Fetch profile data
    fetch(`http://${config.ip}:8000/profiles/?page=1&size=50&sort=id&order=asc`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Profile data:", data);
        setProfileData(data);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      })
      .finally(() => {
        setRefreshing(false); // Yenileme işlemi tamamlandığında refreshing durumunu false yapın
      });
  }, [token]);

  const onRefresh = () => {
    setRefreshing(true); // Yenileme işlemi başladığında refreshing durumunu true yapın
    fetchData(); // Verileri tekrar getirin
  };

  useEffect(() => {
    fetchData(); // İlk render'da verileri getirin
  }, [fetchData]);

  const logoFileNames = {
    LOL: require('./assets/lol.jpg'),
    VALO: require('./assets/valo.jpeg'),
    CS2: require('./assets/cs2.jpg'),
    DOTA2: require('./assets/d2.jpg'),
  };

  const handleDeleteProfile = (profileId) => {
    // API'ye DELETE isteği gönder
    fetch(`http://${config.ip}:8000/profiles/${profileId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // Başarılı bir şekilde silindi, profil listesini güncelle
          setProfileData((prevData) => ({
            ...prevData,
            profiles: prevData.profiles.filter((profile) => profile.id !== profileId),
          }));
        } else {
          console.error("Error deleting profile:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error deleting profile:", error);
      });
  };
  

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
    <View style={styles.container}>
      <View style={[styles.sectionContainer, { marginTop: 20 }]}>
        <Text style={styles.sectionTitle}> About Me</Text>

        {userData ? (
          <View style={styles.infoBox}>
            <ImageBackground
              source={require('./assets/p2g.png')}
              style={styles.infoBackground}
              imageStyle={{ opacity: 0.5 }}
            >
              <View style={styles.infoContent}>
                <Text style={styles.infoText}>Username: {userData.username}</Text>
                <Text style={styles.infoText}>Email: {userData.email}</Text>
                <Text style={styles.infoText}>First Name: {userData.first_name}</Text>
                <Text style={styles.infoText}>Last Name: {userData.last_name}</Text>
              </View>
            </ImageBackground>
          </View>
        ) : (
          <Text>Loading user data...</Text>
        )}
      </View>

      <View style={[styles.sectionContainer, { marginTop: 20 }]}>
        <Text style={styles.sectionTitle}> My Games</Text>
        {profileData && Array.isArray(profileData.profiles) ? (
  profileData.profiles.map((profileItem) => (
    <View key={profileItem.id}>
      <ImageBackground
        source={logoFileNames[profileItem.game.game_logo]}
        style={[styles.gameBox, { marginTop: 10 }]}
      >
        <View style={styles.gameContent}>
          <Text style={styles.boldText}>Game: {profileItem.game.game_name}</Text>
          <Text style={styles.boldText}>Nickname: {profileItem.user_nickname}</Text>
          <Text style={styles.boldText}>Rank: {profileItem.user_rank}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteProfile(profileItem.id)}
        >
          <Icon name="minus-circle" style={styles.buttonIcon} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  ))
) : (
  <Text>Loading profile data...</Text>
)}
      </View>

      {/* + butonu */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddProfilePress}>
        <Icon name="plus-circle" style={styles.buttonIcon} />
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#a2cffe",
    borderRadius:5,
  },
  gamesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gameBox: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  gameContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Set the background color for the text container
    padding: 10,
    borderRadius: 10,
  },
  aboutMeImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    padding: 20,
 
  },
  infoBox: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
 
  },
  infoContent: {
    padding: 20, // Ayarlayabilirsiniz

  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000', // veya istediğiniz renk
  },
  boldText: {
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    color: '#fff',
    fontSize: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
});

export default ProfileScreen;
