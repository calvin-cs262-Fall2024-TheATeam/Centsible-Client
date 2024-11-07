import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import bankData from '../assets/bankStatement.json';

export default function ReportsScreen() {
  const screenWidth = Dimensions.get('window').width;
  const [chartData, setChartData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [details, setDetails] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const colors = ['#f39c12', '#3498db', '#e74c3c', '#9b59b6', '#1abc9c', '#2ecc71', '#e67e22', '#d35400'];
  const getColor = (index) => colors[index % colors.length];

  const processData = () => {
    const categoryTotals = {};

    bankData.transactions.forEach((transaction) => {
      const { category, amount, date } = transaction;
      const transactionDate = new Date(date);
      
      if (amount < 0 && transactionDate.getMonth() === selectedMonth) { 
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += Math.abs(amount);
      }
    });

    const chartData = Object.keys(categoryTotals).map((category, index) => ({
      name: category,
      population: categoryTotals[category],
      color: getColor(index),
      legendFontColor: '#333',
      legendFontSize: 12,
    }));

    return chartData;
  };

  useEffect(() => {
    const data = processData();
    setChartData(data);

    const categoryDetails = {};
    bankData.transactions.forEach((transaction) => {
      const { category, description, amount, date } = transaction;
      const transactionDate = new Date(date);
      const transactionMonth = transactionDate.getMonth() + 1;

      // Monthly
      if (amount < 0 && transactionMonth === selectedMonth) {
        if (!categoryDetails[category]) {
          categoryDetails[category] = [];
        }
        categoryDetails[category].push({ description, amount: Math.abs(amount), date });
      }
    });

    setDetails(categoryDetails);
  }, [selectedMonth]);

  // const handleCategoryPress = (category) => {
  //   setSelectedCategory(category === selectedCategory ? null : category);
  // };

  return (
    
    <View style={styles.container}>
      <View style={styles.monthSelector}>
      {Array.from({ length: 12 }, (_, i) => (
        <TouchableOpacity key={i} onPress={() => setSelectedMonth(i + 1)}>
          <Text style={selectedMonth === i + 1 ? styles.selectedMonthText : styles.monthText}>
            {new Date(0, i).toLocaleString('default', { month: 'short' })}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
      
      <PieChart
        data={chartData}
        width={screenWidth}
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
        absolute
      />

      {selectedCategory && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>What You Spent on {selectedCategory}</Text>
          <FlatList
            data={details[selectedCategory]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.detailItem}>
                <Text style={styles.description}>{item.description}       {item.date}</Text>
                <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
              </View>
            )}
          />
        </View>
      )}

      <View style={styles.legendContainer}>
        {chartData.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleCategoryPress(item.name)}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  detailsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '90%',
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  legendContainer: {
    marginTop: 20,
    width: '90%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendColor: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  monthSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 16,
    color: '#878787',
    fontWeight: 'bold',
    marginHorizontal: 8,
    paddingVertical: 5,
  },
  selectedMonthText: {
    fontSize: 16,
    marginHorizontal: 8,
    borderRadius: 6, 
    paddingVertical: 5,
    paddingHorizontal: 10, 
    color: '#B19CD9',
    fontWeight: 'bold',
    borderWidth: 1, 
    borderColor: '#B19CD9', 
    backgroundColor: '#f5f5f5',
  },
});
