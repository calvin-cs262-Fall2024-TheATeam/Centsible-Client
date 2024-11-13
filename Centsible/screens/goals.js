import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';

const SubCategoryList = ({ subcategories, onAddTransaction, transactions, onAddSubcategory, category }) => {
  const [amounts, setAmounts] = useState({}); // Store subcategory amounts
  const [isEditing, setIsEditing] = useState(false); // Track if we are editing
  const [activeSubcategory, setActiveSubcategory] = useState(null); // Track which subcategory is being edited
  const [newSubcategoryName, setNewSubcategoryName] = useState(''); // State to track new subcategory name
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false); // To track if we are in add subcategory mode

  // Handle when a subcategory amount is clicked (for editing)
  const handleAmountPress = (subcategory) => {
    setActiveSubcategory(subcategory); // Set the active subcategory to be edited
    setIsEditing(true); // Enable editing mode
  };

  // Handle changes in the amount (on text input change)
  const handleAmountChange = (subcategory, value) => {
    // Remove all non-numeric characters except the decimal point
    let formattedValue = value.replace(/[^0-9.]/g, '');

    // Ensure that the value doesn't have more than one decimal point
    const parts = formattedValue.split('.');
    if (parts.length > 2) return; // Prevent multiple decimals
    if (parts[1] && parts[1].length > 3) return; // Limit decimals to 3 places

    // Prevent leading zeros unless the value is '0.'
    if (formattedValue.startsWith('0') && !formattedValue.startsWith('0.') && formattedValue.length > 1) {
      formattedValue = formattedValue.substring(1);
    }

    setAmounts({ ...amounts, [subcategory]: formattedValue }); // Update subcategory amount
  };

  // Handle when user finishes editing (on blur)
  const handleAmountBlur = (subcategory) => {
    const updatedAmount = parseFloat(amounts[subcategory] || '0.0');
    if (isNaN(updatedAmount) || updatedAmount < 0) {
      // Reset to $0.0 if the amount is invalid
      setAmounts({ ...amounts, [subcategory]: '0.0' });
    } else {
      // Save the amount in the transactions
      onAddTransaction(subcategory, updatedAmount);
      setIsEditing(false); // Exit editing mode
      setActiveSubcategory(null); // Reset active subcategory
    }
  };

  const handleAddSubcategory = () => {
    if (!newSubcategoryName) {
      Alert.alert('Error', 'Please enter a name for the subcategory.');
      return;
    }
    onAddSubcategory(category, newSubcategoryName); // Add new subcategory to the category
    setNewSubcategoryName(''); // Clear the input field
    setIsAddingSubcategory(false); // Exit adding mode
  };

  return (
    <ScrollView style={styles.subCategoryContainer}>
      {subcategories.map((subcat) => (
        <View key={subcat} style={styles.subCategoryItem}>
          <Text style={styles.subCategoryText}>{subcat}</Text>

          {/* Editable amount for each subcategory */}
          <TouchableOpacity onPress={() => handleAmountPress(subcat)}>
            {activeSubcategory === subcat ? (
              <TextInput
                value={amounts[subcat] || '0'} // Use the amount stored for the subcategory
                onChangeText={(text) => handleAmountChange(subcat, text)} // Update the amount as text changes
                keyboardType="numeric"
                style={styles.input}
                onBlur={() => handleAmountBlur(subcat)} // Save when editing is done
                autoFocus
              />
            ) : (
              <Text style={styles.subAmountText}>
                ${parseFloat(amounts[subcat] || '0').toFixed(2)} {/* Show amount with two decimals */}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ))}

      {/* Add New Subcategory Section */}
      {!isAddingSubcategory ? (
        <TouchableOpacity
          onPress={() => setIsAddingSubcategory(true)}
        >
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
            {/* Left Aligned Add */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddSubcategory}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            {/* Right Aligned Cancel */}
            <TouchableOpacity onPress={() => setIsAddingSubcategory(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const BudgetPlanner = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState({
    Food: ["Food"],
    Personal: ["Phone", "Fun Money", "Hair/Cosmetics", "Subscriptions"],
    Lifestyle: ["Pet Care", "Child Care"],
  });
  const initialBudget = 260;

  const getTotalSpent = () => transactions.reduce((sum, t) => sum + t.amount, 0);
  const getRemainingBudget = () => initialBudget - getTotalSpent();

  const handleAddTransaction = (subcategory, amount) => {
    // Update the transactions with the new amount for the selected subcategory
    setTransactions((prev) => {
      const newTransactions = prev.filter(t => t.subcategory !== subcategory); // Remove previous transaction if exists
      return [...newTransactions, { subcategory, amount }];
    });
  };

  const handleAddSubcategory = (category, newSubcategory) => {
    // Add the new subcategory to the category
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
      return sum + subcategoryTotal;
    }, 0);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>November 2024</Text>
      </View>

      {/* Remaining budget with warning if below zero */}
      <Text style={styles.remainingBudgetText}>
        ${getRemainingBudget().toFixed(2)} left to budget
      </Text>
      {getRemainingBudget() < 0 && (
        <Text style={styles.warningText}>Warning: You’re out of budget!</Text>
      )}

      {/* Category List */}
      <ScrollView style={styles.scrollView}>
        {Object.entries(categories).map(([category, subcategories]) => {
          return (
            <View key={category} style={styles.categoryContainer}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category}</Text>
                
                {/* Display the total amount for the category */}
                <Text style={styles.amountText}>
                  Total: ${getCurrentAmountForCategory(subcategories).toFixed(2)}
                </Text>
              </View>

              {/* Subcategories list */}
              <SubCategoryList
                category={category}
                subcategories={subcategories}
                onAddTransaction={handleAddTransaction}
                transactions={transactions}
                onAddSubcategory={handleAddSubcategory}
              />
            </View>
          );
        })}
      </ScrollView>
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
    paddingLeft: 14,
    paddingRight: 14,
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
    flex: 1,
  },
  categoryContainer: {
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: 5,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subAmountText: {
    color: 'purple',
    fontSize: 18,
    // fontWeight: '',
  },
  subCategoryContainer: {
    paddingLeft: 10,
    marginBottom: 5,
    maxHeight: 100, // Limit the height of the subcategory list for scrolling
  },
  subCategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  subCategoryText: {
    fontSize: 16,
    color: '#333',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    width: 200,
    textAlign: 'right',
  },
  addSubcategoryText: {
    color: 'purple',
    fontSize: 16,
    textAlign: 'left',
    textDecorationLine: 'underline',
  },
  addSubcategoryContainer: {
    marginTop: 10,
  },
  addSubcategoryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align Add on the left and Cancel on the right
  },
  addButton: {
    padding: 5,
  },
  addButtonText: {
    color: 'purple',
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 16,
    alignSelf: 'center',
  },
};

export default BudgetPlanner;
