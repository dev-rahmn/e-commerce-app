import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppSelector } from '@/redux/store/hooks';

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
      const addresses = useAppSelector(state => state.address.addresses);
      const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
      
    const editAddressHandler =() =>{
        openUpdateAddress()
      }

      const addressSelectionHandler = (item : any) =>{
        updateAddress(item)
        setSelectedAddress(item)
      }

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
                className={`border border-gray-200 rounded-lg my-2`}
                onPress={() => addressSelectionHandler(item)}
                >

                <View className={`bg-white p-2 rounded-lg shadow py-4 ${selectedAddress?.id === item.id ? "border border-primary-300" : ""}`}>
                    <View className="flex-row items-center">
                        {/* Name */}
                        <Text className={`text-lg font-semibold ${selectedAddress?.id === item.id ? "text-blue-600" : "text-black"}`}>
                        {item.name}
                        </Text>
        
                        {/* Address Type */}
                        <View className="ml-2 px-2 py-1 bg-gray-200 rounded">
                        <Text className="text-xs text-gray-700">{item.type.toUpperCase()}</Text>
                        </View>
        
                        {/* Edit Button */}
                        {selectedAddress?.id === item.id && showAction && (
                            <TouchableOpacity className="ml-auto flex-row items-center bg-primary-300 px-4 py-1 rounded-lg border border-gray-300" 
                            onPress={() =>editAddressHandler()}
                            >

                                <Text className="text-white ml-auto">Edit</Text>
                            </TouchableOpacity>
                        )}
                    </View>
        
                    {/* Address Details */}
                    <Text className="text-gray-600">{item.buildingName}, {item.roadName}, {item.city}</Text>
                    <Text className="text-gray-600">{item.state} - {item.pincode}</Text>
                    <Text className="text-gray-900 font-semibold pt-2">{item.phone}</Text>
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
                
            />
        </View>
 
    
  )
}

export default ManageAddressList