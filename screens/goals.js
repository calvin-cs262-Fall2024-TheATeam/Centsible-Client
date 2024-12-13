import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';

const BudgetPlanner = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState({});
  const [amounts, setAmounts] = useState({});
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryAmount, setNewSubcategoryAmount] = useState('');
  const currentUserId = 1;

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const transactionsResponse = await fetch(
          'https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/transactions/1'
        );
  
        if (!transactionsResponse.ok) {
          console.error('Transactions Error:', transactionsResponse.status, await transactionsResponse.text());
          throw new Error(`Failed to fetch transactions: ${transactionsResponse.status}`);
        }
  
        const transactionsData = await transactionsResponse.json();
        console.log('Transactions Data:', transactionsData);
        setTransactions(transactionsData);
  
        const categoriesResponse = await fetch(
          'https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/monthBudget/1/12/2024'
        );
  
        if (!categoriesResponse.ok) {
          console.error('Categories Error:', categoriesResponse.status, await categoriesResponse.text());
          throw new Error(`Failed to fetch month budget: ${categoriesResponse.status}`);
        }
  
        const categoriesData = await categoriesResponse.json();
        console.log('Categories Data:', categoriesData);
  
        const categoriesMap = {};
        const amountsMap = {};
        categoriesData.forEach((item) => {
          categoriesMap[item.categoryname] = [];
          amountsMap[item.categoryname] = parseFloat(item.monthlydollaramount).toFixed(2);
        });
        setCategories(categoriesMap);
        setAmounts(amountsMap);
      } catch (error) {
        console.error('Error initializing data:', error);
        Alert.alert('Error', error.message);
      }
    };
  
    fetchInitialData();
  }, []);
  
  // Add subcategory
  const addSubcategory = async (categoryId, subcategoryName, subcategoryAmount) => {
    try {
      const response = await fetch('https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/budgetSubcategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budgetcategoryID: categoryId,
          subcategoryname: subcategoryName,
          monthlydollaramount: parseFloat(subcategoryAmount),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add subcategory.');
      }

      setCategories((prev) => ({
        ...prev,
        [categoryId]: [...(prev[categoryId] || []), subcategoryName],
    }));

      setAmounts((prev) => ({
        ...prev,
        [subcategoryName]: parseFloat(subcategoryAmount).toFixed(2),
    }));
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  };

  // Update subcategory amount
  const updateSubcategoryAmount = async (subcategoryId, newAmount) => {
    try {
      const response = await fetch('https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/budgetSubcategoryAmount', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: subcategoryId,
          monthlydollaramount: parseFloat(newAmount),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subcategory amount.');
      }

      setAmounts((prev) => ({
        ...prev,
        [subcategoryId]: parseFloat(newAmount).toFixed(2),
    }));
    } catch (error) {
      console.error('Error updating subcategory amount:', error);
    }
  };

  // Delete subcategory
  const deleteSubcategory = async (subcategoryId, categoryName) => {
    try {
      const response = await fetch(`https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/budgetSubcategory/${subcategoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${API_KEY}`, // Include the API key here
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete subcategory.');
      }
  
      setCategories((prev) => ({
        ...prev,
        [categoryName]: prev[categoryName].filter((subcat) => subcat !== subcategoryId),
    }));
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };

  // Calculate total for category
  const getTotalForCategory = (category) => {
    const subcategories = categories[category] || [];
    return subcategories.reduce((sum, subcat) => sum + parseFloat(amounts[subcat] || '0'), 0);
  };

  const handleAddSubcategory = () => {
    if (!newSubcategoryName || !newSubcategoryAmount) {
      console.error('Subcategory name or amount is missing.');
      return;
    }
    addSubcategory(currentUserId, newSubcategoryName, newSubcategoryAmount);
    setNewSubcategoryName('');
    setNewSubcategoryAmount('');
    setIsAddingSubcategory(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>December 2024</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {Object.entries(categories).map(([category, subcategories]) => (
          <View key={category} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category}</Text>

            {subcategories.map((subcat) => (
              <View key={subcat} style={styles.subCategoryItem}>
                <Text style={styles.subCategoryText}>{subcat}</Text>
                <TextInput
                  style={styles.amountInput}
                  keyboardType="numeric"
                  value={amounts[subcat]?.toString() || '0'}
                  onChangeText={(value) => updateSubcategoryAmount(subcat, value)}
                />
                <TouchableOpacity onPress={() => deleteSubcategory(subcat, category)}>
                  <Text style={styles.deleteText}>Delete</Text>
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
                  placeholder="Subcategory Name"
                  value={newSubcategoryName}
                  onChangeText={setNewSubcategoryName}
                />
                <TextInput
                  style={styles.amountInput}
                  placeholder="Amount"
                  keyboardType="numeric"
                  value={newSubcategoryAmount}
                  onChangeText={setNewSubcategoryAmount}
                />
                <TouchableOpacity onPress={handleAddSubcategory}>
                  <Text style={styles.addText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsAddingSubcategory(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
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
};

export default BudgetPlanner;