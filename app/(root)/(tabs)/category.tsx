import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import NoResults from "@/components/NoResults";
import { UIActivityIndicator } from "react-native-indicators";
import { Card, CategoryCard } from "@/components/Card";
import ManageCategoryModal from "@/modals/ManageCategoryModal";
import DeleteModal from "@/modals/DeleteModal";


const sampleItem = [
  { id: 1, name: "Cozy Studio"},
  { id: 2, name: "Rahul Boss" },
  { id: 3, name: "Rahul Kumar" },
  { id: 4, name: "Rahul Studio" },
  { id: 5, name: "Rahul Studio" },
  { id: 6, name: "Rahul Kumar" },
  { id: 7, name: "Rahul Studio" },
  { id: 8, name: "Rahul Studio" },
  { id: 21, name: "Rahul Kumar" },
  { id: 23, name: "Rahul Studio" },
  { id: 25, name: "Rahul Pandit" },
  { id: 95, name: "Rahul Studio"},
  { id: 233, name: "Rahul Boss" },
];
const Category = () => {
  const params = useLocalSearchParams();
  const searchedItem = params.query || '';
  const isAdmin = true;
  const loading = false;

  const [filteredItems, setFilteredItems] = useState(sampleItem);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [updatedCategory, setUpdatedCategory] = useState(null);

  useEffect(() => {
    const searchQuery = String(searchedItem || "").toLowerCase(); // Ensure searchedItem is a string
  
    const filtered = sampleItem.filter((item) => {
      const name = String(item.name || "").toLowerCase(); // Ensure item.name is a string
      return name.includes(searchQuery);
    });
  
    setFilteredItems(filtered);
  }, [searchedItem, sampleItem]);

  const addCategoryHandler = () => {
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    setDeleteModalVisible(true);
    console.log("Delete item with ID:", id);
    // Add your delete logic here
  };

  // Function to handle update action
  const handleUpdate = (item: any) => {
    setUpdatedCategory(item);
    setModalVisible(true);
    // Add your update logic here
  };

  const adminActions = (item: any) => ( isAdmin && (
    <View className="flex flex-row items-center gap-2">
      <TouchableOpacity
        className="bg-green-700 px-4 py-1 rounded-lg"
        onPress={() => handleUpdate(item)}
      >
        <Text className="text-white">Update</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-600 px-4 py-1 rounded-lg"
        onPress={() => handleDelete(item.id)}
      >
        <Text className="text-white">Delete</Text>
      </TouchableOpacity>
    </View>
  ));

  

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="px-4 py-2 flex flex-row  items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-primary-100 h-10 w-10  rounded-full flex items-center justify-center "
        >
          <Image source={icons.backArrow} className="size-6" />
        </TouchableOpacity>

        <Text className="text-xl font-rubik-medium text-black-300 mt-2">
          {isAdmin ? "Category Management" : "Category"}
        </Text>

        {isAdmin && (
          <TouchableOpacity
            onPress={addCategoryHandler}
            className="bg-primary-300 py-1 px-2 rounded-lg flex items-center justify-center "
          >
            <Text className="text-white font-rubik-medium">Add New</Text>
          </TouchableOpacity>
        )}
        {!isAdmin && <Image source={icons.bell} className="size-5" />}
      </View>

      <FlatList
        contentContainerClassName="pb-24"
        data={filteredItems}
        renderItem={({ item, index }) => (
          <CategoryCard item={item} adminActions={adminActions(item)} />
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          loading ? (
            <View className="flex-1  items-center justify-center mt-60">
              <UIActivityIndicator size={50} color="#0061FF" />
            </View>
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={
          <View className="px-2">
            <Search />
          </View>
        }
      />
      <ManageCategoryModal 
      visible={modalVisible} 
      category={updatedCategory}
      onClose={() => {setModalVisible(false),setUpdatedCategory(null)}} 
      />
    <DeleteModal 
    visible={isDeleteModalVisible}
    onClose={() => setDeleteModalVisible(false)}
    />
    </SafeAreaView>
  );
};

export default Category;
