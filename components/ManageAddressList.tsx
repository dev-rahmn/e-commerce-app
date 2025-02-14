import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, {  useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import DeleteModal from '@/modals/DeleteModal';
import { deleteAddressAsync, getAllAddresses } from '@/redux/slices/addressSlice';

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
const ManageAddressList = (
    {openNewAddress, updateAddress, openUpdateAddress, showAction, disableScroll}: 
    {openNewAddress: () => void,
         updateAddress: (address : any) => void, showAction: boolean, disableScroll: boolean
         openUpdateAddress: () => void}
) => {
      const dispatch = useAppDispatch()
      const { addresses,loading, error} = useAppSelector(state => state.address);
      const profile = useAppSelector(state => state.auth.userProfile);
      const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
      const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
      const [activeMenu, setActiveMenu] = useState<any | null>(null);
      const [selectedId, setSelectedId] = useState<number | null>(null); // Store ID of selected item
     const [reFetch, setReFetch] = useState(false);
    const editAddressHandler =() =>{
        openUpdateAddress()
      }

      const addressSelectionHandler = (item : any) =>{
        setActiveMenu(null);
        updateAddress(item)
        setSelectedAddress(item)
      }

      const deleteAddress =(item: any)=>{
        setSelectedId(item.id)
        setDeleteModalVisible(true);
      };
      const handleModalClose = async (deleteConfirmed: boolean) => {
            
            if (deleteConfirmed && selectedId !== null) {  
           const res = await dispatch(deleteAddressAsync(selectedId)).unwrap();

            if (res) {
            setReFetch(true)
            setDeleteModalVisible(false); // Close modal
            setActiveMenu(null) 
            }
            }
      };

        useEffect(() =>{
        if(profile && reFetch){
            dispatch(getAllAddresses(profile?.userId))  
        }
         },[reFetch, dispatch, profile])


  return (
  
    <View className='px-4 pb-28'>
        
        <FlatList
            nestedScrollEnabled={true} 
            scrollEnabled={!disableScroll}
            data={addresses}
            contentContainerClassName="py-2 mt-4"
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                className={`relative  border border-gray-200 rounded-lg my-2`}
                onPress={() => addressSelectionHandler(item)}
                >

                <View className={`bg-white p-2 rounded-lg shadow py-4 ${  selectedAddress?.id.toString() === item.id ? "border border-primary-300" : ""}`}>
                    <View className="flex-row pb-3 items-center">
                        {/* Name */}
                        <Text className={`text-lg font-semibold ${  selectedAddress?.id.toString() === item.id ? "text-blue-600" : "text-black"}`}>
                        {item.name}
                        </Text>
        
                        {/* Address Type */}
                        <View className="ml-2 px-2 py-1 bg-gray-200 rounded">
                        <Text className="text-xs text-gray-700">{item.type.toUpperCase()}</Text>
                        </View>
        
                        {/* 3-Dot Menu Button */}
                            {  selectedAddress?.id.toString() === item.id && showAction && (
                            <TouchableOpacity
                                onPress={() =>
                                setActiveMenu(activeMenu === item.id ? null : item.id)
                                }
                                className="ml-auto px-4 py-1 bg-gray-200 rounded"
                            >
                                <Text className="text-xl">⋮</Text>
                            </TouchableOpacity>
                            )}
                    </View>
        
                    {/* Address Details */}
                    <Text className="text-gray-600">{item.buildingName}, {item.roadName}, {item.city}</Text>
                    <Text className="text-gray-600">{item.state} - {item.pincode}</Text>
                    <Text className="text-gray-900 font-semibold pt-2">{item.phone}</Text>

                    {/* Dropdown Menu (using native components and NativeWind styling) */}
                        {activeMenu === item.id && (
                        <View className="absolute right-2 top-12 z-10 bg-white border border-gray-300 rounded shadow">
                            <TouchableOpacity
                            onPress={() => {
                                setActiveMenu(null);
                                editAddressHandler();
                            }}
                            className="px-4 py-2"
                            >
                            <Text className="text-blue-600">Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={() => {
                                
                              deleteAddress(item);
                            }}
                            className="px-4 py-2"
                            >
                            <Text className="text-red-600">Delete</Text>
                            </TouchableOpacity>
                        </View>
                        )}
                </View>
                </TouchableOpacity>
                )}
                ListHeaderComponent={
                    showAction ? (
                        <TouchableOpacity 
                            className="py-3 px-6 rounded-lg flex-1 items-center justify-center bg-primary-300"
                            onPress={openNewAddress}
                        >
                            <Text className="text-white text-lg font-rubik-semibold">
                                + Add new address
                            </Text>
                        </TouchableOpacity>
                    ) : null
                }
                ListEmptyComponent={
                    loading ? (
                        <View className="flex-1 justify-center items-center mt-20">  
                          <ActivityIndicator size="large" color="#00ff00"/>
                        </View>
                      ) : (


                    <View className="flex-1 items-center justify-center">
                        <View className="mt-40 mx-4 h-24 w-full flex items-center justify-center bg-primary-300/25 rounded-lg border border-primary-200">
                                <Text className="text-white text-lg font-rubik-semibold">
                                No address found 
                            </Text>
                        </View>
                      
                    </View> 
                      )
                }
            />

        <DeleteModal 
            visible={isDeleteModalVisible}
            onClose={handleModalClose}
            />
        </View>
 
    
  )
}

export default ManageAddressList