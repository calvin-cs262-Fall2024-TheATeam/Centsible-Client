import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TransactionItem = ({ item }) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = item.date.toLocaleDateString('en-US', options).replace(',', '');
  
    return (
      <View>
        <View style={styles.itemContainer}>
          <View>
            <Text style={styles.dateText}>{formattedDate.toUpperCase()}</Text>
            <Text>{item.category}</Text>
          </View>
          <Text style={[styles.amountText, { color: item.type === 'income' ? 'green' : 'red' }]}>
            {item.type === 'income' ? `+${item.amount.toFixed(2)}` : `-${item.amount.toFixed(2)}`}
          </Text>
        </View>
        <View style={styles.divider} />
      </View>
    );
  };

  const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 5,
      alignItems: 'center',
      width: '100%',
    },
    dateText: {
      fontWeight: '500',
      paddingTop: 4,
    },
    amountText: {
      fontWeight: 'bold',
    },
    divider: {
      height: 1.5,
      backgroundColor: '#ccc',
      marginTop: 4,
      width: '100%',
    },
  });
  
  export default TransactionItem;