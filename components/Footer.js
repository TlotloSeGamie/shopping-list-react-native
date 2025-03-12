import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // FontAwesome icons

const Footer = ({ navigation }) => {
  return (
    <View style={styles.footerContainer}>
      {/* Home Button */}
      <TouchableOpacity 
        style={styles.iconButton} 
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="home" size={25} color="#fff" />
      </TouchableOpacity>

      {/* List Button */}
      <TouchableOpacity 
        style={styles.iconButton} 
        onPress={() => navigation.navigate('List')}
      >
        <Icon name="list" size={25} color="#fff" />
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity 
        style={styles.iconButton} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Icon name="user" size={25} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#2f4f4f',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#4682b4',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10, 
  },
  iconButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Footer;
