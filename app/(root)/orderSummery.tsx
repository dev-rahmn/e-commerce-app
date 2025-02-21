import icons from "@/constants/icons";
import images from "@/constants/images";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, SafeAreaView, ScrollView, Animated } from "react-native";
import ManageAddress from "./manageAddress";
import { useTheme } from "@/contaxtapis/ThemeContext";

const OrderSummary = () => {

  const [step, setStep] = useState(1); // Track current step
 
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
 
  const {data,loading, error} = useAppSelector(state => state.address.selectedDeliveryAddress);
   const selectedDeliveryAddress = data
  const steps = ["Address", "Order Summary", "Payment"]; 

  const { bgColor, textColor} = useTheme();
  useEffect(() => {  
    if(!data)  {
      setStep(1)
    }else{

      setStep(2) 
    }
},[data]);

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const placeOrderHandler =() =>{
    console.log('place order');
  }

  const handleAddressChange = () => {
        setStep(1);
  }
 
  return (
    <SafeAreaView className=" h-full"   style={{ backgroundColor: bgColor }}>
      <View className="flex-1 ">
        
        {step === 1 && (<View className="flex flex-row mt-2 items-center gap-4 mx-4 pb-2">
            <TouchableOpacity onPress={() => {setStep(2)}} className=" h-10 w-10 rounded-full flex items-center justify-center"
            style={{ borderColor: textColor, borderWidth: 1, backgroundColor: bgColor }}
              >
              <Image tintColor={textColor} source={icons.backArrow} className="size-6" />
            </TouchableOpacity>
            <Text className={`text-xl font-rubik-base  mt-2 text-${textColor}`}>Address </Text>  
        </View>)}
        {step === 2 && (<View className="flex flex-row mt-2 items-center gap-4 mx-4 pb-2">
            <TouchableOpacity onPress={() => router.back()} className=" h-10 w-10 rounded-full flex items-center justify-center"
            style={{ borderColor: textColor, borderWidth: 1, backgroundColor: bgColor }}
              >
              <Image tintColor={textColor} source={icons.backArrow} className="size-6" />
            </TouchableOpacity>
            <Text className={`text-xl font-rubik-base  mt-2 text-${textColor}`}>Order Summary</Text>  
        </View>)}
        {step === 3 && (<View className="flex flex-row mt-2 items-center gap-4 mx-4 pb-2">
            <TouchableOpacity onPress={() => setStep(2)} className=" h-10 w-10 rounded-full flex items-center justify-center"
            style={{ borderColor: textColor, borderWidth: 1, backgroundColor: bgColor }}
              >
              <Image tintColor={textColor} source={icons.backArrow} className="size-6" />
            </TouchableOpacity>
            <Text className={`text-xl font-rubik-base  mt-2 text-${textColor}`}>Payment</Text>  
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

        <View >   
          {/* Step 1: Address Input */}
          {step === 1 && (
           <View className="pb-24">
             <View>
              <ManageAddress showAddAction={true} onDeliverHandler={() => setStep(2)} />
            </View> 
          </View>
          )}
            
          {/* Step 2: Order Summary */}
            {step === 2 && (
            <ScrollView 
                className=" px-2"  style={{ backgroundColor: bgColor }}  
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
                <View className="bg-white p-2 mx-2 rounded-lg shadow">
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
                <View className="bg-white mx-2 p-2 rounded-lg shadow mt-4 flex-row">
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
                <View className="bg-white p-4 mx-2 rounded-lg shadow mt-4">
                    <Text className="text-lg font-semibold">Get VIP membership</Text>
                    <Text className="text-gray-500">
                    Enjoy savings worth ₹256.0 now! ₹499 for 12 months.
                    </Text>
                    <TouchableOpacity className="bg-blue-500 p-2 rounded-lg mt-2">
                    <Text className="text-white text-center font-bold">Buy VIP</Text>
                    </TouchableOpacity>
                </View>

                {/* Price Details */}
                <View className="bg-white p-4 mx-2  rounded-lg shadow mt-4">
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
            <View className="px-4">
              <Text className="text-xl mb-3 " style={{ color: textColor}}>Select Payment Method</Text>
              {["Wallet UPI", "Net Banking", "Cash on Delivery"].map((method, index) => (
                <TouchableOpacity key={index} className="p-4 border rounded-md mb-3"
                style={{ borderColor: textColor, borderWidth: 1, backgroundColor: bgColor }} >
                  <Text className="text-black" style={{ color: textColor }}>{method}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

        </View>
      </View>

      {/* Back and Next Buttons */}
      <View className="absolute bottom-0 left-0 right-0 p-2 gap-4 flex flex-row justify-between border-t border-gray-300"  style={{ backgroundColor: bgColor }}>
        {step > 2 && (
          <TouchableOpacity className="bg-primary-300 py-3 px-6 rounded-full flex-1 " onPress={handlePrevStep}>
            <Text className="text-white text-center">Back</Text>
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
