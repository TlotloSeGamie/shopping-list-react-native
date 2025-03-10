import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShoppingList from './ShoppingList';
import InputField from './InputFields';

const ShoppingDisplay = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const saveItems = async (newItems) => {
    try {
      await AsyncStorage.setItem('shoppingItems', JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      Alert.alert('Error', 'Failed to save items.');
    }
  };

  const loadItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('shoppingItems');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load items.');
    }
  };

  const addItem = (text) => {
    if (!text.trim()) return;
    const newItem = { id: Date.now().toString(), text, checked: false };
    saveItems([...items, newItem]);
  };

  const removeItem = (id) => {
    saveItems(items.filter((item) => item.id !== id));
  };

  const toggleItem = (id) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    saveItems(updatedItems);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>
      <InputField addItem={addItem} />
      <ShoppingList items={items} toggleItem={toggleItem} removeItem={removeItem} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
});

export default ShoppingDisplay;
