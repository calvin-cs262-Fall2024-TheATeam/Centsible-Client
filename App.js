import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { globalStyles } from './styles/globalStyles';

import TransactionScreen from './screens/transaction';
import GoalsScreen from './screens/goals';
import ReportScreen from './screens/reports';
import ProfileScreen from './screens/profile';
import LoginScreen from './screens/LoginScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import ImageViewer from './components/ImageViewer';

const PlaceholderImage = require('./assets/background-img.png');

// Tab and Stack navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Only valid during the current session

  useEffect(() => {
    // Show splash screen for 3 seconds
    const splashTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(splashTimeout);
  }, []);

  // Display splash screen while loading
  if (isLoading) {
    return (
      <View style={globalStyles.splashContainer}>
        <View style={globalStyles.imageContainer}>
          <ImageViewer placeholderImageSource={PlaceholderImage} />
        </View>
        <View style={globalStyles.textContainer}>
          <Text style={globalStyles.welcomeText}>Welcome to Centsible!</Text>
        </View>
      </View>
    );
  }

  // Home tab screens
  const HomeTabs = () => (
    <Tab.Navigator initialRouteName="Reports"
    screenOptions={{
      tabBarStyle: { backgroundColor: 'white' }, // Optional: Set the background color of the tab bar
      tabBarActiveTintColor: 'purple', // Active icon and label color
      tabBarInactiveTintColor: 'gray', // Inactive icon and label color
    }}>
      <Tab.Screen
        name="Reports"
        component={ReportScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="line-chart" color={color} size={size} />
          ),
          headerTitle: 'Reports',  
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: 'black',
          },
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="credit-card" color={color} size={size} />
          ),
          headerTitle: 'Transactions',  
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: 'black',
          },
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="dollar" color={color} size={size} />
          ),
          headerTitle: 'Goals',  
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: 'black',
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        children={() => <ProfileScreen setIsLoggedIn={setIsLoggedIn} />}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
          headerTitle: 'Profile',  
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: 'black',
          },
        }}
      />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
              initialParams={{ setIsLoggedIn }}
            />
            <Stack.Screen
              name="CreateAccount"
              component={CreateAccountScreen}
              options={{ title: 'Create Account' }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Home"
            component={HomeTabs}
            options={{ headerShown: false }} // No header for the home tabs
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
