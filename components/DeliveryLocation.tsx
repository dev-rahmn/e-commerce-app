import React, { useRef } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import icons from "@/constants/icons";
import BottomDrawer, { BottomDrawerRef } from "./BottomDrawer";
import ManageAddress from "@/app/(root)/manageAddress";
import { useAppSelector } from "@/redux/store/hooks";

const DeliveryLocation = () => {
  const selectedDeliveryAddress = useAppSelector(
    (state) => state.address.selectedDeliveryAddress
  );
  
  // Create a ref for BottomDrawer
  const drawerRef = useRef<BottomDrawerRef>(null);

  const onDeliverHandler = () => {
    if (drawerRef.current) {
      drawerRef.current.close();
    }
  };

  // Header component: show address details if available; otherwise, prompt to add an address.
  const Header = () => {
    // Use a type guard to check for properties on selectedDeliveryAddress.
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
      // If no address exists, show a view prompting the user to add an address.
      return (
        <TouchableOpacity
          className="py-2 rounded-lg items-center justify-center mt-2 border border-dashed border-gray-300"
          onPress={() => {
            // Optionally, you can open the drawer or navigate to the add address screen.
            // For example: drawerRef.current?.open();
          }}
        >
          <Text className="text-base text-black font-rubik-light">
            No address selected
          </Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <BottomDrawer ref={drawerRef} header={<Header />}>
      <ManageAddress
        // Optionally, you can pass a prop that shows add action when there’s no address.
        showAddAction={!selectedDeliveryAddress}
        disableScroll={true}
        onDeliverHandler={onDeliverHandler}
      />
    </BottomDrawer>
  );
};

export default DeliveryLocation;
