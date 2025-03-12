import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";


const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.main}>
      <View style={styles.homeContainer}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Welcome to <Text style={styles.highlight}>Shopping Baskette</Text>
          </Text>
          <Text style={styles.heroDescription}>
            Manage your shopping efficiently with{" "}
            <Text style={styles.highlight}>Baskettet</Text> – your ultimate tool for organizing and prioritizing your shopping items!
          </Text>
          <TouchableOpacity
            style={styles.getStartedBtn}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.getStartedBtnText}>Get Started</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Why Choose Us?</Text>
          <View>
            <Text style={styles.featuresItem}>✔ Add items to your shopping list easily</Text>
            <Text style={styles.featuresItem}>✔ Remove items when they're no longer needed</Text>
            <Text style={styles.featuresItem}>✔ Track what you need to buy seamlessly</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 40,
    backgroundColor: "#f0f0f0",
  },
  homeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  hero: {
    alignItems: "center",
    backgroundColor: "#d3d3d3",
    padding: 30,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2f4f4f",
    textAlign: "center",
  },
  highlight: {
    color: "#4682b4",
  },
  heroDescription: {
    fontSize: 16,
    marginVertical: 15,
    textAlign: "center",
    color: "#2f4f4f",
  },
  getStartedBtn: {
    backgroundColor: "#4682b4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  getStartedBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  features: {
    backgroundColor: "#d3d3d3",
    padding: 30,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2f4f4f",
    marginBottom: 15,
  },
  featuresItem: {
    fontSize: 16,
    color: "#2f4f4f",
    marginBottom: 10,
  },
});


export default Home;