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
          <TouchableOpacity onPress={() => handleAmountPress(subcat)}>
            {isEditing && activeSubcategory === subcat ? (
              <TextInput
                value={amounts[subcat] || ''}
                onChangeText={(text) => handleAmountChange(subcat, text)}
                keyboardType="numeric"
                style={styles.individualAmountInput}
                onBlur={() => handleAmountBlur(subcat)}
                autoFocus
              />
            ) : (
              <Text style={styles.subAmountText}>
                ${parseFloat(amounts[subcat] || '0').toFixed(2)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ))}

      {!isAddingSubcategory ? (
        <TouchableOpacity onPress={() => setIsAddingSubcategory(true)}>
          <Text style={styles.addSubcategoryText}>+ Add a subcategory</Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>October 2024</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {Object.entries(categories).map(([category, subcategories]) => {
          const categorySpent = transactions
            .filter(t => t.category === category)
            .reduce((sum, t) => sum + t.amount, 0);
          
          const totalAmount = getTotalForCategory(category);

          // calculate the amount left in the budget
          let isOverBudget = false;
          const amountRemaining = totalAmount - categorySpent;
          if (amountRemaining < 0) {
            isOverBudget = true;
          };

          const progress = (categorySpent / totalAmount) * 100;

          return (
            <View key={category} style={styles.categoryContainer}>

              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category}</Text>
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
                      width: `${Math.min(progress, 100)}%`, // Cap the progress at 100%
                      backgroundColor: getProgressBarColor(categorySpent, totalAmount),
                    }}
                  />
                </View>
              </View>

              <View style={styles.amountTotalContainer}>
                <View>
                  <Text style={styles.amountTotal}>Total:</Text>
                </View>
                <View>
                  {/* <Text style={styles.amountUsed}>${categorySpent.toFixed(2)} / </Text> */}
                  <Text style={styles.amountTotalNumber}>${totalAmount.toFixed(2)}</Text>
                </View>
              </View>

              <SubCategoryList
                category={category}
                subcategories={categories[category] || []} // Correctly pass updated subcategories
                onAddTransaction={(subcategory, amount) =>
                  setTransactions([...transactions, { category, subcategory, amount }])
                }
                transactions={transactions}
                amounts={amounts}
                setAmounts={setAmounts}
                setCategories={setCategories}
                onAmountUpdate={onAmountUpdate}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );

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