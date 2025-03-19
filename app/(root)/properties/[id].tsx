import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { isAdminUser } from "@/constants/utils";
import { useTheme } from "@/contaxtapis/ThemeContext";
import { getProductDetail } from "@/redux/slices/productSlice";
import { UIActivityIndicator } from "react-native-indicators";
import { BASE_URL } from "@/utils/app.constent";
import { BackHandler } from "react-native";

const Property = () => {
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id?: any }>();
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

 const productDetail =  useAppSelector((state) => state.products.productDetail);
 const { data, loading, error }  = productDetail
  const token = useAppSelector((state) => state.auth.token);
  const isAdmin = useMemo(() => isAdminUser(token), [token]);
  const { textColor, bgColor, theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const backAction = () => {
      router.push("/product"); // Navigate to the previous screen
      return true; // Prevent default behavior (exiting the app)
    };
  
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
  
    return () => backHandler.remove(); // Cleanup the event listener
  }, []);
  
  // Keep all hooks before any conditional return
  const desTextColor = useMemo(() => (theme === "light" ? "text-black-100" : "text-gray-400"), [theme]);
  const normalTextColor = useMemo(() => (theme === "light" ? "text-black" : "text-white"), [theme]);
  const detailBgColor = useMemo(() => (theme === "light" ? "bg-gray-200" : "bg-black-300"), [theme]);

  useEffect(() => {
    if (id) {

     const res = dispatch(getProductDetail(id)).unwrap();

    }
  }, [id, dispatch]);

  const productDetailInfo = useMemo(() => {
    return data?.product;
  }, [data?.product]);

   // Memoize the product images with full URLs
   const productImages = useMemo(() => {
    return productDetailInfo?.productImages?.map((img: string) => `${BASE_URL}/${img}`) || [];
  }, [productDetailInfo?.productImages]);

   // Memoized Image Component
   const MemoizedImage = React.memo(({ uri }: { uri: string }) => (
    <Image source={{ uri }} style={{ width: 400, height: windowHeight / 2 }} resizeMode="cover" />
  ));

  // Memoized renderItem to avoid unnecessary re-renders
  const renderItem = useCallback(({ item }: { item: string }) => {
    return <MemoizedImage uri={item} />;
  }, []);
   

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: bgColor }} testID="loading-indicator-0">
        <ActivityIndicator size={50} color="red" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: bgColor }}>
        <Text className="text-red-500 text-lg font-semibold">Something went wrong! Please try again.</Text>
        <Text className="text-red-500 text-lg font-light mt-10 underline">{error}</Text>

      </View>
    );
  }
  

  return (
    <View className="flex-1" style={{ backgroundColor: bgColor }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32"
      >
        {/* Image Slider Section */}
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
            <FlatList
            showsHorizontalScrollIndicator={true}
            data={productImages}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            initialNumToRender={5} // Reduce initial rendering items
            maxToRenderPerBatch={5} // Control batch rendering
            windowSize={5} // Optimize memory usage
            getItemLayout={(data, index) => ({
              length: 400, // Fixed width of the images
              offset: 400 * index, // Calculate position
              index,
            })}
          />
          <View
            className="z-50 absolute inset-x-7"
            style={{
              top: Platform.OS === "ios" ? 70 : 20,
            }}
          >
            {/* header row */}
            <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity
                onPress={() => router.push("/product")}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image
                  source={icons.backArrow}
                  className="size-5"
                  tintColor={textColor}
                />
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
        <View className={`p-5 mx-2 mt-5 rounded-lg ${detailBgColor}`}>
          <View className="flex flex-row items-center justify-between">
            <Text className={`text-xl font-rubik-bold ${normalTextColor}`}>
              {productDetailInfo?.name} 
            </Text>
            <Image source={icons.chat} className="size-7" />
          </View>
          <View className="flex flex-row items-center justify-between mt-2">
            <View className="flex flex-row items-center gap-2">
              {/* <Image
                source={icons.location}
                className="size-4"
                tintColor={textColor}
              /> */}
              <Text className="text-xs font-rubik text-black-100">
              Category - {productDetailInfo?.category?.categoryName} 
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2">
              <Image
                source={icons.star}
                className="size-4"
                tintColor={textColor}
              />
              <Text className="text-xs font-rubik text-black-100">4.4</Text>
            </View>
          </View>
        </View>
        {/* Description Section */}

        <View className="px-5 mt-10">
          <Text
            className={`text-md font-rubik-medium text-black-100 mt-4 ${desTextColor}`}
          >
            {productDetailInfo?.description} 
          </Text>
        </View>
        {/* Additional Property Features */}
        {/* <View className="mt-4 px-5 ">
              <Text className={`text-lg font-rubik-bold ${normalTextColor}`}>Additional Features</Text>
              <Text className={`text-sm font-rubik ${normalTextColor}`} >
                - 2 Bedrooms
              </Text>
              <Text className={`text-sm font-rubik ${normalTextColor}`} >
                - 1 Bathroom
              </Text>
              <Text className={`text-sm font-rubik ${normalTextColor}`} >
                - Fully Furnished
              </Text>
              <Text className={`text-sm font-rubik ${normalTextColor}`} >
                - High-Speed Internet
              </Text>
            </View> */}
      </ScrollView>

      {/* Bottom Buy Now Section */}
      <View
        className="absolute  bottom-0 w-full rounded-t-2xl border-t  border-gray-200 p-3 shadow-lg"
        style={{ backgroundColor: bgColor }}
      >
        <View className="flex flex-row items-center justify-between gap-24">
          <View className="flex flex-col items-start">
            <Text className={`text-xs font-rubik-medium ${desTextColor}`}>
              Price
            </Text>
            <Text
              numberOfLines={1}
              className="text-primary-300 text-start text-2xl font-rubik-bold"
            >
              ₹{productDetailInfo?.price}
            </Text>
          </View>
          {!isAdmin && (
            <TouchableOpacity
              className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400"
              onPress={() => router.push("/orderSummery")}
            >
              <Text className="text-white text-lg text-center font-rubik-bold">
                Buy Now
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default Property;
