import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/utils/app.constent';

// Define the Category interface.
export interface Category {
  id: number;
  name: string;
}

// Define the state interface for the category slice.
interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

// Set the initial state.
const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

// Async thunk to fetch all categories.
export const getCategories = createAsyncThunk<Category[], void>(
  'category/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      // Adjust according to your API response structure.
      return response.data?.categories || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Async thunk to add a new category.
export const addCategory = createAsyncThunk<Category, Category>(
  'category/addCategory',
  async (category, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/categories`, category);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Async thunk to update an existing category.
export const updateCategory = createAsyncThunk<Category, Category>(
  'category/updateCategory',
  async (category, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/categories/${category.id}`,
        category
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Async thunk to delete a category by its ID.
export const deleteCategory = createAsyncThunk<number, number>(
  'category/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/categories/${categoryId}`);
      return categoryId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Create the category slice.
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // You can add synchronous reducers here if needed.
  },
  extraReducers: (builder) => {
    // Handle getCategories.
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });

    // Handle addCategory.
    builder
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add category';
      });

    // Handle updateCategory.
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update category';
      });

    // Handle deleteCategory.
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (cat) => cat.id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete category';
      });
  },
});

export default categorySlice.reducer;
