import { View, Text, Image, TouchableOpacity, ScrollView, Platform, Dimensions, FlatList } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/constants/icons';
import images from '@/constants/images';
import { useAppSelector } from '@/redux/store/hooks';
import { isAdminUser } from '@/constants/utils';

const Property = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const windowHeight = Dimensions.get("window").height;

    const token = useAppSelector((state) => state.auth.token);
      const isAdmin = useMemo(() => isAdminUser(token), [token]);
  
 const data =[
  { id: 1, image: images.onboarding },
  { id: 2, image: images.japan },
  { id: 3, image: images.home },
  { id: 4, image: images.noResult },
]

  return (
    <View className="flex-1 bg-white">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32"
      >
        {/* Image Slider Section */}
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <FlatList
           showsHorizontalScrollIndicator={true}
            data={data}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            // contentContainerStyle={{ paddingHorizontal: 10 }} // add this line
            renderItem={({ item,index }) => (
             
                <Image key={index} 
                  source={item.image}
                  style={{ width: 400, height: windowHeight / 2}}
                  resizeMode="cover"
                />
           
            )}
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full z-40"
          />

          <View
            className="z-50 absolute inset-x-7"
            style={{
              top: Platform.OS === "ios" ? 70 : 20,
            }}
          >
            <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity
                onPress={() => router.push('/product')}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              <View className="flex flex-row items-center gap-3">
                <Image
                  source={icons.heart}
                  className="size-7"
                  tintColor={"#191D31"}
                />
                <Image source={icons.send} className="size-7" />
              </View>
            </View>
          </View>
        </View>

        {/* Property Details Section */}
        <View className="px-5 mt-5">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-xl font-rubik-bold">Cozy Studio</Text>
            <Image source={icons.chat} className="size-7" />
          </View>
          <View className="flex flex-row items-center justify-between mt-2">
            <View className="flex flex-row items-center gap-2">
              <Image
                source={icons.location}
                className="size-4"
                tintColor={"#191D31"}
              />
              <Text className="text-xs font-rubik text-black-100">
                22 W 33rd St, New York
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2">
              <Image
                source={icons.star}
                className="size-4"
                tintColor={"#191D31"}
              />
              <Text className="text-xs font-rubik text-black-100">4.4</Text>
            </View>
          </View>

          {/* Description Section */}
          <Text className="text-md font-rubik-medium text-black-100 mt-4">
            This cozy studio is located in the heart of New York, featuring modern amenities and a stylish interior. Perfect for a comfortable stay!
          </Text>

          {/* Additional Property Features */}
          <View className="mt-4">
              <Text className="text-lg font-rubik-bold">Additional Features</Text>
              <Text className="text-sm font-rubik text-black-100">
                - 2 Bedrooms
              </Text>
              <Text className="text-sm font-rubik text-black-100">
                - 1 Bathroom
              </Text>
              <Text className="text-sm font-rubik text-black-100">
                - Fully Furnished
              </Text>
              <Text className="text-sm font-rubik text-black-100">
                - High-Speed Internet
              </Text>
            </View>
        </View>
      </ScrollView>   

      {/* Bottom Buy Now Section */}
      <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-3 shadow-lg">
        <View className="flex flex-row items-center justify-between gap-24">
          <View className="flex flex-col items-start">
            <Text className="text-black-200 text-xs font-rubik-medium">
              Price
            </Text>
            <Text
                numberOfLines={1} className="text-primary-300 text-start text-2xl font-rubik-bold">
                $800
            </Text>
          </View>
            {!isAdmin && (
              
          <TouchableOpacity className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400"
          onPress={() => router.push('/orderSummery')}>
            <Text className="text-white text-lg text-center font-rubik-bold">
              Buy Now
            </Text>
          </TouchableOpacity>
            )}
        </View>
      </View>
    </View>
  )
}

export default Property;
