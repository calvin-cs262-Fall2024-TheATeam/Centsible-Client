import React from 'react';
import { Modal, TextInput, TouchableOpacity, Text, View, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { globalStyles } from '../styles/globalStyles';

const TransactionModal = ({ visible, onClose, onAdd, amount, setAmount, category, setCategory, type, setType, date, setDate, showDatePicker, setShowDatePicker }) => {
    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={globalStyles.modalContainer}>
                <Text style={globalStyles.modalTitle}>Add Transaction Amount</Text>

                <TextInput
                    placeholder="Enter amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    style={globalStyles.input}
                    placeholderTextColor="#888"
                    autoFocus={true}
                />

                <TextInput
                    placeholder="Enter category"
                    value={category}
                    onChangeText={setCategory}
                    style={globalStyles.input}
                    placeholderTextColor="#888"
                />
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                    <TouchableOpacity
                        style={[globalStyles.button, type === 'expense' && { backgroundColor: 'lightgray' }]}
                        onPress={() => setType('expense')}
                    >
                        <Text style={globalStyles.buttonText}>Expense</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[globalStyles.button, type === 'income' && { backgroundColor: 'lightgray' }]}
                        onPress={() => setType('income')}
                    >
                        <Text style={globalStyles.buttonText}>Income</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={globalStyles.button}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={globalStyles.buttonText}>{`Select Date: ${date.toLocaleDateString()}`}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                                setDate(selectedDate);
                            }
                        }}
                    />
                )}

                <TouchableOpacity
                    style={globalStyles.button}
                    onPress={onAdd}
                >
                    <Text style={globalStyles.buttonText}>Add</Text>
                </TouchableOpacity>
                <Button title="Cancel" onPress={onClose} color="red" />
            </View>
        </Modal>
    );
};

export default TransactionModal;