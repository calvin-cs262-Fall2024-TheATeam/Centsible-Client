import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import bankData from '../assets/bankStatement.json';
import { Picker } from '@react-native-picker/picker';

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
      const transactionMonth = transactionDate.getMonth() + 1;

      if (amount < 0 && transactionMonth === selectedMonth) {
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += Math.abs(amount);
      }
    });

    const totalSpending = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);

    const chartData = Object.keys(categoryTotals).map((category, index) => ({
      name: category,
      population: categoryTotals[category],
      color: getColor(index),
      legendFontColor: '#333',
      legendFontSize: 12,
      percentage: ((categoryTotals[category] / totalSpending) * 100).toFixed(1),
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

      if (amount < 0 && transactionMonth === selectedMonth) {
        if (!categoryDetails[category]) {
          categoryDetails[category] = [];
        }
        categoryDetails[category].push({ description, amount: Math.abs(amount), date });
      }
    });

    setDetails(categoryDetails);
  }, [selectedMonth]);

  return (
    <ScrollView style={styles.container}>
      {/* Month Selector Dropdown */}
      <Picker
        selectedValue={selectedMonth}
        onValueChange={(itemValue) => setSelectedMonth(itemValue)}
        style={styles.picker}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <Picker.Item
            key={i}
            label={new Date(0, i).toLocaleString('default', { month: 'long' })}
            value={i + 1}
          />
        ))}
      </Picker>

      {/* Donut Chart Section */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Spending Breakdown for {new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })}</Text>
        <PieChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          hasLegend={false}
          center={[50, 0]}
          absolute
        />
        <FlatList
          data={chartData}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.name}: {item.percentage}%</Text>
            </View>
          )}
        />
      </View>

      {/* Details Section */}
      {selectedCategory && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Details for {selectedCategory}</Text>
          <FlatList
            data={details[selectedCategory]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.detailItem}>
                <Text style={styles.description}>{item.description} - {item.date}</Text>
                <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
              </View>
            )}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  picker: {
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
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
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
});

