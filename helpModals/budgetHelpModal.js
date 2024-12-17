import React, { useState } from 'react';
import { Modal, Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/FontAwesome';


const BudgetHelpModal = ({ visible, onClose }) => {

    const [makeBudgetCollapsed, setMakeBudgetCollapsed] = useState(true);
    const [seeReportsCollapsed, setSeeReportsCollapsed] = useState(true);
    const [seeTransactions, setSeeTransactions] = useState(true);
    const [seeProfile, setSeeProfile] = useState(true);
    
    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType="slide"
        >
            {/* Modal Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Help</Text>
                {/* Close Button in the Header */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>

            {/* Modal Content */}
            {/* <ScrollView>
                <View style={styles.helpContent}>
                    <Text style={styles.helpHeaderText}>Make a budget: {'\n'} </Text>
                    <Text style={styles.helpContentOrderedList}>
                        1. Tap <Text style={styles.bold}>Add a subcategory</Text> in the category you want {'\n'}
                        2. Enter a name and the amount you plan to spend in that subcategory and tap <Text style={styles.bold}>Add</Text> {'\n'}
                        3. To edit the amount in a subcategory, tap on the amount {'\n'}
                        4. The progress bar will show you how much you have spent in that category
                    </Text>
                </View>
            </ScrollView> */}

            {/* Modal Content */}
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView>
                        {/* Header for the budget information */}
                        <TouchableOpacity style={styles.helpHeader} onPress={() => setMakeBudgetCollapsed(!makeBudgetCollapsed)}>
                            <Text style={styles.helpHeaderText}>Make a budget</Text>
                            <Icon name={ makeBudgetCollapsed ? 'chevron-down' : 'chevron-up' } size={18} color="#fff" />
                        </TouchableOpacity>

                        {/* Content for budget information */}
                        <Collapsible collapsed={makeBudgetCollapsed}>
                            <View style={styles.helpContent}>
                                <Text style={styles.helpContentText}>
                                    Navigate to the <Text style={styles.bold}>Budget</Text> tab at the bottom of the screen.
                                </Text>
                                <Text style={styles.helpContentOrderedList}>
                                    1. Tap <Text style={styles.bold}>Add a subcategory</Text> in the category you want {'\n'}
                                    2. Enter a name and the amount you plan to spend in that subcategory and tap <Text style={styles.bold}>Add</Text> {'\n'}
                                    3. To edit the amount in a subcategory, tap on the amount {'\n'}
                                    4. The progress bar will show you how much you have spent in that category
                                </Text>
                            </View>
                        </Collapsible>

                        {/* Header with a dropdown button */}
                        <TouchableOpacity style={styles.helpHeader} onPress={() => setSeeReportsCollapsed(!seeReportsCollapsed)}>
                            <Text style={styles.helpHeaderText}>View an analysis of your finances</Text>
                            <Icon name={ seeReportsCollapsed ? 'chevron-down' : 'chevron-up' } size={18} color="#fff" />
                        </TouchableOpacity>

                        {/* Collapsible Content */}
                        <Collapsible collapsed={seeReportsCollapsed}>
                            <View style={styles.helpContent}>
                                <Text style={styles.helpContentText}>
                                    Navigate to the <Text style={styles.bold}>Reports</Text> tab at the bottom of the screen.
                                </Text>
                                <Text style={styles.helpContentText}>
                                    <Text style={styles.bold}>To view reports from previous months:</Text>
                                </Text>
                                <Text style={styles.helpContentOrderedList}>
                                    1. Tap on the <Text style={styles.bold}>purple bar</Text> at the top {'\n'}
                                    2. Scroll to the desired month
                                </Text>
                                <Text style={styles.helpContentText}>
                                    <Text style={styles.bold}>To compare your spending and income:</Text>
                                </Text>
                                <Text style={styles.helpContentText}>
                                    Locate the <Text style={styles.bold}>Income vs. Expenses</Text> at the top of the page.
                                </Text>
                                <Text style={styles.helpContentOrderedList}>
                                    The <Text style={styles.bold}>blue</Text> represents your income for the month. {'\n'}
                                    The <Text style={styles.bold}>red</Text> represents your expenses for the month.
                                </Text>
                                <Text style={styles.helpContentText}>
                                    <Text style={styles.bold}>View your spending by category:</Text>
                                </Text>
                                <Text style={styles.helpContentOrderedList}>
                                    1. Scroll to <Text style={styles.bold}>Total Expenses</Text>{'\n'}
                                    2. In the pie chart, each slice of the chart represents a spending category {'\n'}
                                    3. The red number in the middle is your total expenses for the month {'\n'}
                                    4. Click on the labels next to the chart to reveal more details about a category
                                </Text>
                            </View>
                        </Collapsible>

                        {/* Header for Transactions help */}
                        <TouchableOpacity style={styles.helpHeader} onPress={() => setSeeTransactions(!seeTransactions)}>
                            <Text style={styles.helpHeaderText}>See your income and expenses</Text>
                            <Icon name={ seeTransactions ? 'chevron-down' : 'chevron-up' } size={18} color="#fff" />
                        </TouchableOpacity>

                        {/* Content for Transactions help */}
                        <Collapsible collapsed={seeTransactions}>
                            <View style={styles.helpContent}>
                                <Text style={styles.helpContentText}>
                                    Navigate to the <Text style={styles.bold}>Transactions</Text> tab at the bottom of the screen. {'\n'}
                                    To see a <Text style={styles.bold}>description</Text> of any tranaction, tap on the box
                                </Text>
                                <Text style={styles.helpContentText}>
                                    <Text style={styles.bold}>View transactions from previous months:</Text>
                                </Text>
                                <Text style={styles.helpContentOrderedList}>
                                    1. Tap on the <Text style={styles.bold}>purple bar</Text> at the top {'\n'}
                                    2. Scroll to the desired month
                                </Text>
                                <Text style={styles.helpContentText}>
                                    <Text style={styles.bold}>Delete a transaction: </Text>
                                </Text>
                                <Text style={styles.helpContentOrderedList}>
                                    1. <Text style={styles.bold}>Swipe</Text> to the left on a transaction {'\n'}
                                    2. Press the red <Text style={styles.bold}>trash can icon</Text>
                                </Text>
                                <Text style={styles.helpContentText}>
                                    <Text style={styles.bold}>Add your income:</Text>
                                </Text>
                                <Text style={styles.helpContentOrderedList}>
                                    1. Tap the purple <Text style={styles.bold}>+</Text> in the upper right corner {'\n'}
                                    2. Select <Text style={styles.bold}>Income</Text> {'\n'}
                                    3. Enter the appropriate <Text style={styles.bold}>date</Text> and <Text style={styles.bold}>amount</Text> {'\n'}
                                    4. Add an option <Text style={styles.bold}>description</Text> {'\n'}
                                    5. Tap <Text style={styles.bold}>Add</Text> in the upper right corner
                                </Text>
                                <Text style={styles.helpContentText}>
                                    <Text style={styles.bold}>Add an expense:</Text>
                                </Text>
                                <Text style={styles.helpContentOrderedList}>
                                    1. Tap the purple <Text style={styles.bold}>+</Text> in the upper right corner {'\n'}
                                    2. Select <Text style={styles.bold}>Income</Text> {'\n'}
                                    3. Enter the appropriate <Text style={styles.bold}>date</Text> and <Text style={styles.bold}>amount</Text> {'\n'}
                                    4. Add an optional <Text style={styles.bold}>description</Text> {'\n'}
                                    5. Tap <Text style={styles.bold}>Add</Text> in the upper right corner
                                </Text>
                            </View>
                        </Collapsible>

                        <TouchableOpacity style={styles.helpHeader} onPress={() => setSeeProfile(!seeProfile)}>
                            <Text style={styles.helpHeaderText}>See your profile</Text>
                            <Icon name={ seeProfile ? 'chevron-down' : 'chevron-up' } size={18} color="#fff" />
                        </TouchableOpacity>

                        {/* Collapsible Content */}
                        <Collapsible collapsed={seeProfile}>
                            <View style={styles.helpContent}>
                                <Text style={styles.helpContentText}>
                                    Navigate to the <Text style={styles.bold}>Profile</Text> tab at the bottom of the screen.
                                </Text>
                                <Text style={styles.helpContentText}>
                                    <Text style={styles.bold}>Change your password:</Text>
                                </Text>
                                <Text style={styles.helpContentOrderedList}>
                                    1. Select <Text style={styles.bold}>Change password</Text>{'\n'}
                                    2. Follow the instructions {'\n'}
                                    3. Tap <Text style={styles.bold}>Change password</Text>
                                </Text>
                            </View>
                        </Collapsible>

                    </ScrollView>
                </View>
            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#eee',
    },
    // Header Style
    header: {
        height: 90,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        paddingTop: 40,
    },
    headerText: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        paddingTop: 35,
    },
    closeButtonText: {
        color: 'red',
        fontSize: 18,
    },
    // content
    modalContent: {
        // paddingTop: 15,
    },
    modalText: {
        fontSize: 24,
        color: 'black',
    },

    // help content
    helpHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: '#231942',
        // Shadow for iOS
        shadowColor: '#999',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        // Shadow for Android
        elevation: 5,
    },
    helpHeaderText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    helpContent: {
        // marginBottom: 10,
        padding: 15,
        backgroundColor: '#fff',
        // marginHorizontal: 10,
    },
    helpContentText: {
        fontSize: 16,
        color: '#333',
        paddingBottom: 10,
    },
    helpContentOrderedList: {
        fontSize: 16,
        color: '#333',
        paddingLeft: 15,
        paddingBottom: 10,
    },
    helpContentOrderedListTab: {
        fontSize: 16,
        color: '#333',
        paddingLeft: 50,
        paddingBottom: 10,    
    },
    bold: {
        fontWeight: 'bold',
    }
})

export default BudgetHelpModal;
