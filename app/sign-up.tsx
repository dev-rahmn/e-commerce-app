import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import icons from '@/constants/icons'
import CustomInput from '@/components/CustomInput'
import { router } from 'expo-router'


const SignUp = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmailHandler = () => {

    if (!validateEmail(email)) {

      setEmailError('Invalid email format');
      return false;
    }
   
    setEmailError('');
    return true;
  };

  // Validate confirm password while typing
  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (!text) {
        setError('');  // Clear error when confirm password field is empty
      } else if (password && text !== password) {
        setError('Passwords do not match');
      } else {
        setError('');
      }
  };

const handleEmailChange = (text: string) => {
    setEmailError('');
  setEmail(text);
}
  const handleSignUp = () => {
     if (validateEmailHandler()) {
    const data = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    };
    console.log('SignUp data', data);
  }
    
  }

  const isFormValid = () => {
    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
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
        <View className='px-5'>
          <View className='flex flex-row justify-start items-center my-2'>
            <TouchableOpacity  
              className='flex flex-row items-center justify-center bg-white/30 rounded-full size-11'
              onPress={() => router.back()}
            >
              <Image 
                source={icons.backArrow}
                className="size-6"
              />
            </TouchableOpacity> 
          </View>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="px-6 pb-10 pt-20 bg-gradient-to-t from-black/80 to-transparent">
              <Text className="text-white text-4xl font-rubik-bold mb-2">
                Create Account
              </Text>
              <Text className="text-white/80 text-lg font-rubik-light mb-4">
                Join us and find your dream home
              </Text>

              <CustomInput
                label="First Name"
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
              />

              <CustomInput
                label="Last Name"
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
              />

              <CustomInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                error={emailError}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <CustomInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <CustomInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry
                error= {error}
              />

              <TouchableOpacity disabled={!isFormValid()}
                onPress={handleSignUp}
                className={`rounded-xl py-4 mb-2 mt-6 ${!isFormValid() ? 'bg-gray-400' : 'bg-primary-200'}`}
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
  )
}

export default SignUp
