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
  const [type, setType] = useState('Expense'); //setting the default to say expense
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0); // set state for expense/income segmented control tab
  const [currentBalance] = useState(0); // Initialize with a default value of 0

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Replace with your actual backend URL
        const response = await fetch('https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/transactions/1'); // Replace '1' with actual appuserID
        if (response.ok) {
          const data = await response.json();
          const sortedTransactions = data.map((transaction, index) => ({
            ...transaction,
            key: transaction.id || index.toString(), // Ensure a unique key for each transaction
          })).sort((a, b) => new Date(b.transactiondate) - new Date(a.transactiondate)); // Sort by date
          setTransactions(sortedTransactions);
        } else {
          Alert.alert("Error", "Failed to fetch transactions.");
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        Alert.alert("Error", "Something went wrong.");
      }
    };

    fetchTransactions();
  }, []);

  const handleAddTransaction = async () => {
    const parsedAmount = parseFloat(amount);

    // Create a new transaction object
    const newTransaction = {
      appuserid: 1, // Ensure field matches the server's expected field
      dollaramount: parsedAmount.toString(), // Ensure the amount is a string (if that's how the API expects it)
      transactiontype: type, // "Expense" or "Income"
      budgetcategoryid: category, // Assuming 'category' is the correct value to pass here
      optionaldescription: description,
      transactiondate: date.toISOString(), // Correct format for date
    };

    try {
      // Make the API call to create the transaction
      const response = await fetch('https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction), // Send the newTransaction object as JSON
      });

      // Log the response status code and body for debugging
      const responseText = await response.text();  // Read the response body as text
      console.log('Response Status:', response.status);
      console.log('Response Text:', responseText);

      if (response.ok) {
        try {
          const data = JSON.parse(responseText); // Try parsing the response text as JSON
          setTransactions((prevTransactions) => {
            const updatedTransactions = [data, ...prevTransactions];
            return updatedTransactions.sort((a, b) => new Date(b.transactiondate) - new Date(a.transactiondate)); // Sort by date descending
          });
          resetForm(); // Reset the form after adding the transaction
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          alert('Error parsing the response data.');
        }
      } else {
        // Handle server errors or non-200 responses
        try {
          const errorData = JSON.parse(responseText); // Try parsing error data returned by the server
          console.error('Error data from server:', errorData);
          throw new Error(errorData.message || "Failed to add transaction");
        } catch (jsonError) {
          console.error('Error parsing error response:', jsonError);
          throw new Error("Failed to add transaction. Unknown error.");
        }
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Error creating transaction: " + error.message); // Show error message
    }
  };


  // setTransactions(prevTransactions => {
  //   const updatedTransactions = [newTransaction, ...prevTransactions];
  //   return updatedTransactions.sort((a, b) => b.date - a.date);  // Sort by date descending
  // });
  // resetForm();


  // Resets the form fields and closes the modal
  const resetForm = () => {
    setAmount('');
    setCategory('');
    setType('Expense');
    setDate(new Date());
    setDescription('');
    setSelectedIndex(0); //Resets to "Expense" (index 0)
    setModalVisible(false);
  };

  // handles switching expense/income tabs in transaction
  const handleIndexChange = (index) => {
    setSelectedIndex(index);
    if (index === 0) { setType('Expense') };
    if (index === 1) { setType('Income') };
  };

  const handleExpandTransaction = (transactionKey) => {
    // Toggle between expanding and collapsing
    if (expandedTransaction === transactionKey) {
      setExpandedTransaction(null); // Collapse the transaction
    } else {
      setExpandedTransaction(transactionKey); // Expand the clicked transaction
    }
  };  

  // Calculate current balance
  const calculateBalance = () => {
    let balance = parseFloat(currentBalance); // Start with the current balance from the database (stored in state)

    // Iterate over transactions and adjust the balance
    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.dollaramount); // Parse the transaction amount
      // Update balance based on transaction type
      if (transaction.transactiontype === 'Income') {
        balance += amount; // Add income
      } else if (transaction.transactiontype === 'Expense') {
        balance -= amount; // Subtract expense
      }
    });

    return balance.toFixed(2); // Return balance rounded to two decimal places
  };

  // Renders a single transaction item with correct layout 
  const TransactionItem = ({ data }) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = new Date(data.item.transactiondate).toLocaleDateString('en-US', options).replace(',', '');
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
            {data.item.type === 'Income' ? (
              <Text style={[styles.categoryText, isExpanded && { paddingBottom: 0 }]}>Income</Text>
            ) : (
              <Text style={[styles.categoryText, isExpanded && { paddingBottom: 0 }]}>{data.item.category}</Text>
            )}
            {/* Render description if expanded */}
            {isExpanded && (
              <Text style={[styles.descriptionText, { paddingBottom: 8 }]}>
                {data.item.optionaldescription || "No description given"}
              </Text>
            )}
          </View>
          <Text style={[styles.amountText, { color: data.item.type === 'Income' ? 'green' : 'black' }]}>
            {data.item.type === 'Income'
              ? `+$${parseFloat(data.item.dollaramount).toFixed(2)}`
              : `-$${parseFloat(data.item.dollaramount).toFixed(2)}`}
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