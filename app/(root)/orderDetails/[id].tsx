import { View, Text, Image, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/constants/icons';
import { allTrackingSteps } from '@/utils/orderDetails';

const getTrackingSteps = (currentStatus: string) => {
  const currentIndex = allTrackingSteps.findIndex(step => step.label === currentStatus);
  return allTrackingSteps.map((step, index) => ({
    ...step,
    completed: index <= currentIndex,
    isActive: index === currentIndex, // Mark the current step
  }));
};

const OrderDetails = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const lineAnimations = useRef(allTrackingSteps.map(() => new Animated.Value(0))).current;
  const scaleAnimations = useRef(allTrackingSteps.map(() => new Animated.Value(1))).current;
  const pulseAnimations = useRef(allTrackingSteps.map(() => new Animated.Value(1))).current;

  const orderStatus = 'Shipped';
  const trackingSteps = getTrackingSteps(orderStatus);

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

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="px-4 py-2 flex flex-row items-center justify-between border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="bg-primary-100 h-10 w-10 rounded-full flex items-center justify-center">
          <Image source={icons.backArrow} className="size-6" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Order #{id}</Text>
      </View>

      <View className="mt-5 px-5">
        <Text className="text-lg font-semibold mb-2">Order Information:</Text>
        <Text className="text-base text-gray-700">• Product Name: Example Product</Text>
        <Text className="text-base text-gray-700">• Quantity: 2</Text>
        <Text className="text-base text-gray-700">• Total Price: ₹200</Text>
      </View>

      <ScrollView contentContainerClassName="p-5 pb-32">
        <Text className="text-xl font-semibold mb-3">Tracking Status</Text>

        <View className="mt-5">
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
                    {step.completed ? '🚚' : step.id}
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
