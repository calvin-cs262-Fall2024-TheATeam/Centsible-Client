import { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Modal, TextInput, Button, Alert, FlatList, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { globalStyles } from '../styles/globalStyles';

export default function TransactionScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense'); //setting the default to say expense
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactions, setTransactions] = useState([]);

  //hard coded transactions
  useEffect(() => {
    const initialTransactions = [
      { amount: 50, category: 'Groceries', type: 'expense', date: new Date(2024, 10, 15) },
      { amount: 200, category: 'Salary', type: 'income', date: new Date(2024, 10, 10) },
      { amount: 30, category: 'Utilities', type: 'expense', date: new Date(2024, 10, 12) },
    ];
    setTransactions(initialTransactions);
  }, []);

  const handleAddTransaction = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount greater than zero.");
      return;
    }

    setTransactions([...transactions, { amount: parsedAmount, category, type, date }]);
    setAmount('');
    setCategory('');
    setType('');
    setDate(new Date());
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={globalStyles.buttonText}>
          Add a transaction
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={globalStyles.modalContainer}>
          <Text style={globalStyles.modalTitle}>Add Transaction Amount</Text>

          <TextInput
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={globalStyles.input}
            placeholderTextColor="#888"
            autoFocus={true} // Automatically focus the input when modal opens
          />
          <TextInput
            placeholder="Enter category"
            value={category}
            onChangeText={setCategory}
            style={globalStyles.input}
            placeholderTextColor="#888"
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
            <TouchableOpacity
              style={[globalStyles.button, type === 'expense' && { backgroundColor: 'lightgray' }]}
              onPress={() => setType('expense')}
            >
              <Text style={globalStyles.buttonText}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.button, type === 'income' && { backgroundColor: 'lightgray' }]}
              onPress={() => setType('income')}
            >
              <Text style={globalStyles.buttonText}>Income</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={globalStyles.buttonText}>{`Select Date: ${date.toLocaleDateString()}`}</Text>
          </TouchableOpacity>

          {/* DatePicker */}
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

          <TouchableOpacity
            style={globalStyles.button}
            onPress={handleAddTransaction} >
            <Text style={globalStyles.buttonText}>
              Add
            </Text>
          </TouchableOpacity>
          <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
        </View>
      </Modal>

      <FlatList
        style={styles.flatList}
        data={transactions.slice().reverse()}
        keyExtractor={(item, index) => index.toString()} // Unique key for each item
        renderItem={({ item }) => {
          const options = { month: 'short', day: 'numeric', year: 'numeric' };
          const formattedDate = item.date.toLocaleDateString('en-US', options).replace(',', '');

          return (
            <View>
            <View style={styles.itemContainer}>
              <View>
                <Text style={styles.dateText}>
                  {formattedDate.toUpperCase()}
                </Text>
                <Text>{item.category}</Text>
              </View>
              <Text style={[styles.amountText, { color: item.type === 'income' ? 'green' : 'red' }]}>
                {item.type === 'income' ? `+${item.amount.toFixed(2)}` : `-${item.amount.toFixed(2)}`}
              </Text>
            </View>
            <View style={styles.divider} />
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flatList: {
    paddingHorizontal: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    alignItems: 'center',
    width: '100%',
  },
  dateText: {
    fontWeight: '500',
    paddingTop: 4,
  },
  amountText: {
    fontWeight: 'bold',
  },
  divider: {
    height: 1.5,
    backgroundColor: '#ccc', // Adjust color as needed
    marginTop: 4, // Space between amount and divider
    width: '100%', // Full width
  },
});
