import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import NoResults from "@/components/NoResults";
import { UIActivityIndicator } from "react-native-indicators";
import { Card, CategoryCard } from "@/components/Card";
import ManageCategoryModal from "@/modals/ManageCategoryModal";
import DeleteModal from "@/modals/DeleteModal";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { deleteCategory, getCategories } from "@/redux/slices/categorySlice";
import { RootState } from "@/redux/store/store";
import Toast from "react-native-toast-message";
import Loading from "@/utils/Loading";
import { useTheme } from "@/contaxtapis/ThemeContext";
import { isAdminUser } from "@/constants/utils";


const Category = () => {
  const params = useLocalSearchParams();
  const searchedItem = params.query || '';

const dispatch = useAppDispatch();
const {categories, loading, error} = useAppSelector((state: RootState) => state.category);

  const isAdmin = true;
     const token = useAppSelector((state) => state.auth.token);
      // const isAdmin = useMemo(() => isAdminUser(token), [token]);
  
    const {bgColor, textColor} = useTheme();
  const [filteredItems, setFilteredItems] = useState(categories);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [updatedCategory, setUpdatedCategory] = useState(null);
  const [selectedId, setSelectedId] = useState<number | null>(null); // Store ID of selected item

  useEffect(() => {
    const searchQuery = String(searchedItem || "").toLowerCase(); // Ensure searchedItem is a string
    const filtered = categories.filter((item) => {
      const name = String(item.name || "").toLowerCase(); // Ensure item.name is a string
      return name.includes(searchQuery);
    });
    setFilteredItems(filtered);
  }, [searchedItem, categories]);

  useEffect(() =>{
      dispatch(getCategories())
      },[dispatch])

  const addCategoryHandler = () => {
    setUpdatedCategory(null);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    setDeleteModalVisible(true);
    setSelectedId(id); // Store ID in state
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

  const handleModalClose = async (deleteConfirmed: boolean) => {
   
       setDeleteModalVisible(false); // Close modal
    if (deleteConfirmed && selectedId !== null) {  
    const res = await dispatch(deleteCategory(selectedId)).unwrap()
    if (res){

        Toast.show({
                  type: 'info', // can be 'success' or 'info'
                  text1: res,
                  position: 'top',
                  topOffset:10,
                  visibilityTime:2000
                });
    }
    }
  };

  return (
    <SafeAreaView className="h-full" style={{ backgroundColor: bgColor }}
    
    >
      <View className="px-4 py-2 flex flex-row  items-center justify-between">
        <TouchableOpacity style={{ borderColor: textColor, borderWidth: 1, backgroundColor: bgColor }}
          onPress={() => router.back()}
          className=" h-10 w-10  rounded-full flex items-center justify-center "
        >
          <Image source={icons.backArrow} className="size-6" tintColor={textColor}/>
        </TouchableOpacity>

        <Text className="text-xl font-rubik-medium mt-2" style={{ color: textColor }}>
          {isAdmin ? "Category Management" : "Category List"}
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
              <Loading />
            </View>
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={
          <View >
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
    onClose={handleModalClose}
    />
    </SafeAreaView>
  );
};

export default Category;
