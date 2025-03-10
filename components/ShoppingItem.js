import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ShoppingItem = ({ item, toggleItem, removeItem }) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => toggleItem(item.id)} style={styles.checkBox}>
        <Ionicons
          name={item.checked ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={item.checked ? '#4CAF50' : '#aaa'}
        />
      </TouchableOpacity>
      <Text style={[styles.itemText, item.checked && styles.checkedText]}>{item.text}</Text>
      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    elevation: 2,
  },
  checkBox: { marginRight: 10 },
  itemText: { fontSize: 16 },
  checkedText: { textDecorationLine: 'line-through', color: '#aaa' },
});

export default ShoppingItem;
