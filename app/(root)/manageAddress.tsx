import { View, Text, TouchableOpacity, Image, ScrollView, Animated, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import icons from '@/constants/icons'
import ManageAddressList from '@/components/ManageAddressList'
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import {  getAllAddresses, manageAddress, updateSelectedDeliveryAddressAsync } from "@/redux/slices/addressSlice";
import ManageAddressForm from '@/components/ManageAddressForm'
import { useTheme } from '@/contaxtapis/ThemeContext'

interface AddressProps {
    showAddAction: boolean;
    disableScroll?: boolean;
    onDeliverHandler : () => void
}
const ManageAddress = ({showAddAction = true, disableScroll = false, onDeliverHandler} : AddressProps) => {
   
     const dispatch =  useAppDispatch()
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [address, setAddress] = useState<any | null>(null);
    const profile = useAppSelector((state) => state.auth.userProfile);
  
    const {bgColor, textColor} = useTheme()
    const manageAddressHandler = async (address: any) => {
        if (profile) {
          try {
            const res = await dispatch(
              manageAddress({ address, userId: profile.userId })
            ).unwrap();
      
            if (res) {
              // Refresh the address list after a successful add/update.
              dispatch(getAllAddresses(profile.userId));
              // Reset local state.
              setAddress(null);
              setIsAddingAddress(false);
            }
          } catch (error) {
            // Handle the error: you might want to show a notification or log the error.
            console.error("Failed to manage address:", error);
          }
        }
      };
      

   // This handler updates the selected delivery address.
   const updateDeliveryAddressHandler = async() => {
    if (!address || !profile?.userId) {
      console.error('Address or profile userId is not available');
      return;
    }
    const response = await dispatch(
      updateSelectedDeliveryAddressAsync({
        selectedAddressId: address.id,
        userId: profile.userId,
      })
    );
    if(response){
      
      onDeliverHandler();
    }
  };


   const getSelectedAddress = (address : any) =>{
        setAddress(address)
    }
    const openUpdateAddressHandler = () => {
    setIsAddingAddress(true);
    }


    return (
        <View className="h-full " style={{ backgroundColor: bgColor }}>
            
                {isAddingAddress ? (
                    <ManageAddressForm onSubmit={manageAddressHandler} address={address} onClose={() => {setIsAddingAddress(false), setAddress(null)}}/>
                    ) 
                    : 
                    (
                    <ManageAddressList disableScroll={disableScroll} showAction={showAddAction} openUpdateAddress = {openUpdateAddressHandler}
                    openNewAddress={() => {setIsAddingAddress(true), setAddress(null)}}
                    updateAddress={getSelectedAddress}
                    />
                    )
                }
            
        {(address && !isAddingAddress) && (
           <View className={`absolute bottom-0 left-0 right-0 bg-${bgColor} p-2 gap-4 mb-8 flex flex-row justify-between border-t border-gray-300`}>

            <TouchableOpacity className="bg-orange-500 py-3 px-6 rounded-full flex-1"
             onPress={updateDeliveryAddressHandler}>
                <Text className="text-white text-center text-lg font-bold">DELIVER HERE</Text>
            </TouchableOpacity>
            </View>
           )}        
        </View>
    )
}

export default ManageAddress

