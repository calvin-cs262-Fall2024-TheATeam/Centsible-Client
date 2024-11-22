import React, { useState } from 'react';
import { Modal, TextInput, Text, View, Button, TouchableOpacity, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { globalStyles } from '../styles/globalStyles';
import SegmentedControlTab from "react-native-segmented-control-tab";
import PropTypes from 'prop-types';
// may need to use command "npm install react-native-segmented-control-tab"

const expenseCategories = [
    'Housing',
    'Entertainment',
    'Food',
    'Personal',
    'Transportation',
    'Education'
];

//TODO get rid of unneeded global styles that shouldn't be found there
const TransactionModal = ({ visible, onClose, onAdd, amount, setAmount, category, setCategory, date, setDate, selectedIndex, handleIndexChange, description, setDescription, resetForm }) => {
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);

    const renderCategoryItem = (categoryName) => (
        <TouchableOpacity
            onPress={() => {
                setCategory(categoryName);
                setCategoryModalVisible(false); // Close modal once category is selected
            }}
            style={globalStyles.categoryOption}
        >
            <Text style={globalStyles.categoryOptionText}>{categoryName}</Text>
        </TouchableOpacity>
    );

    TransactionModal.propTypes = {
        visible: PropTypes.bool,
        onClose: PropTypes.func,
        onAdd: PropTypes.func,
        amount: PropTypes.string,
        setAmount: PropTypes.func,
        category: PropTypes.string,
        setCategory: PropTypes.func,
        date: PropTypes.instanceOf(Date),
        setDate: PropTypes.func,
        selectedIndex: PropTypes.number,
        handleIndexChange: PropTypes.func,
        description: PropTypes.string,
        setDescription: PropTypes.func,
        resetForm: PropTypes.func,
    };

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={globalStyles.modalContainer}>
                    <View style={globalStyles.transactionHeader}>
                        <Button
                            title="Cancel"
                            onPress={() => {
                                onClose();    // Close the modal
                                resetForm();  // Reset the form
                            }}
                            color="red"
                            style={globalStyles.cancelTransaction}
                        />
                        <Text style={globalStyles.transactionHeaderText}>Add a transaction</Text>

                        {/* less preferred option but working for now */}
                        <Button
                            title="Add"
                            onPress={() => {
                                if (!amount && !category && selectedIndex === 0) {
                                    alert("Please enter an amount and select a category");
                                }
                                else if (!amount || (!amount && selectedIndex === 1)) {
                                    alert("Please enter an amount");
                                }
                                else if (!category && selectedIndex === 0) {
                                    alert("Please select a category")
                                } else {
                                    onAdd(); // Call the function to add a transaction
                                    onClose(); // Close the modal after adding the transaction
                                }
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
                            autoFocus={false}
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
                        autoFocus={false}
                    />

                    {/* Category input: Only show modal if "Expense" is selected */}
                    <TouchableOpacity
                        style={globalStyles.input}
                        onPress={() => {
                            // Only show the category modal if "Expense" is selected
                            if (selectedIndex === 0) {
                                setCategoryModalVisible(true);
                            }
                        }}
                        disabled={selectedIndex === 1} // Disable if "Income" is selected
                    >
                        <Text style={globalStyles.inputText}>
                            {selectedIndex === 1 ? "Income" : category || "Select category"}
                        </Text>
                    </TouchableOpacity>

                    {/* Category Selection Modal */}
                    {categoryModalVisible && selectedIndex === 0 && (
                        <Modal
                            transparent={true}
                            animationType="fade"
                            visible={categoryModalVisible}
                            onRequestClose={() => setCategoryModalVisible(false)}
                        >
                            <View style={globalStyles.categoryModalContainer}>
                                <FlatList
                                    data={expenseCategories}
                                    renderItem={({ item }) => renderCategoryItem(item)}
                                    keyExtractor={(item) => item}
                                    style={globalStyles.categoryList}
                                />
                                <TouchableOpacity
                                    style={globalStyles.closeCategoryModal}
                                    onPress={() => setCategoryModalVisible(false)}
                                >
                                    <Text style={globalStyles.closeCategoryText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    )}

                    <TextInput
                        placeholder="Enter a description (optional)"
                        value={description}
                        onChangeText={setDescription}
                        style={globalStyles.input}
                        placeholderTextColor="#888"
                    />
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default TransactionModal;
