import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { logout } from "../redux/authSlice";
import Profile from "./Profile";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isLoggedIn: reduxLoggedIn, loggedInUser: reduxLoggedInUser } = useSelector((state) => state.auth);
  const [isLoggedIn, setIsLoggedIn] = useState(reduxLoggedIn);
  const [loggedInUser, setLoggedInUser] = useState(reduxLoggedInUser);
  const [showProfile, setShowProfile] = useState(false);
  const [profileImage, setProfileImage] = useState(reduxLoggedInUser?.profileImage || null);

  useEffect(() => {
    setIsLoggedIn(reduxLoggedIn);
    setLoggedInUser(reduxLoggedInUser);
    setProfileImage(reduxLoggedInUser?.profileImage || null);
  }, [reduxLoggedIn, reduxLoggedInUser]);

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

  const handleLogout = () => {
    dispatch(logout());
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setShowProfile(false);
    setProfileImage(null);
    navigation.navigate("Home");
  };

  return (
    <View style={styles.navMain}>
      <Text style={styles.logoText}>Shopping Baskette</Text>
      <View style={styles.logins}>
        {isLoggedIn ? (
          <>
            <TouchableOpacity
              style={styles.profile}
              onPress={() => setShowProfile(true)}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <Icon name="user-circle" style={styles.profileIcon} />
              )}
              <Text style={styles.profileText}>
                {capitalizeFirstLetter(loggedInUser?.name)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
              <Icon name="sign-out" style={styles.logoutIcon} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>
                <Icon name="sign-in" /> Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.loginLink}>
                <Icon name="user-plus" /> Sign Up
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {showProfile && (
        <Modal visible={true} transparent animationType="slide">
          <View style={styles.profileModal}>
            <View style={styles.profileModalContent}>
              <TouchableOpacity
                style={styles.closeModal}
                onPress={() => setShowProfile(false)}
              >
                <Text style={styles.closeModalText}>&times;</Text>
              </TouchableOpacity>
              <Profile onClose={() => setShowProfile(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#6ff2c0",
    padding: 25,
    height: "12%",
  },
  logoText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  logins: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginLink: {
    color: "#000",
    fontSize: 16,
    marginLeft: 10,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    fontSize: 30,
    color: "#021ffa",
  },
  profileText: {
    color: "#000",
    fontSize: 16,
    marginLeft: 5,
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  logoutIcon: {
    fontSize: 16,
    color: "#fff",
    marginRight: 5,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  profileModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxWidth: 400,
  },
  closeModal: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeModalText: {
    fontSize: 24,
    color: "#333",
  },
});

export default Navbar;
