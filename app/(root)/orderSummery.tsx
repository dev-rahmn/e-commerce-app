import icons from "@/constants/icons";
import images from "@/constants/images";
import { addAddress, selectAddress, updateAddress } from "@/redux/slices/addressSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, SafeAreaView, ScrollView, Animated } from "react-native";

const OrderSummary = () => {
  const dispatch =  useAppDispatch()
  const [step, setStep] = useState(1); // Track current step
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

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
  const [isAddingAddress, setIsAddingAddress] = useState(false);


// Step 1: Personal Information
const [name, setName] = useState("");
const [phone, setPhone] = useState("");
// Step 2: Location Details
const [pincode, setPincode] = useState("");
const [state, setState] = useState("");
const [city, setCity] = useState("");
// Step 3: Address Details
const [buildingName, setBuildingName] = useState("");
const [roadName, setRoadName] = useState("");
// Step 4: type
  const [selectedType, setSelectedType] = useState('home');

  const addresses = useAppSelector(state => state.address.addresses);
  const selectedDeliveryAddress = useAppSelector(state => state.address.selectedDeliveryAddress);

  const steps = ["Address", "Order Summary", "Payment"]; 

  const orderItems = [
    { id: 1, name: "Adidas Men's Shoes", price: "₹2,650", image: "https://via.placeholder.com/150" }
  ];

  
  const addressSelectionHandler = (item : any) =>{
    // dispatch(selectAddress(id));
    setSelectedAddress(item)
  }

  const handleAddressSelection = () => {
        dispatch(selectAddress(selectedAddress));
    if (selectedAddress) {
      
      setStep(2);
    } else {
      console.warn("No address found for the given ID");
    }
  };
  
  useEffect(() => {  

      if(selectedAddress){
        setStep(2)
      }
  },[]);

  useEffect(() => {    
      setStep(2) 
},[]);

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const placeOrderHandler =() =>{
    console.log('place order');
  }

  const editAddressHandler =(item : any) =>{
    setName(item.name);
    setPhone(item.phone);
    setPincode(item.pincode);
    setState(item.state);
    setCity(item.city);
    setBuildingName(item.buildingName);
    setRoadName(item.roadName);
    setSelectedType(item.type);

    setIsAddingAddress(true);
  }

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
  const handleAddressChange = () => {
        setStep(1);
  }
  const handleManageAddress = () =>{

        // if (!name.trim()) return alert("Full Name is required");
        // if (!phone.trim() || phone.length !== 10) return alert("Enter a valid 10-digit phone number");
        // if (!pincode.trim() || pincode.length !== 6) return alert("Enter a valid 6-digit pincode");
        // if (!state.trim()) return alert("State is required");
        // if (!city.trim()) return alert("City is required");
        // if (!buildingName.trim()) return alert("Building Name is required");
        // if (!roadName.trim()) return alert("Road Name is required");

    const newAddress = {
        
        name,
        phone,
        pincode,
        state,
        city,
        buildingName,
        roadName,
        type: selectedType,
      };
    
      if(selectedAddress?.id){

        let data = { id: selectedAddress. id,...newAddress}
        dispatch(updateAddress(data))
        
        setSelectedAddress(data)
        console.log('update');

      }else{
        dispatch(addAddress({
          ...newAddress,id: Date.now()
        }))
        console.log('add');
      }
    
    
      resetFields(); 
      setIsAddingAddress(false)
    };
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-1 py-2">
        
        {step === 1 && (<View className="flex flex-row items-center gap-4 mx-4 pb-2">
            <TouchableOpacity onPress={() => {setStep(2), setIsAddingAddress(false)}} className="bg-primary-100 h-10 w-10 rounded-full flex items-center justify-center">
              <Image source={icons.backArrow} className="size-6" />
            </TouchableOpacity>
            <Text className="text-xl font-rubik-base text-black-300 mt-2">Address - {`(${addresses.length})`}</Text>  
        </View>)}
        {step === 2 && (<View className="flex flex-row items-center gap-4 mx-4 pb-2">
            <TouchableOpacity onPress={() => router.back()} className="bg-primary-100 h-10 w-10 rounded-full flex items-center justify-center">
              <Image source={icons.backArrow} className="size-6" />
            </TouchableOpacity>
            <Text className="text-xl font-rubik-base text-black-300 mt-2">Order Summary</Text>  
        </View>)}
        {step === 3 && (<View className="flex flex-row items-center gap-4 mx-4 pb-2">
            <TouchableOpacity onPress={() => setStep(2)} className="bg-primary-200 h-10 w-10 rounded-full flex items-center justify-center">
              <Image source={icons.backArrow} className="size-6" />
            </TouchableOpacity>
            <Text className="text-xl font-rubik-base text-black-300 mt-2">Payment</Text>  
        </View>)}

        {/* Step Indicator */}
        <View className="w-full flex-row items-center justify-between mb-2">
          {steps.map((item, index) => {
            const isCompleted = step > index + 1;
            const isActive = step === index + 1;
            const isConnectorActive = step > index;

            return (
              <View key={index} className="flex-1 items-center relative">
                {/* Connector Line with Animation */}
                {index !== 0 && (
                  <View className="absolute left-[-50%] right-[50%] top-5 h-1 overflow-hidden">
                    <View className={`h-full ${isConnectorActive ? "bg-green-500" : "bg-gray-300"} transition-all duration-500 w-full`} />
                  </View>
                )}

                {/* Step Number */}
                <View className={`w-10 h-10 rounded-full flex items-center z-50 justify-center ${isCompleted ? "bg-green-500" : isActive ? "bg-primary-300" : "bg-gray-300"}`}>
                  <Text className="text-white font-bold">{index + 1}</Text>
                </View>

                {/* Step Label */}
                <Text className="text-sm mt-1 text-center">{item}</Text>
              </View>
            );
          })}
        </View>
        {/* wrap the all component all three steps in this div */} 

        <View className=" px-2 ">   
          {/* Step 1: Address Input */}
          {step === 1 && (
           <View className=" pb-48">
             {!isAddingAddress ? (
                <FlatList
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
                            {selectedAddress?.id === item.id && (
                                <TouchableOpacity className="ml-auto flex-row items-center bg-primary-300 px-4 py-1 rounded-lg border border-gray-300" 
                                onPress={() =>editAddressHandler(item)}
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
                        <TouchableOpacity className="py-3 px-6 rounded-lg flex-1 items-center justify-center bg-primary-300"
                          onPress={() =>{ setIsAddingAddress(true), setSelectedAddress(null)}}>
                        <Text className="text-white text-lg font-rubik-semibold">+ Add new address</Text>
                    </TouchableOpacity>
                    }
                />
             ):(
      // ✅ Show Add Address Form
      <ScrollView 
        className="bg-gray-100 px-2 pb-48"  
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps="handled"
        >
        <Text className="text-xl font-bold my-4 underline">Add Delivery Address</Text>

        {/* Full Name */}
        <Text className="text-gray-600 mb-1">Full Name (Required) *</Text>
        <TextInput className="border border-gray-300 p-3 rounded-md mb-3"  
        value={name} 
        onChangeText={(text) => setName(text)}
        placeholder="Full Name" />

        {/* Phone Number */}
        <Text className="text-gray-600 mb-1">Phone Number (Required) *</Text>
        <TextInput className="border border-gray-300 p-3 rounded-md mb-3" placeholder="Phone Number" keyboardType="phone-pad"
        value={phone} 
        onChangeText={(text) => setPhone(text)}
         />

        {/* Pincode, State, City */}
        <View className="flex-row gap-2 justify-between mr-2">
          <View className="w-1/2">
            <Text className="text-gray-600 mb-1">Pincode *</Text>
            <TextInput className="border border-gray-300 p-3 rounded-md" value={pincode} onChangeText={(text) => setPincode(text)} />
          </View>
          <View className="w-1/2">
            <Text className="text-gray-600 mb-1">State *</Text>
            <TextInput className="border border-gray-300 p-3 rounded-md" value={state} onChangeText={(text) => setState(text)} />
          </View>
        </View>

        <View className="flex-row gap-2 justify-between mr-2">
          
          <View className="w-1/2">
            <Text className="text-gray-600 mb-1">City *</Text>
            <TextInput className="border border-gray-300 p-3 rounded-md" value={city} onChangeText={(text) => setCity(text)} />
          </View>
          <View className="w-1/2">
          <Text className="text-gray-600 mb-1">Location *</Text>
            <TouchableOpacity className="bg-blue-600 p-3 rounded-md mb-3">
            <Text className="text-white text-center">Use My Location</Text>
            </TouchableOpacity>
        </View>
        </View>

        {/* Use My Location Button */}
       

        {/* Address Details */}
        <Text className="text-gray-600 mb-1">House No., Building Name *</Text>
        <TextInput className="border border-gray-300 p-3 rounded-md mb-3" value={buildingName} onChangeText={(text) => setBuildingName(text)} />

        <Text className="text-gray-600 mb-1">Road name, Area, Colony *</Text>
        <TextInput className="border border-gray-300 p-3 rounded-md mb-3" value={roadName} onChangeText={(text) => setRoadName(text)} />

        {/* Address Type Selection */}
        <Text className="text-gray-600 mb-1">Type of Address :</Text>
        <View className="flex-row gap-2 my-2 w-1/2">
          <TouchableOpacity
            className={`flex-1 py-2 px-4 border rounded-lg ${selectedType === "home" ? "border-blue-600 border-2" : "border-black"}`}
            onPress={() => setSelectedType("home")}
          >
            <View className="flex-row items-center gap-2 justify-center">
            <Animated.Image source={icons.home} 
                 tintColor={selectedType === "home" ? "#0061FF" : "#666876"}
            className={`w-6 h-6  text-center`}
            />

            <Text className={`${selectedType === "home" ? "text-blue-600" : "text-black"} text-center font-rubik-semibold`}>Home</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2 px-4 border rounded-lg ${selectedType === "work" ? "border-blue-600 border-2" : "border-black"}`}
            onPress={() => setSelectedType("work")}
          >
            <View className="flex-row items-center gap-2 justify-center">

            <Animated.Image source={icons.work} 
                 tintColor={selectedType === "work" ? "#0061FF" : "#666876"}
            className={`w-6 h-6  text-center`}
            />
            <Text className={`${selectedType === "work" ? "text-blue-600" : "text-black"} text-center font-rubik-semibold`}>Work</Text>
            </View>
          </TouchableOpacity>
        </View>

       
      </ScrollView>
    )}
  </View>
)}
            

          {/* Step 2: Order Summary */}
            {step === 2 && (
            <ScrollView 
                className="bg-gray-100 px-2"  
                contentContainerStyle={{ paddingBottom: 180 }} 
                showsVerticalScrollIndicator={false} 
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1">
                {/* Header */}
                <View className="flex-row justify-between items-center my-4">
                    <Text className="text-lg font-semibold">Order Summary</Text>
                </View>

                {/* Delivery Info */}
                <View className="bg-white p-2 rounded-lg shadow">
                    <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-semibold">Deliver To :</Text>
                    <TouchableOpacity className="bg-primary-300 px-3 py-1 rounded-md" onPress={handleAddressChange}>
                        <Text className="text-white">Change</Text>
                    </TouchableOpacity>
                    </View>
                    <View className="flex-row items-start gap-2">

                    <Text className="text-gray-700 font-rubik-medium">{selectedDeliveryAddress?.name}</Text>
                    <View className="ml-2 px-2 py-1 bg-gray-200 rounded-lg">
                            <Text className="text-sm text-gray-700">{selectedDeliveryAddress?.type.toUpperCase()}</Text>
                            </View>
                    </View>
                    <Text className="text-gray-500">
                    {selectedDeliveryAddress?.buildingName}, {selectedDeliveryAddress?.roadName}, {selectedDeliveryAddress?.state},{selectedDeliveryAddress?.city},{selectedDeliveryAddress?.pincode}
                    </Text>
                    <Text className="text-gray-700 font-bold">{selectedDeliveryAddress?.phone}</Text>
                </View>

                {/* Product Card */}
                <View className="bg-white p-2 rounded-lg shadow mt-4 flex-row">
                    <Image
                    source={images.home}
                    className="w-20 h-20 rounded-lg"
                    />
                    <View className="flex-1 ml-4">
                    <Text className="text-lg font-semibold">Skechers D'Lux Fitness</Text>
                    <Text className="text-gray-500">Size: 8, Navy</Text>
                    <Text className="text-green-500 font-bold">53% OFF</Text>
                    <Text className="text-gray-500 line-through">₹7,499</Text>
                    <Text className="text-black font-bold">₹3,501</Text>
                    </View>
                </View>

                {/* VIP Membership */}
                <View className="bg-white p-4 rounded-lg shadow mt-4">
                    <Text className="text-lg font-semibold">Get VIP membership</Text>
                    <Text className="text-gray-500">
                    Enjoy savings worth ₹256.0 now! ₹499 for 12 months.
                    </Text>
                    <TouchableOpacity className="bg-blue-500 p-2 rounded-lg mt-2">
                    <Text className="text-white text-center font-bold">Buy VIP</Text>
                    </TouchableOpacity>
                </View>

                {/* Price Details */}
                <View className="bg-white p-4 rounded-lg shadow mt-4">
                    <Text className="text-lg font-semibold">Price Details</Text>
                    <View className="flex-row justify-between mt-2">
                    <Text>Price (1 item)</Text>
                    <Text>₹7,499</Text>
                    </View>
                    <View className="flex-row justify-between">
                    <Text>Discount</Text>
                    <Text className="text-green-500">- ₹3,380</Text>
                    </View>
                    <View className="flex-row justify-between">
                    <Text>Coupons</Text>
                    <Text className="text-green-500">- ₹618</Text>
                    </View>
                    <View className="flex-row justify-between">
                    <Text>Platform Fee</Text>
                    <Text>₹3</Text>
                    </View>
                    <View className="flex-row justify-between">
                    <Text>Delivery Charges</Text>
                    <Text className="text-green-500">FREE</Text>
                    </View>
                    <View className="flex-row justify-between mt-2 border-t pt-2">
                    <Text className="font-bold text-lg">Total Amount</Text>
                    <Text className="font-bold text-lg">₹3,504</Text>
                    </View>
                </View>
            
                </View>
            </ScrollView>
            )}


          {/* Step 3: Payment Options */}
          {step === 3 && (
            <View>
              <Text className="text-xl mb-3">Select Payment Method</Text>
              {["Wallet UPI", "Net Banking", "Cash on Delivery"].map((method, index) => (
                <TouchableOpacity key={index} className="p-4 border rounded-md mb-3">
                  <Text>{method}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

        </View>
      </View>

      {/* Back and Next Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-2 gap-4 flex flex-row justify-between border-t border-gray-300">
        {step > 2 && (
          <TouchableOpacity className="bg-primary-300 py-3 px-6 rounded-full flex-1 " onPress={handlePrevStep}>
            <Text className="text-white text-center">Back</Text>
          </TouchableOpacity>
        )}
        {(step === 1 && !isAddingAddress) && (
          <TouchableOpacity className="bg-orange-500 py-3 px-6 rounded-full flex-1" onPress={handleAddressSelection} disabled={!selectedAddress}>
          <Text className="text-white text-center text-lg font-bold">DELIVER HERE</Text>
        </TouchableOpacity>
        )}
            {(step === 1 && isAddingAddress) && (
    
                <TouchableOpacity className="bg-orange-500 py-3 px-6 rounded-lg flex-1" onPress={handleManageAddress}>
                  <Text className="text-white text-center font-bold">Save Address</Text>
                </TouchableOpacity>    
            )}
        {(step === 1 && isAddingAddress) && (

            <TouchableOpacity  className="bg-gray-500 py-3 px-6 rounded-lg flex-1"
              onPress={() => {setIsAddingAddress(false),resetFields()}

              } // ✅ Hide Add Address form
            >
              <Text className="text-white text-center font-bold">Cancel</Text>
            </TouchableOpacity>
        )}

        {( step === 2) && (
        <TouchableOpacity className="bg-green-500 py-3 px-6 rounded-full flex-1" onPress={handleNextStep}>
          <Text className="text-white text-center"> CONTINUE</Text>
        </TouchableOpacity>
        )}
        {step === 3 && (
        <TouchableOpacity className="bg-green-500 py-3 px-6 rounded-full flex-1" onPress={placeOrderHandler}>
          <Text className="text-white text-center">PLACE ORDER</Text>
        </TouchableOpacity>
        )}
        
      </View>
    </SafeAreaView>
  );
};

export default OrderSummary;
