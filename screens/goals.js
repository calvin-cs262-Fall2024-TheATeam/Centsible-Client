import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';

const BudgetPlanner = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [editingAmount, setEditingAmount] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [newAmount, setNewAmount] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false); 
  const [newSubcategoryAmount, setNewSubcategoryAmount] = useState('')

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const categoriesResponse = await fetch('https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/monthBudget/1/12/2024');
        const subcatResponse = await fetch('https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/budgetSubcategory/1');
        const transactionsResponse = await fetch('https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/transactions/1');

        if (!categoriesResponse.ok || !subcatResponse.ok || !transactionsResponse.ok) {
          throw new Error('Failed to fetch data.');
        }

        const categoriesData = await categoriesResponse.json();
        const subcatData = await subcatResponse.json();
        const transactionsData = await transactionsResponse.json();

        setCategories(categoriesData);
        setSubcategories(subcatData);
        setTransactions(transactionsData);

        const amountsMap = {};
        subcatData.forEach((subcat) => {
          amountsMap[subcat.id] = parseFloat(subcat.monthlydollaramount).toFixed(2);
        });
        setAmounts(amountsMap);
      } catch (error) {
        console.error('Error initializing data:', error);
        Alert.alert('Error', error.message);
      }
    };

    fetchInitialData();
  }, []);
  
  const updateSubcategoryAmount = async (subcategoryId, newAmount) => {
    try {
      // Ensure the amount is valid and format it to 2 decimal places
      const formattedAmount = parseFloat(newAmount).toFixed(2);
  
      // Call the backend API to update the subcategory amount
      const response = await fetch(
        'https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/budgetSubcategoryAmount',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: subcategoryId, // Subcategory ID to identify the record
            monthlydollaramount: formattedAmount, // New amount to update
          }),
        }
      );
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to update subcategory amount.');
      }
  
      // Update the state with the new amount after backend confirms the update
      setAmounts((prevAmounts) => ({
        ...prevAmounts,
        [subcategoryId]: formattedAmount,
      }));
  
      // Reset the editing state
      setEditingAmount(null);
      setNewAmount('');
    } catch (error) {
      console.error('Error updating subcategory amount:', error);
      Alert.alert('Error', error.message); // Display error to the user
    }
  };
  
  const updateSubcategoryName = async (subcategoryId, newSubcategoryName) => {
    if (!newSubcategoryName.trim()) {
      Alert.alert('Error', 'Subcategory name cannot be empty.');
      return;
    }
  
    try {
      // Call the backend API to update the subcategory name
      const response = await fetch(
        'https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/budgetSubcategoryName',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: subcategoryId, // Subcategory ID to identify the record
            subcategoryname: newSubcategoryName, // Updated subcategory name
          }),
        }
      );
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to update subcategory name.');
      }
  
      // Update the subcategories state with the new name
      setSubcategories((prevSubcategories) =>
        prevSubcategories.map((subcat) =>
          subcat.id === subcategoryId
            ? { ...subcat, subcategoryname: newSubcategoryName }
            : subcat
        )
      );
  
      // Reset the editing state
      setEditingSubcategory(null);
      setNewSubcategoryName('');
    } catch (error) {
      console.error('Error updating subcategory name:', error);
      Alert.alert('Error', error.message); // Display error to the user
    }
  };

  const addSubcategory = async (categoryId, subcategoryName, monthlyAmount) => {
    if (!subcategoryName.trim() || !monthlyAmount) {
      Alert.alert('Error', 'Subcategory name and amount cannot be empty.');
      return;
    }
  
    try {
      // Ensure the amount is a valid number
      const formattedAmount = parseFloat(monthlyAmount).toFixed(2);
  
      // Call the backend API to add the new subcategory
      const response = await fetch(
        'https://cors-anywhere.herokuapp.com/https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/budgetSubcategory',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            budgetcategoryid: categoryId, // ID of the parent category
            subcategoryname: subcategoryName, // Name of the new subcategory
            monthlydollaramount: formattedAmount, // Initial monthly amount
          }),
        }
      );
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to add new subcategory.');
      }
  
      // Parse the response to get the new subcategory data
      const newSubcategory = await response.json();
  
      // Update the subcategories state to include the new subcategory
      setSubcategories((prevSubcategories) => [...prevSubcategories, newSubcategory]);
  
      // Update the amounts state for the new subcategory
      setAmounts((prevAmounts) => ({
        ...prevAmounts,
        [newSubcategory.id]: formattedAmount, // Add the new subcategory amount
      }));
  
      // Clear the input fields or any UI state related to adding subcategories
      setNewSubcategoryName('');
      setNewAmount('');
    } catch (error) {
      console.error('Error adding subcategory:', error);
      Alert.alert('Error', error.message); // Display error to the user
    }
  };
  

  const groupedSubcategories = categories.reduce((acc, category) => {
    acc[category.id] = subcategories.filter((subcat) => subcat.budgetcategoryid === category.id);
    return acc;
  }, {});

  const calculateCategorySpent = (categoryName) => {
    return transactions
      .filter((transaction) => transaction.category === categoryName)
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getTotalForCategory = (categoryId) => {
    return groupedSubcategories[categoryId]?.reduce(
      (total, subcat) => total + parseFloat(amounts[subcat.id] || 0),
      0
    );
  };

  const getProgressBarColor = (spent, total) => {
    const ratio = spent / total;
    if (ratio > 1) return 'red';
    if (ratio > 0.75) return 'orange';
    return 'green';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>October 2024</Text>
      </View>
  
      <ScrollView style={styles.scrollView}>
        {categories.map((category) => {
          const categorySpent = calculateCategorySpent(category.categoryname);
          const totalAmount = getTotalForCategory(category.id);
          const amountRemaining = totalAmount - categorySpent;
          const isOverBudget = amountRemaining < 0;
          const progress = totalAmount ? (categorySpent / totalAmount) * 100 : 0;
  
          return (
            <View key={category.id} style={styles.categoryContainer}>
              <View style={styles.percentageAndBar}>
                <View style={styles.percentageContainer}>
                  <Text style={styles.progressPercentage}>{progress.toFixed(0)}%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={{
                      ...styles.progressBar,
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: getProgressBarColor(categorySpent, totalAmount),
                    }}
                  />
                </View>
              </View>
  
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category.categoryname}</Text>
                <View style={styles.spentRemaining}>
                  {isOverBudget ? (
                    <Text style={styles.spentRemaining}>
                      ${(amountRemaining * -1).toFixed(2)} over budget
                    </Text>
                  ) : (
                    <Text style={styles.spentRemaining}>
                      ${amountRemaining.toFixed(2)} remaining
                    </Text>
                  )}
                </View>
              </View>
  
              <View style={styles.amountTotalContainer}>
                <Text style={styles.amountTotal}>Total:</Text>
                <Text style={styles.amountTotalNumber}>${totalAmount.toFixed(2)}</Text>
              </View>
  
              {groupedSubcategories[category.id]?.map((subcat) => (
                <View key={subcat.id} style={styles.subCategoryItem}>
                  {editingSubcategory === subcat.id ? (
                    <TextInput
                      style={styles.subCategoryText}
                      value={newSubcategoryName}
                      onChangeText={setNewSubcategoryName}
                      onBlur={() =>
                        updateSubcategoryName(subcat.id, newSubcategoryName)
                      }
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setEditingSubcategory(subcat.id);
                        setNewSubcategoryName(subcat.subcategoryname);
                      }}
                    >
                      <Text style={styles.subCategoryText}>
                        {subcat.subcategoryname}
                      </Text>
                    </TouchableOpacity>
                  )}
  
                  {editingAmount === subcat.id ? (
                    <TextInput
                      style={styles.individualAmountInput}
                      value={newAmount}
                      onChangeText={setNewAmount}
                      keyboardType="numeric"
                      onBlur={() => updateSubcategoryAmount(subcat.id, newAmount)}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setEditingAmount(subcat.id);
                        setNewAmount(amounts[subcat.id]);
                      }}
                    >
                      <Text style={styles.amountText}>
                        ${amounts[subcat.id]}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
  
            {!isAddingSubcategory[category.id] ? (
            <TouchableOpacity onPress={() => setIsAddingSubcategory({ ...isAddingSubcategory, [category.id]: true })}>
              <Text style={styles.addSubcategoryText}>+ Add a subcategory</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.addSubcategoryContainer}>
              <View style={styles.addSubCat}>
                <TextInput
                  style={styles.input}
                  value={newSubcategoryName}
                  onChangeText={setNewSubcategoryName}
                  placeholder="Enter subcategory name"
                />
                <TextInput
                  style={styles.amountInput}
                  value={newSubcategoryAmount}
                  onChangeText={setNewSubcategoryAmount}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.addSubcategoryActions}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    addSubcategory(category.id, newSubcategoryName, newSubcategoryAmount); // Call addSubcategory
                    setIsAddingSubcategory({ ...isAddingSubcategory, [category.id]: false }); // Reset the UI state for that category
                  }}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsAddingSubcategory({ ...isAddingSubcategory, [category.id]: false })}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
  
const styles = {
  container: {
    backgroundColor: '#e8d0f4',
    flex: 1,
  },

  // header and headerText are purple bar at the top
  header: {
    padding: 10,
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
    marginTop: 10,
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
    marginLeft: 3,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  spentRemaining: {
    backgroundColor: '#f0f0f0',
    color: '#666',
    padding: 3,
    borderRadius: 5,
  },

  amountText: {
    flexDirection: 'row',
  },
  amountUsed: {
    fontSize: 18,
    color: '#999',
  },

  amountTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingBottom: 10,
    paddingTop: 5,
  },
  
  amountTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  amountTotalNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  percentageAndBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10, 
  },
  percentageContainer: {
    width: '10%',
    alignItems: 'center',
    height: 14,
  },
  progressBarContainer: {
    width: '90%',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    height: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  progressPercentage: {  
    color: 'gray',  
    fontSize: 12,  
  },  

  addSubCat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  subAmountText: {
    color: 'purple',
    fontSize: 18,
  },
  subCategoryContainer: {
    paddingLeft: 5,
    paddingBottom: 10,
    borderRadius: 10,
    flexGrow: 1,
  },
  subCategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
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

  individualAmountInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginBottom: 10,
    fontSize: 18,
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
};

export default BudgetPlanner;
