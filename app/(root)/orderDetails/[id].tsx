import { View, Text, Image, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/constants/icons';
import { allTrackingSteps } from '@/utils/orderDetails';

  // Function to update tracking steps based on status
  const getTrackingSteps = (currentStatus: string) => {
    // Find the index of the current status
    const currentIndex = allTrackingSteps.findIndex(step => step.label === currentStatus);
  
    return allTrackingSteps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex, // Mark previous and current steps as completed
    }));
  };

const OrderDetails = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const lineAnimations = useRef(allTrackingSteps.map(() => new Animated.Value(0))).current;


const orderStatus = 'Shipped';
  const trackingSteps = getTrackingSteps(orderStatus);
  useEffect(() => {
    trackingSteps.forEach((step, index) => {
      if (step.completed && trackingSteps[index + 1]?.completed) {
        Animated.timing(lineAnimations[index], {
          toValue: 1,
          duration: 1000,  // Animate each line over 1 second
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      }
    });
  }, [trackingSteps]);

  
  return (
    <SafeAreaView className="bg-white h-full">
      {/* Header */}
      <View className="px-4 py-2 flex flex-row items-center justify-between border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-primary-100 h-10 w-10 rounded-full flex items-center justify-center"
        >
          <Image source={icons.backArrow} className="size-6" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Order #{id}</Text>
      </View>
    <View className="mt-5 px-5">
          <Text className="text-lg font-semibold mb-2">Order Information:</Text>
          <Text className="text-base text-gray-700">• Product Name: Example Product</Text>
          <Text className="text-base text-gray-700">• Quantity: 2</Text>
          <Text className="text-base text-gray-700">• Total Price: $200</Text>
        </View>
      {/* Order Details */}
      <ScrollView contentContainerClassName="p-5 pb-32">
        <Text className="text-xl font-semibold mb-3">Tracking Status</Text>

        <View className="mt-5">
        {trackingSteps.map((step, index) => (
        <View key={step.id} className="flex flex-row items-center">
            {/* Step Indicator */}
            <View className="flex items-center">
            <View
                className={`h-10 w-10 rounded-full border-2 ${
                step.completed ? 'bg-green-500 border-green-500' : 'bg-gray-300 border-gray-400'
                } flex items-center justify-center`}
            >
                <Text className="text-white font-bold z-50">
                {step.completed ? '✔' : step.id}
                </Text>
            </View>

            {/* Connecting Line */}
            {index !== trackingSteps.length - 1 && (
                <>
                {/* Gray Line (Always Visible) */}
                <View className="w-1 bg-gray-300" style={{ height: 50 }} />

                {/* Animated Green Line (Visible Only if Next Step is Completed) */}
                {trackingSteps[index + 1].completed && (
                    <Animated.View
                    style={{
                        position: 'absolute',
                        height: lineAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 50],  // Gradually fills up to 50 height
                        }),
                    }}
                    className="w-1 bg-green-500"
                    />
                )}
                </>
            )}
            </View>

            {/* Step Label */}
            <Text
            className={`ml-5 text-lg font-medium ${
                step.completed ? 'text-green-600' : 'text-gray-500'
            }`}
            >
            {step.label}
            </Text>
        </View>
        ))}


    </View>

        
      </ScrollView>

      {/* Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-5 flex flex-row justify-between border-t border-gray-300">
        <TouchableOpacity className="bg-green-500 py-3 px-6 rounded-full flex-1 mr-2">
          <Text className="text-white text-center font-semibold text-lg">Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-red-500 py-3 px-6 rounded-full flex-1 ml-2">
          <Text className="text-white text-center font-semibold text-lg">Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OrderDetails;
