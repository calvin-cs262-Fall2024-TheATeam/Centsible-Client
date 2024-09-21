import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
 
import Button from './components/Button';
import ImageViewer from './components/ImageViewer';
 
const PlaceholderImage = require('./assets/background-img.png');
 
export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer placeholderImageSource={PlaceholderImage} />
      </View>
      <View style={styles.text}>
      <Text style= {{color: 'purple', fontSize:'55'}}>Welcome to Centsible!</Text>
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Sign up" />
        <Button theme="primary" label="Login" />
      </View>
 
      <StatusBar style="auto" />
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2529e',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%'
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: '10%',
  },
  text: {
    position: 'absolute',
    top: '10%',
    alignItems: 'center',
    alignContent: 'center',
  },
  footerContainer: {
    alignItems: 'center',
  },
});

