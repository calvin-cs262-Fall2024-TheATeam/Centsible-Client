import { color } from 'chart.js/helpers';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, ScrollView, Modal } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';

export default function ReportsScreen() {
  const screenWidth = Dimensions.get('window').width;
  const [chartData, setChartData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [details, setDetails] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  
  const currentDate = new Date(); // Get today's date
  const [selectedMonth, setSelectedMonth] = useState({
    month: currentDate.getMonth(), // Initialize with the current month (0-based index)
    year: currentDate.getFullYear(), // Initialize with the current year
  });
  const [isPickerVisible, setPickerVisible] = useState(false); // Controls modal visibility

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
    { key: '18', amount: 25, category: 'Personal', description: 'Haircut', type: 'expense', date: new Date(2024, 9, 5) },
    { key: '21', amount: 10, category: 'Personal', description: 'Coffee at campus cafe', type: 'expense', date: new Date(2024, 9, 10) },
    { key: '22', amount: 100, category: 'Personal', description: 'New shoes', type: 'expense', date: new Date(2024, 9, 13) },
    { key: '22', amount: 100, category: 'Personal', description: 'Amazon', type: 'expense', date: new Date(2024, 9, 13) },
    { key: '24', amount: 50, category: 'Food', description: 'Groceries for the week', type: 'expense', date: new Date(2024, 9, 14) },
    { key: '25', amount: 45, category: 'Education', description: 'School supplies', type: 'expense', date: new Date(2024, 9, 14) },
    { key: '28', amount: 50, category: 'Personal', description: 'Earrings', type: 'expense', date: new Date(2024, 9, 16) },
    { key: '30', amount: 10, category: 'Entertainment', description: 'Sports event tickets', type: 'expense', date: new Date(2024, 9, 16) },
    { key: '32', amount: 5, category: 'Food', description: 'Coffee shop', type: 'expense', date: new Date(2024, 9, 18) },
    { key: '34', amount: 15, category: 'Food', description: 'Lunch with friends', type: 'expense', date: new Date(2024, 9, 19) },
    { key: '36', amount: 50, category: 'Transportation', description: 'Gas for the car', type: 'expense', date: new Date(2024, 9, 20) },
    { key: '38', amount: 12, category: 'Entertainment', description: 'Movie night with friends', type: 'expense', date: new Date(2024, 9, 22) },
    { key: '47', amount: 25, category: 'Personal', description: 'Toiletries', type: 'expense', date: new Date(2024, 9, 28) },
    { key: '48', amount: 50, category: 'Food', description: 'Groceries for the weekend', type: 'expense', date: new Date(2024, 9, 28) },
    { key: '50', amount: 15, category: 'Entertainment', description: 'Monthly gaming subscription', type: 'expense', date: new Date(2024, 9, 30) },
    { key: '51', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 9, 8) },
    { key: '52', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 9, 15) },
    { key: '53', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 9, 22) },
    { key: '54', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 9, 29) },
  ];

  const colors = ['#f95d6a', '#ff9909', '#fbd309', '#7cb6dc', '#1c43da', '#2e3884'];
  const getColor = (index) => colors[index % colors.length];

  const processData = () => {
    const categoryTotals = {};
    let income = 0;
    let expense = 0;

    initialTransactions.forEach((transaction) => {
      const { category, amount, type } = transaction;
      if (type === 'expense') { 
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += Math.abs(amount);
        expense += Math.abs(amount);

      } else if (type === 'income') { 
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += amount;
        income += amount;
      }
    });

    setTotalIncome(income);
    setTotalExpense(expense);

    const chartData = Object.keys(categoryTotals).map((category, index) => ({
      name: category,
      population: categoryTotals[category],
      color: getColor(index),
      legendFontColor: '#000',
      legendFontSize: 12,
    }));

    return chartData;
  };

  useEffect(() => {
    const data = initialTransactions.filter(
      (transaction) =>
        transaction.date.getMonth() === selectedMonth.month &&
        transaction.date.getFullYear() === selectedMonth.year
    );
  
    const categoryTotals = {};
    const categoryDetails = {};
    let income = 0;
    let expense = 0;
  
    data.forEach((transaction) => {
      const { category, amount, type, description = "No description", date = new Date() } = transaction;
      if (type === 'expense') {
        if (!categoryTotals[category]) categoryTotals[category] = 0;
        categoryTotals[category] += Math.abs(amount);
        expense += Math.abs(amount);
      } else {
        income += amount;
      }

      if (!categoryDetails[category]) {
        categoryDetails[category] = [];
      }
      categoryDetails[category].push({ description:transaction.description || "No description", amount, date });
    });
  
    setTotalIncome(income);
    setTotalExpense(expense);
  
    setChartData(
      Object.keys(categoryTotals).map((category, index) => ({
        name: category,
        population: categoryTotals[category],
        color: colors[index % colors.length],
      }))
    );
    setDetails(categoryDetails);
  }, [selectedMonth]);
  // Recalculate when selectedMonth changes
  

  // calculating the toal of each categories..
  const calculateCategoryTotal = (category) => {
    if (!details[category]) return 0;
    return details[category].reduce((sum, item) => sum + item.amount, 0);
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

  const calculateCategoryPercentage = (category) => {
    const total = chartData.reduce((sum, item) => sum + item.population, 0);
    const categoryTotal = calculateCategoryTotal(category);
    return ((categoryTotal / total) * 100).toFixed(1) + '%';
  };

  const dataWithPercentage = calculatePercentage(filteredChartData);

  // for now, instead of percentages being shown,
  // the labels with the most expense come first so in most-least order
  const sortedDataWithPercentage = [...dataWithPercentage].sort((b, a) => a.population - b.population);

  //for legend box cateogry labels
  const Triangle = ({ color, isSelected }) => {
    return (
      <View style={[styles.triangle, { borderTopColor: color, 
        transform: [
        { rotate: isSelected ? '0deg' : '-90deg' }, 
      ], 
    },
  ]} />
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
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.dropdownButtonContainer}>
  <TouchableOpacity
    style={styles.dropdownButton}
    onPress={() => setPickerVisible(true)} // Show the modal
  >
    <Text style={styles.dropdownButtonText}>
      {new Date(selectedMonth.year, selectedMonth.month).toLocaleString('default', { month: 'long' })} {selectedMonth.year} 
    </Text>
  </TouchableOpacity>
</View>

      <Text style={styles.title}></Text>

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
                  <Triangle color= {item.color} isSelected={selectedCategory === item.name}/>
                  <Text style={[styles.legendText, selectedCategory === item.name && {color: item.color}]}>{item.name}</Text>
  
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

    </ScrollView>
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
  // totalPercentage: {
  //   textAlign: 'left',
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: 'black',
  // },
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