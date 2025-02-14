import { BASE_URL } from '@/utils/app.constent';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the Address interface.
// Note: The backend sends IDs as strings.
interface Address {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  state: string;
  city: string;
  buildingName: string;
  roadName: string;
  type: string;
  userId?: string;
}

// Payload interface for adding/updating an address.
interface ManageAddressPayload {
  address: Address;
  userId?: string;
}

// Separate state for selected delivery address.
interface SelectedDeliveryAddressState {
  data: Address | null;
  loading: boolean;
  error: string | null;
}

// Main state for the address slice.
interface AddressState {
  addresses: Address[] | null;
  selectedDeliveryAddress: SelectedDeliveryAddressState;
  loading: boolean;
  error: string | null;
}

// Define the response interface for getAllAddresses.
interface GetAllAddressesResponse {
  addresses: Address[];
  selectedAddressId: string | null;
}

const initialState: AddressState = {
  addresses: [],
  selectedDeliveryAddress: {
    data: null,
    loading: false,
    error: null,
  },
  loading: false,
  error: null,
};

// Async thunk to get all addresses for a user.
// The backend returns an object containing both "addresses" and "selectedAddressId".
export const getAllAddresses = createAsyncThunk<GetAllAddressesResponse, string>(
  'address/getAllAddresses',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/addresses/${userId}`);
      return {
        addresses: response.data?.addresses || [],
        selectedAddressId: response.data?.selectedAddressId || null,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Async thunk to add or update an address.
export const manageAddress = createAsyncThunk<Address, ManageAddressPayload>(
  'address/manageAddress',
  async ({ address, userId }, { rejectWithValue }) => {
    try {
      let response;
      // If address.id is not provided, add a new address.
      if (!address.id) {
        if (!userId) {
          throw new Error('User ID is required for adding an address');
        }
        response = await axios.post(`${BASE_URL}/addresses/${userId}`, address);
      } else {
        // Otherwise, update the existing address.
        response = await axios.patch(`${BASE_URL}/addresses/${address.id}`, address);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Async thunk to delete an address by its ID.
  export const deleteAddressAsync = createAsyncThunk<number, number>(
    'address/deleteAddressAsync',
    async (addressId, { rejectWithValue }) => {
      try {
        await axios.delete(`${BASE_URL}/addresses/${addressId}`);
        return addressId;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message);
      }
    }
  );

// Async thunk to update the selected delivery address for a user.
export const updateSelectedDeliveryAddressAsync = createAsyncThunk<
  string, // Returns the selected delivery address ID.
  { userId: string; selectedAddressId: string }>(
  'address/updateSelectedDeliveryAddressAsync',
  async ({ userId, selectedAddressId }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/addresses/${userId}/selected-address`,
        { selectedAddressId }
      );
    
      return response?.data?.selectedDeliveryAddress;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    // Optionally, you can manually set the selected address.
  },
  extraReducers: (builder) => {
    // Handle getAllAddresses.
    builder
      .addCase(getAllAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload.addresses;
        // Use the returned selectedAddressId to set the selected address.
        if (action.payload.selectedAddressId && state.addresses) {
          const selected = state.addresses.find(
            (address) => address.id === action.payload.selectedAddressId
          );
          state.selectedDeliveryAddress.data = selected || null;
        } else {
          state.selectedDeliveryAddress.data = null;
        }
      })
      .addCase(getAllAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch addresses';
      });
      
    // Handle updateSelectedDeliveryAddressAsync.
    builder
      .addCase(updateSelectedDeliveryAddressAsync.pending, (state) => {
        state.selectedDeliveryAddress.loading = true;
        state.selectedDeliveryAddress.error = null;
      })
      .addCase(updateSelectedDeliveryAddressAsync.fulfilled, (state, action) => {
       
        if (state.addresses) {
          const selected = state.addresses.find(
            (address) => address.id === action.payload
          );
          state.selectedDeliveryAddress.data = selected || null;
        }
        state.selectedDeliveryAddress.loading = false;
      })
      .addCase(updateSelectedDeliveryAddressAsync.rejected, (state, action) => {
        state.selectedDeliveryAddress.loading = false;
        state.selectedDeliveryAddress.error =
          action.error.message || 'Failed to update selected address';
      });
      
    // You can add additional cases for manageAddress and deleteAddressAsync if needed.
  },
});


export default addressSlice.reducer;
