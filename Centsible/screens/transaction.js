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
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0); // set state for expense/income segmented control tab

  //temporary hard-coded transactions
  useEffect(() => {
    const initialTransactions = [
      { key: '1', amount: 200, category: 'Housing', description: 'Monthly rent', type: 'expense', date: new Date(2024, 10, 1) },
      { key: '2', amount: 60, category: 'Housing', description: 'Internet bill', type: 'expense', date: new Date(2024, 10, 2) },
      { key: '3', amount: 5.99, category: 'Entertainment', description: 'Spotify subscription', type: 'expense', date: new Date(2024, 10, 2) },
      { key: '4', amount: 30, category: 'Transportation', description: 'Gas for the car', type: 'expense', date: new Date(2024, 10, 3) },
      { key: '5', amount: 50, category: 'Personal', description: 'New clothes', type: 'expense', date: new Date(2024, 10, 2) },
      { key: '7', amount: 10, category: 'Food', description: 'Takeout dinner', type: 'expense', date: new Date(2024, 10, 3) },
      { key: '8', amount: 60, category: 'Housing', description: 'Electricity bill', type: 'expense', date: new Date(2024, 10, 5) },
      { key: '9', amount: 50, category: 'Entertainment', description: 'Concert tickets', type: 'expense', date: new Date(2024, 10, 5) },
      { key: '10', amount: 10, category: 'Food', description: 'Lunch with friends', type: 'expense', date: new Date(2024, 10, 6) },
      { key: '11', amount: 100, category: 'Education', description: 'Lab fees', type: 'expense', date: new Date(2024, 10, 7) },
      { key: '12', amount: 25, category: 'Transportation', description: 'Uber ride to campus', type: 'expense', date: new Date(2024, 10, 6) },
      { key: '13', amount: 90, category: 'Food', description: 'Groceries for the week', type: 'expense', date: new Date(2024, 10, 7) },
      { key: '14', amount: 20, category: 'Personal', description: 'Shampoo and toiletries', type: 'expense', date: new Date(2024, 10, 7) },
      { key: '15', amount: 50, category: 'Entertainment', description: 'Weekend trip', type: 'expense', date: new Date(2024, 10, 8) },
      { key: '16', amount: 10, category: 'Food', description: 'Fast food lunch', type: 'expense', date: new Date(2024, 10, 9) },
      { key: '17', amount: 10, category: 'Transportation', description: 'Parking ticket', type: 'expense', date: new Date(2024, 10, 9) },
      { key: '18', amount: 45, category: 'Personal', description: 'Haircut', type: 'expense', date: new Date(2024, 10, 5) },
      { key: '19', amount: 30, category: 'Food', description: 'Takeout pizza', type: 'expense', date: new Date(2024, 10, 9) },
      { key: '20', amount: 100, category: 'Transportation', description: 'Monthly bus pass', type: 'expense', date: new Date(2024, 10, 7) },
      { key: '21', amount: 10, category: 'Personal', description: 'Coffee at campus cafe', type: 'expense', date: new Date(2024, 10, 10) },
      { key: '22', amount: 100, category: 'Personal', description: 'New shoes', type: 'expense', date: new Date(2024, 10, 13) },
      { key: '23', amount: 30, category: 'Entertainment', description: 'Netflix subscription', type: 'expense', date: new Date(2024, 10, 13) },
      { key: '24', amount: 50, category: 'Food', description: 'Groceries for the week', type: 'expense', date: new Date(2024, 10, 14) },
      { key: '25', amount: 15, category: 'Education', description: 'School supplies', type: 'expense', date: new Date(2024, 10, 14) },
      { key: '26', amount: 70, category: 'Education', description: 'Course materials', type: 'expense', date: new Date(2024, 10, 15) },
      { key: '28', amount: 50, category: 'Transportation', description: 'Tolls on road trip', type: 'expense', date: new Date(2024, 10, 16) },
      { key: '29', amount: 1200, category: 'Education', description: 'Semester tuition fee', type: 'expense', date: new Date(2024, 10, 15) },
      { key: '30', amount: 10, category: 'Entertainment', description: 'Sports event tickets', type: 'expense', date: new Date(2024, 10, 16) },
      { key: '32', amount: 15, category: 'Food', description: 'Coffee shop', type: 'expense', date: new Date(2024, 10, 18) },
      { key: '34', amount: 15, category: 'Food', description: 'Lunch with friends', type: 'expense', date: new Date(2024, 10, 19) },
      { key: '35', amount: 10, category: 'Transportation', description: 'Uber ride to class', type: 'expense', date: new Date(2024, 10, 20) },
      { key: '36', amount: 50, category: 'Transportation', description: 'Gas for the car', type: 'expense', date: new Date(2024, 10, 20) },
      { key: '37', amount: 75, category: 'Personal', description: 'New headphones', type: 'expense', date: new Date(2024, 10, 22) },
      { key: '38', amount: 10, category: 'Entertainment', description: 'Movie night with friends', type: 'expense', date: new Date(2024, 10, 22) },
      { key: '39', amount: 50, category: 'Food', description: 'Groceries', type: 'expense', date: new Date(2024, 10, 23) },
      { key: '40', amount: 25, category: 'Personal', description: 'Gym membership', type: 'expense', date: new Date(2024, 10, 23) },
      { key: '41', amount: 15, category: 'Entertainment', description: 'Monthly video game subscription', type: 'expense', date: new Date(2024, 10, 24) },
      { key: '43', amount: 20, category: 'Food', description: 'Lunch out', type: 'expense', date: new Date(2024, 10, 25) },
      { key: '44', amount: 5, category: 'Transportation', description: 'Public transport for school', type: 'expense', date: new Date(2024, 10, 25) },
      { key: '45', amount: 60, category: 'Entertainment', description: 'Concert tickets', type: 'expense', date: new Date(2024, 10, 26) },
      { key: '46', amount: 10, category: 'Food', description: 'Coffee at campus cafe', type: 'expense', date: new Date(2024, 10, 27) },
      { key: '47', amount: 25, category: 'Personal', description: 'Toiletries', type: 'expense', date: new Date(2024, 10, 28) },
      { key: '48', amount: 50, category: 'Food', description: 'Groceries for the weekend', type: 'expense', date: new Date(2024, 10, 28) },
      { key: '49', amount: 30, category: 'Transportation', description: 'Bike repairs', type: 'expense', date: new Date(2024, 10, 29) },
      { key: '50', amount: 15, category: 'Entertainment', description: 'Monthly gaming subscription', type: 'expense', date: new Date(2024, 10, 30) },
      { key: '51', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 10, 8) },
      { key: '52', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 10, 15) },
      { key: '53', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 10, 22) },
      { key: '54', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 10, 29) },
      { key: '55', amount: 3000, category: 'Income', description: 'Summer income', type: 'income', date: new Date(2024, 9, 31) },
    ];

    const sortedTransactions = initialTransactions.sort((a, b) => b.date - a.date);
    setTransactions(sortedTransactions);
  }, []);

  const handleAddTransaction = () => {
    const parsedAmount = parseFloat(amount);

    // Create a new transaction object
    const newTransaction = {
      key: Date.now().toString(), // To generate unique key
      amount: parsedAmount,
      category,
      description,
      type,
      date,
    };

    setTransactions(prevTransactions => {
      const updatedTransactions = [newTransaction, ...prevTransactions];
      return updatedTransactions.sort((a, b) => b.date - a.date);  // Sort by date descending
    });
    resetForm();
  };

  // Resets the form fields and closes the modal
  const resetForm = () => {
    setAmount('');
    setCategory('');
    setType('expense');
    setDate(new Date());
    setDescription('');
    setSelectedIndex(0); //Resets to "Expense" (index 0)
    setModalVisible(false);
  };

  // handles switching expense/income tabs in transaction
  const handleIndexChange = (index) => {
    setSelectedIndex(index);
    if (index === 0) { setType('expense') };
    if (index === 1) { setType('income') };
  };

  const handleExpandTransaction = (transactionKey) => {
    if (expandedTransaction === transactionKey) {
      setExpandedTransaction(null);  // Collapse the transaction if it's already expanded
    } else {
      setExpandedTransaction(transactionKey);  // Expand the clicked transaction
    }
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
    const isExpanded = expandedTransaction === data.item.key;

    return (
      <TouchableHighlight
        style={[styles.rowFrontVisible, { height: isExpanded ? 70 : 60 }]}  // Adjust height if expanded
        onPress={() => handleExpandTransaction(data.item.key)} // Toggle expansion on press
        underlayColor="#D3D3D3"
      >
        <View style={styles.itemContainer}>
          <View>
            <Text style={styles.dateText}>{formattedDate.toUpperCase()}</Text>
            {data.item.type === 'income' ? (
              <Text style={[styles.categoryText, isExpanded && { paddingBottom: 0 }]}>Income</Text>
            ) : (
              <Text style={[styles.categoryText, isExpanded && { paddingBottom: 0 }]}>{data.item.category}</Text>
            )}
            {/* Render description if expanded */}
            {isExpanded && (
              <Text style={[styles.descriptionText, { paddingBottom: 8 }]}>
                {data.item.description || "No description given"}
              </Text>
            )}
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

  const HiddenItemWithActions = ({ swipeAnimatedValue, onDelete, data }) => {
    const isExpanded = expandedTransaction === data.item.key;
    return (
      <View style={[styles.rowBack, { height: isExpanded ? 70 : 60 }]}>
        <TouchableOpacity style={[styles.trashBtn, { height: isExpanded ? 70 : 60 }]} onPress={onDelete}>
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
              size={35}
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
        description={description}
        setDescription={setDescription}
        type={type}
        setType={setType}
        date={date}
        setDate={setDate}
        onRequestClose={() => setModalVisible(false)}
        selectedIndex={selectedIndex}
        handleIndexChange={handleIndexChange}
        resetForm={resetForm}
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
    marginTop: 12,
    marginBottom: 12, // Add some bottom margin
  },
  rowFrontVisible: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginBottom: 10,
    padding: 15,
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
    paddingTop: 8,
    paddingBottom: 2, // Space between date and category
    fontSize: 16,
  },
  categoryText: {
    fontWeight: '500',
    color: '#777',
    fontSize: 16,
    paddingBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: '#888',  // Lighter color for description
    fontWeight: '300',  // Lighter weight
  },
  amountText: {
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: 16,
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
    height: 35,
    width: 35,
    marginRight: 3,
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