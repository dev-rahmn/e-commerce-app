import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform  } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import icons from '@/constants/icons'
import CustomInput from '@/components/CustomInput'
import { router } from 'expo-router'
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks'
import { RootState } from '@/redux/store/store'
import { loginUser } from '@/redux/slices/authSlice'
import Toast from 'react-native-toast-message'

/**
 * SignIn component provides a user interface for signing in to the application.
 * It includes input fields for email and password, and buttons for logging in 
 * with email/password or through Google. The background is set with an image and
 * various styling is applied to create a visually appealing layout.
 */

const LogIn = () => {

  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);

  const handleLogin = async () => {
    setloading(true)
    const data = { email, password };
   
    try {
      // Dispatch the loginUser thunk and wait for the result
      const response = await dispatch(loginUser(data)).unwrap();
      router.push('/');
    } catch (error : any) {
     
      Toast.show({
        type: 'error', // can be 'success' or 'info'
        text1: ' Error occured when Logining In',
        text2: error || "An error occurred while logging in",
        position: 'top',
      });
    }finally{
      setloading(false)
    }
  };

  const handleGoogleLogin = () => {
    router.push('/sign-up')
  }

  return (
    <ImageBackground 
      source={images.onboarding} 
      className="flex-1"
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 bg-black/50">
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
                    Welcome Back
                  </Text>
                  <Text className="text-white/80 text-lg font-rubik mb-8">
                    Find your perfect product with me
                  </Text>

                  <CustomInput labelColor='white'
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <CustomInput labelColor='white'
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />

                  <TouchableOpacity disabled={loading || !email || !password}
                    onPress={handleLogin}
                    className="bg-primary-300/30 backdrop-blur rounded-xl py-2 my-4 border border-primary-300"
                  >
                    {!loading ? (<Text className="text-white text-center font-rubik-bold text-lg">
                      Log In
                    </Text>) : (
                        <View className='flex flex-row items-center justify-center px-4'>
                            <Text className='text-white text-center font-rubik-medium text-lg'> Signing In </Text>
                          </View>
                    )}
                  </TouchableOpacity>

                  <View className="flex-row items-center my-4">
                    <View className="flex-1 h-[1px] bg-white/20" />
                    <Text className="text-white/60 mx-4 font-rubik">OR</Text>
                    <View className="flex-1 h-[1px] bg-white/20" />
                  </View>

                  <TouchableOpacity 
                    onPress={handleGoogleLogin} 
                    className="bg-white rounded-xl py-2 border border-primary-200"
                  >
                    <View className="flex-row items-center justify-center">
                      <Image 
                        source={icons.person} 
                        className="w-6 h-6" 
                        resizeMode="contain"
                      />
                      <Text className="text-black/70 font-rubik-medium text-lg ml-3">
                        Create New Account
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
              </KeyboardAvoidingView>
       
      </SafeAreaView>
    </ImageBackground>
  )
}


export default LogIn