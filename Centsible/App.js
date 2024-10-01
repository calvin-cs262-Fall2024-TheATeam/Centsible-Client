import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Button from './components/Button';
import ImageViewer from './components/ImageViewer';

const PlaceholderImage = require('./assets/background-img.png');

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
      <View style={styles.splashContainer}>
        <View style={styles.imageContainer}>
          <ImageViewer placeholderImageSource={PlaceholderImage} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Welcome to Centsible!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Sign up" />
        <Button theme="primary" label="Login" />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items at the start
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 0.8, // Adjust this to control image height
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50, 
  },
  textContainer: {
    alignItems: 'center', // Center horizontally
    marginTop: 20, // Add some margin for spacing
  },
  welcomeText: {
    color: 'white', // Change text color for better visibility
    fontSize: 55,
    textAlign: 'center', // Center text alignment
  },
  footerContainer: {
    alignItems: 'center',
  },
});
