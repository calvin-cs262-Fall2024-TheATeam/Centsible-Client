import React, { useState } from 'react'; 
import { Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';

// Initial transactions and amounts
const initialTransactions = [
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
  // { key: '51', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 9, 8) },
  // { key: '52', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 9, 15) },
  // { key: '53', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 9, 22) },
  // { key: '54', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 9, 29) },
];

const initialAmounts = {
  'Groceries': '300.00',
  'Phone': '50.00',
  'Fun Money': '20.00',
  'Hair/Cosmetics': '30.00',
  'Subscriptions': '15.00',
  'Gas': '85.00',
  'Tuition': '500.00',
  'Books': '80.00',
  'Spotify subscription': '10.00',
  'Monthly rent': '275.00',
  'Electricity bill': '50.00',
  'Streaming services': '40.00',
  'Fun things': '50.00',
};

const SubCategoryList = ({
  subcategories,
  onAddTransaction,
  transactions,
  category,
  setCategories,
  amounts,
  setAmounts,
  onAmountUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryAmount, setNewSubcategoryAmount] = useState('');
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);

  const handleAmountPress = (subcategory) => {
    setActiveSubcategory(subcategory);
    setIsEditing(true);
  };

  const handleAmountChange = (subcategory, value) => {
    const formattedValue = value.replace(/[^0-9.]/g, '');
    const parts = formattedValue.split('.');
    if (parts.length > 2 || (parts[1] && parts[1].length > 2)) return;

    setAmounts((prev) => ({
      ...prev,
      [subcategory]: formattedValue,
    }));
  };

  const handleAmountBlur = (subcategory) => {
    const updatedAmount = parseFloat(amounts[subcategory] || '0');
    setIsEditing(false);
    setActiveSubcategory(null);

    // Update parent state
    onAmountUpdate(subcategory, isNaN(updatedAmount) ? 0 : updatedAmount);
  };

  const handleAddSubcategory = () => {
    if (!newSubcategoryName || !newSubcategoryAmount) {
      Alert.alert('Error', 'Please enter a valid subcategory name and amount.');
      return;
    }

    const newAmount = parseFloat(newSubcategoryAmount);
    if (isNaN(newAmount)) {
      Alert.alert('Error', 'Please enter a valid numerical amount.');
      return;
    }

    // Add the new subcategory to the selected category
    setCategories((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), newSubcategoryName],
    }));

    // Update the amount for the new subcategory
    setAmounts((prev) => ({
      ...prev,
      [newSubcategoryName]: newAmount.toFixed(2),
    }));

    // Reset the form and close the input
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
  const [transactions, setTransactions] = useState(initialTransactions);
  const [categories, setCategories] = useState({
    Food: ["Groceries"],
    Personal: ["Phone", "Fun Money", "Hair/Cosmetics"],
    Transportation: ["Gas"],
    Education: ["Tuition", "Books"],
    Housing: ["Monthly rent", "Electricity bill"],
    Entertainment: ["Spotify subscription", "Streaming services", "Fun things"],
  });
  const [amounts, setAmounts] = useState(initialAmounts); // Track budget goals for subcategories

  const onAmountUpdate = (subcategory, newAmount) => {
    setAmounts((prev) => ({
      ...prev,
      [subcategory]: parseFloat(newAmount).toFixed(2),
    }));
  };

  const getTotalForCategory = (category) => {
    const subcategories = categories[category] || [];
    return subcategories.reduce((sum, subcat) => {
      return sum + parseFloat(amounts[subcat] || '0.00');
    }, 0);
  };
  

  const getProgressBarColor = (spentAmount, totalAmount) => {
    const progress = (spentAmount / totalAmount) * 100;
    if (progress >= 100) return '#cc0000';
    if (progress >= 90) return '#ff9933';
    return '#006600';
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

          const progress = (categorySpent / totalAmount) * 100;

          return (
            <View key={category} style={styles.categoryContainer}>
              {/* Move progress bar above category header */}
              <View style={styles.progressBarContainer}>
                <View
                  style={{
                    ...styles.progressBar,
                    width: `${Math.min(progress, 100)}%`, // Cap the progress at 100%
                    backgroundColor: getProgressBarColor(categorySpent, totalAmount),
                  }}
                />
                {/* <Text style={styles.progressPercentage}>  
                  {Math.min(progress, 100).toFixed(0)}%  
                </Text>   */}
              </View>

              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <View  style={styles.amountText}>
                  <Text style={styles.amountUsed}>${categorySpent.toFixed(2)} / </Text>
                  <Text style={styles.amountTotal}>${totalAmount.toFixed(2)}</Text>
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