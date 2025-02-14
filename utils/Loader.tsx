// Loader.tsx
import React from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";

import Loading from "../assets/loader.json";
const Loader = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LottieView
        source={Loading} // adjust the path as needed
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
};

export default Loader;
