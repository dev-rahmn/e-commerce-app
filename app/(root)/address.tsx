import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect } from 'react'
import { router } from 'expo-router'
import icons from '@/constants/icons'
import ManageAddress from './manageAddress'
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks'
import { getAllAddresses } from '@/redux/slices/addressSlice'

const Address = () => {
   const profile = useAppSelector(state => state.auth.userProfile);
    const dispatch = useAppDispatch()
    
   useEffect(() =>{
              if(profile?.type === 'USER'){
                  dispatch(getAllAddresses(profile?.userId))  
              }
        },[dispatch, profile])
  return (
    <SafeAreaView className="h-full bg-white">
                  <View className='h-full'>

                    <View className='flex px-4 flex-row items-center gap-4'>
                        <TouchableOpacity onPress={() => router.push('/profile')} 
                            className='bg-primary-100 h-10 w-10  rounded-full flex items-center justify-center '>
                            <Image source={icons.backArrow} className="size-6" />  
                            </TouchableOpacity>
                
                            <Text className='text-xl font-rubik-base text-black-300 mt-2'>Saved Address</Text>
                    </View>

                      <View>
                          <ManageAddress showAddAction={true} onDeliverHandler={() => router.push('/profile')} />
                      </View>   
                  </View>
    </SafeAreaView>

  )
}

export default Address