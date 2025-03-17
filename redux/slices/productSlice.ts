import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/utils/app.constent';

interface ProductState {
  productList: {
    data: any[];
    loading: boolean;
    error: string | null;
  };
  productDetail: {
    data: any | null;
    loading: boolean;
    error: string | null;
  };
}

const initialState: ProductState = {
  productList: {
    data: [],
    loading: false,
    error: null,
  },
  productDetail: {
    data: null,
    loading: false,
    error: null,
  },
};

export const getAllProducts = createAsyncThunk(
  'products/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      return response.data.products;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Unknown error'
      );
    }
  }
);

export const getProductDetail = createAsyncThunk(
  'products/getDetail',
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/products/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch product details'
      );
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.productList.loading = true;
        state.productList.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.productList.loading = false;
        state.productList.data = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.productList.loading = false;
        state.productList.error = action.payload as string;
      })
      .addCase(getProductDetail.pending, (state) => {
        state.productDetail.loading = true;
        state.productDetail.error = null;
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.productDetail.loading = false;
        state.productDetail.data = action.payload;
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        state.productDetail.loading = false;
        state.productDetail.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
