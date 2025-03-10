import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Image, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
// import Profile from "./Profile";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const storedLoggedIn = await AsyncStorage.getItem("isLoggedIn");
            const storedUserEmail = await AsyncStorage.getItem("loggedInUser");

            if (storedLoggedIn === "true" && storedUserEmail) {
                const users = JSON.parse(await AsyncStorage.getItem("users")) || [];
                const user = users.find((u) => u.email === storedUserEmail);
                
                if (user) {
                    setIsLoggedIn(true);
                    setLoggedInUser(user);
                    setProfileImage(user.profileImage || null);
                }
            }
        } catch (error) {
            Alert.alert("Error", "Failed to load user data.");
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("isLoggedIn");
            await AsyncStorage.removeItem("loggedInUser");
            setIsLoggedIn(false);
            setLoggedInUser(null);
            setProfileImage(null);
            setShowProfile(false);
            Alert.alert("Success", "Logged out successfully!");
        } catch (error) {
            Alert.alert("Error", "Logout failed.");
        }
    };

    const handleProfileClose = (updatedUser) => {
        setShowProfile(false);
        if (updatedUser) {
            setLoggedInUser(updatedUser);
            setProfileImage(updatedUser.profileImage || null);
        }
    };

    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

    return (
        <>
            <View style={styles.navMain}>
                <View style={styles.logo}>
                    <Text style={styles.logoText}>Shopping Baskette</Text>
                </View>
                <View style={styles.logins}>
                    {isLoggedIn ? (
                        <>
                            <TouchableOpacity
                                style={styles.loginLink}
                                onPress={() => setShowProfile(true)}
                            >
                                {profileImage ? (
                                    <Image
                                        source={{ uri: profileImage }}
                                        style={styles.navbarProfileImage}
                                    />
                                ) : (
                                    <Text style={styles.profileIcon}>👤</Text>
                                )}
                                <Text style={styles.profileText}>
                                    {capitalizeFirstLetter(loggedInUser?.name)}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                                <Text style={styles.logoutIcon}>🚪</Text> 
                                <Text>Logout</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.loginLink} onPress={() => Alert.alert("Navigate", "Go to Login Screen")}>
                                <Text>🔑 Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.loginLink} onPress={() => Alert.alert("Navigate", "Go to Register Screen")}>
                                <Text>📝 Register</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            {showProfile && (
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={showProfile}
                    onRequestClose={() => setShowProfile(false)}
                >
                    <View style={styles.profileModal}>
                        <View style={styles.profileModalContent}>
                            <TouchableOpacity
                                style={styles.closeModal}
                                onPress={() => setShowProfile(false)}
                            >
                                <Text style={styles.closeModalText}>×</Text>
                            </TouchableOpacity>
                            {/* <Profile onClose={(updatedUser) => handleProfileClose(updatedUser)} /> */}
                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    navMain: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 25,
        backgroundColor: "#4682b4",
    },
    logoText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    logins: {
        flexDirection: "row",
        alignItems: "center",
    },
    loginLink: {
        marginLeft: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    navbarProfileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    profileIcon: {
        fontSize: 30,
        marginRight: 10,
    },
    profileText: {
        color: "#fff",
        fontWeight: "bold",
    },
    logout: {
        marginLeft: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    logoutIcon: {
        fontSize: 18,
        marginRight: 5,
    },
    profileModal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    profileModalContent: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    closeModal: {
        position: "absolute",
        top: 10,
        right: 15,
    },
    closeModalText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
});

export default Navbar;
