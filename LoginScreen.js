import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileScreen from './ProfileScreen';
import { useAuth } from './AuthContext';
import config from './config';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation(); // Get the navigation object
    const { login } = useAuth();
  
    const handleLogin = async () => {
      try {
        const response = await fetch(`http://${config.ip}:8000/auth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });
  
        if (response.ok) {
          const { access_token } = await response.json();
          login(access_token);
          navigation.navigate('Profile', { token: access_token }); 
        } else {
          Alert.alert('Hata', 'Kullanıcı adı veya şifre yanlış.');
        }
      } catch (error) {
        console.error('Login Error:', error);
        Alert.alert('Hata', 'Bir hata oluştu, lütfen tekrar deneyin.');
      }
    };

  const handleRegister = () => {
    navigation.navigate('Register');
  };
    

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/p2g.png')}
        style={styles.imageType}
      />
    <View style={styles.inputContainer}>
      <Text>Kullanıcı Adı</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={(text) => setUsername(text)}
        placeholder="Username"
      />

      <Text>Şifre</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        placeholder="Password"
      />
    </View>

    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline} onPress={handleRegister}>
        <Text style={styles.buttonOutlineText}>Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  inputContainer: {
    width: "80%",
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
    width: "60%",
    flexDirection: "column", // Butonları dikey olarak hizala
    alignItems: "center", // Butonları ortala
    marginTop: 20,
  },
  button: {
    backgroundColor: "#0782F9",
    width: 200, // Sabit genişlik
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonOutline: {
    backgroundColor: "white",
    width: 200, // Sabit genişlik
    marginTop: 10,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    alignSelf: 'center',
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  imageType: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '30%',  // Tamamını kaplayacak şekilde değiştirildi
    resizeMode: 'contain',
    alignSelf: 'center',  // Yatayda ortalamayı sağlar
  }
});

export default LoginScreen;
