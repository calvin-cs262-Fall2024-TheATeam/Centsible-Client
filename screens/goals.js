import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';

const API_BASE_URL = "https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/";

const BudgetPlanner = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState({});
  const [amounts, setAmounts] = useState({});
  const currentUserId = 1;
  const currentMonth = 11;
  const currentYear = 2024;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Ensure default month budget exists
        const defaultBudgetResponse = await fetch(`${API_BASE_URL}defaultMonthBudget`, {
          method: 'POST',
          mode: "no-cors",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            appuserID: 1,
            month: currentMonth,
            year: currentYear,
          }),
        });

        if (!defaultBudgetResponse.ok) {
          throw new Error("Failed to create or verify default budget.");
        }

        console.log("Default budget created or verified.");

        // Fetch transactions and budget
        const transactionsResponse = await fetch(`${API_BASE_URL}transactions/${currentUserId}`);
        const categoriesResponse = await fetch(`${API_BASE_URL}monthBudget?appuserID=${currentUserId}&month=${currentMonth}&year=${currentYear}`);

        if (!transactionsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch transactions or month budget.");
        }

        const transactionsData = await transactionsResponse.json();
        const categoriesData = await categoriesResponse.json();

              // Fetch details for each category one by one
        const categoriesMap = {};
        const amountsMap = {};

        for (const category of categoriesData) {
          const categoryDetailsResponse = await fetch(`${API_BASE_URL}budgetCategoryName/${category.id}`);
          if (!categoryDetailsResponse.ok) {
          throw new Error(`Failed to fetch details for category ${category.id}`);
        }
          const categoryDetails = await categoryDetailsResponse.json();

          categoriesMap[categoryDetails.categoryname] = [];
          amountsMap[categoryDetails.categoryname] = parseFloat(category.monthlydollaramount).toFixed(2);
      }

      setCategories(categoriesMap);
      setAmounts(amountsMap);

      console.log('Processed Categories:', categoriesMap);
      console.log('Processed Amounts:', amountsMap);
    } catch (error) {
      console.error('Error initializing data:', error);
      Alert.alert('Error', 'Failed to initialize budget data.');
    }
  };

  fetchInitialData();
}, []);

  const addSubcategory = async (category, subcategoryName, subcategoryAmount) => {
    try {
      const response = await fetch(`${API_BASE_URL}budgetSubcategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budgetcategoryID: category, // Replace with actual category ID
          subcategoryname: subcategoryName,
          monthlydollaramount: parseFloat(subcategoryAmount),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add subcategory.");
      }

      setCategories((prev) => ({
        ...prev,
        [category]: [...prev[category], subcategoryName],
      }));

      setAmounts((prev) => ({
        ...prev,
        [subcategoryName]: parseFloat(subcategoryAmount).toFixed(2),
      }));
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  const updateSubcategoryAmount = async (subcategoryId, newAmount) => {
    try {
      const response = await fetch(`${API_BASE_URL}budgetSubcategoryAmount`, {
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
        throw new Error("Failed to update subcategory amount.");
      }

      setAmounts((prev) => ({
        ...prev,
        [subcategoryId]: parseFloat(newAmount).toFixed(2),
      }));
    } catch (error) {
      console.error("Error updating subcategory amount:", error);
    }
  };

  const deleteSubcategory = async (subcategoryId, categoryName) => {
    try {
      const response = await fetch(`${API_BASE_URL}budgetSubcategory/${subcategoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to delete subcategory.");
      }

      setCategories((prev) => ({
        ...prev,
        [categoryName]: prev[categoryName].filter((subcat) => subcat !== subcategoryId),
      }));
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  const getTotalForCategory = (category) => {
    const subcategories = categories[category] || [];
    return subcategories.reduce((sum, subcat) => sum + parseFloat(amounts[subcat] || '0'), 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>October 2024</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {Object.entries(categories).map(([category, subcategories]) => (
          <View key={category} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category}</Text>

            <SubCategoryList
              category={category}
              subcategories={subcategories}
              setCategories={setCategories}
              amounts={amounts}
              setAmounts={setAmounts}
              onAddSubcategory={addSubcategory}
              onUpdateSubcategoryAmount={updateSubcategoryAmount}
              onDeleteSubcategory={deleteSubcategory}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const SubCategoryList = ({ subcategories, category, setCategories, amounts, setAmounts, onAddSubcategory, onUpdateSubcategoryAmount, onDeleteSubcategory }) => {
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryAmount, setNewSubcategoryAmount] = useState('');

  const handleAddSubcategory = () => {
    if (!newSubcategoryName || !newSubcategoryAmount) {
      Alert.alert('Error', 'Please enter a valid subcategory name and amount.');
      return;
    }

    const amount = parseFloat(newSubcategoryAmount);
    if (isNaN(amount) || amount < 0) {
      Alert.alert('Error', 'Please enter a valid positive amount.');
      return;
    }

    onAddSubcategory(category, newSubcategoryName, amount);

    setNewSubcategoryName('');
    setNewSubcategoryAmount('');
    setIsAddingSubcategory(false);
  };

  return (
    <View style={styles.subCategoryContainer}>
      {subcategories.map((subcat) => (
        <View key={subcat} style={styles.subCategoryItem}>
          <Text style={styles.subCategoryText}>{subcat}</Text>
          <TextInput
            style={styles.amountInput}
            keyboardType="numeric"
            value={amounts[subcat]?.toString() || '0'}
            onChangeText={(value) => onUpdateSubcategoryAmount(subcat, value)}
          />
          <TouchableOpacity onPress={() => onDeleteSubcategory(subcat, category)}>
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
          <View style={styles.addSubCat}>
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
          </View>
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