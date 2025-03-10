import React from 'react';
import { FlatList } from 'react-native';
import ShoppingItem from './ShoppingList';

const ShoppingList = ({ items, toggleItem, removeItem }) => {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ShoppingItem item={item} toggleItem={toggleItem} removeItem={removeItem} />
      )}
    />
  );
};

export default ShoppingList;
