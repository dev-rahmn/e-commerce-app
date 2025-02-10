import { View, Text, TouchableOpacity, Image, ScrollView, Animated, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import icons from '@/constants/icons'
const ManageAddressForm = ({onSubmit, onClose , address} :{onSubmit: ({} :any) => void, address?: any, onClose: () => void}) => {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [pincode, setPincode] = useState("")
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [buildingName, setBuildingName] = useState("");
    const [roadName, setRoadName] = useState("");
    const [selectedType, setSelectedType] = useState('home');

    // Populate state when the address changes
    useEffect(() => {
        if (address) {
            setName(address.name || "");
            setPhone(address.phone || "");
            setPincode(address.pincode || "");
            setState(address.state || "");
            setCity(address.city || "");
            setBuildingName(address.buildingName || "");
            setRoadName(address.roadName || "");
            setSelectedType(address.type || "home");
        }
    }, [address]);

    const resetFields = () => {
        setName("");
        setPhone("");
        setPincode("");
        setState("");
        setCity("");
        setBuildingName("");
        setRoadName("");
        setSelectedType("home");
      };

     const handleManageAddress = () =>{
    
            if (!name.trim()) return alert("Full Name is required");
            if (!phone.trim() || phone.length !== 10) return alert("Enter a valid 10-digit phone number");
            if (!pincode.trim() || pincode.length !== 6) return alert("Enter a valid 6-digit pincode");
            if (!state.trim()) return alert("State is required");
            if (!city.trim()) return alert("City is required");
            if (!buildingName.trim()) return alert("Building Name is required");
            if (!roadName.trim()) return alert("Road Name is required");
    
            const newAddress = {
                id: address?.id || null, // If address has an ID, include it
                name,
                phone,
                pincode,
                state,
                city,
                buildingName,
                roadName,
                type: selectedType,
            };

        resetFields();  
        onSubmit(newAddress) 
        };

      const closeHandler = () => {
            onClose()
        }
  return (
    
        <ScrollView className='pb-32'>
            
            <View className="px-2">
                <View className='flex flex-row px-2 items-center justify-between'>
                    <Text className="text-xl font-bold my-4">{address ? 'Update' : 'Add'} Delivery Address</Text>
                    <TouchableOpacity className='items-center py-1 px-2 justify-center border border-red-500 rounded-lg' onPress={closeHandler}>
                        <Text className='text-red-600'>
                            X
                        </Text>
                    </TouchableOpacity>
                </View>
                
                {/* Full Name */}
                <Text className="text-gray-600 mb-1">Full Name (Required) *</Text>
                <TextInput className="border border-gray-300 p-3 rounded-md mb-3"
                    value={name} onChangeText={setName} placeholder="Full Name" />
                
                {/* Phone Number */}
                <Text className="text-gray-600 mb-1">Phone Number (Required) *</Text>
                <TextInput className="border border-gray-300 p-3 rounded-md mb-3"
                    placeholder="Phone Number" keyboardType="phone-pad"
                    value={phone} onChangeText={setPhone} />
                
                {/* Pincode & State */}
                <View className="flex-row gap-2 justify-between mr-2">
                    <View className="w-1/2">
                        <Text className="text-gray-600 mb-1">Pincode *</Text>
                        <TextInput className="border border-gray-300 p-3 rounded-md"
                            value={pincode} onChangeText={setPincode} />
                    </View>
                    <View className="w-1/2">
                        <Text className="text-gray-600 mb-1">State *</Text>
                        <TextInput className="border border-gray-300 p-3 rounded-md"
                            value={state} onChangeText={setState} />
                    </View>
                </View>

                {/* City & Location */}
                <View className="flex-row gap-2 justify-between mr-2">
                    <View className="w-1/2">
                        <Text className="text-gray-600 mb-1">City *</Text>
                        <TextInput className="border border-gray-300 p-3 rounded-md"
                            value={city} onChangeText={setCity} />
                    </View>
                    <View className="w-1/2">
                        <Text className="text-gray-600 mb-1">Location *</Text>
                        <TouchableOpacity className="bg-blue-600 p-3 rounded-md mb-3">
                            <Text className="text-white text-center">Use My Location</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Address Details */}
                <Text className="text-gray-600 mb-1">House No., Building Name *</Text>
                <TextInput className="border border-gray-300 p-3 rounded-md mb-3"
                    value={buildingName} onChangeText={setBuildingName} />

                <Text className="text-gray-600 mb-1">Road name, Area, Colony *</Text>
                <TextInput className="border border-gray-300 p-3 rounded-md mb-3"
                    value={roadName} onChangeText={setRoadName} />

                {/* Address Type Selection */}
                <Text className="text-gray-600 mb-1">Type of Address :</Text>
                <View className="flex-row gap-2 my-2 w-1/2">
                    <TouchableOpacity
                        className={`flex-1 py-1 px-4 border rounded-lg ${selectedType === "home" ? "border-blue-600 border-2" : "border-black"}`}
                        onPress={() => setSelectedType("home")}>
                        <View className="flex-row items-center gap-2 justify-center">
                            <Animated.Image source={icons.home} 
                                tintColor={selectedType === "home" ? "#0061FF" : "#666876"}
                                className="w-6 h-6" />
                            <Text className={`${selectedType === "home" ? "text-blue-600" : "text-black"} text-center font-rubik-semibold`}>Home</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`flex-1 py-1 px-4 border rounded-lg ${selectedType === "work" ? "border-blue-600 border-2" : "border-black"}`}
                        onPress={() => setSelectedType("work")}>
                        <View className="flex-row items-center gap-2 justify-center">
                            <Animated.Image source={icons.work} 
                                tintColor={selectedType === "work" ? "#0061FF" : "#666876"}
                                className="w-6 h-6" />
                            <Text className={`${selectedType === "work" ? "text-blue-600" : "text-black"} text-center font-rubik-semibold`}>Work</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View className=" bg-white mb-8">
                <View className="flex flex-row gap-4 py-4 px-2">
                    <TouchableOpacity className="bg-orange-500 py-3  rounded-lg flex-1"
                        onPress={handleManageAddress}
                    >
                        <Text className="text-white text-center font-bold">+Add Address </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-gray-500 py-3  rounded-lg flex-1"
                        onPress={closeHandler}
                    >
                        <Text className="text-white text-center font-bold">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>  
            
  )
}

export default ManageAddressForm