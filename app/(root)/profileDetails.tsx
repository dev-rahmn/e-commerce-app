import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import { useAppSelector } from '@/redux/store/hooks';
import { useTheme } from '@/contaxtapis/ThemeContext';
import { router } from 'expo-router';
import icons from '@/constants/icons';

const ProfileDetails = () => {
    const { bgColor, textColor,theme } = useTheme();
    const profile = useAppSelector((state) => state.auth.userProfile);

    const rotate = useSharedValue(0);
    const scale = useSharedValue(1);
    const [flipped, setFlipped] = useState(false);


       useEffect(() => {
          const backAction = () => {
            router.push("/profile"); // Navigate to the previous screen
            return true; // Prevent default behavior (exiting the app)
          };
        
          const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        
          return () => backHandler.remove(); // Cleanup the event listener
        }, []);

    // Flip Animation - Rotates 360°
    const flipCard = () => {
        rotate.value = withTiming(flipped ? 0 : 360, { duration: 1800 });
        scale.value = withTiming(0.10, { duration: 200 }, () => {
            scale.value = withTiming(1, { duration: 200 });
        });
        setFlipped(!flipped);
    };


    useEffect(() =>{
            flipCard();
    },[profile])
    // Card Animation
    const cardStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${rotate.value}deg` }, { scale: scale.value }],
    }));

    return (
        <SafeAreaView className="h-full items-center justify-center" style={{ backgroundColor: bgColor }}>
            {/* Header */}
            <View className="absolute top-4 left-4 flex flex-row items-center">
                <TouchableOpacity 
                    style={{ borderColor: textColor, borderWidth: 1, backgroundColor: bgColor }}
                    onPress={() => router.push('/profile')}
                    className="h-10 w-10 rounded-full flex items-center justify-center">
                    <Image source={icons.backArrow} className="size-6" tintColor={textColor} />
                </TouchableOpacity>

                <Text className="text-xl font-rubik-medium ml-4" style={{ color: textColor }}>
                    Profile
                </Text>
            </View>

            {/* Flip Card with More Height & 360° Rotation */}
            <TouchableWithoutFeedback onPress={flipCard}>
            <Animated.View 
                className="w-80 h-64 bg-blue-400 rounded-2xl items-center justify-center p-6"
                style={[
                    cardStyle,
                    {
                    // Conditionally set the shadow color based on the theme
                    shadowColor: bgColor === 'back' ? 'green' : 'gray',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.5,
                    shadowRadius: 4,
                    elevation: 5, // For Android shadow
                    },
                ]}
                >
                <Image 
                    source={{ uri: 'https://via.placeholder.com/100https://img.freepik.com/free-vector/smiling-redhaired-boy-illustration_1308-175803.jpg' }} 
                    className="size-20 rounded-full" 
                />
                <Text className="text-xl font-bold text-white mt-3">
                    {profile?.fullName || "User Name"}
                </Text>
                <Text className="text-sm text-gray-200">Email: {profile?.email}</Text>
                <Text className="text-sm text-gray-200">User ID: {profile?.userId}</Text>
                <Text className="text-sm text-gray-200">Type: {profile?.type}</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default ProfileDetails;
