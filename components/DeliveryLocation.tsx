import React, { useRef } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import icons from "@/constants/icons";
import BottomDrawer, { BottomDrawerRef } from "./BottomDrawer";
import ManageAddress from "@/app/(root)/manageAddress";
import { useAppSelector } from "@/redux/store/hooks";

const DeliveryLocation = () => {
  // Destructure the selectedDeliveryAddress state: data, loading, and error.
  const { data, loading, error } = useAppSelector(
    (state) => state.address.selectedDeliveryAddress
  );
  const selectedDeliveryAddress = data;
  
  // Create a ref for BottomDrawer.
  const drawerRef = useRef<BottomDrawerRef>(null);

  const onDeliverHandler = () => {
    if (drawerRef.current) {
      drawerRef.current.close();
    }
  };

  // Header component: Display a message if loading or error, else show address details or a prompt.
  const Header = () => {
    if (loading) {
      return (
        <View className="py-2 rounded-lg flex-row items-center justify-center mt-2 border border-dashed border-gray-300">
          <Text className="text-base text-black font-rubik-light">
            Location is updating...
          </Text>
        </View>
      );
    }
    if (error) {
      return (
        <View className="py-2 rounded-lg flex-row items-center justify-center mt-2 border border-dashed border-gray-300">
          <Text className="text-base text-red-600 font-rubik-light">
            {error}
          </Text>
        </View>
      );
    }
    if (selectedDeliveryAddress && "buildingName" in selectedDeliveryAddress) {
      const { buildingName, roadName, type } = selectedDeliveryAddress;
      return (
        <View className="py-2 rounded-lg flex-row items-center justify-between mt-2 border border-dashed border-gray-300">
          <View className="flex flex-row px-1 items-center">
            {type === "home" ? (
              <Image source={icons.home} className="w-5 h-5 mr-2" />
            ) : (
              <Image source={icons.work} className="w-5 h-5 mr-2" />
            )}
            <Text className="text-base px-2 py-1 bg-gray-200 text-black font-rubik-bold rounded-lg">
              {type}
            </Text>
          </View>
          <Text
            className="text-base text-black font-rubik-light flex-1 mx-2"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {buildingName}, {roadName}
          </Text>
          <Image source={icons.rightArrow} className="w-5 h-5" />
        </View>
      );
    } else {
      null
    }
  };

  return (
    <BottomDrawer ref={drawerRef} header={<Header />}>
      <ManageAddress
        // If no address is selected, show the add action.
        showAddAction={!selectedDeliveryAddress}
        disableScroll={true}
        onDeliverHandler={onDeliverHandler}
      />
    </BottomDrawer>
  );
};

export default DeliveryLocation;
