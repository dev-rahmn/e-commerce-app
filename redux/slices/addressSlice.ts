import { BASE_URL } from '@/utils/app.constent';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


const data: Address[] = [
    {
      id: 1,
      name: "Atiqur Rahman",
      phone: "8840362901",
      pincode: "201301",
      state: "Noida",
      city: "Noida",
      buildingName: "Infinity Business Tower",
      roadName: "Puncture Shop, Wazidpur",
      type: "work",
    },
    {
      id: 2,
      name: "Atiqur Rahman",
      phone: "8840362901",
      pincode: "110001",
      state: "Delhi",
      city: "New Delhi",
      buildingName: "Connaught Place Business Hub",
      roadName: "Outer Circle, CP",
      type: "work",
    },
    {
      id: 3,
      name: "Atiqur Rahman",
      phone: "8844444441",
      pincode: "201000",
      state: "Uttar Pradesh",
      city: "Ghaziabad",
      buildingName: "Shipra Mall Tower",
      roadName: "Indirapuram, Ghaziabad",
      type: "home",
    },
    {
      id: 4,
      name: "Atiq-Rahman",
      phone: "8840355901",
      pincode: "122018",
      state: "Haryana",
      city: "Gurgaon",
      buildingName: "Cyber City Tower",
      roadName: "DLF Phase 3",
      type: "work",
    },
    {
      id: 5,
      name: "Krishna Yadav",
      phone: "8840882901",
      pincode: "400001",
      state: "Maharashtra",
      city: "Mumbai",
      buildingName: "Nariman Point Plaza",
      roadName: "Marine Drive",
      type: "work",
    },
    {
      id: 6,
      name: "Atiqur",
      phone: "8840362901",
      pincode: "560001",
      state: "Karnataka",
      city: "Bangalore",
      buildingName: "Brigade Gateway",
      roadName: "Malleswaram, Bangalore",
      type: "work",
    },
]

  const data2: Address =  {
    id: 6,
    name: " Rahman",
    phone: "88400001",
    pincode: "560001",
    state: "Karnataka",
    city: "Bangalore",
    buildingName: "Brigade Gateway",
    roadName: "Malleswaram, Bangalore",
    type: "work",
  }
  
  interface Address {
    id: number;
    name: string;
    phone: string;
    pincode: string;
    state: string;
    city: string;
    buildingName: string;
    roadName: string;
    type: string; // Use enum here
  }
  
// Define a payload interface that includes both the address and (optionally) the userId.
interface ManageAddressPayload {
  address: Address;
  // Only required when adding a new address.
  userId?: string;
}
// Define the slice state.
interface AddressState {
  addresses: Address[] | null;
  selectedDeliveryAddress: Address | null;
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  selectedDeliveryAddress: null,
  loading: false,
  error: null,
};


// Async thunk to get all addresses (expects a userId as a parameter)
export const getAllAddresses = createAsyncThunk<Address[], string>(
  'address/getAllAddresses',
  async (userId, { rejectWithValue }) => {
    try{
      const response = await axios.get(`${BASE_URL}/addresses/${userId}`);
          return response.data?.addresses || [];
    }catch(error: any) {
      // If the request fails, return a rejected action with the error message.
      return rejectWithValue(error.response?.data?.message);
    } 
  }
);



// Create a single async thunk that handles both adding and updating.
export const manageAddress = createAsyncThunk<Address, ManageAddressPayload>(
  'address/manageAddress',
  async ({ address, userId }, { rejectWithValue }) => {
    try {
      let response;
      // If the address id is null or undefined, this is an add operation.
      if (address.id === null || address.id === undefined) {
        if (!userId) {
          throw new Error('User ID is required for adding an address');
        }
        // POST to /addresses/<userId> 
        console.log("adding new address",address)
        response = await axios.post(`${BASE_URL}/addresses/${userId}`, address);
      } else { console.log("updating address",address)
        // Otherwise, update the existing address via PUT to /addresses/<addressId>
        response = await axios.patch(`${BASE_URL}/addresses/${address.id}`, address);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Async thunk to delete an address by id.
export const deleteAddressAsync = createAsyncThunk<number, number>(
  'address/deleteAddressAsync',
  async (addressId,  { rejectWithValue }) => {
    try{
        await axios.delete(`${BASE_URL}/addresses/${addressId}`);
        // Return the id so we can remove it from the state.
        return addressId;
    }catch (error: any) {
      // If the request fails, return a rejected action with the error message.
      return rejectWithValue(error.response?.data?.message);
    }
   
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {

    selectAddress: (state, action) => {
      state.selectedDeliveryAddress = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Extra reducers for getAllAddresses.
    builder
      .addCase(getAllAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(getAllAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch addresses';
      });
  },
});


export const {  selectAddress } = addressSlice.actions;
export default addressSlice.reducer;
