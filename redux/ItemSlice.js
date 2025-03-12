import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    items: [],
    categories: [],
};

// Helper functions for AsyncStorage persistence (optional)
const saveToStorage = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Failed to save ${key} to storage`, error);
    }
};

const loadFromStorage = async (key) => {
    try {
        const data = await AsyncStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Failed to load ${key} from storage`, error);
        return [];
    }
};

const itemSlice = createSlice({
    name: "items",
    initialState,
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
            saveToStorage("items", state.items); // Persist items
        },
        setCategories: (state, action) => {
            state.categories = action.payload;
            saveToStorage("categories", state.categories); // Persist categories
        },
        addItem: (state, action) => {
            state.items.push(action.payload);
            saveToStorage("items", state.items); // Persist items
        },
        updateItem: (state, action) => {
            const { index, item } = action.payload;
            state.items[index] = item;
            saveToStorage("items", state.items); // Persist items
        },
        deleteItem: (state, action) => {
            state.items.splice(action.payload, 1);
            saveToStorage("items", state.items); // Persist items
        },
        toggleItemCheck: (state, action) => {
            const index = action.payload;
            state.items[index].checked = !state.items[index].checked;
            saveToStorage("items", state.items); // Persist items
        },
        addCategory: (state, action) => {
            state.categories.push(action.payload);
            saveToStorage("categories", state.categories); // Persist categories
        },
        updateCategory: (state, action) => {
            const { index, category } = action.payload;
            state.categories[index] = category;
            saveToStorage("categories", state.categories); // Persist categories
        },
        deleteCategory: (state, action) => {
            const categoryToDelete = state.categories[action.payload];
            state.categories = state.categories.filter((_, i) => i !== action.payload);
            state.items = state.items.map((item) =>
                item.category === categoryToDelete ? { ...item, category: null } : item
            );
            saveToStorage("categories", state.categories); // Persist categories
            saveToStorage("items", state.items); // Persist items
        },
    },
});

// Initialize state from AsyncStorage when the app starts (optional)
(async () => {
    initialState.items = await loadFromStorage("items");
    initialState.categories = await loadFromStorage("categories");
})();

export const {
    setItems,
    setCategories,
    addItem,
    updateItem,
    deleteItem,
    toggleItemCheck,
    addCategory,
    updateCategory,
    deleteCategory,
} = itemSlice.actions;

export default itemSlice.reducer;
