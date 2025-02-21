import { View, Text, TouchableOpacity,Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTheme } from '@/contaxtapis/ThemeContext'
import { router } from 'expo-router'
import icons from '@/constants/icons'
const ProfileDetails = () => {
    const {bgColor, textColor} = useTheme();

  return (
    <SafeAreaView className='h-full' style = {{ backgroundColor: bgColor}}>
         <View className="px-4 py-2 flex flex-row  items-center justify-between">
            <TouchableOpacity style={{ borderColor: textColor, borderWidth: 1, backgroundColor: bgColor }}
                onPress={() => router.push('/profile')}
                className=" h-10 w-10  rounded-full flex items-center justify-center" >
                <Image source={icons.backArrow} className="size-6" tintColor={textColor}/>
            </TouchableOpacity>

            <Text className="text-xl font-rubik-medium mt-2" style={{ color: textColor }}>
                Profile
            </Text>     
         </View>    
        <View className='px-3 mt-5'>
          <Text className='text-lg' style={{color:textColor}}>welcome to my profile </Text>
          <Text className='text-2xl' style={{color:textColor}}> ProfileDetails</Text>
        </View>
    </SafeAreaView>
  )
}

export default ProfileDetails