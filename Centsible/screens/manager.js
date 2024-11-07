import React, { useState } from 'react';
import Transaction from '../transaction'; 
import ReportScreen from '../reports'; 
import bankData from '../assets/bankStatement.json'; 

export default function BankStatementManager() {
  const [transactions, setTransactions] = useState(bankData.transactions);

  // Function to add a new transaction
  const addTransaction = (newTransaction) => {
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
  };

  return (
    <View style={{ flex:1 }}>
      <Transaction addTransaction={addTransaction} transactions={transactions} />
      <ReportScreen transactions={transactions} />
    </View>
  );
}
