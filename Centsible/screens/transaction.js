import { useState, useEffect } from 'react';
import {
  View, Text, Animated, TouchableHighlight, TouchableOpacity, Alert
} from 'react-native';
import TransactionModal from '../transactionComponents/transactionModal'; // Import the modal component
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TransactionScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense'); //setting the default to say expense
  const [transactions, setTransactions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0); // set state for expense/income segmented control tab

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
    // Validate that the amount is a positive number
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount greater than zero.");
      return;
    }

    // Create a new transaction object
    const newTransaction = {
      key: Date.now().toString(), // To generate unique key
      amount: parsedAmount,
      category,
      type,
      date,
    };

    setTransactions([newTransaction, ...transactions]);
    resetForm();
  };

  // Resets the form fields and closes the modal
  const resetForm = () => {
    setAmount('');
    setCategory('');
    setType('expense');
    setDate(new Date());
    setModalVisible(false);
  };

  // handles switching expense/income tabs in transaction
  const handleIndexChange = (index) => {
    setSelectedIndex(index);
    if (index === 0) { setType('expense') };
    if (index === 1) { setType('income') };
  };

  // Calculate current balance
  const calculateBalance = () => {
    return transactions.reduce((balance, transaction) => {
      return transaction.type === 'income'
        ? balance + transaction.amount
        : balance - transaction.amount;
    }, 0).toFixed(2); // Keep it two decimals
  };

  // Renders a single transaction item with correct layout 
  const TransactionItem = ({ data }) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = data.item.date.toLocaleDateString('en-US', options).replace(',', '');

    return (
      <TouchableHighlight style={styles.rowFrontVisible}>
        <View style={styles.itemContainer}>
          <View>
            <Text style={styles.dateText}>{formattedDate.toUpperCase()}</Text>
            <Text style={styles.categoryText}>{data.item.category}</Text>
          </View>
          <Text style={[styles.amountText, { color: data.item.type === 'income' ? 'green' : 'black' }]}>
            {data.item.type === 'income' ? `+$${data.item.amount.toFixed(2)}` : `-$${data.item.amount.toFixed(2)}`}
          </Text>
        </View>
      </TouchableHighlight>

    );
  };

  // Render function for individual transaction items
  const renderItem = (data) => {
    return (
      <TransactionItem data={data} />
    );
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteTransaction = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey); // Close the row before deletion
    const newData = [...transactions]; // Copy current transactions
    const prevIndex = transactions.findIndex(item => item.key === rowKey); // Find the index of the transaction to delete
    newData.splice(prevIndex, 1); // Remove the transaction from the list
    setTransactions(newData); // Update state with the new list
  };

  const HiddenItemWithActions = ({ swipeAnimatedValue, onDelete }) => {

    return (
      <View style={styles.rowBack}>
        <TouchableOpacity style={styles.trashBtn} onPress={onDelete}>
          <Animated.View
            style={[styles.trash, {
              transform: [{
                scale: swipeAnimatedValue.interpolate({
                  inputRange: [-90, -45],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                }),
              },],
            },]}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={25}
              color="#fff"
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    )
  }

  // Render the hidden item when swiped
  const renderHiddenItem = (data, rowMap) => {
    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        onDelete={() => deleteTransaction(rowMap, data.item.key)}
      />
    );
  }

  // Set headerRight option dynamically
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.addButton} // Adjust padding for placement
          onPress={() => setModalVisible(true)} // Show the modal when pressed
        >
          <MaterialCommunityIcons name="plus" size={30} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Current Balance:</Text>
        <Text style={styles.balanceAmount}>${calculateBalance()}</Text>
      </View>

      {/* Input Transaction Screen */}
      <TransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)} // Close the modal
        onAdd={handleAddTransaction} // Add transaction when modal submits
        amount={amount}
        setAmount={setAmount}
        category={category}
        setCategory={setCategory}
        type={type}
        setType={setType}
        date={date}
        setDate={setDate}
        onRequestClose={() => setModalVisible(false)}
        selectedIndex={selectedIndex}
        handleIndexChange={handleIndexChange}
      />

      {/* Transaction Table */}
      <View style={styles.transactionTableContainer}>
        <SwipeListView
          data={transactions}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75}
          disableRightSwipe
        />
      </View>

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