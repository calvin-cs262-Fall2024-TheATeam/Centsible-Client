// CreateAccountScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function CreateAccountScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    specialChar: false,
    uppercase: false,
});


  // Check password rules only when the user starts typing
  const checkPasswordValidations = (password) => {
    if (password === '') {
      // Do not apply any validation until there's input
      return;
    }

    const minLength = password.length >= 8;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const uppercase = /[A-Z]/.test(password);

    // Update the validation state
    setPasswordValidations({
      minLength,
      specialChar,
      uppercase,
    });
  };

  useEffect(() => {
    checkPasswordValidations(password);
  }, [password]); // Re-run validation whenever password changes

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const handleCreateAccount = () => {
    // First, check for required fields
    if (!firstName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    // Validate password (at least 8 characters, contains uppercase letter and special character)
    if (checkPasswordValidations(password)) {
      Alert.alert('Error', 'Password must be at least 8 characters long, contain a special character, and have at least one uppercase letter.');
      return;
    }

    // Ensure password and confirm password match
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    // Handle successful account creation
    Alert.alert('Account Created!', 'You can now log in.');
    navigation.goBack(); // Navigate back to login page after account creation
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="First name"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
          keyboardType="default"
          autoFocus={true}
        />

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

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <View>
          <Text
            style={[
              styles.passwordRule,
              passwordValidations.minLength && styles.validRule,
            ]}
          >
            • At least 8 characters
          </Text>
          <Text
            style={[
              styles.passwordRule,
              passwordValidations.specialChar && styles.validRule,
            ]}
          >
            • At least one special character
          </Text>
          <Text
            style={[
              styles.passwordRule,
              passwordValidations.uppercase && styles.validRule,
            ]}
          >
            • At least one uppercase letter
          </Text>
        </View>

        <Button title="Create Account" onPress={handleCreateAccount} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'purple',
    marginBottom: 16,
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
  passwordRule: {
    fontSize: 16,
    color: '#888',
  },
  validRule: {
    color: 'green',
  },
});