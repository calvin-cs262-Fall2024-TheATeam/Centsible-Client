import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    splashContainer: {
      flex: 1,
      backgroundColor: 'purple',
      alignItems: 'center',
      justifyContent: 'flex-start', // Align items at the start
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
    screenText: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    button: {
      backgroundColor: 'purple',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 5,
      margin: 10,
    },
    buttonText:{
      color: 'white',
      fontSize: 18,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 20,
    },
    modalTitle: {
      fontSize: 24,
      marginBottom: 20,
    },
    cancelText: {
      fontSize: 14,
      color: 'white',
    },
    input: {
      width: '80%',
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 15,
    },
  });