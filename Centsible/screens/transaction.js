import { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import TransactionModal from '../transactionComponents/transactionModal'; // Import the modal component
import TransactionItem from '../transactionComponents/transactionItem'; // Import the transaction item component
import { globalStyles } from '../styles/globalStyles';


export default function TransactionScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactions, setTransactions] = useState([]);

  //temporary hard-coded transactions
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

    const newTransaction = {
      amount: parsedAmount,
      category,
      type,
      date,
    };

    setTransactions([newTransaction, ...transactions]);
    resetForm();
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setType('expense');
    setDate(new Date());
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={globalStyles.buttonText}>Add a transaction</Text>
      </TouchableOpacity>

      <TransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddTransaction}
        amount={amount}
        setAmount={setAmount}
        category={category}
        setCategory={setCategory}
        type={type}
        setType={setType}
        date={date}
        setDate={setDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
      />

      <FlatList
        style={styles.flatList}
        data={transactions}
        keyExtractor={(item, index) => index.toString()} // Unique key for each item
        renderItem={({ item }) => <TransactionItem item={item} />}
      />
    </View>
  );
}

const styles = {
  flatList: {
    paddingHorizontal: 15,
  },
};
