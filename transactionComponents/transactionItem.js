import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TransactionItem = ({ item }) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = new Date(item.transactiondate).toLocaleDateString('en-US', options).replace(',', '');
  
    return (
      <TouchableHighlight
        style={[styles.rowFrontVisible, { height: isExpanded ? 70 : 60 }]}  // Adjust height if expanded
        onPress={() => handleExpandTransaction(data.item.key)} // Toggle expansion on press
        underlayColor="#D3D3D3"
      >
        <View style={styles.itemContainer}>
          <View>
            <Text style={styles.dateText}>{formattedDate.toUpperCase()}</Text>
            {data.item.transactiontype === 'Income' ? (
              <Text style={[styles.categoryText, isExpanded && { paddingBottom: 0 }]}>Income</Text>
            ) : (
              <Text style={[styles.categoryText, isExpanded && { paddingBottom: 0 }]}>{data.item.category}</Text>
            )}
            {/* Render description if expanded */}
            {isExpanded && (
              <Text style={[styles.descriptionText, { paddingBottom: 8 }]}>
                {data.item.optionaldescription || "No description given"}
              </Text>
            )}
          </View>
          <Text style={[styles.amountText, { color: data.item.transactiontype === 'Income' ? 'green' : 'black' }]}>
            {data.item.transactiontype === 'Income'
              ? `+$${parseFloat(data.item.dollaramount).toFixed(2)}`
              : `-$${parseFloat(data.item.dollaramount).toFixed(2)}`}
          </Text>
        </View>
      </TouchableHighlight>
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