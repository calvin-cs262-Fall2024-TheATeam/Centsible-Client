import React from 'react';
import { Modal, TextInput, Text, View, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { globalStyles } from '../styles/globalStyles';
import SegmentedControlTab from "react-native-segmented-control-tab"; // me
// may need to use command "npm install react-native-segmented-control-tab"

//TODO get rid of unneeded global styles that shouldn't be found there
const TransactionModal = ({ visible, onClose, onAdd, amount, setAmount, category, setCategory, date, setDate, selectedIndex, handleIndexChange }) => {
    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
        >
            <View style={globalStyles.modalContainer}>
                <Text style={globalStyles.createTransactionText}>
                    + Add a transaction
                </Text>

                <View style={globalStyles.transactionHeader}>
                    <Button
                        title="Cancel"
                        onPress={onClose}
                        color="red"
                        style={globalStyles.cancelTransaction}
                    />
                    <Text style={globalStyles.transactionHeaderText}>Add a transaction</Text>

                    {/* less preferred option but working for now */}
                    <Button
                        title="Add"
                        onPress={() => {
                            onAdd(); // Call the function to add a transaction
                            onClose(); // Close the modal after adding the transaction
                        }}
                        color="purple"
                    />

                    {/* TO FIX: Add button but as touchable opacity. 
                 Would prefer to use this but haven't figured out styling */}
                    {/* <TouchableOpacity onPress={handleAddTransaction}>
                 <Text style={globalStyles.addTransaction}>Add</Text>
             </TouchableOpacity> */}
                </View>

                {/* <Text style={globalStyles.modalTitle}>Add transaction</Text> */}

                {/* Expense/income segmented control tab */}
                <View style={globalStyles.sctContainer}>
                    <SegmentedControlTab
                        values={['Expense', 'Income']}
                        selectedIndex={selectedIndex}
                        tabStyle={globalStyles.tabStyle}
                        activeTabStyle={globalStyles.activeTabStyle}
                        tabTextStyle={globalStyles.tabTextStyle}
                        onTabPress={handleIndexChange}
                    />
                </View>

                <View style={globalStyles.dateContainer}>
                    <Text style={globalStyles.setDateText}>Date of transaction: </Text>
                    <DateTimePicker
                        style={globalStyles.datePicker}
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            // setShowDatePicker(true);
                            if (selectedDate) {
                                setDate(selectedDate);
                            }
                        }}
                    />
                </View>

                <TextInput
                    placeholder="Enter amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    style={globalStyles.input}
                    placeholderTextColor="#888"
                    autoFocus={true}
                />

                {/* Ideally this will become a dropdown of previously created categories? */}
                <TextInput
                    placeholder="Enter category"
                    value={category}
                    onChangeText={setCategory}
                    style={globalStyles.input}
                    placeholderTextColor="#888"
                />
            </View>
        </Modal>
    );
};

export default TransactionModal;