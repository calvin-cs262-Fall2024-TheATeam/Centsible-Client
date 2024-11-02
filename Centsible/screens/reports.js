import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import bankData from '../assets/bankStatement.json'; // Adjust the path as needed

export default function ReportScreen() {
  const [data, setData] = useState(null);

  // Function to load bank data
  const loadBankData = async () => {
    setData(bankData); // Set the imported JSON data to state
  };

  // Use useEffect to load data when the component mounts
  useEffect(() => {
    loadBankData();
  }, []);

  // Render the data if it exists
  return (
    <ScrollView contentContainerStyle={globalStyles.screenText}>
      <Text style={globalStyles.headerText}>Reports</Text>
      {data && data.transactions.map((transaction, index) => (
        <View key={index} style={globalStyles.transactionItem}>
          <Text>{`${transaction.date} - ${transaction.description} (${transaction.category}): $${transaction.amount.toFixed(2)}`}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
