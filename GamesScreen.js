import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GamesScreen = ({ games }) => {
  const navigation = useNavigation();

  const handleGamePress = (gameId) => {
    navigation.navigate('RoomsPage', { gameId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gameBox}
      onPress={() => handleGamePress(item.id)}
    >
      <View style={styles.innerContainer}>
        <Image
          style={styles.gameImage}
          source={logoFileNames[item.game_logo] || require('./assets/default.jpg')}
        />
        <View style={styles.textContainer}>
          <Text style={styles.gameName}>{item.game_name}</Text>
          <Text style={styles.gameDescription}>Genre: {item.game_description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const logoFileNames = {
    LOL: require('./assets/lol.jpg'),
    VALO: require('./assets/valo.jpeg'),
    CS2: require('./assets/cs2.jpg'),
    DOTA2: require('./assets/d2.jpg'),
  };

  const styles = StyleSheet.create({
    container: {
      paddingTop: 30,
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      padding: 10,
      backgroundColor: '#fff',
    },
    gameBox: {
      width: '48%',
      marginBottom: 30,
      marginHorizontal: 5,
      borderRadius: 10,
      overflow: 'hidden',
      elevation: 5,
    },
    innerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      width: '100%',
      padding: 10,
    },
    gameImage: {
      width: '100%',
      height: 150,
      resizeMode: 'cover',
      marginBottom: 10,
    },
    gameName: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    gameDescription: {
      fontSize: 12,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
      />
    </View>
  );
};

export default GamesScreen;
