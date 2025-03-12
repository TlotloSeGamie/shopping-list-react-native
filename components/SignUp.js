import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../redux/authSlice";
import { Ionicons } from "@expo/vector-icons";
// import Swal from "sweetalert2";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const users = useSelector((state) => state.auth.users);

  // Inject custom SweetAlert styling to ensure it appears on top
  // if (typeof document !== "undefined") {
  //   const style = document.createElement("style");
  //   style.textContent = `
  //     .swal2-container {
  //       z-index: 9999 !important; /* Ensures SweetAlert is always on top */
  //     }
  //   `;
  //   document.head.appendChild(style);
  // }

  const handleSubmit = () => {
    if (!name || !email || !password || !confirmPassword) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    if (users.some((user) => user.email === email)) {
      Swal.fire("Error", "Email already registered", "error");
      return;
    }

    dispatch(registerUser({ name, email, password }));
    Swal.fire("Success", "User registered successfully!", "success").then(
      () => {
        navigation.navigate("Login");
      }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.header}>Sign Up</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.smallText}>
        Already have an account?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          Login here
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
    backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2f4f4f",
    marginBottom: 30,
    textAlign: "center",
  },
  formGroup: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2f4f4f",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4682b4",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  smallText: {
    marginTop: 10,
    color: "#2f4f4f",
  },
  link: {
    color: "#4682b4",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default SignUp;
