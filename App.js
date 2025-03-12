import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import store from "./redux/store";
import { StyleSheet, View } from "react-native";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Item from "./components/Item";
import Footer from "./components/Footer";
import Profile from "./components/Profile";
import { useNavigationState } from "@react-navigation/native";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainApp />
      </NavigationContainer>
    </Provider>
  );
}

const MainApp = () => {
  const navState = useNavigationState((state) => state);
  const currentRoute = navState?.routes[navState.index]?.name;

  const hideNavAndFooter = currentRoute === "Login" || currentRoute === "SignUp";

  return (
    <View style={styles.container}>
      {!hideNavAndFooter && <Navbar />}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Item" component={Item} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
      {!hideNavAndFooter && <Footer />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
