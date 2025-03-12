import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { updateUserProfile, logout } from '../redux/authSlice';

const Profile = ({ onClose }) => {
    const dispatch = useDispatch();
    const reduxUser = useSelector((state) => state.auth.loggedInUser);
    const [user, setUser] = useState({ name: '', email: '', cellphone: '', profileImage: null });
    const [profileImage, setProfileImage] = useState(null);
    const [showButtons, setShowButtons] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formValues, setFormValues] = useState({ name: '', email: '', cellphone: '' });
    const navigation = useNavigation();
    const [loggedOut, setLoggedOut] = useState(false);

    useEffect(() => {
        const storedUserEmail = ''; // Replace with AsyncStorage retrieval logic
        const users = []; // Replace with AsyncStorage retrieval logic

        const localStorageUser = users.find((u) => u.email === storedUserEmail);

        if (reduxUser || localStorageUser) {
            const currentUser = reduxUser || localStorageUser;
            setUser(currentUser);
            setProfileImage(currentUser.profileImage || null);
            setFormValues({ ...currentUser, cellphone: currentUser.cellphone || '' });
        } else if (!loggedOut) {
            Alert.alert('Not Logged In', 'You must be logged in to view your profile.', [
                { text: 'OK', onPress: () => navigation.navigate('Login') },
            ]);
        }
    }, [reduxUser, loggedOut, navigation]);

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(logout());
                        setLoggedOut(true);
                        if (onClose) onClose();
                        navigation.navigate('Home');
                    },
                },
            ]
        );
    };

    const handleImageChange = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'You need to allow access to your photos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const newProfileImage = result.uri;

            setProfileImage(newProfileImage);
            setShowButtons(false);

            const updatedUser = { ...user, profileImage: newProfileImage };
            setUser(updatedUser);
            dispatch(updateUserProfile(updatedUser));

            // Replace with AsyncStorage update logic
            Alert.alert('Image Updated', 'Your profile image has been updated.');
        }
    };

    const removeImage = () => {
        Alert.alert(
            'Remove Photo',
            'Are you sure you want to remove your profile picture?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        setProfileImage(null);
                        setShowButtons(false);

                        const updatedUser = { ...user, profileImage: null };
                        setUser(updatedUser);
                        dispatch(updateUserProfile(updatedUser));

                        // Replace with AsyncStorage update logic
                        Alert.alert('Image Removed', 'Your profile picture has been removed.');
                    },
                },
            ]
        );
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setFormValues({
            name: user.name,
            email: user.email,
            cellphone: user.cellphone,
        });
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formValues.email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return false;
        }

        if (formValues.cellphone && !/^\d+$/.test(formValues.cellphone)) {
            Alert.alert('Invalid Cellphone', 'Cellphone number must contain only digits.');
            return false;
        }

        return true;
    };

    const handleFormSubmit = () => {
        if (!validateForm()) return;

        const updatedUser = { ...formValues, profileImage };
        setUser(updatedUser);
        dispatch(updateUserProfile(updatedUser));

        // Replace with AsyncStorage update logic
        setIsEditing(false);
        Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
    };

    const handleFormChange = (key, value) => {
        setFormValues((prevValues) => ({ ...prevValues, [key]: value }));
    };

    return (
        <View style={styles.container}>
            {!isEditing ? (
                <>
                    <View style={styles.header}>
                        <Text style={styles.title}>Profile</Text>
                        <TouchableOpacity onPress={handleEditClick} style={styles.editButton}>
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => profileImage && setShowButtons(!showButtons)}
                        style={styles.imageContainer}
                    >
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <Text style={styles.defaultProfileIcon}>🙂</Text>
                        )}
                    </TouchableOpacity>
                    {showButtons && (
                        <View style={styles.buttonContainer}>
                            <Button title="Upload Photo" onPress={handleImageChange} />
                            <Button title="Remove Photo" onPress={removeImage} color="red" />
                        </View>
                    )}
                    <View style={styles.details}>
                        <Text><Text style={styles.label}>Username:</Text> {user.name}</Text>
                        <Text><Text style={styles.label}>Email:</Text> {user.email}</Text>
                        {user.cellphone && <Text><Text style={styles.label}>Cellphone:</Text> {user.cellphone}</Text>}
                    </View>
                    <Button title="Log Out" onPress={handleLogout} color="red" />
                </>
            ) : (
                <View style={styles.form}>
                    <Text style={styles.title}>Edit Profile</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={formValues.name}
                        onChangeText={(value) => handleFormChange('name', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={formValues.email}
                        editable={false}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Cellphone"
                        value={formValues.cellphone}
                        onChangeText={(value) => handleFormChange('cellphone', value)}
                    />
                    <Button title="Save Changes" onPress={handleFormSubmit} />
                    <Button title="Cancel" onPress={() => setIsEditing(false)} color="red" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    editButtonText: {
        color: '#fff',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    defaultProfileIcon: {
        fontSize: 100,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    details: {
        marginBottom: 20,
    },
    label: {
        fontWeight: 'bold',
    },
    form: {
        marginTop: 20,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 15,
        fontSize: 16,
        padding: 10,
    },
});

export default Profile;
