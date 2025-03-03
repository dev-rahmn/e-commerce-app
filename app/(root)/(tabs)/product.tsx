import { View, Text, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {Card, FeaturedCard} from '@/components/Card'
import { UIActivityIndicator } from 'react-native-indicators'
import NoResults from '@/components/NoResults'
import Search from '@/components/Search'
import { router, useLocalSearchParams } from 'expo-router'
import Filters from '@/components/Filters'
import icons from '@/constants/icons'
import { categories } from '@/constants/data';
import AddProductModal from '@/modals/AddProductModal'
import DeleteModal from '@/modals/DeleteModal'
import { useTheme } from '@/contaxtapis/ThemeContext'

const Product = () => {
  const [modalVisible, setModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [updatedProduct, setUpdatedProduct] = useState(null);
    const [selectedId, setSelectedId] = useState<number | null>(null); // Store ID of selected item
      const {bgColor, textColor} = useTheme();
    const loading = false
    const isAdmin = true
      // Get the selected category from URL params
        const params = useLocalSearchParams();
        const selectedCategory = params.filter || 'All';  // Default to 'All' if not set
        const searchItem = params.query  

        useEffect(() => {
          console.log('Selected category:', selectedCategory);
        }, [selectedCategory]);

        useEffect(() => {
          console.log('searched Item:', searchItem);
        }, [searchItem]);
        
        const addProductHandler = () => {
          setModalVisible(true)
          console.log('clicked add product')
        }


      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];  // Example data (9 items)

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

    const adminActions = (item: any) => ( isAdmin && (
      <View className="flex flex-row items-center gap-2">
        <TouchableOpacity
          className="border border-green-400 px-1 py-1 rounded-lg"
          onPress={() => handleUpdate(item)}
        >
          {/* <Text className="text-white">Update</Text> */}
          <Image source={icons.editLogo} className="size-5"/>
        </TouchableOpacity>
        <TouchableOpacity
          className="border border-red-400 px-1 py-1 rounded-lg"
          onPress={() => handleDelete(item.id)}
        >
           <Image source={icons.deleteLogo} className="size-5"/>
        </TouchableOpacity>
      </View>
    ));

    const handleModalClose = (deleteConfirmed: boolean) => {
      setDeleteModalVisible(false); // Close modal
  
      if (deleteConfirmed && selectedId !== null) {  
        console.log("Item deleted!", selectedId); // Perform delete action here
      }
    };
  return (
      <SafeAreaView className='h-full'  style={{ backgroundColor: bgColor }}>
          <View className='px-4 py-2 flex flex-row  items-center justify-between'>
             <TouchableOpacity style={{ borderColor: textColor, borderWidth: 1, backgroundColor: bgColor }}
                onPress={() => router.back()}
                className=" h-10 w-10  rounded-full flex items-center justify-center">
                <Image source={icons.backArrow} className="size-6" tintColor={textColor}/>
            </TouchableOpacity>

            <Text className='text-xl font-rubik-medium mt-2' style={{ color: textColor }}>
              {isAdmin ? 'Product Management' : 'Product List'}
              </Text>
           
            {isAdmin && (
            <TouchableOpacity onPress={addProductHandler} 
            className='bg-primary-300 py-1 px-2 rounded-lg flex items-center justify-center '>
             <Text className='text-white font-rubik-medium'>Add New</Text>   
            </TouchableOpacity>
            )}
            {!isAdmin && <Image source={icons.bell} className="size-5" />}
            </View>    
            <FlatList 
            columnWrapperClassName='flex gap-3  px-2'
            numColumns={2}
            contentContainerClassName='pb-24'
            data={data}
            renderItem={({item})=>
                  <Card  onPress={() =>  router.push(`/properties/${item}`)} 
                  item={item}
                  adminActions={adminActions(item)}
                  />}
                keyExtractor={(item) => item.toString()}
                ListEmptyComponent={
                loading ? (
                 <View className="flex-1  items-center justify-center mt-60">  
                   <UIActivityIndicator size={50} color="#0061FF"/>
                 </View>
               ) : (
                 <NoResults />
               )
               }
               ListHeaderComponent={
                <View className="px-2">

                    <Search />

                   {!isAdmin && <Filters items={categories}/>}
                </View>
               }
            />
    
        <AddProductModal 
          visible={modalVisible} 
          onClose={() => setModalVisible(false)} 
        />
        <DeleteModal 
          visible={isDeleteModalVisible}
          onClose={handleModalClose}
        />
    </SafeAreaView>
  )
}

export default Product