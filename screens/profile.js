import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function ProfileScreen({ setIsLoggedIn }) {
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
    
    return (
      <View style={globalStyles.screenText}>
        <Text>Profile</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
    },
  });
