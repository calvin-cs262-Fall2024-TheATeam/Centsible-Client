import React, { useState, useEffect, useMemo } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const BudgetPlanner = () => {

  const isDarkMode = useColorScheme() === 'dark';

  const pickerStyles = StyleSheet.create({
    picker: {
      width: '100%',
      color: isDarkMode ? '#ffffff' : '#000000', // White text for dark mode, black for light mode
      backgroundColor: isDarkMode ? '#333333' : '#ffffff', // Dark background for dark mode, light for light mode
    },
    pickerItem: {
      color: isDarkMode ? '#ffffff' : '#000000', // Text color for items
    },
  });

  const currentDate = new Date(); // Get today's date
  const [selectedMonth, setSelectedMonth] = useState({
    month: currentDate.getMonth(), // Initialize with the current month (0-based index)
    year: currentDate.getFullYear(), // Initialize with the current year
  });
  const [isPickerVisible, setPickerVisible] = useState(false);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [editingAmount, setEditingAmount] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [newAmount, setNewAmount] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [isBudgetExists, setIsBudgetExists] = useState(false); // State to track if budget exists
  const [newSubcategoryAmount, setNewSubcategoryAmount] = useState('')


  // Fetch initial data on component mount
  const fetchBudgetData = async () => {
    const { month, year } = selectedMonth;
    try {
      // Fetch categories
      const budgetResponse = await fetch(`https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/monthBudget/1/${month+1}/${year}`);

      if (budgetResponse.ok) {
        const budgetData = await budgetResponse.json();

        // Check if budgetData and budgetData.data are valid arrays
        if (Array.isArray(budgetData.data)) {
          setCategories(budgetData.data); // Set the categories
          setIsBudgetExists(true);  // Mark that the budget exists

          const categoryIDs = budgetData.data.map(category => category.id);

          // Initialize an array to store subcategories
          const subcategoriesData = [];

          // Fetch subcategories for each category
          for (let categoryId of categoryIDs) {
            try {
              const subcatResponse = await fetch(`https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/budgetSubcategory/${categoryId}`);

              if (subcatResponse.ok) {
                const subcatData = await subcatResponse.json();

                // If there are subcategories, add them to the array
                if (Array.isArray(subcatData.data)) {
                  subcategoriesData.push(...subcatData.data); // Add valid subcategories
                }
              } else {
                // If no subcategories are found (404), you can skip that category or handle accordingly
                if (subcatResponse.status === 404) {
                  console.log(`No subcategories found for category ${categoryId}`);
                }
              }
            } catch (error) {
              console.error(`Error fetching subcategories for category ID ${categoryId}:`, error);
            }
          }

          // After looping through all categories, update the state with subcategories
          setSubcategories(subcategoriesData);

          // Create amounts map for subcategories
          const amountsMap = {};
          subcategoriesData.forEach((subcat) => {
            amountsMap[subcat.id] = parseFloat(subcat.monthlydollaramount).toFixed(2);
          });
          setAmounts(amountsMap);

          console.log('Budget data and subcategory data fetched:', { budgetData, subcategoriesData });
        } else {
          // If the response data is not in the expected format
          console.error('Unexpected response format for budget data:', budgetData);
        }
      } else {
        // If no data, handle accordingly
        if (budgetResponse.status === 404) {
          setIsBudgetExists(false); // Mark as no data
          console.log('No budget data found, creating default budget');
        }
      }

      // Fetch transactions data
      const transactionsResponse = await fetch(`https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/transactions/1`);

      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData);
      } else {
        throw new Error('Failed to fetch transactions');
      }

    } catch (error) {
      console.error('Error initializing data:', error);
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    fetchBudgetData(); // Call the fetch function on initial render
  }, [selectedMonth]);

  const createDefaultMonthBudget = async (month, year) => {
    appuserID = 1;
    try {
      const response = await fetch(
        'https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/defaultMonthBudget', // Replace with your actual API endpoint
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            appuserID,   // User ID from your app (can be fetched from auth or state)
            month,       // The month for the budget
            year,        // The year for the budget
          }),
        }
      );

      if (response.ok) {
        // Handle success - you can update the UI or notify the user
        setIsBudgetExists(true); // Set budget as created successfully
        fetchBudgetData(); // Re-fetch the budget data to display
      } else {
        const errorText = await response.text();
        throw new Error('Failed to create default month budget: ' + errorText);
      }
    } catch (error) {
      console.error('Error creating default month budget:', error);
      Alert.alert('Error', error.message);
    }
  };

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
      // Optimistically update the subcategories state before backend request
      const newSubcategory = {
        budgetcategoryID: categoryId,
        subcategoryname: subcategoryName,
        monthlydollaramount: parseFloat(monthlyAmount).toFixed(2),
      };
  
      // Optimistically add the new subcategory to state
      setSubcategories((prevSubcategories) => {
        const updatedSubcategories = [...prevSubcategories];
        const categoryIndex = updatedSubcategories.findIndex((subcat) => subcat.budgetcategoryID === categoryId);
        if (categoryIndex === -1) {
          updatedSubcategories.push(newSubcategory);
        } else {
          updatedSubcategories.splice(categoryIndex + 1, 0, newSubcategory);
        }
        return updatedSubcategories;
      });
  
      // Call the backend API to add the new subcategory
      const response = await fetch(
        'https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/budgetSubcategory',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSubcategory),
        }
      );
  
      if (response.ok) {
        const addedSubcategory = await response.json();
        // Update the state with the actual data from the backend
        setSubcategories((prevSubcategories) =>
          prevSubcategories.map((subcat) => (subcat.id === addedSubcategory.id ? addedSubcategory : subcat))
        );
        setAmounts((prevAmounts) => ({ ...prevAmounts, [addedSubcategory.id]: monthlyAmount }));
  
        // Refresh the subcategories list for the specific category
        const refreshSubcategories = async () => {
          try {
            const subcatResponse = await fetch(
              `https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/budgetSubcategory/${categoryId}`
            );
            if (subcatResponse.ok) {
              const subcatData = await subcatResponse.json();
              // Update only the subcategories for the specific category
              setSubcategories((prevSubcategories) =>
                prevSubcategories.map((subcat) =>
                  subcat.budgetcategoryID === categoryId ? subcatData.find((s) => s.id === subcat.id) || subcat : subcat
                )
              );
            } else {
              console.error(`Failed to refresh subcategories for category ID ${categoryId}`);
            }
          } catch (error) {
            console.error('Error refreshing subcategories:', error);
          }
        };
        refreshSubcategories();
      } else {
        // Handle backend error, and revert optimistic update if needed
        console.error('Failed to add subcategory');
        Alert.alert('Error', 'Failed to add subcategory');
        setSubcategories((prevSubcategories) =>
          prevSubcategories.filter((subcat) => subcat !== newSubcategory)
        );
      }
    } catch (error) {
      console.error('Error adding subcategory:', error);
      Alert.alert('Error', error.message); // Display error to the user
      // Revert the optimistic update if needed
      setSubcategories((prevSubcategories) =>
        prevSubcategories.filter((subcat) => subcat !== newSubcategory)
      );
    } finally {
      setIsAddingSubcategory({ ...isAddingSubcategory, [categoryId]: false });
      setNewSubcategoryName('');
      setNewSubcategoryAmount('');
    }
  };
  
  
  

  const groupedSubcategories = useMemo(() => {
    const grouped = {};
    subcategories.forEach((subcategory) => {
      if (!grouped[subcategory.budgetcategoryid]) {
        grouped[subcategory.budgetcategoryid] = [];
      }
      grouped[subcategory.budgetcategoryid].push(subcategory);
    });
    return grouped;
  }, [subcategories]); 
  

  const calculateCategorySpent = (categoryId) => {
    const filteredTransactions = transactions.filter(
      (txn) => txn.transactiontype === 'Expense' && txn.budgetcategoryid === categoryId
    );
    return filteredTransactions.reduce((sum, txn) => sum + parseFloat(txn.dollaramount), 0);
  };

 const getTotalForCategory = (categoryId) => {
  return subcategories
    .filter((subcategory) => subcategory.budgetcategoryid === categoryId)
    .reduce((sum, subcategory) => sum + parseFloat(amounts[subcategory.id] || 0), 0);
};


const getProgressBarColor = (spent, total) => {
  console.log("Spent:", spent, "Total:", total);
  if ((total === 0) && (spent === 0)) {
    return 'f0f0f0';
  }
  if (total == 0) {
    // If total is 0 (no allocated amount), show red (over budget)
    return '#cc0000';
  }

  const ratio = spent / total;
  console.log(ratio);
  if ((ratio > 1) || (ratio === NaN) || (ratio === Infinity) ) return '#cc0000';  // Over budget
  if (ratio > 0.75) return '#ff9933';  // 75% to 100% spent
  return '#006600';  // Below 75%, green for safe budget
};


  return (
    <View style= {styles.container}>
      <View style={styles.monthNavigationContainer}>
        <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => {
                const newMonth = selectedMonth.month === 0 ? 11 : selectedMonth.month - 1;
                const newYear = selectedMonth.month === 0 ? selectedMonth.year - 1 : selectedMonth.year;
                setSelectedMonth({ month: newMonth, year: newYear });
              }}
            >
              <FontAwesome name="chevron-left" size={20} color="white" />


        </TouchableOpacity>

    {/* Dropdown Button */}
    <TouchableOpacity
      style={styles.dropdownButton}
      onPress={() => setPickerVisible(true)}
    >
      <Text style={styles.dropdownButtonText}>
        {new Date(selectedMonth.year, selectedMonth.month).toLocaleString('default', { month: 'long' })} {selectedMonth.year}
      </Text>
    </TouchableOpacity>

        {/* Next Month Arrow */}
        <TouchableOpacity
      style={styles.arrowButton}
      onPress={() => {
        const newMonth = selectedMonth.month === 11 ? 0 : selectedMonth.month + 1;
        const newYear = selectedMonth.month === 11 ? selectedMonth.year + 1 : selectedMonth.year;
        setSelectedMonth({ month: newMonth, year: newYear });
      }}
    >
      <FontAwesome name="chevron-right" size={20} color="white" />
    </TouchableOpacity>

      </View>
  
      <ScrollView style={styles.scrollView}>
        {categories.map((category) => {
          const categorySpent = calculateCategorySpent(category.id);
          const totalAmount = getTotalForCategory(category.id);
          const amountRemaining = totalAmount - categorySpent;
          const isOverBudget = amountRemaining < 0;
          const progress = totalAmount ? (categorySpent / totalAmount) * 100 : 100;
          
          return (
            <View key={category.id} style={styles.categoryContainer}>
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

               {/* Move progress bar above category header */} 
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
                      <Text style={styles.subAmountText}>
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
             <Modal
        visible={isPickerVisible} // Show/hide modal
        transparent={true} // Makes the modal overlay transparent
        animationType="slide" // Slide-in effect
        onRequestClose={() => setPickerVisible(false)} // Close modal on back press
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Month</Text>
            <Picker
              selectedValue={`${selectedMonth.month}-${selectedMonth.year}`} // Use a string as value
              onValueChange={async (itemValue) => {
                const [month, year] = itemValue.split('-').map(Number); // Parse the selected value
                setSelectedMonth({ month, year }); // Update state with parsed values
                setPickerVisible(false); // Close modal after selection

                await createDefaultMonthBudget(month, year);
              }}
              style={styles.picker}
              itemStyle={pickerStyles.pickerItem}
            >
              {Array.from({ length: currentDate.getMonth() + 1 }, (_, i) => (
                <Picker.Item
                  key={i}
                  label={`${new Date(currentDate.getFullYear(), i).toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`}
                  value={`${i}-${currentDate.getFullYear()}`} // Use a string representation
                />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPickerVisible(false)} // Close modal without selection
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    padding: 10,
    backgroundColor: '#231942',
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
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#231942',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#dcdcdc',
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

  addTemplateBudget: {
    padding: 7,
    backgroundColor: 'purple',
    borderRadius: 5,
    color: 'white',
    marginHorizontal: 47,
    fontSize: 18,
    marginTop: 15,
    textAlign: 'center'
  },
  
  monthNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  arrowButton: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#231942',
    borderRadius: 0,
    height: 42
  },
  dropdownButton: {
    flex: 1,
    backgroundColor: '#231942',
    padding: 10,
    borderRadius: 0,
    marginHorizontal: 0,
    height: 42
  },
  dropdownButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
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
  picker: {
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default BudgetPlanner;