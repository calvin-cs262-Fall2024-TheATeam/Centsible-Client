import { useState } from 'react';
import { Text, View, TouchableOpacity, Modal, TextInput, Alert, FlatList, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { globalStyles } from '../styles/globalStyles';

export default function TransactionScreen() {
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
