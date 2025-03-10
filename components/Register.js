import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { registerUser } from "../redux/authSlice";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const users = useSelector((state) => state.auth.users);

    const handleSubmit = (e) => {
        e.preventDefault();

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
        Swal.fire("Success", "User registered successfully!", "success").then(() => {
            navigation.navigate("Login");
        });
    };

    return (
        <View style={styles.loginContainer}>
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
            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
                <Text style={styles.loginButtonText}>Register</Text>
            </TouchableOpacity>
            <View style={styles.formGroup}>
                <Text>
                    Already have an account?{" "}
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.registerLink}>Login here</Text>
                    </TouchableOpacity>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loginContainer: {
        padding: 40,
        flexDirection: "column",
        alignItems: "center",
        gap: 40,
    },
    header: {
        textAlign: "center",
        backgroundColor: "#d3d3d3",
        padding: 30,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        fontSize: 25,
        color: "#2f4f4f",
    },
    formGroup: {
        marginVertical: 20,
        width: "100%",
    },
    label: {
        fontSize: 18,
        color: "#2f4f4f",
    },
    input: {
        width: "90%",
        padding: 10,
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#ccc",
        marginTop: 5,
    },
    loginButton: {
        backgroundColor: "#4682b4",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
        marginVertical: 10,
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    registerLink: {
        color: "#4682b4",
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
});

export default Register;
