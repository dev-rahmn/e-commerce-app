// DeliveryLocation.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Image } from "react-native";
import icons from "@/constants/icons";
import BottomDrawer, { BottomDrawerRef } from "./BottomDrawer";
import ManageAddress from "@/app/(root)/manageAddress";
import { useAppSelector } from "@/redux/store/hooks";

const DeliveryLocation = () => {
     const selectedDeliveryAddress = useAppSelector(state => state.address.selectedDeliveryAddress);
    
  // Create a ref for BottomDrawer
  const drawerRef = useRef<BottomDrawerRef>(null);
useEffect(() =>{

    console.log('selectedDeliveryAddress',selectedDeliveryAddress)
} ,[])

const { buildingName, roadName,type,  } = selectedDeliveryAddress || {};
  // Header Component to open the drawer
  const Header = () => {
    return (
      <View className=" py-2 rounded-lg flex-row items-center justify-between mt-2 border border-dashed border-gray-300">
        <View className="flex flex-row px-1 items-center">
       {(type === 'home') ? <Image source={icons.home} className="w-5 h-5 mr-2" /> : <Image source={icons.work} className="w-5 h-5 mr-2" />}
        <Text className="text-base px-2 py-1 bg-gray-200 text-black  font-rubik-bold  rounded-lg">{type}</Text>
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
  };

  const onDeliverHandler = () => {
    if (drawerRef.current) {
      drawerRef.current.close();
    }
  };

  return (
    <BottomDrawer
      ref={drawerRef}
      header={
      
      <Header />
    }
     
    >
      <ManageAddress
        showAddAction={false}
        disableScroll={true}
        onDeliverHandler={onDeliverHandler}
      />
    </BottomDrawer>
  );
};

export default DeliveryLocation;
