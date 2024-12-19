import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';

export default function LoginScreen({ route, navigation }) {
  const { setIsLoggedIn } = route.params; // Get the setter for login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    // Basic validation before sending request
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    try {
      // Send login request to the backend API using fetch
      const response = await fetch('https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/loginUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), 
      });

      if (response.ok) {
        // On successful login (status code 200)
       const result = await response.json();
       setIsLoggedIn(true);
        Alert.alert('Login Successful', 'You have logged in successfully!');
  
      } else {
        // Handle specific error statuses (e.g., invalid email/password)
        if (response.status === 400) {
          const errorData = await response.json();  
          Alert.alert('Login Failed', data.message ||'Invalid email or password.');
        } else if (response.status == 401) {
          Alert.alert('Login Failed', 'Invalid email or password.');
        }
      }
    } catch (error) {
      Alert.alert('Login Failed', 'An error occurred. Please try again later.'); 
  } finally {
    setIsLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Centsible</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="default"
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
}
