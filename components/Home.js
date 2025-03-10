import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>
          Welcome to <Text style={styles.highlight}>Shopping Baskette</Text>
        </Text>
        <Text style={styles.description}>
          Manage your shopping efficiently with <Text style={styles.highlight}>ShoppingList</Text> – your ultimate tool for organizing and prioritizing your shopping items!
        </Text>
        <TouchableOpacity style={styles.getStartedBtn}>
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        <Text style={styles.featuresTitle}>Why Choose Us?</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>✔ Add items to your shopping list easily</Text>
          <Text style={styles.listItem}>✔ Remove items when they're no longer needed</Text>
          <Text style={styles.listItem}>✔ Track what you need to buy seamlessly</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    alignItems: 'center',
  },
  hero: {
    width: '100%',
    backgroundColor: '#d3d3d3',
    padding: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f4f4f',
    textAlign: 'center',
  },
  highlight: {
    color: '#4682b4',
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  getStartedBtn: {
    backgroundColor: '#4682b4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  features: {
    width: '100%',
    backgroundColor: '#d3d3d3',
    padding: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2f4f4f',
    textAlign: 'center',
  },
  listContainer: {
    marginTop: 15,
    alignItems: 'flex-start',
  },
  listItem: {
    fontSize: 16,
    marginBottom: 10,
    color: '#2f4f4f',
  },
});

export default Home;
