import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRoute } from '@react-navigation/native';
import { useAuth } from './AuthContext';

const data = [
  { label: 'League Of Legends', value: '1' },
  { label: 'Counter Strike 2', value: '2' },
  { label: 'Valorant', value: '3' },
  { label: 'DOTA2', value: '4' },
];

const AddProfileScreen = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [textInput1, setTextInput1] = useState('');
  const [textInput2, setTextInput2] = useState('');
  const [profileList, setProfileList] = useState([]);
  const { accessToken } = useAuth();
  

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Choose A Game
        </Text>
      );
    }
    return null;
  };

  const handleAddProfile = async () => {
    const apiUrl = 'http://192.168.90.49:8000/profiles/';

    try {
      const token = accessToken; // Replace with your actual Bearer token

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          game_id: value,
          user_nickname: textInput1,
          user_rank: textInput2,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Profile added successfully!');
      } else {
        Alert.alert('Error', 'Failed to add profile. Please try again.');
      }
    } catch (error) {
      console.error('Error adding profile:', error);
      console.log('Server response:', await error.response.json());
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select item' : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? 'blue' : 'black'}
            name="Safety"
            size={20}
          />
        )}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Enter nickname"
        value={textInput1}
        onChangeText={setTextInput1}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Enter rank"
        value={textInput2}
        onChangeText={setTextInput2}
      />
      <Button title="Add Profile" onPress={handleAddProfile} />

      {/* Profil listesini ekrana yazdırma */}
      {profileList.map(profile => (
        <Text key={profile.id}>{profile.user_nickname} - {profile.user_rank}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 16,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 16,
  },
});

export default AddProfileScreen;
