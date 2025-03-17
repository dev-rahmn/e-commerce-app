import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/utils/app.constent';

// Define the Category interface.
export interface Category {
  id?: number;
  name: string;
}
interface ManageCategoryResponse {
category: Category,
message: string,
error: boolean
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
      const response = await axios.get(`${BASE_URL}/category`);
      // Adjust according to your API response structure.

      return response.data?.categories || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Add or update category
export const manageCategory = createAsyncThunk<ManageCategoryResponse, Category>(
    'category/manage',
    async (payload, { dispatch, rejectWithValue }) => {
      try {
        const method = payload.id ? 'patch' : 'post';
        const url = payload.id? `${BASE_URL}/category/${payload.id}` : `${BASE_URL}/category`;
        const response = await axios[method](url, payload);
        // Re-fetch categories to update the list
        dispatch(getCategories());
        return response.data;
      } catch (error: any) {
        console.log("error", error.response);
        return rejectWithValue(error.response?.data?.message);
      }
    }
  );

// Async thunk to delete a category by its ID.
export const deleteCategory = createAsyncThunk<string, number>(
  'category/deleteCategory',
  async (categoryId,  { dispatch, rejectWithValue }) => {
    try {
     const res  = await axios.delete(`${BASE_URL}/category/${categoryId}`);
     dispatch(getCategories())
      return res.data.message;
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
  },
});

export default categorySlice.reducer;