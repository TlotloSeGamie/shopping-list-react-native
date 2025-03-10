import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { login } from "../redux/authSlice";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const users = useSelector((state) => state.auth.users);

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = users.find((user) => user.email === email && user.password === password);
        if (!user) {
            Swal.fire("Error", "Invalid email or password", "error");
            return;
        }

        dispatch(login(user));
        Swal.fire("Success", `Welcome back, ${user.name}!`, "success").then(() => {
            navigation.navigate("Items");
        });
    };

    return (
        <View style={styles.loginContainer}>
            <Text style={styles.header}>Login</Text>
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
            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.formGroup}>
                <Text>
                    Don't have an account?{" "}
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <Text style={styles.registerLink}>Sign Up here</Text>
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
    inputFocus: {
        borderColor: "#4682b4",
        outline: "none",
        shadowColor: "rgba(70, 130, 180, 0.5)",
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

export default Login;
