import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect } from 'react'
import { router } from 'expo-router'
import icons from '@/constants/icons'
import ManageAddress from './manageAddress'
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks'
import { getAllAddresses } from '@/redux/slices/addressSlice'
import { useTheme } from '@/contaxtapis/ThemeContext'

const Address = () => {
   const profile = useAppSelector(state => state.auth.userProfile);
    const dispatch = useAppDispatch()
    
    const {bgColor, textColor} = useTheme()
    
   useEffect(() =>{
              if(profile?.type === 'USER'){
                  dispatch(getAllAddresses(profile?.userId))  
              }
        },[dispatch, profile])
  return (
    <SafeAreaView className="h-full" style={{ backgroundColor: bgColor }}>
                  <View className='h-full'>

                    <View className='flex p-4 flex-row items-center gap-4'>
                        <TouchableOpacity onPress={() => router.push('/profile')} style={{ borderColor: textColor, borderWidth: 1, backgroundColor: bgColor }}
                            className=' h-10 w-10  rounded-full  flex items-center justify-center '>
                            <Image source={icons.backArrow} className="size-6" tintColor={textColor}/>  
                            </TouchableOpacity>
                
                            <Text className={`text-xl font-rubik-base mt-2 text-${textColor}`}>Saved Address</Text>
                    </View>

                      <View>
                          <ManageAddress showAddAction={true} onDeliverHandler={() => router.push('/profile')} />
                      </View>   
                  </View>
    </SafeAreaView>

  )
}

export default Address