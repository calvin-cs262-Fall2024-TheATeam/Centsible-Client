import { color } from 'chart.js/helpers';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, ScrollView, Modal } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';

export default function ReportsScreen() {
  const screenWidth = Dimensions.get('window').width;
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [details, setDetails] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [isPickerVisible, setPickerVisible] = useState(false);

  const currentDate = new Date(); 
  const [selectedMonth, setSelectedMonth] = useState({
    month: currentDate.getMonth(), 
    year: currentDate.getFullYear(), 
  });

  const colors = ['#f95d6a', '#ff9909', '#fbd309', '#7cb6dc', '#1c43da', '#2e3884'];
  const getColor = (index) => colors[index % colors.length];

  const fetchTransactions = async () => {
    try {
      const userId = 1; 
      const response = await fetch(`https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/transactions/${userId}`); 
  
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Transactions: ", data);
  
        const updatedTransactions = await Promise.all(data.map(async (transaction, index) => {
          try {
            if (transaction.transactiontype === 'Income') {
              return {
                ...transaction,
                category: 'Income',  // Set category name as "Income"
                key: transaction.id,
                amount: parseFloat(transaction.dollaramount),
              };
            } else if (transaction.transactiontype === 'Expense') {
              if (transaction.budgetcategoryid != null) {
                const categoryResponse = await fetch(`https://centsible-gahyafbxhwd7atgy.eastus2-01.azurewebsites.net/budgetCategoryName/${transaction.budgetcategoryid}`);
                if (categoryResponse.ok) {
                  const categoryData = await categoryResponse.json();
                  return {
                    ...transaction,
                    category: categoryData.categoryname,
                    key: transaction.id,  // Set fetched category name
                    amount: parseFloat(transaction.dollaramount),
                  };
                }
              }
                //console.error(`Failed to fetch category for ID ${transaction.budgetcategoryid}`);
                return {
                  ...transaction,
                  category: 'Unknown Category',  // Default category if failed
                  key: transaction.id || index.toString(),
                  amount: parseFloat(transaction.dollaramount),
                };
            } else {
              return {
                ...transaction,
                category: 'Unknown Category',
                key: transaction.id || index.toString(),
                amount: parseFloat(transaction.dollaramount),
              };
            }
          } catch (err) {
            console.error(`Error processing transaction for ID ${transaction.id}: `, err);
            return {
              ...transaction,
              category: 'Unknown Category',  // Default category if error
              key: transaction.id || index.toString(),
              amount: parseFloat(transaction.dollaramount),
            };
          }
        }));

       // console.log("Updated Transactions: ", updatedTransactions);
        setTransactions(updatedTransactions);
        calculateTotalIncomeExpense(updatedTransactions);

        // const income = updatedTransactions.filter(item => item.transactiontype === 'Income').reduce((acc, curr) => acc + curr.amount, 0);
        // const expense = updatedTransactions.filter(item => item.transactiontype === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);
        
        // console.log("Total Income: ", income);
        // console.log("Total Expense: ", expense);
        
        // setTotalIncome(income);
        // setTotalExpense(expense);

      } else {
        Alert.alert("Error", "Failed to fetch transactions.");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

useEffect(() => {
  fetchTransactions(); 
}, []);

useEffect(() => {
  if (transactions.length > 0) {
    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.transactiondate);
      return (
        transactionDate.getMonth() === selectedMonth.month &&
        transactionDate.getFullYear() === selectedMonth.year
      );
    });

    const categoryTotals = {};
    const categoryDetails = {};
    let income = 0;
    let expense = 0;

    // Categorize and sum expenses and income
    filteredTransactions.forEach((transaction) => {
      const { category, amount, transactiontype, optionaldescription = "No description", transactiondate = new Date() } = transaction;
      if (transactiontype === 'Expense') {
        categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(amount);
        expense += Math.abs(amount);
      } else {
        income += amount;
      }

      if (!categoryDetails[category]) {
        categoryDetails[category] = [];
      }
      categoryDetails[category].push({ optionaldescription, amount, date: new Date(transactiondate) });
    });
    
    console.log("Category Totals: ", categoryTotals); // Log here
    console.log("Category Details: ", categoryDetails); // Log here


    // Create data for Pie Chart
    setChartData(
      Object.keys(categoryTotals).map((category, index) => ({
        name: category,
        population: categoryTotals[category],
        color: getColor(index),
    }))
  );

    setDetails(categoryDetails);
    setTotalIncome(income);
    setTotalExpense(expense);

  }
}, [transactions, selectedMonth]);

  const calculateCategoryTotal = (category) => {
    return details[category]?.reduce((total, item) => total + item.amount, 0) || 0;
  };

  const handleCategoryPress = (category) => {
    if (category !== 'Income') {
      setSelectedCategory(category === selectedCategory ? null : category);
    }
  };

  const sortedChartData = [...chartData].sort((a, b) => b.population - a.population);
  const filteredChartData = chartData.filter(item => item.name !== 'Income');

  const calculatePercentage = (data) => {
    const total = data.reduce((sum, item) => sum + item.population, 0);
    return data.map(item => ({
      ...item,
      percentage: ((item.population / total) * 100).toFixed(1) + '%'
    }));
  };

  const dataWithPercentage = calculatePercentage(filteredChartData);
  const sortedDataWithPercentage = [...dataWithPercentage].sort((b, a) => a.population - b.population);

  const Triangle = ({ color, isSelected }) => {
    return (
      <View style={[styles.triangle, {
        borderTopColor: color,
        transform: [
          { rotate: isSelected ? '0deg' : '-90deg' },
        ],
      }]}
      />
    );
  };

  const categoryColors = {
    "Housing":"#f95d6a",
    "Transportation":"#ff9909",
    "Personal": "#fbd309",
    "Food": "#7cb6dc", 
    "Education":"#2e3884",
    "Entertainment": "#1c43da"
  };
  
  const expenseDetails = () => {
    return (
      <View style={styles.detailBox}>
        <Text style={[
          styles.detailsTitle,
          { color: categoryColors[selectedCategory] || "#000000" }
        ]}>{selectedCategory} Expenses</Text>
        <Text style={styles.totalCategoryExpense && totalPercentage}>
          <Text style={styles.totalLabel}>Total: </Text>
          <Text style={styles.totalAmount}>${calculateCategoryTotal(selectedCategory).toLocaleString()}</Text>
        </Text>
        <View style={styles.detailsContainer}>
          {details[selectedCategory]?.map((item, index) => (
            <View
              style={[
                styles.detailItem,
                index === details[selectedCategory].length - 1 && { borderBottomWidth: 0 },
              ]}
              key={index}
            >
              <Text style={styles.date}>{item.date.toLocaleDateString()}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.amount}>${item.amount.toFixed()}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.dropdownButtonContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setPickerVisible(true)}
        >
          <Text style={styles.dropdownButtonText}>
            {new Date(selectedMonth.year, selectedMonth.month).toLocaleString('default', { month: 'long' })} {selectedMonth.year}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.box}>
        <View style={styles.chartContainer}>
          <Text style={styles.boxText}>Income vs. Expense</Text>

          {/* Total Income Progress Bar */}
          <View style={styles.progressBarContainer}>
            <Text style={styles.progressBarLabel}>Total Income</Text>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: totalIncome > 0 ? `${(totalIncome / (totalIncome + totalExpense)) * 100}%` : '0%',
                    backgroundColor: 'rgba(0, 123, 255, 1)',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressBarValue}>
              {totalIncome > 0 ? `$${totalIncome.toLocaleString()}` : '$0'}
            </Text>
          </View>

          {/* Total Expense Progress Bar */}
          <View style={styles.progressBarContainer}>
            <Text style={styles.progressBarLabel}>Total Expense</Text>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: totalExpense > 0 ? `${(totalExpense / (totalIncome + totalExpense)) * 100}%` : '0%',
                    backgroundColor: 'rgba(255, 69, 58, 1)',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressBarValue}>
              {totalExpense > 0 ? `$${totalExpense.toLocaleString()}` : '$0'}
            </Text>
          </View>
        </View>
      </View>


      {/* Box for Pie Chart */}
      <View style={styles.box}>
        <View style={styles.chartContainer}>
          <Text style={styles.boxText}>Total Expenses</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ position: 'relative', alignItems: 'center', width: '50%' }}>
              <PieChart
                data={sortedChartData && filteredChartData && dataWithPercentage}
                width={screenWidth * 0.8}
                height={220}
                chartConfig={{
                  backgroundColor: '#1cc910',
                  backgroundGradientFrom: '#eff3ff',
                  backgroundGradientTo: '#efefef',
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="45"
                // hid the freakin labels that come with pie chart :) yay
                hasLegend={false}
                absolute={false}
              />
              <View style={styles.donutCenter} />
              <Text style={styles.totalExpenseText}>${Math.round(totalExpense).toLocaleString()}</Text>

            </View>

            {/* Legend for the Pie Chart */}
            <View style={styles.legendContainer}>
              {sortedDataWithPercentage.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => handleCategoryPress(item.name)}>
                  <View style={styles.legendItem}>
                    <Triangle color={item.color} isSelected={selectedCategory === item.name} />
                    <Text style={[styles.legendText, selectedCategory === item.name && { color: item.color }]}>{item.name}</Text>

                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Box for Category Details (if selected) */}
      {selectedCategory && (
        <View style={styles.box}>
          <Text style={[
            styles.detailsTitle,
            { color: categoryColors[selectedCategory] || "#000000" } 
          ]}>What You Spent on {selectedCategory}
        </Text>
        {/* <Text style={styles.totalPercentage}> {calculateCategoryPercentage(selectedCategory)}</Text> */}
          <Text style={styles.totalCategoryExpense && totalPercentage}> 
          <Text style={styles.totalLabel}>Total: </Text>
          <Text style={styles.totalAmount}>${calculateCategoryTotal(selectedCategory).toLocaleString()}</Text>
          </Text>

        <ScrollView contentContainerStyle={styles.scrollableContent}>
          <FlatList
            data={details[selectedCategory]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.detailItem}>
                <Text style={styles.date}>{item.date.toLocaleDateString()}</Text>
                <Text style={styles.description}>{item.description} </Text>
                <Text style={styles.amount}>${item.amount.toFixed()}</Text>
              </View>
            )}
          />
        </ScrollView>
      </View>
      )}

      {/* Switch months button */}
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
              onValueChange={(itemValue) => {
                const [month, year] = itemValue.split('-').map(Number); // Parse the selected value
                setSelectedMonth({ month, year }); // Update state with parsed values
                setPickerVisible(false); // Close modal after selection
              }}
              style={styles.picker}
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
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#e8d0f4',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '95%',
    padding: 15,
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'space-between',
  },
  boxText: {
    fontSize: 20,
    color: 'purple',
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  donutCenter: {
    position: 'absolute',
    top: '50%',
    left: '30%',
    width: 120, 
    height: 120, 
    backgroundColor: '#fff',
    borderRadius: 60, 
    transform: [{ translateX: -60 }, { translateY: -60 }],
  },
  totalExpenseText: {
    position: 'absolute',
    top: '44%', 
    left: '10%',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#1c43da',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  totalLabel: {
    textAlign: 'right',
    fontSize: 17,
    marginBottom: 10,
    color: 'gray',
  },
  totalAmount: {
    fontSize: 18,
    flex: 1,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red',
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f95d6a',
  },
  legendContainer: {
    flexDirection: 'column',
    marginLeft: 15,
    alignItems: 'flex-start',
    width: '35%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  legendColor: {
    width: 25,
    height: 16,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    fontSize: 13,
    fontWeight: 'bold',
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  selectedLegendText: {
    color: color, 
  },
  legend2Text: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  barChart: {
    alignItems: 'center',
    marginVertical: 15,
    borderRadius: 12,
  },
  scrollableContent: {
    maxHeight: 200,
  },
  dropdownButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  dropdownButton: {
    backgroundColor: 'purple',
    padding: 10,
    alignItems: 'center',
    alignItems: 'center',
    borderRadius: 0,
    width: '100%',
  },
  dropdownButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
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
  picker: {
    width: '100%',
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
  progressBarContainer: {
    width: '100%',
    marginBottom: 15,
  },
  progressBarLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#e0e0e0', // Light gray background for unfilled part
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressBarValue: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'right', // Align the value to the right
  },
});