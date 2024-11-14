import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import TransactionScreen from './transaction';

export default function ReportsScreen() {
  const screenWidth = Dimensions.get('window').width;
  const [chartData, setChartData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [details, setDetails] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const initialTransactions = [
    { key: '1', amount: 200, category: 'Housing', description: 'Monthly rent', type: 'expense', date: new Date(2024, 10, 1) },
    { key: '3', amount: 5.99, category: 'Entertainment', description: 'Spotify subscription', type: 'expense', date: new Date(2024, 10, 2) },
    { key: '4', amount: 30, category: 'Transportation', description: 'Gas for the car', type: 'expense', date: new Date(2024, 10, 3) },
    { key: '5', amount: 50, category: 'Personal', description: 'New clothes', type: 'expense', date: new Date(2024, 10, 2) },
    { key: '7', amount: 10, category: 'Food', description: 'Takeout dinner', type: 'expense', date: new Date(2024, 10, 3) },
    { key: '8', amount: 60, category: 'Housing', description: 'Electricity bill', type: 'expense', date: new Date(2024, 10, 5) },
    { key: '10', amount: 10, category: 'Food', description: 'Lunch with friends', type: 'expense', date: new Date(2024, 10, 6) },
    { key: '12', amount: 25, category: 'Transportation', description: 'Uber ride to campus', type: 'expense', date: new Date(2024, 10, 6) },
    { key: '13', amount: 90, category: 'Food', description: 'Groceries for the week', type: 'expense', date: new Date(2024, 10, 7) },
    { key: '14', amount: 20, category: 'Personal', description: 'Shampoo and toiletries', type: 'expense', date: new Date(2024, 10, 7) },
    { key: '15', amount: 50, category: 'Entertainment', description: 'Weekend trip', type: 'expense', date: new Date(2024, 10, 8) },
    { key: '16', amount: 10, category: 'Food', description: 'Fast food lunch', type: 'expense', date: new Date(2024, 10, 9) },
    { key: '18', amount: 45, category: 'Personal', description: 'Haircut', type: 'expense', date: new Date(2024, 10, 5) },
    { key: '21', amount: 10, category: 'Personal', description: 'Coffee at campus cafe', type: 'expense', date: new Date(2024, 10, 10) },
    { key: '22', amount: 100, category: 'Personal', description: 'New shoes', type: 'expense', date: new Date(2024, 10, 13) },
    { key: '23', amount: 5.67, category: 'Entertainment', description: 'Netflix subscription', type: 'expense', date: new Date(2024, 10, 13) },
    { key: '24', amount: 50, category: 'Food', description: 'Groceries for the week', type: 'expense', date: new Date(2024, 10, 14) },
    { key: '25', amount: 15, category: 'Education', description: 'School supplies', type: 'expense', date: new Date(2024, 10, 14) },
    { key: '28', amount: 50, category: 'Transportation', description: 'Tolls on road trip', type: 'expense', date: new Date(2024, 10, 16) },
    { key: '30', amount: 10, category: 'Entertainment', description: 'Sports event tickets', type: 'expense', date: new Date(2024, 10, 16) },
    { key: '32', amount: 5, category: 'Food', description: 'Coffee shop', type: 'expense', date: new Date(2024, 10, 18) },
    { key: '34', amount: 15, category: 'Food', description: 'Lunch with friends', type: 'expense', date: new Date(2024, 10, 19) },
    { key: '36', amount: 50, category: 'Transportation', description: 'Gas for the car', type: 'expense', date: new Date(2024, 10, 20) },
    { key: '38', amount: 10, category: 'Entertainment', description: 'Movie night with friends', type: 'expense', date: new Date(2024, 10, 22) },
    { key: '47', amount: 25, category: 'Personal', description: 'Toiletries', type: 'expense', date: new Date(2024, 10, 28) },
    { key: '48', amount: 50, category: 'Food', description: 'Groceries for the weekend', type: 'expense', date: new Date(2024, 10, 28) },
    { key: '50', amount: 15, category: 'Entertainment', description: 'Monthly gaming subscription', type: 'expense', date: new Date(2024, 10, 30) },
    { key: '51', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 10, 8) },
    { key: '52', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 10, 15) },
    { key: '53', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 10, 22) },
    { key: '54', amount: 180, category: 'Income', description: 'Weekly income', type: 'income', date: new Date(2024, 10, 29) },
    // { key: '55', amount: 3000, category: 'Income', description: 'Summer income', type: 'income', date: new Date(2024, 9, 31) },
  ];

  const colors = ['#f95d6a', '#ffb609', '#fbd309', '#7cb6dc', '#1c43da', '#2e3884', '#077dd5'];
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
    const data = processData();
    setChartData(data);

    const categoryDetails = {};
    initialTransactions.forEach((transaction) => {
      const { category, description, amount, date } = transaction;
      if (!categoryDetails[category]) {
        categoryDetails[category] = [];
      }
      categoryDetails[category].push({ description, amount, date });
    });

    setDetails(categoryDetails);
  }, []);

  const handleCategoryPress = (category) => {
    if (category !== 'Income') {  
      setSelectedCategory(category === selectedCategory ? null : category);
    }
  };
  
  const sortedChartData = [...chartData].sort((a, b) => b.population - a.population);
  const filteredChartData = chartData.filter(item => item.name !== 'Income');

  const subscriptions = [
    { 
      key: '3', 
      amount: 5.99, 
      category: 'Entertainment', 
      description: 'Spotify subscription', 
      type: 'expense', 
      date: new Date(2024, 10, 2), 
      color: '#1DB954' 
    },
    { 
      key: '23', 
      amount: 5.67, 
      category: 'Entertainment', 
      description: 'Netflix subscription', 
      type: 'expense', 
      date: new Date(2024, 10, 13), 
      color: '#E50914'  
    },
  ];

  const categoryColors = {
    "Food": "#1c43da", 
    "Entertainment": "#ffb609", 
    "Subscriptions": "#FFD700",
    "Transportation":"#fbd309",
    "Housing":"#f95d6a",
    "Education":"#2e3884",
    "Personal": "#7cb6dc"
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>November 2024</Text>
      </View>
      <Text style={styles.title}></Text>

    {/* Bar Chart */}
    <View style={styles.box}>
      <View style={styles.chartContainer}>
        <BarChart
          data={{
            labels: ['Total Income', 'Total Expense'],
            datasets: [{data: [totalIncome, totalExpense],
              colors: [
                (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, //Income
                (opacity = 1) => `rgba(255, 69, 58, ${opacity})`, //Expense
              ],
            }],
          }}
          width={screenWidth * 0.8}
          height={170}
          fromZero={true}
          horizontal={true}
          showValuesOnTopOfBars={true}
          withHorizontalLabels={true}
        
          chartConfig={{
            backgroundColor: '#f0f0f0',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            barPercentage: 0.6,

            propsForLabels: {
              fontWeight: 'bold',
            },
            propsForHorizontalLabels: {
              fontWeight: 'bold',  
              paddingRight: 10,    
            },
            propsForValuesOnTopOfBars: {
              fontWeight: 'bold',  
              fontSize: 14,        
              paddingTop: 10,      
              paddingBottom: 5,
            },
        }}
        withCustomBarColorFromData={true}
        flatColor={true}
        style={styles.barChart}
      />
    </View>
    </View>

      {/* Box for Pie Chart and Legend */}
      <View style={styles.box}>
        <View style={styles.chartContainer}>
        <PieChart
          data={sortedChartData && filteredChartData}
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
          paddingLeft="15"
          absolute={false}
          innerRadius="50%"
        />
      </View>
        
        {/* Legend for the Pie Chart */}
        <View style={styles.legendContainer}>
          {filteredChartData.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleCategoryPress(item.name)}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
          <FlatList
            data={details[selectedCategory]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.detailItem}>
                <Text style={styles.date}>{item.date.toLocaleDateString()}</Text>
                <Text style={styles.description}>{item.description} </Text>
                <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
              </View>
            )}
            contentContainerStyle={styles.scrollableContent}
          />
        </View>
      )}

      {/* New box */}
      <View style={styles.newBox}>
        <Text style={styles.newBoxTitle}> You're SUBSCRIBED to... </Text>
        <FlatList
          data={subscriptions}  // Use the subscription data
          keyExtractor={(item) => item.key}  // Using the unique key for each subscription
          renderItem={({ item }) => (
            <View style={styles.subscriptionItem}>
            <View style={[styles.subscriptionColor, { backgroundColor: item.color }]} />
            <Text style={styles.subscriptionText}>{item.description}</Text>
            <Text style={styles.subscriptionAmount}>${item.amount.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#e8d0f4',
    justifyContent: 'flex-start'
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '94%',
    padding: 15,
    marginBottom: 20,
  },
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
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
  },

  amount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
   legendContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  legendColor: {
    width: 25,
    height: 16,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  barChart: {
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  scrollableContent: {
    maxHeight: 200, 
  },
  newBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '94%',
    padding: 15,
    marginBottom: 20,
  },
  newBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  newBoxContent: {
    fontSize: 16,
  },
  susbcriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscriptionText: {
    fontSize: 16,
    flex: 1, 
  },
  subscriptionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
