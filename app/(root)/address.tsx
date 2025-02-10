import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import icons from '@/constants/icons'
import ManageAddress from './manageAddress'

const Address = () => {
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