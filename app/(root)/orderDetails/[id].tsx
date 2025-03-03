import { View, Text, Image, TouchableOpacity, ScrollView, Animated, Easing, UIManager, Platform, LayoutAnimation, LayoutChangeEvent } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/constants/icons';
import { allTrackingSteps } from '@/utils/orderDetails';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { fetchOrderDetail } from '@/redux/slices/orderSlice';
import { RootState } from '@/redux/store/store';
import { isAdminUser } from '@/constants/utils';
import Loading from '@/utils/Loading';
import { useTheme } from '@/contaxtapis/ThemeContext';

const getTrackingSteps = (currentStatus: string) => {
  const currentIndex = allTrackingSteps.findIndex(step => step.label === currentStatus);
  return allTrackingSteps.map((step, index) => ({
    ...step,
    completed: index <= currentIndex,
    isActive: index === currentIndex, // Mark the current step
  }));
};

// Create an Animated component that supports Tailwind's className
const AnimatedView = Animated.createAnimatedComponent(View);

const OrderDetails = () => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  // Interpolate the animated value to map from 0 to contentHeight
  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 140],
  });
  const toggleCustomerInfo = () => {
    const finalValue = expanded ? 0 : 1;
    Animated.spring(animation, {
      toValue: finalValue,
      stiffness: 300,              // High stiffness for fast acceleration
      damping: 100,                // High damping to quickly stop oscillations
      mass: 1,                     
      overshootClamping: true,     // Prevents any overshooting (bounce)
      useNativeDriver: false,      // Height animations cannot use the native driver
    }).start(() => {
      setExpanded(!expanded);
    });
  };
  
  // Capture the content's height
  const onContentLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height !== contentHeight) {
      setContentHeight(height);
    }
  };


  const { id } = useLocalSearchParams<{ id?: string }>();
  const dispatch = useAppDispatch();
const orderDetails = useAppSelector((state: RootState) => state.order.orderDetail)

    const token = useAppSelector((state) => state.auth.token);

    const isAdmin = useMemo(() => isAdminUser(token), [token]);
    const { loading, error, data}  = orderDetails;

  const {bgColor, textColor} = useTheme()

const statusFlag = useMemo(() => data?.statusFlag ?? null, [data]);
  useEffect(() => {
    if(id) dispatch(fetchOrderDetail(id))
  },[id, dispatch ])


  const lineAnimations = useRef(allTrackingSteps.map(() => new Animated.Value(0))).current;
  const scaleAnimations = useRef(allTrackingSteps.map(() => new Animated.Value(1))).current;
  const pulseAnimations = useRef(allTrackingSteps.map(() => new Animated.Value(1))).current;

  const trackingSteps = getTrackingSteps(data ? data?.status.toString() : '');

  useEffect(() => {
    trackingSteps.forEach((step, index) => {
      if (step.completed && trackingSteps[index + 1]?.completed) {
        Animated.timing(lineAnimations[index], {
          toValue: 1,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: false,
        }).start();
      }

      if (step.completed) {
        Animated.spring(scaleAnimations[index], {
          toValue: 1.2, // Slightly enlarges the completed step
          friction: 3,
          tension: 80,
          useNativeDriver: false,
        }).start();
      }

      if (step.isActive) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnimations[index], { toValue: 1.2, duration: 400, useNativeDriver: false }),
            Animated.timing(pulseAnimations[index], { toValue: 1, duration: 800, useNativeDriver: false }),
          ])
        ).start();
      }
    });
  }, [trackingSteps]);


 if (loading) {
          return (
            <View className="flex-1 items-center justify-center "  style={{ backgroundColor: bgColor }}>
              <Loading />
            </View>
          );
        }
        
        if (error) {
          return (
            <View className="flex-1 items-center justify-center mt-24"   style={{ backgroundColor: bgColor }}>
              <Text className="text-red-500 text-lg font-semibold">Something went wrong! Please try again.</Text>
            </View>
          );
        }  


  return (
    <SafeAreaView className="bg-white h-full">
      <View className="px-4 py-2 flex flex-row items-center justify-between border-b border-gray-200" style={{ backgroundColor: bgColor }}>
        <TouchableOpacity onPress={() => router.back()} style={{ borderColor: textColor, borderWidth: 1,opacity: 0.5 }}
         className=" h-10 w-10 rounded-full flex items-center justify-center">
          <Image source={icons.backArrow} className="size-6" tintColor={textColor}/>
        </TouchableOpacity>
        <Text className="text-lg font-bold" style={{ color: textColor }}>{id}</Text>
      </View>

      <View className="mt-5 p-5 bg-gray-100 border border-gray-200 mx-3 rounded-lg">
        <Text className="text-lg font-semibold mb-2">Order Information:</Text>
        <Text className="text-base text-gray-700">Product Name: {data?.productName}</Text>
        <Text className="text-base text-gray-700 my-2">Quantity: {data?.quantity}</Text>
        <Text className="text-base text-gray-700">Total Price: ₹{data?.productPrice}</Text>
      </View>

      {isAdmin && (
        <View className="flex flex-col my-3 px-3">
          <TouchableOpacity onPress={toggleCustomerInfo}>
            <View className="py-3 px-2 flex flex-row items-center justify-between border rounded-lg border-gray-200">
              <Text className="text-lg font-semibold">
                Customer Information
              </Text>
              <Text className="text-lg font-semibold">
                {expanded ? "▲" : "▼"}
              </Text>
            </View>
          </TouchableOpacity>
          <AnimatedView
            className="overflow-hidden"
            style={{ height: heightInterpolate }}
          >
            <View
              onLayout={onContentLayout}
              className="px-3 mt-4 py-4 bg-green-100 border border-green-500 rounded-lg"
            >
              <Text className="font-rubik-medium text-gray-700">
                Customer Email: {data?.userEmail}
              </Text>
              <Text className="font-rubik-medium text-gray-700 my-2">
                Customer Name: {data?.userFirstName} {data?.userLastName}
              </Text>
              <Text className="font-rubik-medium text-gray-700">
                Delivery Address: add here some address
              </Text>
            </View>
          </AnimatedView>
        </View>
      )}

      <ScrollView contentContainerClassName="p-5 pb-32">
        <Text className="text-xl font-semibold my-4 ">Order Status Steps</Text>

        <View className="mt-2">
          {trackingSteps.map((step, index) => (
            <View key={step.id} className="flex flex-row items-center">
              <View className="flex items-center">
                {/* Animated Step Indicator */}
                <Animated.View
                  style={{
                    transform: [{ scale: step.isActive ? pulseAnimations[index] : scaleAnimations[index] }],
                    backgroundColor: step.completed ? '#34D399' : '#D1D5DB',
                    borderColor: step.completed ? '#059669' : '#9CA3AF',
                  }}
                  className="h-10 w-10 z-10 rounded-full border-4 flex items-center justify-center"
                >
                  <Text className="text-white font-bold z-5">
                    {step.completed ? '✓' : step.id}
                  </Text>
                </Animated.View>

                {/* Animated Connecting Line */}
                {index !== trackingSteps.length - 1 && (
                  <>
                    <View className="w-1 bg-gray-300" style={{ height: 50 }} />
                    {trackingSteps[index + 1].completed && (
                      <Animated.View
                        style={{
                          position: 'absolute',
                          height: lineAnimations[index].interpolate({ inputRange: [0, 1], outputRange: [0, 50] }),
                        }}
                        className="mt-11 w-1 bg-green-500"
                      />
                    )}
                  </>
                )}
              </View>

              {/* Step Label */}
              <Text className={`ml-5 pb-2 text-lg font-medium ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      
      
      {/* Action Buttons */}

      <View className="absolute bottom-0 left-0 right-0 px-2  flex flex-row justify-between border-t border-gray-300" style={{ backgroundColor: bgColor }}>
            {statusFlag === null && isAdmin ? (
              <>
              {/* Cancel Button  for admin*/}
              <TouchableOpacity className="bg-red-700 py-3 px-6 my-2 rounded-full flex-1 mr-2">
                <Text className="text-white text-center font-semibold text-lg">Cancel</Text>
              </TouchableOpacity>

              {/* Accept Button  for admin*/}
              <TouchableOpacity className="bg-green-700 py-3 px-6 my-2 rounded-full flex-1 ml-2">
                <Text className="text-white text-center font-semibold text-lg">Accept</Text>
              </TouchableOpacity>
          </>
          ) : isAdmin ? (
            data?.status !== "Delivered" && data?.status !== "Cancelled" ? (
              <TouchableOpacity className="bg-blue-700 py-3 px-6 my-2 rounded-full flex-1 ml-2">
                {/* update the order status admin can update  */}
              <Text className="text-white text-center font-semibold text-lg">Update Status</Text>
            </TouchableOpacity>
            ) : (
              null
            )
          ) :  data?.status !== "Delivered" && data?.status !== "Cancelled" ? (
            
            <TouchableOpacity className="bg-red-700 py-3 my-2 px-6 rounded-full flex-1 mr-2">  
            {/* cancel button for user */}
            <Text className="text-white text-center font-semibold text-lg">Cancel</Text>
          </TouchableOpacity>
          ) : (
            <View className={`${data?.status === "Delivered" ? "bg-green-700" : data.status === "Cancelled" ? "bg-red-700" : "bg-orange-700"} rounded-full my-2 flex-1 p-3 `}>
            <Text className="text-center text-lg font-semibold text-white">Your order is {data?.status}</Text>
          </View>
          )}
      </View>
     
    </SafeAreaView>
  );
};

export default OrderDetails;
