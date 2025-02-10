import { View, Text, TouchableOpacity, Image, ScrollView, Animated, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import icons from '@/constants/icons'
import ManageAddressList from '@/components/ManageAddressList'
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { addAddress, selectAddress, updateAddress } from "@/redux/slices/addressSlice";
import ManageAddressForm from '@/components/ManageAddressForm'

interface AddressProps {
    showAddAction: boolean;
    disableScroll?: boolean;
    onDeliverHandler : () => void
}
const ManageAddress = ({showAddAction = true, disableScroll = false, onDeliverHandler} : AddressProps) => {
   
     const dispatch =  useAppDispatch()
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [address, setAddress] = useState(null);
    const manageAddressHandler = (address : any) => {
    // console.log("address",address) 
    if(address.id  != null){
        console.log('update',address)
        dispatch(updateAddress(address))
    }else{
        const data = { ...address, id: Date.now() }; // ✅ Fix applied
       dispatch(addAddress(data))   
    }

    setAddress(null)
    setIsAddingAddress(false)
    }

    const updateDeliveryAddressHandler = ( ) => { //button for deleiver here
        dispatch(selectAddress(address))
        onDeliverHandler()
    }

   const getSelectedAddress = (address : any) =>{
        setAddress(address)
    }
    const openUpdateAddressHandler = () => {
    setIsAddingAddress(true);
    }


    return (
        <View className="h-full ">
            
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
           <View className="absolute bottom-0 left-0 right-0 bg-white p-2 gap-4 mb-10 flex flex-row justify-between border-t border-gray-300">

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

