import icons from "@/constants/icons";
import images from "@/constants/images";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView, Modal, TouchableWithoutFeedback } from "react-native";
import ManageAddress from "./manageAddress";
import { useTheme } from "@/contaxtapis/ThemeContext";
import { BASE_URL } from "@/utils/app.constent";

const OrderSummary = () => {

  const [step, setStep] = useState(1); // Track current step
  const [quantity, setQuantity] = useState(1); // Default quantity
  const [modalVisible, setModalVisible] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [userInput, setUserInput] = useState("");
  const [invalidCaptcha, setInvalidCaptcha] = useState(false);
  const MAX_QUANTITY = 6; // Maximum allowed quantity
   
  const { data: selectedDeliveryAddress, loading: addressLoading, error: addressError } = useAppSelector(
    state => state.address.selectedDeliveryAddress
  );
  
  const productDetail = useAppSelector(state => state.products.productDetail);
  const { data: productData, loading: productLoading, error: productError } = productDetail;
  
  const profile = useAppSelector((state) => state.auth.userProfile);

  const productDetailInfo = useMemo(() => {
    return productData?.product;
  }, [productData?.product]);
    // Generate a simple CAPTCHA (Random 4-digit number)
    const generateCaptcha = () => {
      return Math.floor(1000 + Math.random() * 9000).toString();
    };

  const increaseQuantity = () => {
    if (quantity < MAX_QUANTITY) setQuantity((prev) => prev + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };
  
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

  
// ✅ Ensure values exist before calculation
const basePrice = productDetailInfo?.price || 0; // Selling price
const originalPrice = basePrice + 190; // MRP of the product
const discountAmount = (originalPrice - basePrice) * quantity; // Discount applied
const discountAmountForPercentage = originalPrice - basePrice; // Discount applied
// const couponDiscount = Math.min(basePrice * 0.05, 500); // Example: 5% coupon discount (max ₹500)

const couponDiscount = 0; // Fixed platform fee
const platformFee = 3; // Fixed platform fee
const deliveryCharges = 0; // Assuming "FREE" means 0

// ✅ Calculate discount percentage (Ensure no division by zero)
const discountPercentage = originalPrice > 0 ? Math.round((discountAmountForPercentage / originalPrice) * 100) : 0;

// ✅ Total price calculation based on quantity
const totalAmount = Math.max(((basePrice - couponDiscount + deliveryCharges) * quantity) + platformFee , 0);

  const steps = ["Address", "Order Summary", "Payment"]; 

  const { bgColor, textColor} = useTheme();
  useEffect(() => {  
    if(!selectedDeliveryAddress)  {
      setStep(1)
    }else{

      setStep(2) 
    }
},[selectedDeliveryAddress]);

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const placeOrderHandler =() =>{
    const orderData = {
      productId: productDetailInfo.id,
      quantity,
      userId: profile?.userId,
      // paymentMethod, // Add payment method to the order data
    };

    console.log('place order',orderData);
  
  }

  const handleAddressChange = () => {
        setStep(1);
  }
 
  const handlePaymentMethod = (method: string) => {
    if (method === "Cash on Delivery") {
      setCaptcha(generateCaptcha()); // Generate a new CAPTCHA
      setModalVisible(true); // Open the modal

    }else{
      // Handle online payment
      console.log("Selected Payment Method: Online Payment");
      console.log('testing for online payment')
    }
  }

   // Handle CAPTCHA verification
   const verifyCaptcha = () => {
    if (userInput === captcha) {
      setModalVisible(false);
      setInvalidCaptcha(false);
      console.log("CAPTCHA verified. Proceed with Cash on Delivery.");
    } else {
      setInvalidCaptcha(true);
    }
  };


  return (
    <View>

    <SafeAreaView className=" h-full"   style={{ backgroundColor: bgColor }}>
      <View className="flex-1 mt-5">
        
        
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
            style={{ backgroundColor: bgColor }}
              >
              <Image tintColor={textColor} source={icons.backArrow} className="size-6" />
            </TouchableOpacity>
            <Text className={`text-xl font-rubik-base  mt-2 text-${textColor}`}>Payment</Text>  
        </View>)}

       
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
        
        <View >   
          
          {step === 1 && (
           <View className="pb-24">
             <View>
              <ManageAddress showAddAction={true} onDeliverHandler={() => setStep(2)} />
            </View> 
          </View>
          )}
            
        
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
                    source={{ uri: `${BASE_URL}/${productDetailInfo?.productImages[0]}` }} 
                    className="w-20 h-20 rounded-lg"
                    />
                    <View className="flex-1 ml-4">
                      <View className="flex-row justify-between items-center">
                          <Text className="text-lg font-semibold">{productDetailInfo?.name}</Text>

                          {/* Quantity Input with + / - Buttons */}
                              <View className="flex-row items-center  rounded-md">
                                {/* Subtract Button */}
                                <TouchableOpacity onPress={decreaseQuantity} className="px-3 py-1 bg-gray-200 rounded-md"
                                  disabled={quantity <= 1}>
                                  <Text className="text-lg">-</Text>
                                </TouchableOpacity>

                                {/* Input Field */}
                                <View className="w-10 text-center py-1">
                                  <Text className="text-center">{quantity}</Text>
                                </View>

                                {/* Add Button */}
                                <TouchableOpacity onPress={increaseQuantity} className="px-3 py-1 bg-gray-200 rounded-md"
                                  disabled={quantity >= MAX_QUANTITY}>
                                  <Text className="text-lg">+</Text>
                                </TouchableOpacity>
                              </View>
                        </View>
                        <Text className="text-gray-500">Category: {productDetailInfo?.category?.categoryName}</Text>
                        
                        {discountPercentage > 0 && (
                          <Text className="text-green-500 font-bold">{discountPercentage}% OFF</Text>
                        )}
                        
                        <Text className="text-gray-500 line-through">₹{originalPrice}</Text>
                        <Text className="text-black font-bold">₹{basePrice}</Text>
                    </View>

                </View>

                {/* VIP Membership */}
                <View className="bg-white p-4 mx-2 rounded-lg shadow mt-4">
                    <Text className="text-lg font-semibold">Get VIP membership</Text>
                    <Text className="text-gray-500">
                    Enjoy savings worth ₹256.0 now! ₹499 for 12 months.
                    </Text>
                    <TouchableOpacity className="bg-blue-500 p-2 rounded-lg mt-2" disabled>
                    <Text className="text-white text-center font-bold">Buy VIP</Text>
                    </TouchableOpacity>
                </View>

               {/* Price Details */}
                    <View className="bg-white p-4 mx-2 rounded-lg shadow mt-4">
                      <Text className="text-lg font-semibold">Price Details</Text>

                      <View className="flex-row justify-between mt-2">
                        <Text>Price ({quantity} item)</Text>
                        <Text>₹{originalPrice * quantity}</Text>
                      </View>

                      <View className="flex-row justify-between">
                        <Text>Discount</Text>
                        <Text className="text-green-500">- ₹{discountAmount}</Text>
                      </View>

                      <View className="flex-row justify-between">
                        <Text>Coupons</Text>
                        <Text className="text-green-500">- ₹{couponDiscount}</Text>
                      </View>

                      <View className="flex-row justify-between">
                        <Text>Platform Fee</Text>
                        <Text>₹{platformFee}</Text>
                      </View>

                      <View className="flex-row justify-between">
                        <Text>Delivery Charges</Text>
                        <Text className="text-green-500">{deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}</Text>
                      </View>

                      <View className="flex-row justify-between mt-2 border-t pt-2">
                        <Text className="font-bold text-lg">Total Amount</Text>
                        <Text className="font-bold text-lg">₹{totalAmount}</Text>
                      </View>
                    </View>

            
                </View>
            </ScrollView>
            )}


          {/* Step 3: Payment Options */}
          {step === 3 && (
            <View className="px-4">
              {/* CAPTCHA Modal */}
                  <Modal visible={modalVisible} transparent animationType="fade">
                    <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
                      <View className="bg-white w-[90%] p-5 rounded-lg shadow-lg relative">
                      <TouchableOpacity className="absolute right-[-5] top-[-10] px-2 py-1 bg-gray-500 rounded-lg" onPress={() => {setModalVisible(false), setInvalidCaptcha(false)}}>
                       <Text className="text-red-500">X</Text> 
                      </TouchableOpacity>
                        <Text className="text-xl font-bold mb-2 text-center">Enter The Captcha Code</Text>
                      {invalidCaptcha && (
                        
                        <Text className="text-sm font-rubik mb-2 text-center text-red-500">Please enter the correct code</Text>
                      )}
                        <Text className="text-2xl font-semibold text-center bg-gray-200 p-3 rounded-lg mb-4">
                          {captcha}
                        </Text>
                        <TextInput
                          placeholder="Enter CAPTCHA CODE" 
                          className="border border-gray-300 p-3 rounded-lg text-center mb-4"
                          onChangeText={setUserInput}
                          keyboardType="numeric"
                        />
                        <TouchableOpacity
                          onPress={verifyCaptcha}
                          className="bg-blue-500 py-3 rounded-lg">
                          <Text className="text-white text-center font-bold">Place order</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
              <Text className="text-xl mb-3 " style={{ color: textColor}}>Select Payment Method</Text>
              {["Cash on Delivery","Online Payment",].map((method, index) => (
                <TouchableOpacity key={index} className="p-4 border rounded-lg mb-3" onPress={() => handlePaymentMethod(method)}
                style={{ borderColor: textColor, borderWidth: 1, backgroundColor: bgColor }} >
                  <Text className="text-black" style={{ color: textColor }}>{method}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}


        </View>

        
      </View>

      {/* Back and Next Buttons */}
      {(step == 2 || step == 3 ) && (
        <View className="absolute bottom-0 left-0 right-0 p-2 gap-4 flex flex-row justify-between border-t border-gray-300"  style={{ backgroundColor: bgColor }}>
        {step > 2 && (
          <TouchableOpacity className="bg-primary-300 py-3 px-6 rounded-full flex " onPress={handlePrevStep}>
            <Text className="text-white text-center">Back</Text>
          </TouchableOpacity>
        )}
        
        {( step === 2) && (
        <TouchableOpacity className="bg-green-500 py-3 px-6 rounded-full flex-1" onPress={handleNextStep}>
          <Text className="text-white text-center"> CONTINUE</Text>
        </TouchableOpacity>
        )}
       
      </View>
      )}
      
    </SafeAreaView>

    </View>
  );
};

export default OrderSummary;
