// Loading.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import loading from "../assets/Animation.json";

const Loading = () => {
  return (
    
      <LottieView
        source={loading}
        autoPlay
        loop
        resizeMode="contain"
        style={{ width: 600, height: 200 }}
      />
 
  );
};




export default Loading;
