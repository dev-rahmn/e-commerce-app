import icons from "@/constants/icons";
import images from "@/constants/images";
import { Button, Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  item?: any;
  onPress?: () => void;
  adminActions?: JSX.Element;
}
interface CategoryProps {
  item?: any; // Include item properties
  adminActions: JSX.Element; // Function to render admin actions based on id
}

export const FeaturedCard = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-col items-start w-60 h-80 relative"
    >
      <Image source={images.japan} className="size-full rounded-2xl" />

      <Image
        source={images.cardGradient}
        className="size-full rounded-2xl absolute bottom-0"
      />

      <View className="flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5">
        <Image source={icons.star} className="size-3.5" />
        <Text className="text-xs font-rubik-bold text-primary-300 ml-1">
          4.4
        </Text>
      </View>

      <View className="flex flex-col items-start absolute bottom-5 inset-x-5">
        <Text
          className="text-xl font-rubik-extrabold text-white"
          numberOfLines={1}
        >
          Modern Apartment
        </Text>
        <Text className="text-base font-rubik text-white" numberOfLines={1}>
          {/* {item.address} */} 22 W 33rd St, New York
        </Text>

        <View className="flex flex-row items-center justify-between w-full">
          <Text className="text-xl font-rubik-extrabold text-white">
            {/* ${item.price} */} $2500
          </Text>
          <Image source={icons.heart} className="size-5" />

        </View>
      </View>
    </TouchableOpacity>
  );
};

export  const Card = ({ item, onPress, adminActions }: Props) => {
  return (
    <TouchableOpacity
      className="flex-1 w-full mt-2 px-3 py-3 rounded-lg bg-white shadow-lg shadow-black-100/70 relative"
      onPress={onPress}
    >
      <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
        <Image source={icons.star} className="size-2.5" />
        <Text className="text-xs font-rubik-bold text-primary-300 ml-0.5">
           4.8
        </Text>
      </View>

      <Image source={images.home} className="w-full h-40 rounded-lg" />

      <View className="flex flex-col mt-2">
        <Text className="text-base font-rubik-bold text-black-300">
          {/* {item.name} */} Cozy Studio
        </Text>
        <Text className="text-xs font-rubik text-black-100">
          {/* {item.address} */} 22 W 33rd St, New York
        </Text>

        <View className="flex flex-row items-center justify-between mt-2">
          <Text className="text-base font-rubik-bold text-primary-300">
            {/* ${item.price} */} $2200
          </Text>
          {adminActions}
          {!adminActions && <Image
            source={icons.heart}
            className="w-5 h-5 mr-2"
            tintColor="#191D31"
          />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const OrderCard = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity
      className="flex-1 w-full mt-2 px-4 py-3 rounded-lg bg-white shadow-lg shadow-black-100/70 relative"
      onPress={onPress}
    >


      <View className="flex flex-row items-center justify-between mt-2">
        {/* First View: Image */}
        <View className="flex flex-row items-center">
          <Image source={images.newYork} className="w-16 h-16 rounded-lg" />
        </View>

        {/* Second View: Name, Price, and Status */}
        <View className="flex-1 ml-3">
          <Text className="text-base font-rubik-bold text-black-300">
            Cozy Studio
          </Text>
          <Text className="text-xs font-rubik text-black-100">
            22 W 33rd St, New York
          </Text>
          <View className="flex flex-row items-center justify-between mt-2">
            <Text className="text-base font-rubik-bold text-primary-300">
              $2200
            </Text>
            <Text className="text-xs font-rubik text-green-500">Available</Text>
          </View>
        </View>

        {/* Third View: Right Arrow */}
        <View className="flex justify-center items-center ml-3">
          <Image source={icons.rightArrow} className="w-6 h-6" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const CategoryCard = ({ item, adminActions  }: CategoryProps) => {
  return (
    <View
      className="flex-1 w-full mt-2 px-4 py-3 rounded-lg bg-white shadow-lg shadow-black-100/70 relative"
    >


      <View className="flex flex-row items-center justify-between mt-2">
        {/* First View: Image */}
        <View className="flex flex-row items-center">
          <Image source={images.CategoryImg} className="w-16 h-16 rounded-lg" />
        </View>

        {/* Second View: Name, Price, and Status */}
        <View className="flex-1 ml-3">
          <Text className="text-xl font-rubik-bold text-black-300">
           {item.name}
          </Text>
          
          <View className="flex flex-row items-center justify-end mt-2">

           {/* Render adminActions here */}
           {adminActions}
          </View>
        </View>


      </View>
    </View>
  );
};