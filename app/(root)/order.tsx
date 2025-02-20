import { View, Text, ScrollView, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {Card, FeaturedCard, OrderCard} from '@/components/Card'
import { UIActivityIndicator } from 'react-native-indicators'
import NoResults from '@/components/NoResults'
import Search from '@/components/Search'
import { useDebouncedCallback } from 'use-debounce';
import { router, useLocalSearchParams } from 'expo-router'
import Filters from '@/components/Filters'
import icons from '@/constants/icons'
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks'
import { RootState } from '@/redux/store/store'
import Loading from '@/utils/Loading'
import { fetchOrders } from '@/redux/slices/orderSlice'

const Order = () => {
    const dispatch =  useAppDispatch()
    const profile = useAppSelector((state) => state.auth.userProfile);

   const orders = useAppSelector((state: RootState) => state.order.orders)

   const {data,loading, error} = orders

  useEffect(() =>{
      if(profile?.userId){
        dispatch(fetchOrders(profile.userId))
      }
  },[dispatch, profile])

      // Get the selected category from URL params
        const params = useLocalSearchParams();
        const selectedCategory = params.filter || 'All';  // Default to 'All' if not set
        const searchItem = params.query  // Default to 'All' if not set

        useEffect(() => {
          console.log('Selected category:', selectedCategory);
        }, [selectedCategory]);

        useEffect(() => {
          console.log('searched Item:', searchItem);
        }, [searchItem]);


        if (loading) {
          return (
            <View className="flex-1 items-center justify-center ">
              <Loading />
            </View>
          );
        }
        
        if (error) {
          return (
            <View className="flex-1 items-center justify-center mt-24">
              <Text className="text-red-500 text-lg font-semibold">Something went wrong! Please try again.</Text>
            </View>
          );
        }      
  
  return (
    <SafeAreaView className='bg-white h-full'>
         <View className='px-4 py-2 flex flex-row  items-center justify-between'>
            <View className='flex flex-row items-center gap-4'>
              <TouchableOpacity onPress={() => router.push('/profile')} 
                  className='bg-primary-100 h-10 w-10  rounded-full flex items-center justify-center '>
                  <Image source={icons.backArrow} className="size-6" />  
                  </TouchableOpacity>
                <Text className='text-xl font-rubik-base text-black-300 mt-2'>My Orders</Text>
            </View> 
                     <Image source={icons.bell} className="size-5" />
                     </View>    
                     <View className="px-2">
                        <Search />
                      </View>
                    <FlatList 
                      contentContainerClassName='pb-24'
                      data={data}
                      renderItem={({item})=>             
                      <OrderCard item={item} onPress={() =>  router.push(`/orderDetails/${item.id}`)}/>

                      }
                      keyExtractor={(item) => item.id}
                      ListEmptyComponent={ 
                          <NoResults /> 
                        }  
                    />
    </SafeAreaView>
  )
}

export default Order