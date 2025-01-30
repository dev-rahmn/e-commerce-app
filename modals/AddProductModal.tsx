import { useEffect, useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Image, ScrollView, FlatList, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import icons from '@/constants/icons';
import { categories } from '@/constants/data';
import images from '@/constants/images';
import CustomInput from '@/components/CustomInput';

const AddProductModal = ({ visible, onClose } : any) => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [productImages, setProductImages] = useState<any[]>([]);

  const handleAddProduct = () => {
    console.log({ productName, category, price, description, productImages });
    // onClose();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsMultipleSelection: true,
      allowsEditing: true,  //not working when allowsMultipleSelection is true
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProductImages([...productImages, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const handleClose = () =>{
    onClose()
    setProductName('')
    setCategory('') 
    setPrice('')
    setDescription('')
    setProductImages([])

  }

  return (
    <Modal visible={visible}  animationType="fade" transparent >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50 border border-gray-200 ">
        <View className="px-2 py-2 my-4 rounded-lg w-11/12 bg-white border border-black-200" >
          <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-row items-center justify-between mt-2 px-2">

          <Text className="text-xl font-bold ">Add Product</Text>
          <TouchableOpacity onPress={handleClose} className="bg-transparent py-2 px-5 rounded-lg border border-red-500 opacity-5">
              <Text className="text-red-500">X</Text>
            </TouchableOpacity>
        </View>

            <CustomInput
            label='Name'
              className="border border-gray-300 rounded-lg p-2 mb-3"
              placeholder="Enter product name"
              value={productName}
              onChangeText={setProductName}
            />

            <Text className="text-black font-rubik-medium ">Category</Text>
            <View  className="border border-gray-300 rounded-lg mb-3 mt-2">
            <Picker
              selectedValue={category}
              onValueChange={(itemValue : any) => setCategory(itemValue)}
              className="border border-gray-300 rounded-lg ">
              <Picker.Item label="Select Category" value={category} />
              {categories.map((cat) => (
                <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
              ))}
            </Picker>
            </View>
            

            <CustomInput
            label='Price'
              className="border border-gray-300 rounded-lg p-2 mb-3"
              placeholder="Enter price"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />

            
            <CustomInput
            label='Description'
              className="border border-gray-300 rounded-lg p-2 mb-3"
              placeholder="Enter description"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
            <View className=' items-center border border-gray-300 rounded-lg mb-3'>
            <TouchableOpacity
              className=" flex flex-row items-center justify-between w-full px-2"
              onPress={pickImage}
            >
               <Text className=" text-black font-rubik-medium ">Select Images for product</Text>
              <Image source={icons.addImage} className="w-10 h-10 mb-2" />
            </TouchableOpacity>
            </View>
            {productImages.length > 0 && (
              <FlatList
                data={productImages}
                horizontal
                keyExtractor={(item, index) => item.toString()}
                 renderItem={({ item, index }) => (
                    <View key={index} className="relative px-2 ">
                    <Image source={{ uri: item }} className="border border-gray-200 mx-2 px-2" style={{ width: Dimensions.get('window').width - 80, height: 300, borderRadius: 8 }} />
                    <TouchableOpacity onPress={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 rounded-full px-4 py-2 ">
                        <Text className="text-white text-xs">X</Text>
                    </TouchableOpacity>
                    </View>
                )}
             />
            )}
           

          <View className="flex-row items-end justify-end mt-4">
            
            <TouchableOpacity onPress={handleAddProduct} className="bg-green-500 py-2 px-5 rounded-lg">
              <Text className="text-white">Add</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddProductModal;