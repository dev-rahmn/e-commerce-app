import { View, Text, ScrollView, FlatList, TouchableOpacity, Image, ActivityIndicator, BackHandler } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
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
import { useTheme } from '@/contaxtapis/ThemeContext'
import SkeletonLoader from '@/components/CustomSkeleton'
import { SkeletonOrderCard } from '@/skeletons'

const Order = () => {
    const dispatch =  useAppDispatch()
    const profile = useAppSelector((state) => state.auth.userProfile);
    const [refreshing, setRefreshing] = useState(false);

   const orders = useAppSelector((state: RootState) => state.order.orders)

   const {data,loading, error} = orders

   const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Dispatch your fetchOrders action using the user's profile id.
      // Adjust logic as needed if you want to refresh the orders list.
      if (profile?.userId) {
        await dispatch(fetchOrders(profile.userId));
      }
    } catch (error) {
      console.error('Error refreshing orders:', error);
    }
    setRefreshing(false);
  }, [dispatch, profile]);
  
   useEffect(() => {
    // Check if a userId exists and no orders data is present
    if (profile?.userId && (!data || data.length === 0)) {
      dispatch(fetchOrders(profile.userId));
    }
  }, [dispatch, profile, data]);

   useEffect(() => {
      const backAction = () => {
        router.push("/profile"); // Navigate to the previous screen
        return true; // Prevent default behavior (exiting the app)
      };
    
      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    
      return () => backHandler.remove(); // Cleanup the event listener
    }, []);

      // Get the selected category from URL params
        const params = useLocalSearchParams();
        const selectedCategory = params.filter || 'All';  // Default to 'All' if not set
        const searchItem = params.query  // Default to 'All' if not set

        const {bgColor, textColor , theme} = useTheme()
       
  
  return (
    <SafeAreaView className='h-full'   style={{ backgroundColor: bgColor }}>
         <View className='px-4 py-2 flex flex-row  items-center justify-between'>
              <View className='flex flex-row items-center gap-4'>
                <TouchableOpacity onPress={() => router.push('/profile')} 
                    className='h-10 w-10  rounded-full flex items-center justify-center '>
                    <Image source={icons.backArrow} className="size-6" tintColor={textColor}/>  
                    </TouchableOpacity>
                  <Text className={`text-xl font-rubik-base mt-2 text-${textColor}`}>My Orders</Text>
              </View> 
                <Image source={icons.bell} className="size-5" tintColor={textColor}/>
          </View>  

          {loading ? (
            <ScrollView showsVerticalScrollIndicator={false}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
            
          <SkeletonOrderCard className={`rounded-lg p-4 m-2 shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-black-200 shadow-black-100/70'}`} key={index}/>
          ))}
          </ScrollView>
          ) : (
            
              <View className="px-2">
                <FlatList 
                refreshing={refreshing}
                onRefresh={onRefresh}
                  contentContainerClassName='pb-24'
                  data={data}
                  renderItem={({item})=>             
                  <OrderCard item={item} onPress={() =>  router.push(`/orderDetails/${item.id}`)}/>

                  }
                  keyExtractor={(item) => item.id}
                  ListEmptyComponent={ 
                      <NoResults /> 
                    } 
                    
                    ListHeaderComponent={
                      <View >
                        <Search />
                      </View>
                    }
                />
              </View>
          )}

    </SafeAreaView>
  )
}

export default Order