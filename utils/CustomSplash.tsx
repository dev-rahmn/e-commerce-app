// CustomSplash.tsx
import React from "react";
import { View, Text, Image } from "react-native";
import LottieView from "lottie-react-native";
import Loading from '../assets/loader.json'
import images from "@/constants/images";
const CustomSplash = () => {
  return (
    <View className="flex-1 bg-white justify-center items-center">

      <LottieView
        source={Loading}
        autoPlay
        loop
        style={{ width: 300, height: 300 }} // you can also try className="w-48 h-48" if supported
      />
    </View>
  );
};

export default CustomSplash;
