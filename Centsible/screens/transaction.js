import { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Modal, TextInput, Button, Alert, FlatList, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { globalStyles } from '../styles/globalStyles';

import SegmentedControlTab from "react-native-segmented-control-tab"; // me
// may need to use command "npm install react-native-segmented-control-tab"

export default function TransactionScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense'); //setting the default to say expense
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
    setType('expense');
    setDate(new Date());
    setModalVisible(false);
  };

  // set state for expense/income segmented control tab
  const [selectedIndex, setSelectedIndex] = useState(0);

  // default sct to expense when opened
  useEffect(() => {
    setSelectedIndex(0);
  }, []);
  
  // handles switching expense/income tabs in transaction
  const handleIndexChange = (index) => {
    setSelectedIndex(index);
    if (index === 0) { setType('expense') };
    if (index === 1) { setType('income') };
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={globalStyles.createTransactionText}>
          + Add a transaction
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        
        <View style={globalStyles.transactionHeader}>
            <Button 
              title="Cancel" 
              onPress={() => setModalVisible(false)} 
              color="red" 
              style={globalStyles.cancelTransaction}
            />
            <Text style={globalStyles.transactionHeaderText}>Add a transaction</Text>
            
            {/* less preferred option but working for now */} 
            <Button 
              title="Add" 
              onPress={handleAddTransaction} 
              color="purple" 
              style={globalStyles.addTransaction}
            />
            
            {/* TO FIX: Add button but as touchable opacity. 
                Would prefer to use this but haven't figured out styling */}
            {/* <TouchableOpacity onPress={handleAddTransaction}>
                <Text style={globalStyles.addTransaction}>Add</Text>
            </TouchableOpacity> */}
        </View>
        
        <View style={globalStyles.modalContainer}>
          {/* <Text style={globalStyles.modalTitle}>Add transaction</Text> */}

          {/* Expense/income segmented control tab */}
          <View style={globalStyles.sctContainer}>
            <SegmentedControlTab 
              values={['Expense', 'Income']}
              selectedIndex={selectedIndex}
              tabStyle={globalStyles.tabStyle}
              activeTabStyle={globalStyles.activeTabStyle}
              tabTextStyle={globalStyles.tabTextStyle}
              onTabPress={handleIndexChange}
            />
          </View>

          <View style={globalStyles.dateContainer}>
            <Text style={globalStyles.setDateText}>Date of transaction: </Text>
            <DateTimePicker
              style={globalStyles.datePicker}
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                // setShowDatePicker(true);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          </View>

          <TextInput
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={globalStyles.input}
            placeholderTextColor="#888"
            autoFocus={true} // Automatically focus the input when modal opens
          />
          
          {/* Ideally this will become a dropdown of previously created categories? */}
          <TextInput
            placeholder="Enter category"
            value={category}
            onChangeText={setCategory}
            style={globalStyles.input}
            placeholderTextColor="#888"
          />

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
