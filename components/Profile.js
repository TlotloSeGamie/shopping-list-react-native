import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button, Alert } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { updateUserProfile, logout } from '../redux/authSlice';

const Profile = ({ onClose }) => {
    const dispatch = useDispatch();
    const reduxUser = useSelector((state) => state.auth.loggedInUser);
    const [user, setUser] = useState({ name: '', email: '', cellphone: '', profileImage: null });
    const [profileImage, setProfileImage] = useState(null);
    const [showButtons, setShowButtons] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formValues, setFormValues] = useState({ name: '', email: '', cellphone: '' });
    const navigate = useNavigate();
    const [loggedOut, setLoggedOut] = useState(false);

    useEffect(() => {
        const storedUserEmail = localStorage.getItem('loggedInUser');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const localStorageUser = users.find((u) => u.email === storedUserEmail);

        if (reduxUser || localStorageUser) {
            const currentUser = reduxUser || localStorageUser;
            setUser(currentUser);
            setProfileImage(currentUser.profileImage || null);
            setFormValues({ ...currentUser, cellphone: currentUser.cellphone || '' });
        } else if (!loggedOut) {
            Alert.alert('Not Logged In', 'You must be logged in to view your profile.', [
                { text: 'OK', onPress: () => navigate('/login') },
            ]);
        }
    }, [reduxUser, loggedOut, navigate]);

    const handleLogout = () => {
        Alert.alert('Are you sure?', 'You want to log out?', [
            {
                text: 'No, stay logged in',
                style: 'cancel',
            },
            {
                text: 'Yes, log out',
                onPress: () => {
                    dispatch(logout());
                    setLoggedOut(true);
                    if (onClose) onClose();
                    navigate('/');
                },
            },
        ]);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newProfileImage = e.target.result;

                setProfileImage(newProfileImage);
                setShowButtons(false);

                const updatedUser = { ...user, profileImage: newProfileImage };
                setUser(updatedUser);
                dispatch(updateUserProfile(updatedUser));

                const users = JSON.parse(localStorage.getItem('users')) || [];
                const updatedUsers = users.map((u) =>
                    u.email === updatedUser.email ? updatedUser : u
                );
                localStorage.setItem('users', JSON.stringify(updatedUsers));

                Alert.alert('Image Updated', 'Your profile image has been updated.');
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        Alert.alert('Are you sure?', 'This will remove your profile picture.', [
            {
                text: 'No, keep it',
                style: 'cancel',
            },
            {
                text: 'Yes, remove it',
                onPress: () => {
                    setProfileImage(null);
                    setShowButtons(false);

                    const updatedUser = { ...user, profileImage: null };
                    setUser(updatedUser);
                    dispatch(updateUserProfile(updatedUser));

                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const updatedUsers = users.map((u) =>
                        u.email === updatedUser.email ? updatedUser : u
                    );
                    localStorage.setItem('users', JSON.stringify(updatedUsers));

                    Alert.alert('Image Removed', 'Your profile picture has been removed.');
                },
            },
        ]);
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

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const updatedUser = { ...formValues, profileImage };
        setUser(updatedUser);
        dispatch(updateUserProfile(updatedUser));

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.map((u) =>
            u.email === updatedUser.email ? updatedUser : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        setIsEditing(false);
        Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    return (
        <View style={styles.profileContainer}>
            {!isEditing ? (
                <>
                    <View style={styles.editProfile}>
                        <Text style={styles.profileHeading}>Profile</Text>
                        <TouchableOpacity style={styles.editProfileBtn} onPress={handleEditClick}>
                            <Text style={styles.btnText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileIcons}>
                        {profileImage ? (
                            <Image
                                source={{ uri: profileImage }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <FaUserCircle size={100} style={styles.defaultProfileIcon} />
                        )}
                        {showButtons && (
                            <View style={styles.profileImageButtons}>
                                <TouchableOpacity
                                    style={styles.uploadBtn}
                                    onPress={() => document.getElementById('profileImageInput').click()}
                                >
                                    <Text style={styles.btnText}>Upload Photo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.removeBtn}
                                    onPress={removeImage}
                                >
                                    <Text style={styles.btnText}>Remove Photo</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    <View style={styles.profileDetails}>
                        <Text><Text style={styles.label}>Username:</Text> {user.name}</Text>
                        <Text><Text style={styles.label}>Email:</Text> {user.email}</Text>
                        {user.cellphone && <Text><Text style={styles.label}>Cellphone:</Text> {user.cellphone}</Text>}
                    </View>
                    <View style={styles.profileActions}>
                        <TouchableOpacity style={styles.profileBtn}>
                            <Text style={styles.btnText}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                            <Text style={styles.btnText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={styles.editProfileForm}>
                    <Text style={styles.profileHeading}>Edit Profile</Text>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Username:</Text>
                        <TextInput
                            style={styles.input}
                            value={formValues.name}
                            onChange={handleFormChange}
                            name="name"
                            required
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Email:</Text>
                        <TextInput
                            style={styles.input}
                            value={formValues.email}
                            onChange={handleFormChange}
                            name="email"
                            editable={false}
                            required
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Cellphone:</Text>
                        <TextInput
                            style={styles.input}
                            value={formValues.cellphone}
                            onChange={handleFormChange}
                            name="cellphone"
                        />
                    </View>
                    <TouchableOpacity onPress={handleFormSubmit} style={styles.saveBtn}>
                        <Text style={styles.btnText}>Save Changes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => setIsEditing(false)}
                    >
                        <Text style={styles.btnText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = {
    profileContainer: {
        margin: 20,
        padding: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        alignItems: 'center',
    },
    profileHeading: {
        fontSize: 24,
        marginBottom: 20,
    },
    profileDetails: {
        marginBottom: 20,
        alignItems: 'flex-start',
    },
    label: {
        fontWeight: 'bold',
    },
    profileIcons: {
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    defaultProfileIcon: {
        width: 100,
        height: 100,
    },
    profileImageButtons: {
        marginTop: 10,
        flexDirection: 'row',
        gap: 10,
    },
    uploadBtn: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    removeBtn: {
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
    },
    btnText: {
        color: '#fff',
    },
    profileActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    profileBtn: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    logoutBtn: {
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
    },
    editProfileForm: {
        width: '100%',
    },
    formGroup: {
        marginBottom: 10,
    },
    input: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    saveBtn: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    cancelBtn: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
    },
};

export default Profile;
