import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Modal  } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
// Initial transactions and amounts
const initialTransactions =
  [
    { key: '1', amount: 200, category: 'Housing', description: 'Monthly rent', type: 'expense', date: new Date(2024, 9, 1) },
    { key: '4', amount: 30, category: 'Transportation', description: 'Gas for the car', type: 'expense', date: new Date(2024, 9, 3) },
    { key: '5', amount: 50, category: 'Personal', description: 'New clothes', type: 'expense', date: new Date(2024, 9, 2) },
    { key: '7', amount: 10, category: 'Food', description: 'Takeout dinner', type: 'expense', date: new Date(2024, 9, 3) },
    { key: '8', amount: 60, category: 'Housing', description: 'Electricity bill', type: 'expense', date: new Date(2024, 9, 5) },
    { key: '10', amount: 10, category: 'Food', description: 'Lunch with friends', type: 'expense', date: new Date(2024, 9, 6) },
    { key: '12', amount: 25, category: 'Personal', description: 'Coffee and bagels', type: 'expense', date: new Date(2024, 9, 6) },
    { key: '13', amount: 90, category: 'Food', description: 'Groceries for the week', type: 'expense', date: new Date(2024, 9, 7) },
    { key: '14', amount: 20, category: 'Personal', description: 'Shampoo and toiletries', type: 'expense', date: new Date(2024, 9, 7) },
    { key: '15', amount: 50, category: 'Entertainment', description: 'Weekend trip', type: 'expense', date: new Date(2024, 9, 8) },
    { key: '16', amount: 10, category: 'Food', description: 'Fast food lunch', type: 'expense', date: new Date(2024, 9, 9) },
    { key: '18', amount: 45, category: 'Personal', description: 'Haircut', type: 'expense', date: new Date(2024, 9, 5) },
    { key: '21', amount: 10, category: 'Personal', description: 'Coffee at campus cafe', type: 'expense', date: new Date(2024, 9, 10) },
    { key: '22', amount: 100, category: 'Personal', description: 'New shoes', type: 'expense', date: new Date(2024, 9, 13) },
    { key: '22', amount: 100, category: 'Personal', description: 'Amazon', type: 'expense', date: new Date(2024, 9, 13) },
    { key: '24', amount: 50, category: 'Food', description: 'Groceries for the week', type: 'expense', date: new Date(2024, 9, 14) },
    { key: '25', amount: 15, category: 'Education', description: 'School supplies', type: 'expense', date: new Date(2024, 9, 14) },
    { key: '28', amount: 50, category: 'Personal', description: 'Earrings', type: 'expense', date: new Date(2024, 9, 16) },
    { key: '30', amount: 10, category: 'Entertainment', description: 'Sports event tickets', type: 'expense', date: new Date(2024, 9, 16) },
    { key: '32', amount: 5, category: 'Food', description: 'Coffee shop', type: 'expense', date: new Date(2024, 9, 18) },
    { key: '34', amount: 15, category: 'Food', description: 'Lunch with friends', type: 'expense', date: new Date(2024, 9, 19) },
    { key: '36', amount: 50, category: 'Transportation', description: 'Gas for the car', type: 'expense', date: new Date(2024, 9, 20) },
    { key: '38', amount: 10, category: 'Entertainment', description: 'Movie night with friends', type: 'expense', date: new Date(2024, 9, 22) },
    { key: '47', amount: 25, category: 'Personal', description: 'Toiletries', type: 'expense', date: new Date(2024, 9, 28) },
    { key: '48', amount: 50, category: 'Food', description: 'Groceries for the weekend', type: 'expense', date: new Date(2024, 9, 28) },
    { key: '50', amount: 15, category: 'Entertainment', description: 'Monthly gaming subscription', type: 'expense', date: new Date(2024, 9, 30) },
    { key: '51', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 9, 8) },
    { key: '52', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 9, 15) },
    { key: '53', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 9, 22) },
    { key: '54', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 9, 29) },


  ];

const initialAmounts = {
  Groceries: '100.00',
  Phone: '50.00',
  'Fun Money': '20.00',
  'Hair/Cosmetics': '30.00',
  Subscriptions: '15.00',
  'Pet Care': '40.00',
  'Child Care': '60.00',
  Tuition: '500.00',
  Books: '80.00',
  'Spotify subscription': '10.00',
  'Monthly Rent': '50',
  'Internet bill': '50'
};

const SubCategoryList = ({ subcategories, onAddTransaction, transactions, category, onAddSubcategory }) => {
  const [amounts, setAmounts] = useState(initialAmounts); // Initialize amounts with initialAmounts
  const [isEditing, setIsEditing] = useState(false);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);

  const handleAmountPress = (subcategory) => {
    setActiveSubcategory(subcategory);
    setIsEditing(true);
  };

  const handleAmountChange = (subcategory, value) => {
    let formattedValue = value.replace(/[^0-9.]/g, '');
    const parts = formattedValue.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 3) return;
    if (formattedValue.startsWith('0') && !formattedValue.startsWith('0.') && formattedValue.length > 1) {
      formattedValue = formattedValue.substring(1);
    }

    setAmounts({ ...amounts, [subcategory]: formattedValue });
  };

  const handleAmountBlur = (subcategory) => {
    const updatedAmount = parseFloat(amounts[subcategory] || initialAmounts[subcategory] || '0.0');
    if (isNaN(updatedAmount) || updatedAmount < 0) {
      setAmounts({ ...amounts, [subcategory]: initialAmounts[subcategory] || '0.0' });
    } else {
      onAddTransaction(subcategory, updatedAmount);
      setIsEditing(false);
      setActiveSubcategory(null);
    }
  };

  const handleAddSubcategory = () => {
    if (!newSubcategoryName) {
      Alert.alert('Error', 'Please enter a name for the subcategory.');
      return;
    }
    onAddSubcategory(category, newSubcategoryName);
    setNewSubcategoryName('');
    setIsAddingSubcategory(false);
  };

  return (
    <View style={styles.subCategoryContainer}>
      {subcategories.map((subcat) => (
        <View key={subcat} style={styles.subCategoryItem}>
          <Text style={styles.subCategoryText}>{subcat}</Text>

          <TouchableOpacity onPress={() => handleAmountPress(subcat)}>
            {activeSubcategory === subcat ? (
              <TextInput
                value={amounts[subcat] || ''} // If amounts[subcat] is empty, show an empty input field
                onChangeText={(text) => handleAmountChange(subcat, text)}
                keyboardType="numeric"
                style={styles.input}
                onBlur={() => handleAmountBlur(subcat)}
                autoFocus
              />
            ) : (
              <Text style={styles.subAmountText}>
                ${parseFloat(amounts[subcat] || '0').toFixed(2)} {/* Display 0.00 if no value */}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ))}

      {!isAddingSubcategory ? (
        <TouchableOpacity onPress={() => setIsAddingSubcategory(true)}>
          <Text style={styles.addSubcategoryText}>+ Add Item</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.addSubcategoryContainer}>
          <TextInput
            style={styles.input}
            value={newSubcategoryName}
            onChangeText={setNewSubcategoryName}
            placeholder="Enter subcategory name"
          />
          <View style={styles.addSubcategoryActions}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddSubcategory}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsAddingSubcategory(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const BudgetPlanner = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState({
    Food: ["Groceries"],
    Personal: ["Phone", "Fun Money", "Hair/Cosmetics"],
    Transportation: ["Pet Care", "Child Care"],
    Education: ["Tuition", "Books"],
    Housing: ["Monthly rent", "Electricity bill"],
    Entertainment: ["Spotify subscription", "Concert tickets"],
  });
  const initialBudget = 260;

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });

  const [isPickerVisible, setPickerVisible] = useState(false);

  const getTotalSpent = () => transactions.reduce((sum, t) => sum + t.amount, 0);
  const getRemainingBudget = () => initialBudget - getTotalSpent();

  const handleAddTransaction = (subcategory, amount) => {
    setTransactions((prev) => {
      const newBudgets = prev.filter(t => t.subcategory !== subcategory);
      return [...newBudgets, { subcategory, amount }];
    });
  };

  const handlePreviousMonth = () => {
    if (selectedMonth.month === 0) {
      setSelectedMonth({ month: 11, year: selectedMonth.year - 1 });
    } else {
      setSelectedMonth({ month: selectedMonth.month - 1, year: selectedMonth.year });
    }
  };

  const handleNextMonth = () => {
    if (
      selectedMonth.month !== currentDate.getMonth() ||
      selectedMonth.year !== currentDate.getFullYear()
    ) {
      if (selectedMonth.month === 11) {
        setSelectedMonth({ month: 0, year: selectedMonth.year + 1 });
      } else {
        setSelectedMonth({ month: selectedMonth.month + 1, year: selectedMonth.year });
      }
    }
  };

  const isNextMonthDisabled =
    selectedMonth.month === currentDate.getMonth() &&
    selectedMonth.year === currentDate.getFullYear();

  const handleAddSubcategory = (category, newSubcategory) => {
    setCategories(prevCategories => {
      const updatedCategory = [...prevCategories[category], newSubcategory];
      return { ...prevCategories, [category]: updatedCategory };
    });
  };

  const getCurrentAmountForCategory = (categorySubcategories) => {
    return categorySubcategories.reduce((sum, subcat) => {
      const subcategoryTotal = transactions
        .filter((t) => t.subcategory === subcat)
        .reduce((subSum, t) => subSum + t.amount, 0);

      const initialAmount = parseFloat(initialAmounts[subcat] || '0.00');
      return sum + (subcategoryTotal || initialAmount);
    }, 0);
  };

  const getProgressBarColor = (categorySpent, initialAmount) => {
    const progress = (categorySpent / initialAmount) * 100;
    if (progress >= 100) return 'red';
    if (progress >= 90) return 'yellow';
    return 'green';
  };

  return (
    <View style={styles.container}>
      {/* Monthly Navigation */}
      <View style={styles.monthNavigationContainer}>
  {/* Previous Month Arrow */}
  <TouchableOpacity
    style={styles.arrowButton}
    onPress={handlePreviousMonth}
  >
    <FontAwesome name="chevron-left" size={20} color="white" />
  </TouchableOpacity>

  {/* Dropdown Button */}
  <TouchableOpacity
    style={styles.dropdownButton}
    onPress={() => setPickerVisible(true)} // Show the modal
  >
    <Text style={styles.dropdownButtonText}>
      {new Date(selectedMonth.year, selectedMonth.month).toLocaleString('default', { month: 'long' })} {selectedMonth.year}
    </Text>
  </TouchableOpacity>

  {/* Next Month Arrow */}
  <TouchableOpacity
    style={styles.arrowButton}
    onPress={handleNextMonth}
    disabled={isNextMonthDisabled}
  >
    <FontAwesome name="chevron-right" size={20} color="white" />
  </TouchableOpacity>
</View>


      {transactions.reduce((sum, t) => sum + t.amount, 0) > initialBudget && (
        <Text style={styles.warningText}>Warning: You’re out of budget!</Text>
      )}

      <ScrollView style={styles.scrollView}>
        {Object.entries(categories).map(([category, subcategories]) => {
          const categorySpent = getCurrentAmountForCategory(subcategories);
          const initialAmount = subcategories.reduce((sum, subcat) => {
            return sum + parseFloat(initialAmounts[subcat] || '0.00');
          }, 0);
          const progress = (categorySpent / initialAmount) * 100;

          return (
            <View key={category} style={styles.categoryContainer}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <Text style={styles.amountText}>
                  Total: ${categorySpent.toFixed(2)}
                </Text>
              </View>

              <View style={styles.progressBarContainer}>
                <View
                  style={{
                    ...styles.progressBar,
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: getProgressBarColor(categorySpent, initialAmount),
                  }}
                />
              </View>

              <SubCategoryList
                category={category}
                subcategories={subcategories}
                onAddTransaction={() => {}}
                transactions={transactions}
                onAddSubcategory={() => {}}
              />
            </View>
          );
        })}
      </ScrollView>
      <Modal
  visible={isPickerVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setPickerVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Select Month</Text>
      <Picker
        selectedValue={`${selectedMonth.month}-${selectedMonth.year}`}
        onValueChange={(itemValue) => {
          const [month, year] = itemValue.split('-').map(Number);
          setSelectedMonth({ month, year });
          setPickerVisible(false);
        }}
        style={styles.picker}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <Picker.Item
            key={i}
            label={`${new Date(selectedMonth.year, i).toLocaleString('default', { month: 'long' })} ${selectedMonth.year}`}
            value={`${i}-${selectedMonth.year}`}
          />
        ))}
      </Picker>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setPickerVisible(false)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
  </View>
   
  );
};

const styles = {
  container: {
    backgroundColor: '#e8d0f4',
    flex: 1,
  },
  // header and headerText are purple bar at the top
  header: {
    padding: 10,
    marginLeft: 0,
    backgroundColor: 'purple',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  remainingBudgetText: {
    color: 'purple',
    fontSize: 20,
    textAlign: 'left',
    fontWeight: 'bold',
    margin: 15,
  },
  warningText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  scrollView: {
    marginBottom: 10,
  },
  categoryContainer: {
    marginTop: 5,
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    flexGrow: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  amountText: {
    flexDirection: 'row',
  },
  amountUsed: {
    fontSize: 18,
    color: '#999',
  },
  
  amountTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  addSubCat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  subAmountText: {
    color: 'purple', // Updated to purple
    fontSize: 18,
  },

  progressBarContainer: {
    height: 10,
    marginTop: 5,
    marginBottom: 10, 
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  progressPercentage: {  
    position: 'absolute',  
    top: 0,
    color: 'white',  
    fontSize: 10,  
  },  
  subCategoryContainer: {
    paddingLeft: 5,
    // paddingRight: 5,
    paddingBottom: 10,
    // marginBottom: 5,
    borderRadius: 10,
    flexGrow: 1,
  },
  subCategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5, // Decrease padding to make it smaller
    paddingHorizontal: 10, // Adjust horizontal padding
  },
  subCategoryText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    width: '60%',
    height: 40, // Adjust the height
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    paddingLeft: 10,
    marginBottom: 10, 
    fontSize: 14,
    borderRadius: 8,
  },
  editSubcatAmount: {
    width: 100,
    height: 40, 
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    paddingLeft: 10,
    marginBottom: 10, 
    fontSize: 14,
    borderRadius: 8,
  },

  amountInput: {
    width: '35%', // Set a smaller width for the amount input
    height: 40, // Match the height of the subcategory input
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginBottom: 10,
    fontSize: 14, // Match font size
    borderRadius: 8,
  },
  addSubcategoryText: {
    color: 'purple',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 10,
    marginHorizontal: 10,

  },
  addSubcategoryContainer: {
    marginVertical: 10,
  },
  addSubcategoryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    fontSize: 16,
  },
  addButtonText: {
    color: 'purple',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 18,
    alignSelf: 'center',
  },
  monthNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 0,
    marginVertical: 0,
  },
  arrowButton: {
    padding: 10.3,
    backgroundColor: 'purple',
    borderRadius: 0,
    height: 42,
    justifyContent: 'center',
  },
  dropdownButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  dropdownButton: {
    backgroundColor: 'purple',
    padding: 10.3,
    alignItems: 'center',
    alignItems: 'center',
    borderRadius: 0,
    width: '82.5%',
  },
  picker: {
    width: '100%',
  },
  dropdownButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
};

export default BudgetPlanner;
