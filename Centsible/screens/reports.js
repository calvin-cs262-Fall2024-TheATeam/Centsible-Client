import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import bankData from '../assets/bankStatement.json';

export default function ReportsScreen() {
  const screenWidth = Dimensions.get('window').width;
  const [chartData, setChartData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [details, setDetails] = useState({});

  const colors = ['#f39c12', '#3498db', '#e74c3c', '#9b59b6', '#1abc9c', '#2ecc71', '#e67e22', '#d35400'];

  const getColor = (index) => colors[index % colors.length];

  const processData = () => {
    const categoryTotals = {};

    bankData.transactions.forEach((transaction) => {
      const { category, amount } = transaction;
      if (amount < 0) { // Consider only expenses
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
      legendFontColor: '#000',
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
      if (amount < 0) { // Consider only expenses
        if (!categoryDetails[category]) {
          categoryDetails[category] = [];
        }
        categoryDetails[category].push({ description, amount: Math.abs(amount), date });
      }
    });

    setDetails(categoryDetails);
  }, []);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>November 2024</Text>
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
    backgroundColor: '#e8d0f4',
  },
  // header and headerText are purple bar at the top
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
  },
});
