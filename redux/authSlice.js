import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    isLoggedIn: false,
    loggedInUser: null,
    users: [],
};

// Helper function to initialize users from AsyncStorage
const initializeUsers = async () => {
    try {
        const usersData = await AsyncStorage.getItem("users");
        return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
        console.error("Failed to load users from storage", error);
        return [];
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        async registerUser(state, action) {
            state.users.push(action.payload);
            try {
                await AsyncStorage.setItem("users", JSON.stringify(state.users));
            } catch (error) {
                console.error("Failed to save users to storage", error);
            }
        },
        async login(state, action) {
            state.isLoggedIn = true;
            state.loggedInUser = action.payload;
            try {
                await AsyncStorage.setItem("isLoggedIn", "true");
                await AsyncStorage.setItem("loggedInUser", action.payload.email);
            } catch (error) {
                console.error("Failed to save login state to storage", error);
            }
        },
        async logout(state) {
            state.isLoggedIn = false;
            state.loggedInUser = null;
            try {
                await AsyncStorage.setItem("isLoggedIn", "false");
                await AsyncStorage.removeItem("loggedInUser");
            } catch (error) {
                console.error("Failed to clear login state from storage", error);
            }
        },
        async updateUserProfile(state, action) {
            const updatedUser = action.payload;
            state.loggedInUser = updatedUser;

            state.users = state.users.map((user) =>
                user.email === updatedUser.email ? updatedUser : user
            );
            try {
                await AsyncStorage.setItem("users", JSON.stringify(state.users));
            } catch (error) {
                console.error("Failed to update user profile in storage", error);
            }
        },
    },
});

// Initialize users when the app starts
(async () => {
    initialState.users = await initializeUsers();
})();

export const { registerUser, login, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
