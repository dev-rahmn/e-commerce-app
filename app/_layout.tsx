import { SplashScreen, Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store/store";
import Toast from "react-native-toast-message";
import { Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomSplash from "@/utils/CustomSplash";
import { ThemeProvider } from "@/contaxtapis/ThemeContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
  });

  
  // Animated values for fade, scale, and vertical translation.
  const fadeAnim = useRef(new Animated.Value(0)).current; // starts at opacity 0
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // starts smaller
  const translateY = useRef(new Animated.Value(20)).current; // starts 20px below

  useEffect(() => {
    if (fontsLoaded) {
      // Hide the splash screen when fonts are loaded
      SplashScreen.hideAsync();

      // Run the animations in parallel for a combined effect
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [fontsLoaded]);

  // While fonts (or other assets) are loading, display the loader animation.
  if (!fontsLoaded) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <CustomSplash />
      </SafeAreaView>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
            <Animated.View
                style={{
                  
                  flex: 1,
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }, { translateY: translateY }],
                }}>
              <Stack screenOptions={{ headerShown: false }} />
              <Toast />
            </Animated.View>
         </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}