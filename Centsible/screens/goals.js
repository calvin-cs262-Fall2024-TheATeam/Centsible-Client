import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';

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

const SubCategoryList = ({ subcategories, onAddTransaction, transactions, category }) => {
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
    <ScrollView style={styles.subCategoryContainer}>
      {subcategories.map((subcat) => (
        <View key={subcat} style={styles.subCategoryItem}>
          <Text style={styles.subCategoryText}>{subcat}</Text>

          <TouchableOpacity onPress={() => handleAmountPress(subcat)}>
            {activeSubcategory === subcat ? (
              <TextInput
                value={amounts[subcat] || initialAmounts[subcat] || '0'} 
                onChangeText={(text) => handleAmountChange(subcat, text)}
                keyboardType="numeric"
                style={styles.input}
                onBlur={() => handleAmountBlur(subcat)}
                autoFocus
              />
            ) : (
              <Text style={styles.amountText}>
                ${parseFloat(amounts[subcat] || initialAmounts[subcat] || '0').toFixed(2)}
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
    </ScrollView>
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

  const getTotalSpent = () => transactions.reduce((sum, t) => sum + t.amount, 0);
  const getRemainingBudget = () => initialBudget - getTotalSpent();

  const handleAddTransaction = (subcategory, amount) => {
    setTransactions((prev) => {
      const newBudgets = prev.filter(t => t.subcategory !== subcategory);
      return [...newBudgets, { subcategory, amount }];
    });
  };

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
      <View style={styles.header}>
        <Text style={styles.headerText}>November 2024</Text>
      </View>

      <Text style={styles.remainingBudgetText}>
        ${getRemainingBudget().toFixed(2)} left to budget
      </Text>
      {getRemainingBudget() < 0 && (
        <Text style={styles.warningText}>Warning: You’re out of budget!</Text>
      )}

      <ScrollView style={styles.scrollView}>
        {Object.entries(categories).map(([category, subcategories]) => {
          const categorySpent = getCurrentAmountForCategory(subcategories);
          const initialAmount = subcategories.reduce((sum, subcat) => {
            return sum + parseFloat(initialAmounts[subcat] || '0.00');
          }, 0);

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
                    width: `${(categorySpent / initialAmount) * 100}%`,
                    backgroundColor: getProgressBarColor(categorySpent, initialAmount),
                  }}
                />
              </View>

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
    paddingHorizontal: 10,
  },
  header: {
    padding: 20,
    backgroundColor: 'purple',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  remainingBudgetText: {
    color: 'purple',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 15,
  },
  warningText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  scrollView: {
    marginBottom: 100,
  },
  categoryContainer: {
    paddingVertical: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  amountText: {
    fontSize: 16,
  },
  progressBarContainer: {
    height: 10,
    marginVertical: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  subCategoryContainer: {
    marginTop: 10,
  },
  subCategoryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  subCategoryText: {
    fontSize: 16,
  },
  amountText: {
    fontSize: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 16,
    padding: 5,
    marginBottom: 10,
  },
  addSubcategoryText: {
    color: 'purple',
    fontSize: 16,
  },
  addSubcategoryContainer: {
    paddingTop: 10,
  },
  addSubcategoryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: 'purple',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: 'blue',
  },
};

export default BudgetPlanner;
