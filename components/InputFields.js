import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InputField = ({ addItem }) => {
  const [text, setText] = useState('');

  const handleAddItem = () => {
    addItem(text);
    setText('');
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Add item..."
        value={text}
        onChangeText={setText}
      />
      <TouchableOpacity onPress={handleAddItem} style={styles.addButton}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  input: { flex: 1, height: 50, fontSize: 16 },
  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 50,
    padding: 10,
    marginLeft: 10,
  },
});

export default InputField;
