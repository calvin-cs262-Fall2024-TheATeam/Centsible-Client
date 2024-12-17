import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChangePassword from './changePassword';

export default function ProfileScreen({ setIsLoggedIn }) {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [reminderNotification, setReminderNotification] = useState(false);
  const [budgetWarningNotification, setBudgetWarningNotification] = useState(false);
  const [firstName] = useState('John');  // Example first name
  const [username] = useState('user@example.com');  // Example username
  const [password, setPassword] = useState('password');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    setIsModalVisible(true);
  };

  const handleChangePassword = (newPassword) => {
    setPassword(newPassword);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        {/* First Name Box */}
        <View style={[styles.rowDisplay, styles.rowWithBorder]}>
          <Text style={styles.infoText}>First name:</Text>
          <Text style={styles.usernameText}> {firstName}</Text>
        </View>
        
        {/* Username Box */}
        <View style={[styles.rowDisplay, styles.rowWithBorder]}>
          <Text style={styles.infoText}>Username:</Text>
          <Text style={styles.usernameText}> {username}</Text>
        </View>

        {/* Password Box */}
        <View style={[styles.rowDisplay, styles.rowWithBorder]}>
          <Text style={styles.infoText}>Password:</Text>
          <View style={styles.passwordContainer}>
            <Text style={styles.usernameText}>
              {isPasswordVisible ? password : '••••••••'}  {/* Show or hide the password */}
            </Text>
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="#333" />
            </TouchableOpacity>
          </View>
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
        <View style={[
          styles.notificationToggleContainer,
          isNotificationsEnabled && styles.rowWithBorder  // Apply border if notifications are enabled
        ]}>
          <Text style={[styles.notificationText, isNotificationsEnabled && { fontWeight: 500 }]}>Notifications</Text>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#767577', true: '#231942' }}
            thumbColor={isNotificationsEnabled ? '#ffffff' : '#ffffff'}
            style={styles.switch}
          />
        </View>

        {/* Conditionally render the reminder and budget warning switches */}
        {isNotificationsEnabled && (
          <>
            {/* Reminder Notification Toggle */}
            <View style={[styles.notificationToggleContainer, { marginTop: 10 }]}>
              <Text style={styles.checkboxLabel}>Record Transactions Reminder</Text>
              <Switch
                value={reminderNotification}
                onValueChange={toggleReminderNotification}
                trackColor={{ false: '#767577', true: '#231942' }}
              />
            </View>

            {/* Budget Warning Notification Toggle */}
            <View style={[styles.notificationToggleContainer]}>
              <Text style={styles.checkboxLabel}>Budget Exceeded Warning</Text>
              <Switch
                value={budgetWarningNotification}
                onValueChange={toggleBudgetWarningNotification}
                trackColor={{ false: '#767577', true: '#231942' }}
              />
            </View>
          </>
        )}
      </View>

      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ChangePassword
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onChangePassword={handleChangePassword}
        oldPassword={password}  // Pass the current password to the modal
      />
    </View>
  );
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  rowDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Spacing the label and value
    alignItems: 'center', // Centering vertically
    paddingVertical: 12, // Add padding for vertical spacing
  },
  rowWithBorder: {
    borderBottomWidth: 1, // Horizontal line
    borderBottomColor: '#231942', // Light gray border
  },
  infoBox: {
    backgroundColor: '#F5F5F5',
    marginBottom: 15,
    borderColor: '#231942',
    borderWidth: 1,
    marginTop: 2,
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
    backgroundColor: '#F5F5F5',
    marginVertical: 10,
    borderRadius: 8,
    width: '95%',
    paddingHorizontal: 7,
    borderColor: '#231942',
    borderWidth: 1,
    paddingTop: 13,
    paddingBottom: 4,
  },
  notificationText: {
    fontSize: 18,
    color: '#231942',
    paddingLeft: 5,
    flex: 1,
  },
  notificationToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10, // Adjust the padding below the text to add more space before the border
    paddingRight: 6,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#231942',
    marginLeft: 20,
    flex: 1,
    fontWeight: 300,
  },
  switch: {
    marginLeft: 0,
  },
  logoutButtonContainer: {
    backgroundColor: '#F5F5F5',
    borderColor: '#231942',
    borderWidth: 1,
    padding: 13,
    borderRadius: 8,
    width: '95%',
  },
  buttonText: {
    fontSize: 18,
    color: '#231942',
    paddingLeft: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'right', // Ensure password text and icon are aligned horizontally
  },
});
