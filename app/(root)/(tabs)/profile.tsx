import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Alert,
} from "react-native";
import React, { useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { settings } from "@/constants/data";
import { router } from "expo-router";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { clearCredentials } from "@/redux/slices/authSlice";
import { isAdminUser } from "@/constants/utils";
import { persistor } from "@/redux/store/store";

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
    const dispatch = useAppDispatch();
    const profile = useAppSelector((state) => state.auth.userProfile);
    const token = useAppSelector((state) => state.auth.token);
    const isAdmin = useMemo(() => isAdminUser(token), [token]);

    const [modalVisible, setModalVisible] = useState(false);

 
  const handleResult = async (result: boolean) => {
    setModalVisible(false); // Add your additional logic here based on the result.
     
    if(result){ // For example, if (result) { // confirmed action } else { // cancelled }
    dispatch(clearCredentials())
    // Optionally purge the persisted storage.
    persistor.purge();
    }
  };
  

  return (
    <SafeAreaView className={`h-full ${isAdmin ? 'bg-green-300' : 'bg-white'} `}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="pb-24 px-7"
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
             {profile?.fullName}
            </Text>
          </View>
        </View>
        <View className="flex flex-col mt-2">
          <Settingitem title='My Orders' icon={icons.myOrders} showArrow onPress={() =>router.push(`/order`)}/>

          {!isAdmin && <Settingitem title='My Addresses' icon={icons.address} showArrow onPress={() =>router.push(`/address`)}/>}

          <Settingitem title='Payments' icon={icons.wallet} showArrow/>
          
        </View>
        <View className="flex flex-col mt-2 border-t border-gray-200 pt-5">
          {settings.slice(2).map((item, index) => (
            <Settingitem key={index}
              {...item}
              showArrow
            />
          ))}
        </View>
        <View className="flex flex-col mt-3 border-t border-primary-200 pt-2">
         
            <Settingitem icon={icons.logout} title='Logout' onPress={() =>setModalVisible(true)} textStyle="text-danger"/>
         
        </View>
      </ScrollView>

      <ConfirmationDialog
      visible={modalVisible}
        title="Are you sure you want to log out?"
        message=" We'll miss you, but you can always come back later!"
      onResult={handleResult}
      />
    </SafeAreaView>
  );
};

export default Profile;
