import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Alert,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { settings } from "@/constants/data";
import { router } from "expo-router";

  interface SettingItemProps {
    title: string;
    icon: ImageSourcePropType;
    onPress?: () => void;
    textStyle?: string;
    showArrow?: boolean;
  }

  const Settingitem = ({
    title,
    icon,
    onPress,
    textStyle,
    showArrow }: SettingItemProps) => (
                <TouchableOpacity onPress={onPress} className="flex flex-row items-center justify-between py-3">
                  <View className="flex flex-row items-center gap-3">
                    <Image source={icon} className="size-6"/>
                    <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>{title}</Text>
                  </View>
                  {showArrow && (<Image source={icons.rightArrow} className="size-5" />)}
                </TouchableOpacity>
              )

  const Profile = () => {     
  
  let isAdmin = false
  const handleLogout = async () => {
    console.log("clicked")
    
  };
  
  const myOrderHandler = () =>{
    router.push(`/order`)
  }
  const myAddressHandler = () =>{
    router.push(`/address`)
  }

  return (
    <SafeAreaView className={`h-full ${isAdmin ? 'bg-green-300' : 'bg-white'} `}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold">Profile</Text>
          <Image source={icons.bell} className="size-5" />
        </View>
        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image
              source={images.avatar}
              className="size-44 relative rounded-full"
            />
            <View className={`absolute top-[-15] right-[-20] px-4 py-2  rounded-lg ${isAdmin ? 'bg-white' : 'bg-green-300'}`}>

              <Text className="text-sm font-rubik-medium uppercase">{isAdmin ? 'admin' : 'user'}</Text>
            </View>
            <TouchableOpacity className="absolute bottom-11 right-2">
              <Image source={icons.edit} className="size-9" />
            </TouchableOpacity>

            <Text className="text-2xl font-rubik-bold mt-2">
              Atiqur | Rahman
            </Text>
          </View>
        </View>
        <View className="flex flex-col mt-5">
          <Settingitem title='My Orders' icon={icons.myOrders} showArrow onPress={myOrderHandler}/>

          {!isAdmin && <Settingitem title='My Addresses' icon={icons.address} showArrow onPress={myAddressHandler}/>}

          <Settingitem title='Payments' icon={icons.wallet} showArrow/>
          
        </View>
        <View className="flex flex-col mt-5 border-t border-gray-200 pt-5">
          {settings.slice(2).map((item, index) => (
            <Settingitem key={index}
              {...item}
              showArrow
            />
          ))}
        </View>
        <View className="flex flex-col mt-5 border-t border-primary-200 pt-2">
         
            <Settingitem icon={icons.logout} title='Logout' onPress={handleLogout} textStyle="text-danger"/>
         
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
