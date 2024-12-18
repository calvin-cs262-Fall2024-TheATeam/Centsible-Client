import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';

export default function LoginScreen({ route, navigation }) {
  const { setIsLoggedIn } = route.params; // Get the setter for login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Basic login simulation (replace with actual login logic)
    if ((email === 'user@example.com' && password === 'password') || (email === '' && password === '')) {
      setIsLoggedIn(true);
    } else {
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>

      {/* <ImageViewer placeholderImageSource={logo}/> */}
      
      <Text style={styles.title}>Centsible</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title={isLoading ? 'Logging in...' : 'Login'} onPress={handleLogin} />

      {/* Link to Create Account Screen */}
      <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={styles.createAccountText}>Don't have an account? Create one</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#231942',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 18,
  },
  createAccountText: {
    color: '#231942',
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
