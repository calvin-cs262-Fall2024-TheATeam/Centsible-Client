import { useState } from 'react';
import { Text, View, TouchableOpacity, Modal, TextInput, Alert, FlatList, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { globalStyles } from '../styles/globalStyles';

export default function TransactionScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = ['Food', 'Personal', 'Lifestyle', 'Pet Care', 'Child Care'];
  const budgetRemaining = 260; // Example remaining budget

  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: '2-digit' });


  const handleAddTransaction = (category) => {
    const parsedAmount = parseFloat(amount);
    // Validate that the amount is a positive number
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount greater than zero.");
      return;
    }

    setTransactions([...transactions, { amount: parsedAmount, category, date }]);
    setAmount('');
    setSelectedCategory(null);
    setDate(new Date());
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      {/* Header with month */}
      <View style={{flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'purple', padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' , align: 'center'}}>{currentMonthYear}</Text>
      </View>

      {/* Tabs for Expenses */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'purple', paddingVertical: 10 }}>
        <Text style={{ color: 'white', fontSize: 20 }}>Expenses</Text>
      </View>

      {/* Remaining budget */}
      <Text style={{ textAlign: 'center', fontSize: 20, marginVertical: 10, fontWeight: 'bold' }}>
        ${budgetRemaining.toFixed(2)} left to spend
      </Text>

      {/* Category List with Add Expense Input */}
      <ScrollView style={{ marginHorizontal: 20 }}>
      {categories.map((cat) => (
            <View key={cat} style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 18 }}>{cat}</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                  ${transactions.filter((t) => t.category === cat).reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                </Text>
              </View>

              {/* Add Expense Section for Each Category */}
              {selectedCategory === cat ? (
                <View style={{ marginTop: 10 }}>
                  <TextInput
                    placeholder="Enter amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    style={globalStyles.input}
                    placeholderTextColor="#888"
                  />
                  <TouchableOpacity 
                    style={globalStyles.button} 
                    onPress={() => handleAddTransaction(cat)}
                  >
                    <Text style={globalStyles.buttonText}>Add Expense</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                    <Text style={{ color: 'red', marginTop: 5, textAlign: 'center' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                  <TouchableOpacity onPress={() => setSelectedCategory(cat)}>
                    <Text style={{ color: 'purple' }}>Add Amount</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}
    </View>
  );
}

const styles = {
  //entire screen 
  container: {
    backgroundColor: '#e8d0f4',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  //transaction table styles
  transactionTableContainer: {
    paddingHorizontal: 10,
    flex: 1,
    marginTop: 7,
  },
  rowFrontVisible: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 50,
    marginBottom: 5,
    padding: 10,
    width: '100%', // Full width for the item
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
  dateText: {
    fontWeight: '500',
    paddingBottom: 2, // Space between date and category
  },
  categoryText: {
    fontWeight: '400',
    color: '#666',
  },
  amountText: {
    fontWeight: 'bold',
    textAlign: 'right',
  },

  //styles for when you swipe on a transaction
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flexDirection: 'row',
    marginBottom: 5,
    borderRadius: 5,
    height: 50,
  },
  trashBtn: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    paddingRight: 17,
    backgroundColor: 'red',
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    height: 50,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },

  //add transaction button
  addButton: {
    padding: 2,
    backgroundColor: 'purple',
    borderRadius: 5,
    marginRight: 16,
  },

  //current balance
  balanceContainer: {
    padding: 10,
    backgroundColor: 'purple',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 14,
    paddingRight: 14,
  },
  balanceText: {
    fontSize: 18,
    color: 'white', // Color for the text
    fontWeight: 'bold', // Adjust as needed
  },
  balanceAmount: {
    fontSize: 18,
    color: 'white', // Adjust based on how you want the amount to look
    fontWeight: 'bold',
  },
};