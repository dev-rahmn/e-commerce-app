import icons from "@/constants/icons";
import images from "@/constants/images";
import { Link } from "expo-router";
import { Text, View,Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  function getGreeting() {
    const now = new Date(); // Get the current date and time
    const hours = now.getHours(); // Extract the hour from the current time
  
    if (hours >= 0 && hours < 12) {
      return "Good Morning!";
    } else if (hours >= 12 && hours < 18) {
      return "Good Afternoon!";
    } else {
      return "Good Evening!";
    }
  }
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="px-5">
        <View className="flex flex-row items-center justify-between mt-5">
          <View className="flex flex-row items-center">
            <Image
              source={images.avatar}
              className="size-12 rounded-full"
            />
            <View className="flex flex-col items-start ml-2 justify-center">
              <Text className="text-xs font-rubik-medium text-black-100">
                {getGreeting()}
              </Text>
              <Text className="text-xs font-rubik-medium text-black-300">
                Atiqur Rahman
              </Text>
            </View>
          </View>
          <Image source={icons.bell} className="size-5" />
        </View>
      </View>
       
    </SafeAreaView>
    
  );
}
{/* <Link href='/category'>Category</Link>
      <Link href='/product'>Product</Link>
      <Link href='/profile'>Profile</Link>
      <Link href='/sign-in'>Sign In</Link>
      <Link href='/sign-up'>Sign Up</Link>
      <Link href='/properties/1'>Property</Link> */}