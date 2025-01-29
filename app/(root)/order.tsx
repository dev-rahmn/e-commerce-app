import { View, Text, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native'
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

const Order = () => {
    const loading = false

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
                    <FlatList 
                      contentContainerClassName='pb-24'
                      data={[1,2,3,4,5,6,7,]}
                      renderItem={({item})=>             
                        <OrderCard  onPress={() =>  router.push(`/orderDetails/${item}`)}/>

                      }
                      keyExtractor={(item) => item.toString()}
                      ListEmptyComponent={
                          loading ? (
                          <View className="flex-1  items-center justify-center mt-60">  
                            <UIActivityIndicator size={50} color="#0061FF"/>
                          </View>
                        ) : (
                          <NoResults />
                        )
                        }
                        ListHeaderComponent={
                          <View className="px-2">

                              <Search />

                              {/* <Filters /> */}
                          </View>
                        }
                    />
    

    </SafeAreaView>
  )
}

export default Order