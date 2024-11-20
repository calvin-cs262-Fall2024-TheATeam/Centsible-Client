import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ProfileScreen({ setIsLoggedIn }) {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [reminderNotification, setReminderNotification] = useState(false);
  const [budgetWarningNotification, setBudgetWarningNotification] = useState(false);
  const [username] = useState('user@example.com');  // Example username
  const [password] = useState('password');

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsEnabled(previousState => {
      const newState = !previousState;
      if (newState) {
        // Enable notifications and set both types to true
        setReminderNotification(true);
        setBudgetWarningNotification(true);
      } else {
        // Disable notifications and reset both types to false
        setReminderNotification(false);
        setBudgetWarningNotification(false);
      }
      return newState;
    });
  };

  const toggleReminderNotification = () => {
    setReminderNotification(previousState => !previousState);
  };

  const toggleBudgetWarningNotification = () => {
    setBudgetWarningNotification(previousState => !previousState);
  };

  const handleChangePasswordPress = () => {
    // Handle the change password click (could navigate to another screen or open a dialog)
    console.log("Change Password Pressed");
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
        <TouchableOpacity
          style={styles.changePasswordBox}
          onPress={handleChangePasswordPress}
        >
          <Text style={styles.infoText}>Change Password</Text>
          <Icon name="keyboard-arrow-right" size={24} color="#333" />
        </TouchableOpacity>
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

      {/* These rows show up right below the Notifications switch */}
      {isNotificationsEnabled && (
        <View style={styles.notificationOptions}>
          {/* Reminder Notification Toggle */}
          <View style={[styles.notificationToggleContainer, styles.rowWithBorder]}>
            <Text style={styles.checkboxLabel}>Reminder to input transactions</Text>
            <Switch
              value={reminderNotification}
              onValueChange={toggleReminderNotification}
              trackColor={{ false: '#767577', true: '#9b59b6' }}
            />
          </View>

          {/* Budget Warning Notification Toggle */}
          <View style={[styles.notificationToggleContainer]}>
            <Text style={styles.checkboxLabel}>Warning for going over budget</Text>
            <Switch
              value={budgetWarningNotification}
              onValueChange={toggleBudgetWarningNotification}
              trackColor={{ false: '#767577', true: '#9b59b6' }}
            />
          </View>
        </View>
      )}

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
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 8,
    width: '95%',
    marginTop: 10,
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    paddingLeft: 5,
  },
  changePasswordBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  usernameText: {
    textAlign: 'right',
    fontSize: 18,
    paddingRight: 5,
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
  notificationOptions: {
    backgroundColor: 'white',
    paddingVertical: 0, // Remove padding on top and bottom
    marginTop: 0,
    paddingTop: 5,
    paddingBottom: 0,
    paddingHorizontal: 10, // Keep padding on the sides
    borderRadius: 8,
    width: '95%',
    marginBottom: 10,
  },
  notificationToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5, // Adjust margin for spacing between rows
    paddingBottom: 10, // Adjust the padding below the text to add more space before the border
    paddingRight: 6,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 7,
  },
  logoutButtonContainer: {
    backgroundColor: 'white',
    padding: 13,
    borderRadius: 8,
    width: '95%',
  },
  buttonText: {
    fontSize: 18,
    color: 'purple',
    paddingLeft: 5,
  },
});
