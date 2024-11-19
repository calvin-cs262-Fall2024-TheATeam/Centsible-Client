import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';

export default function ProfileScreen({ setIsLoggedIn }) {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [username] = useState('user@example.com');  // Example username
  const [password] = useState('password');

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsEnabled(previousState => !previousState);
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        {/* Username Box */}
        <View style={[styles.rowDisplay, styles.rowWithBorder]}>
          <Text style={styles.infoText}>Username:</Text>
          <Text style={styles.usernameText}> {username}</Text>
        </View>

        {/* Password Box */}
        <View style={[styles.rowDisplay, styles.rowWithBorder]}>
          <Text style={styles.infoText}>Password:</Text>
          <Text style={styles.usernameText}> {password}</Text>
        </View>

        {/* Change Password Box */}
        <View>
          <TouchableOpacity style={styles.changePasswordButton}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.notificationBox}>
        <Text style={styles.notificationText}>Notifications</Text>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: '#767577', true: '#9b59b6' }}
          thumbColor={isNotificationsEnabled ? '#ffffff' : '#ffffff'}
          style={styles.switch}
        />
      </View>
      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#e8d0f4',
  },
  rowDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Spacing the label and value
    alignItems: 'center', // Centering vertically
    paddingVertical: 12, // Add padding for vertical spacing
  },
  rowWithBorder: {
    borderBottomWidth: 1, // Horizontal line
    borderBottomColor: '#ddd', // Light gray border
  },
  infoBox: {
    backgroundColor: 'white',
    padding: 10,
    paddingTop: 0,
    borderRadius: 8,
    width: '95%',
    marginTop: 10,
    },
  infoText: {
    fontSize: 18,
    color: '#333',
    paddingLeft: 5,
  },
  usernameText: {
    textAlign: 'right',
    fontSize: 18,
    paddingRight: 5,
  },
  changePasswordButton: {
    marginTop: 10,
    marginBottom: 5,
  },
  notificationBox: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
  },
  notificationText: {
    fontSize: 18,
    color: '#333',
    paddingLeft: 5,
  },
  logoutButtonContainer: {
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 8,
    width: '95%',
  },
  logoutButton: {
    padding: 7,
  },
  buttonText: {
    fontSize: 18,
    color: 'purple',
    paddingLeft: 5,
  },
});