import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import icons from "@/constants/icons";
import CustomInput from "@/components/CustomInput";
import { router } from "expo-router";
import { signinUser } from "@/redux/slices/authSlice";
import { useAppDispatch } from "./redux/store/hooks";
import Toast from 'react-native-toast-message'


const SignUp = () => {
  const dispatch = useAppDispatch()
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [enterType, setEnterType] = useState("USER");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmailHandler = () => {
    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return false;
    }

    setEmailError("");
    return true;
  };

  // Validate confirm password while typing
  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (!text) {
      setError(""); // Clear error when confirm password field is empty
    } else if (password && text !== password) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  const handleEmailChange = (text: string) => {
    setEmailError("");
    setEmail(text);
  };
  const handleSignUp = async () => {
    if (validateEmailHandler()) {
     
     const userData = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password,
        type: enterType,
      };
      try{

        const res = await dispatch(signinUser(userData)).unwrap()
        
         Toast.show({
          type: 'success', // can be 'success' or 'info'
          text1: ' Successfull',
          text2: res || "User SignUp successfully",
          position: 'top',
        });

        router.push('/')
      } catch(error : any){

        Toast.show({
          type: 'error', // can be 'success' or 'info'
          text1: ' Error occured when Signing Up',
          text2: error || "An error occurred while signing In",
          position: 'top',
        });
      }
    }
  };

  const isFormValid = () => {
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      !error
    );
  };

  return (
    <ImageBackground
      source={images.onboarding}
      className="flex-1"
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 bg-black/50">
        <View className="px-5 mt-3">
          <View className="flex flex-row justify-start items-center my-2">
            <TouchableOpacity
              className="flex flex-row items-center justify-center bg-white/30 rounded-full size-11"
              onPress={() => router.back()}
            >
              <Image source={icons.backArrow} className="size-6" />
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="px-6 pb-10 pt-20 bg-gradient-to-t from-black/80 to-transparent">
              <Text className="text-white text-4xl font-rubik-bold mb-2">
                Create Account
              </Text>
              <Text className="text-white/80 text-lg font-rubik-light mb-4">
                Join us and find your dream products
              </Text>

              <CustomInput
                labelColor="white"
                label="First Name"
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
              />

              <CustomInput
                labelColor="white"
                label="Last Name"
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
              />

              <CustomInput
                labelColor="white"
                label="Email"
                placeholder="Enter your email"
                value={email}
                error={emailError}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <CustomInput
                labelColor="white"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <CustomInput
                labelColor="white"
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry
                error={error}
              />

              <TouchableOpacity
                disabled={!isFormValid()}
                onPress={handleSignUp}
                className={`rounded-xl py-2 mb-2 mt-6 ${
                  !isFormValid() ? "bg-gray-400" : "bg-green-700"
                }`}
              >
                <Text className="text-white text-center font-rubik-bold text-lg">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SignUp;
