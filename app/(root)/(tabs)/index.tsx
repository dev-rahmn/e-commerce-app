import DeliveryLocation from "@/components/DeliveryLocation";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { isAdminUser } from "@/constants/utils";
import { useTheme } from "@/contaxtapis/ThemeContext";
import { useAppSelector } from "@/redux/store/hooks";
import { useFocusEffect } from "@react-navigation/native";
import { Link, router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View, Image, ScrollView, TouchableOpacity, BackHandler, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const profile = useAppSelector((state) => state.auth.userProfile);
     const token = useAppSelector((state) => state.auth.token);
      const isAdmin = useMemo(() => isAdminUser(token), [token]);
   const selectedDeliveryAddress = useAppSelector(
      (state) => state.address.selectedDeliveryAddress
    );
    
    const {bgColor, textColor} = useTheme();

    useFocusEffect(
      useCallback(() => {
        const backAction = () => {
          if (backPressedOnce) {
            BackHandler.exitApp();
            return true;
          }
  
          setBackPressedOnce(true);
          ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
  
          setTimeout(() => {
            setBackPressedOnce(false);
          }, 2000);
  
          return true;
        };
  
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
  
        return () => backHandler.remove();
      }, [backPressedOnce])
    );
  function getGreeting() {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 0 && hours < 12) {
      return "Good Morning!";
    } else if (hours >= 12 && hours < 18) {
      return "Good Afternoon!";
    } else {
      return "Good Evening!";
    }
  }

  return (
    <SafeAreaView className="h-full" style={{ backgroundColor: bgColor }}>{/* greeting section */}
      <View className="px-2"> 
        <View className="flex flex-row items-center justify-between mt-5">
          <View className="flex flex-row items-center">
            <TouchableOpacity  onPress={() =>router.push(`/profile`)}>
            <Image source={images.avatar} className="size-12 rounded-full" />

            </TouchableOpacity>
            <View className="flex flex-col items-start ml-2 justify-center">
              <Text className="text-xs font-rubik-medium text-black-100">
                {getGreeting()}
              </Text>
              <Text className={`text-xs font-rubik-medium text-${textColor}`}>
                {profile?.fullName}
              </Text>
            </View>
          </View>
          <Image source={icons.bell} className="size-5" tintColor={textColor}/>
        </View>
      </View>
    {selectedDeliveryAddress && !isAdmin && <DeliveryLocation />}
      <ScrollView 
       contentContainerClassName="pb-24 px-4"
       showsVerticalScrollIndicator={false}
       >
        {/* Quick Actions */}
        <View className="mt-6 flex flex-row gap-2 justify-between">
          <TouchableOpacity className="bg-blue-500 p-4 rounded-lg w-1/3 items-center">
            <Image source={icons.home} className="size-6" />
            <Text className="text-white mt-2">Home</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-green-500 p-4 rounded-lg w-1/3 items-center">
            <Image source={icons.search} className="size-6" />
            <Text className="text-white mt-2">Search</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-red-500 p-4 rounded-lg w-1/3 items-center">
            <Image source={icons.bell} className="size-6" />
            <Text className="text-white mt-2">Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Section */}
        <View className="mt-4">
          <Text className="text-lg font-bold">Featured Items</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} className=" py-4">
            <Image source={images.home} className="w-40 h-24 rounded-lg mr-4" />
            <Image source={images.home} className="w-40 h-24 rounded-lg mr-4" />
            <Image source={images.home} className="w-40 h-24 rounded-lg" />
          </ScrollView>
        </View>

        {/* Latest News */}
        <View className="mt-4">
          <Text className="text-lg font-bold">Latest News</Text>
          <View className="mt-4 bg-gray-100 p-4 rounded-lg">
            <Text className="text-black font-medium">New Update Available!</Text>
            <Text className="text-gray-600 text-sm mt-1">Check out the latest features and improvements in our new update.</Text>
          </View>
          <View className="mt-4 bg-gray-100 p-4 rounded-lg">
            <Text className="text-black font-medium">Special Discount This Week</Text>
            <Text className="text-gray-600 text-sm mt-1">Get 20% off on all premium features until Sunday.</Text>
          </View>
        </View>
        

        {/* Call-to-Action Banner */}
        <View className="mt-3 bg-purple-500 p-6 rounded-lg items-center">
          <Text className="text-white text-lg font-semibold">Upgrade to Premium!</Text>
          <Text className="text-white text-sm mt-2 text-center">
            Unlock all features and enjoy an ad-free experience.
          </Text>
          <TouchableOpacity className="mt-4 bg-white px-6 py-2 rounded-full">
            <Text className="text-purple-500 font-bold">Upgrade Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
