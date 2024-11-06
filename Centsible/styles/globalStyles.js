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
  
  createTransactionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
    alignItems: 'center',
    backgroundColor: '#eee',
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
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor:'white',
    borderRadius: 5,
    marginTop: 15,
  },

  // expense/income seg control tab
  sctContainer: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 15,
  },
  
  tabStyle: {
    backgroundColor: 'white',
    borderColor: 'gray',
    padding: 3,
  },

  // expense/income seg control tab
  activeTabStyle: {
    backgroundColor: 'purple',
    borderColor: 'purple',
  },

  // expense/income seg control tab
  tabTextStyle: {
    color: 'gray',
  },

  // set date
  dateContainer: {
    flexDirection: 'row',
    width: '100%',
    alignContent: 'center',
    paddingBottom: 30,
  },

  setDateText: {
    position: 'absolute',
    left: 15,
    fontSize: 18,
    marginTop: 5,
  },

  datePicker: {
    position: 'absolute',
    right: 15,
  },
  
  // header for transaction input
  transactionHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 5,  // Ensure there's padding on the sides
    marginBottom: 10
  },

  transactionHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',  // Center the text within the header
  },
});