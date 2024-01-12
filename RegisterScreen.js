import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, SafeAreaView, StatusBar} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from './LoginScreen';
import config from './config';



const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const navigation = useNavigation();

  
    const handleRegister = async () => {
      // Burada API'ye gönderilecek olan verileri kullanarak bir fetch işlemi gerçekleştirilecek.
      // API endpoint ve diğer gerekli bilgileri kendi backend'inize göre düzenlemelisiniz.
  
      const apiUrl = `http://${config.ip}:8000/users/`;
        
      try {
        const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
            email,
            first_name: firstName, // Frontend'de 'firstName' olarak tutulan bilgiyi 'first_name' olarak düzenle
            last_name: lastName,
        }),
      })
      if (response.ok) {
        Alert.alert('Success', 'Profile added successfully!');
        navigation.navigate('Login');
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
        <SafeAreaView style={styles.SafeAreaView}>
        <ScrollView style= {styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
            />
    
            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
    
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
    
            <Text style={styles.label}>First Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={setFirstName}
            />
    
            <Text style={styles.label}>Last Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
    
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
        </SafeAreaView>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      },
      inputContainer: {
        width: '80%',
      },
      label: {
        fontSize: 16,
        marginBottom: 5,
      },
      input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
        borderWidth: 1,  // Çevre çizgisini ekledik
        borderColor: '#ccc',  // Çizgi rengini gri olarak belirledik
      },
      buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      },
      button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
      },
      buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
      },
      scrollView: {
        flex: 1,
      },
      SafeAreaView: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
        borderWidth: 1,  // Çevre çizgisini ekledik
        borderColor: '#ccc',  // Çizgi rengini gri olarak belirledik
        backgroundColor: '#fff',
      }
    });
  
  export default RegisterScreen;
  