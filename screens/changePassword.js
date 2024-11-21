import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';

const ChangePassword = ({ visible, onClose, onChangePassword }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordValidations, setPasswordValidations] = useState({
        minLength: false,
        specialChar: false,
        uppercase: false,
    });
    

    const clearInputs = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
    };

    const clearNewPassword = () => {
        setNewPassword('');
        setConfirmNewPassword('');
    };

    const handleChangePassword = () => {
        // Step 1: Check if all fields are filled
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
    
        // Step 2: Check if new password is the same as the old password
        if (newPassword === oldPassword) {
            Alert.alert('Error', 'New password cannot be the same as old password.');
            clearNewPassword(); // Clear new password fields to prevent confusion
            return;
        }
    
        // Step 3: Check if new password and confirm new password match
        if (newPassword !== confirmNewPassword) {
            Alert.alert('Error', 'New password and confirm password do not match.');
            return;
        }
    
        // Step 4: Check if the new password meets the required criteria (length, special character, uppercase)
        const passwordRegex = /^(?=.*[A-Z])(?=.*\W).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            Alert.alert(
                'Error',
                'Password must be at least 8 characters long, contain a special character, and have at least one uppercase letter.'
            );
            return;
        }
    
        // Step 5: If all conditions are met, proceed with the password change
        onChangePassword(newPassword); // Call the onChangePassword function to actually change the password
        clearInputs(); // Clear inputs after successful password change
        setPasswordValidations({
            minLength: false,
            specialChar: false,
            uppercase: false,
        });
        onClose(); // Close the modal after changing the password
    };
    

    const handleCancel = () => {
        clearInputs(); // Clear inputs when cancel is pressed
        setPasswordValidations({
            minLength: false,
            specialChar: false,
            uppercase: false,
        });
        onClose(); // Close the modal
    };

    // Update password validation states on every new character input
    const handleNewPasswordChange = (password) => {
        setNewPassword(password);

        // Check validation rules
        setPasswordValidations({
            minLength: password.length >= 8,
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            uppercase: /[A-Z]/.test(password),
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Change Password</Text>

                        {/* Old Password Input */}
                        <Text style={styles.inputLabel}>Old Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter old password"
                            secureTextEntry
                            value={oldPassword}
                            onChangeText={setOldPassword}
                        />

                        {/* New Password Input */}
                        <Text style={styles.inputLabel}>New Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new password"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={handleNewPasswordChange}
                        />

                        {/* Confirm New Password Input */}
                        <Text style={styles.inputLabel}>Confirm New Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm new password"
                            secureTextEntry
                            value={confirmNewPassword}
                            onChangeText={setConfirmNewPassword}
                        />

                        {/* Password Rules */}
                        <View style={styles.passwordRules}>
                            <Text
                                style={[
                                    styles.passwordRule,
                                    passwordValidations.minLength && styles.validRule,
                                ]}
                            >
                                • At least 8 characters
                            </Text>
                            <Text
                                style={[
                                    styles.passwordRule,
                                    passwordValidations.specialChar && styles.validRule,
                                ]}
                            >
                                • At least one special character
                            </Text>
                            <Text
                                style={[
                                    styles.passwordRule,
                                    passwordValidations.uppercase && styles.validRule,
                                ]}
                            >
                                • At least one uppercase letter
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                            <Text style={styles.buttonText}>Change Password</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={handleCancel}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background to dim the screen
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        color: '#333',
        alignSelf: 'flex-start',
        marginBottom: 5,
        marginLeft: 10, // Added left margin to align with input
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 20,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    passwordRules: {
        width: '100%',
        marginBottom: 20,
    },
    passwordRule: {
        fontSize: 14,
        color: '#666',
    },
    validRule: {
        color: 'green',
    },
    button: {
        backgroundColor: 'purple',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ChangePassword;
