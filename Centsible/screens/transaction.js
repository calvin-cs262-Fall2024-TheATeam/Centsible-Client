import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableHighlight, TouchableOpacity, StatusBar,
  FlatList
} from 'react-native';
import TransactionModal from '../transactionComponents/transactionModal'; // Import the modal component
import TransactionItem from '../transactionComponents/transactionItem'; // Import the transaction item component
import { globalStyles } from '../styles/globalStyles';
import { SwipeListView } from 'react-native-swipe-list-view';


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
      { key: 1, amount: 50, category: 'Groceries', type: 'expense', date: new Date(2024, 10, 15) },
      { key: 2, amount: 200, category: 'Salary', type: 'income', date: new Date(2024, 10, 10) },
      { key: 3, amount: 30, category: 'Utilities', type: 'expense', date: new Date(2024, 10, 12) },
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
      key: transactions.length.toString(),
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

  const deleteTransaction = (rowKey) => {
    const newData = transactions.filter(item => item.key !== rowKey);
    setTransactions(newData);
  };

  const TransactionItem = props => {
    const { data } = props;
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = data.item.date.toLocaleDateString('en-US', options).replace(',', '');

    return (
      <TouchableHighlight
        style={styles.rowFrontVisible}
      >
        <View style={styles.itemContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.dateText}>
              {formattedDate.toUpperCase()}
            </Text>
            <Text style={styles.categoryText}>{data.item.category}</Text>
          </View>
          <Text style={[styles.amountText, { color: data.item.type === 'income' ? 'green' : 'black' }]}>
            {data.item.type === 'income' ? `+${data.item.amount.toFixed(2)}` : `-${data.item.amount.toFixed(2)}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  const renderItem = (data, rowMap) => {
    return (
      <TransactionItem data={data} />
    );
  };

  const closeRow  = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...transactions];
    const prevIndex = transactions.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setTransactions(newData);
  };

  const HiddenItemWithActions = props => {
    const { onClose, onDelete } = props;

    return (
      <View style={styles.rowBack}>
        <Text> Left</Text>
        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]} onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={onDelete}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderHiddenItem = (data, rowMap) => {
    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        onDelete={() => deleteRow(rowMap, data.item.key)}
      />
    );
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

      <View style={styles.container}>
        <SwipeListView
          data={transactions}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={75}
          rightOpenValue={-150}
          disableRightSwipe
        />
      </View>

    </View>
  );
}

const styles = {
  container: {
    paddingHorizontal: 15,
    flex: 1
  },

  //TODO fix this
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
    width: '100%', // Ensures it takes the full width,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  dateText: {
    fontWeight: '500',
    paddingBottom: 2, // Space between date and category
  },
  categoryText: {
    fontWeight: '400',
    color: '#666', // Optional: for better readability
  },
  amountText: {
    fontWeight: 'bold',
    textAlign: 'right', // Align amount text to the right
  },

  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    margin: 0,
    marginBottom: 15,
    borderRadius: 5,
  },
  backRightBtn: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    paddingRight: 17,
    height: 50,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  backRightBtnLeft: {
    backgroundColor: '#1f65ff',
    right: 75,
  },
};