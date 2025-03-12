import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Alert,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setItems,
  setCategories,
  addItem,
  updateItem,
  deleteItem,
  toggleItemCheck,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../redux/ItemSlice";

const Items = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);
  const categories = useSelector((state) => state.items.categories);
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [editCategoryIndex, setEditCategoryIndex] = useState(null);
  const [isCategoryFormVisible, setIsCategoryFormVisible] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddOptions, setShowAddOptions] = useState(false); // State to toggle add options visibility

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUserEmail = await AsyncStorage.getItem("loggedInUser");
      if (loggedInUserEmail) {
        const savedData =
          JSON.parse(
            await AsyncStorage.getItem(`items_${loggedInUserEmail}`)
          ) || {};
        dispatch(setItems(savedData.items || []));
        dispatch(setCategories(savedData.categories || []));
        const savedCategory = await AsyncStorage.getItem(
          `selectedCategory_${loggedInUserEmail}`
        );
        if (savedCategory) setSelectedCategory(savedCategory);
      }
    };
    fetchUserData();
  }, [dispatch]);

  const saveToLocalStorage = async (
    updatedItems = items,
    updatedCategories = categories
  ) => {
    const loggedInUserEmail = await AsyncStorage.getItem("loggedInUser");
    if (loggedInUserEmail) {
      await AsyncStorage.setItem(
        `items_${loggedInUserEmail}`,
        JSON.stringify({
          items: updatedItems,
          categories: updatedCategories,
        })
      );
    }
  };

  const handleAdd = () => {
    if (newItem.trim() && newQuantity.trim()) {
      if (editIndex !== null) {
        const updatedItem = {
          ...items[editIndex],
          name: newItem,
          quantity: newQuantity,
          notes: newNotes,
          category: selectedCategory,
        };
        const updatedItems = items.map((item, i) =>
          i === editIndex ? updatedItem : item
        );
        dispatch(updateItem({ index: editIndex, item: updatedItem }));
        saveToLocalStorage(updatedItems);
        setEditIndex(null);
      } else {
        const newItemObj = {
          name: newItem,
          quantity: newQuantity,
          notes: newNotes,
          category: selectedCategory,
          checked: false,
        };
        const updatedItems = [...items, newItemObj];
        dispatch(addItem(newItemObj));
        saveToLocalStorage(updatedItems);
      }
      setNewItem("");
      setNewQuantity("");
      setNewNotes("");
      setSelectedCategory(null);
      setIsFormVisible(false);
    }
  };

  const handleCancel = () => {
    setNewItem("");
    setNewQuantity("");
    setNewNotes("");
    setSelectedCategory(null);
    setEditIndex(null);
    setEditCategoryIndex(null);
    setIsFormVisible(false);
    setIsCategoryFormVisible(false);
    setShowAddOptions(false); // Hide add options when cancelling
  };

  const handleEdit = (index) => {
    const itemToEdit = items[index];
    setEditIndex(index);
    setNewItem(itemToEdit.name);
    setNewQuantity(itemToEdit.quantity);
    setNewNotes(itemToEdit.notes || "");
    setSelectedCategory(itemToEdit.category || null);
    setIsFormVisible(true);
  };

  const handleDelete = (index) => {
    Alert.alert(
      "Are you sure?",
      "You won't be able to revert this!",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, delete it!",
          onPress: () => {
            const updatedItems = items.filter((_, i) => i !== index);
            dispatch(deleteItem(index));
            saveToLocalStorage(updatedItems);
            Alert.alert("Deleted!", "Your item has been deleted.");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleCheck = (index) => {
    dispatch(toggleItemCheck(index));
    saveToLocalStorage();
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      if (editCategoryIndex !== null) {
        const updatedCategories = categories.map((cat, i) =>
          i === editCategoryIndex ? newCategory : cat
        );
        dispatch(
          updateCategory({ index: editCategoryIndex, category: newCategory })
        );
        saveToLocalStorage(null, updatedCategories);
        setEditCategoryIndex(null);
      } else {
        const updatedCategories = [...categories, newCategory];
        dispatch(addCategory(newCategory));
        saveToLocalStorage(null, updatedCategories);
      }
      setNewCategory("");
      setIsCategoryFormVisible(false);
    }
  };

  const handleEditCategory = (index) => {
    setEditCategoryIndex(index);
    setNewCategory(categories[index]);
    setIsCategoryFormVisible(true);
  };

  const handleDeleteCategory = (index) => {
    Alert.alert(
      "Are you sure?",
      `This will delete the category "${categories[index]}" and unassign it from all items.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, delete it!",
          onPress: () => {
            const updatedCategories = categories.filter((_, i) => i !== index);
            const updatedItems = items.map((item) =>
              item.category === categories[index]
                ? { ...item, category: null }
                : item
            );
            dispatch(deleteCategory(index));
            saveToLocalStorage(updatedItems, updatedCategories);
            Alert.alert("Deleted!", "Your category has been deleted.");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    AsyncStorage.setItem(`selectedCategory_${loggedInUserEmail}`, category);
  };

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Basket</Text>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        onPress={() => {
          setShowAddOptions(!showAddOptions);
        }}
        style={styles.fab}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Popup for Add Item and Add Category */}
      {showAddOptions && (
        <View style={styles.addOptionsContainer}>
          <TouchableOpacity
            onPress={() => {
              setIsFormVisible(true);
              setShowAddOptions(false); // Close options after selection
            }}
            style={styles.addOptionButton}
          >
            <Text style={styles.addOptionButtonText}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsCategoryFormVisible(true);
              setShowAddOptions(false); // Close options after selection
            }}
            style={styles.addOptionButton}
          >
            <Text style={styles.addOptionButtonText}>Add Category</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowAddOptions(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>
        </View>
      )}

      {isFormVisible && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={newItem}
            onChangeText={setNewItem}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={newQuantity}
            onChangeText={setNewQuantity}
          />
          <TextInput
            style={styles.input}
            placeholder="Notes (optional)"
            value={newNotes}
            onChangeText={setNewNotes}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleAdd} style={styles.submitButton}>
              <Text>{editIndex !== null ? "Edit" : "Add"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isCategoryFormVisible && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Category Name"
            value={newCategory}
            onChangeText={setNewCategory}
          />
          <TouchableOpacity
            onPress={handleAddCategory}
            style={styles.submitButton}
          >
            <Text>{editCategoryIndex !== null ? "Edit" : "Add"}</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.categoryItem}>
            <TouchableOpacity
              onPress={() => handleCategoryClick(item)}
              style={styles.categoryButton}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
            <View style={styles.categoryActions}>
              <TouchableOpacity
                onPress={() => handleEditCategory(index)}
                style={styles.actionButton}
              >
                <Text>✎</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteCategory(index)}
                style={styles.actionButton}
              >
                <Text>✖</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text>{`Name: ${item.name}`}</Text>
            <Text>{`Quantity: ${item.quantity}`}</Text>
            {item.category && <Text>{`Category: ${item.category}`}</Text>}
            {item.notes && <Text>{`Notes: ${item.notes}`}</Text>}
            <View style={styles.itemActions}>
              <TouchableOpacity
                onPress={() => handleCheck(index)}
                style={styles.actionButton}
              >
                <Text>✔</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleEdit(index)}
                style={styles.actionButton}
              >
                <Text>✎</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(index)}
                style={styles.actionButton}
              >
                <Text>✖</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 116,
    backgroundColor: "#fffe",
    color: "#2f4f4f",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4682b4",
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
  },
  addButton: {
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#4682b4",
    borderRadius: 5,
    borderColor: "#4682b4",
    borderWidth: 1,
    textAlign: "center",
    color: "#fff",
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    color: "#fff",
  },
  formContainer: {
    marginVertical: 20,
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 28,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: "center",
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "#F44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: "center",
    color: "#fff",
  },
  fab: {
    position: "absolute",
    bottom: 100, 
    right: 300, 
    backgroundColor: "#658a8a",
    width: 80,
    height: 80,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8, 
    zIndex: 1, 
  },
  fabText : {
    fontSize: 60,
    bottom: 7,
  },
  addOptionsContainer: {
    position: "absolute",
    bottom: 220, 
    right: 265, 
    backgroundColor: "#fff", 
    borderRadius: 8,
    elevation: 8,
    padding: 10,
    zIndex: 1,
  },
  addOptionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#4682b4",
    borderRadius: 5,
    marginBottom: 10,
  },
  addOptionButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    padding: 5,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#ff6347",
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "#e6e6fa",
    borderRadius: 5,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  categoryActions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 10,
    fontSize: 20,
    color: "#4682b4",
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#d3f3d3",
    borderRadius: 5,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  checkedItem: {
    textDecorationLine: "line-through",
    backgroundColor: "#a0cfa0",
  },
  noDataMessage: {
    textAlign: "center",
    color: "#ff6347",
    fontSize: "1.2rem",
    margin: "20px 0",
    fontWeight: "bold",
    backgroundColor: "#ffe4e1",
    border: "1px solid #ff4500",
    borderRadius: "5px",
    padding: "10px 20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    maxWidth: 500,
    margin: "auto",
  },
  line: {
    height: 2,
    backgroundColor: "#4682b4",
    margin: "20px 0",
    width: "80%",
    margin: "auto",
  },
});

export default Items;
