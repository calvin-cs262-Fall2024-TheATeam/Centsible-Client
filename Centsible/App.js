import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ImageViewer from './components/ImageViewer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

import { globalStyles } from './styles/globalStyles';
import TransactionScreen from './screens/transaction';
import GoalsScreen from './screens/goals';
import ReportScreen from './screens/reports';
import ProfileScreen from './screens/profile';


const PlaceholderImage = require('./assets/background-img.png');

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Display splash screen for 3 seconds

    return () => clearTimeout(timer);
  }, []);

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

  return (
    <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Transactions" component={TransactionScreen} />
            <Tab.Screen name="Goals" component={GoalsScreen} />
            <Tab.Screen name="Reports" component={ReportScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
          <StatusBar style="auto" />
    </NavigationContainer>
    
  );
}
