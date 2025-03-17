import { BASE_URL } from '@/utils/app.constent';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the Order interface (used in lists)
export interface Order {
    id: string;
    productId: string;
    productName: string;
    productPrice: number;
    quantity: number;
    userId: string;
    status: string;
    statusFlag: string;
    createdAt: string;
  }
  
  // Define the OrderDetail interface (includes extra user details)
  export interface OrderDetail extends Order {
    userFirstName: string;
    userLastName: string;
    userEmail: string;
    userType: string;
  }

  // Fetch orders by userId
export const fetchOrders = createAsyncThunk<Order[], string>(
    'orders/fetchOrders',
    async (userId, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${BASE_URL}/orders/user/${userId}`);
        return response.data?.orders || [];
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to fetch orders'
        );
      }
    }
  );

  // Create an order
export const createOrder = createAsyncThunk<Order, any>(
    'orders/createOrder',
    async (orderData, {dispatch, rejectWithValue }) => {
      try {
        const response = await axios.post(`${BASE_URL}/orders`, orderData);
        return response.data.order;
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to create order'
        );
      }
    }
  );

  // Update order status
interface UpdateOrderStatusArgs {
    orderId: string;
    updates: Partial<Order>;
  }
  
  export const updateOrderStatus = createAsyncThunk<
    { orderId: string } & Order,
    UpdateOrderStatusArgs
  >(
    'orders/updateOrderStatus',
    async ({ orderId, updates }, { rejectWithValue }) => {
      try {
        const response = await axios.patch(`${BASE_URL}/orders/${orderId}`, updates);
        return { orderId, ...response.data.order };
      } catch (error: any) {
        return rejectWithValue(error.response?.data);
      }
    }
  );
  // Fetch detailed order info by orderId
export const fetchOrderDetail = createAsyncThunk<OrderDetail, string>(
    'orders/fetchOrderDetail',
    async (orderId, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${BASE_URL}/orders/view/${orderId}`);
        return response.data.order;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Something went wrong!';
        return rejectWithValue(errorMessage);
      }
    }
  );

  interface OrdersState {
    data: Order[];
    loading: boolean;
    error: string | null;
  }
  
  interface OrderDetailState {
    data: OrderDetail | null;
    loading: boolean;
    error: string | null;
  }
  
  interface OrderState {
    orders: OrdersState;
    orderDetail: OrderDetailState;
  }
  
  const initialState: OrderState = {
    orders: {data: [], loading: false, error: null },
    orderDetail: { data: null, loading: false,error: null},
  };


  const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      // Fetch orders
      builder.addCase(fetchOrders.pending, (state) => {
        state.orders.loading = true;
        state.orders.error = null;
      });
      builder.addCase(fetchOrders.fulfilled,
        (state, action) => {
          state.orders.loading = false;
          state.orders.data = action.payload;
        }
      );
      builder.addCase(fetchOrders.rejected,
         (state, action) => {
        state.orders.loading = false;
        state.orders.error = action.payload as string;
      });
  
      // Fetch order detail
      builder.addCase(fetchOrderDetail.pending,
         (state) => {
        state.orderDetail.loading = true;
        state.orderDetail.error = null;
      });
      builder.addCase(fetchOrderDetail.fulfilled,
        (state, action) => {
          state.orderDetail.loading = false;
          state.orderDetail.data = action.payload;
        }
      );
      builder.addCase(fetchOrderDetail.rejected,
         (state, action) => {
        state.orderDetail.loading = false;
        state.orderDetail.error = action.payload as string;
      });
    },
  });
  
  export default orderSlice.reducer;