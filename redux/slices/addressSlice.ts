import { createSlice } from '@reduxjs/toolkit';


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
  

interface AddressState {
  addresses: Address[];
  selectedDeliveryAddress: Address ;
}

const initialState: AddressState = {
  addresses: data,
  selectedDeliveryAddress: data2,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    addAddress: (state, action) => {
      state.addresses.push(action.payload);
    },
    updateAddress: (state, action) => {
        const index = state.addresses.findIndex((addr) => addr.id === action.payload.id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
          state.selectedDeliveryAddress = action.payload; // ✅ Select the updated address
        }
      },
    selectAddress: (state, action) => {
      state.selectedDeliveryAddress = action.payload;
    },
  },
});

export const { addAddress, selectAddress,updateAddress } = addressSlice.actions;
export default addressSlice.reducer;
