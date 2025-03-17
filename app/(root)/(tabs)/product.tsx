import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, FeaturedCard } from "@/components/Card";
import { UIActivityIndicator } from "react-native-indicators";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import { router, useLocalSearchParams } from "expo-router";
import Filters from "@/components/Filters";
import icons from "@/constants/icons";

import AddProductModal from "@/modals/AddProductModal";
import DeleteModal from "@/modals/DeleteModal";
import { useTheme } from "@/contaxtapis/ThemeContext";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { isAdminUser } from "@/constants/utils";
import { RootState } from "@/redux/store/store";
import { getCategories } from "@/redux/slices/categorySlice";
import { getAllProducts } from "@/redux/slices/productSlice";

const Product = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filteredData, setFilteredData] = useState<any[]>([]); // Filtered product data
  const { bgColor, textColor } = useTheme();
  const {
    categories,
    loading: categoryLoading,
    error: categoryError,
  } = useAppSelector((state: RootState) => state.category);
  const { data, loading, error } = useAppSelector(
    (state: RootState) => state.products.productList
  );

  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const selectedCategory = params.filter || "All"; 
  const searchedItem = params.query;

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (data.length > 0) {
      setFilteredData(data);
    }
  }, [data]);

  useEffect(() => {
    let filtered = data;
    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (item) => item.categoryId === selectedCategory
      );
    }

    // Apply search filter
    const searchQuery = String(searchedItem || "").toLowerCase();
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        String(item.name || "")
          .toLowerCase()
          .includes(searchQuery)
      );
    }
    setFilteredData(filtered);
  }, [searchedItem, selectedCategory, data]);

  const token = useAppSelector((state) => state.auth.token);
  const isAdmin = useMemo(() => isAdminUser(token), [token]);
  //  const isAdmin = true;

  const addProductHandler = () => {
    setModalVisible(true);
    console.log("clicked add product");
  };

  // const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];  // Example data (9 items)

  const handleDelete = (id: number) => {
    setDeleteModalVisible(true);
    setSelectedId(id); // Store ID in state
  };

  // Function to handle update action
  const handleUpdate = (item: any) => {
    setUpdatedProduct(item);
    setModalVisible(true);
    // Add your update logic here
  };

  const adminActions = (item: any) =>
    isAdmin ? (
      <View className="flex flex-row items-center gap-2">
        <TouchableOpacity
          className="border border-green-400 px-1 py-1 rounded-lg"
          onPress={() => handleUpdate(item)}
        >
          {/* <Text className="text-white">Update</Text> */}
          <Image source={icons.editLogo} className="size-5" />
        </TouchableOpacity>
        <TouchableOpacity
          className="border border-red-400 px-1 py-1 rounded-lg"
          onPress={() => handleDelete(item.id)}
        >
          <Image source={icons.deleteLogo} className="size-5" />
        </TouchableOpacity>
      </View>
    ) : null;

  const handleModalClose = (deleteConfirmed: boolean) => {
    setDeleteModalVisible(false); // Close modal

    if (deleteConfirmed && selectedId !== null) {
      console.log("Item deleted!", selectedId); // Perform delete action here
    }
  };
  return (
    <SafeAreaView className="h-full" style={{ backgroundColor: bgColor }}>
      <View className="px-4 py-2 flex flex-row  items-center justify-between">
        <TouchableOpacity
          style={{ backgroundColor: bgColor }}
          onPress={() => router.back()}
          className=" h-10 w-10  rounded-full flex items-center justify-center"
        >
          <Image
            source={icons.backArrow}
            className="size-6"
            tintColor={textColor}
          />
        </TouchableOpacity>

        <Text
          className="text-xl font-rubik-medium mt-2"
          style={{ color: textColor }}
        >
          {isAdmin ? "Product Management" : "Product List"}
        </Text>

        {isAdmin && (
          <TouchableOpacity
            onPress={addProductHandler}
            className="bg-primary-300 py-1 px-2 rounded-lg flex items-center justify-center "
          >
            <Text className="text-white font-rubik-medium">Add New</Text>
          </TouchableOpacity>
        )}
        {!isAdmin && (
          <Image source={icons.bell} className="size-5" tintColor={textColor} />
        )}
      </View>
      <FlatList
        columnWrapperClassName="flex gap-3  px-2"
        numColumns={2}
        contentContainerClassName="pb-24"
        data={filteredData}
        renderItem={({ item, index }) => (
          <Card
            key={index}
            onPress={() => router.push(`/properties/${item.id}`)}
            item={item}
            adminActions={adminActions(item)}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          loading && categoryLoading ? (
            <View className="flex-1  items-center justify-center mt-60">
              <ActivityIndicator size={50} color="red" />
            </View>
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={
          <View className="px-2">
            <Search />

            {!isAdmin && (
              <Filters
                items={categories?.map((category) => ({
                  id: String(category.id),
                  name: category.name,
                }))}
              />
            )}
          </View>
        }
      />
      <AddProductModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        categories={categories}
      />
      <DeleteModal visible={isDeleteModalVisible} onClose={handleModalClose} />
    </SafeAreaView>
  );
};

export default Product;
