import { useEffect, useState } from 'react';
import { View, Text, Modal,TouchableOpacity, ScrollView, ProgressBarAndroid, ActivityIndicator } from 'react-native';
import { useAppDispatch } from '@/redux/store/hooks';
import CustomInput from '@/components/CustomInput';
import Toast from 'react-native-toast-message'

import { manageCategory } from '@/redux/slices/categorySlice';

const ManageCategoryModal = ({ visible, onClose, category } : any) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false)
const dispatch  =  useAppDispatch()
const handleAdd = async () => {
  const data = category?.id ? { id: category.id, name } : { name };
  try {
    setLoading(true)
    const response = await dispatch(manageCategory(data)).unwrap();
    if (response) {
      Toast.show({
        type: 'success', // can be 'success' or 'info'
        text1: response.message,
        position: 'top',
        topOffset: 10,
        visibilityTime: 2000,
      });
      onClose();
      setName(''); // clear the input
    }
  } catch (error) {
    // console.log(error)
    Toast.show({
      type: 'error',
       text1:error ? error.toString() : 'An error occurred',
      position: 'top',
      topOffset: 10,
      visibilityTime: 2000,
    });
  }finally{
    setLoading(false)
  }
};



  useEffect(() =>{
    if(category && category.id){

        setName(category.name)
    }
  },[category])



  const handleClose = () =>{
    onClose()
    setName('')
  }

  return (
    <Modal visible={visible}  animationType="fade" transparent >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50 border border-gray-200">
        <View className="px-4 py-2  rounded-lg w-11/12 bg-white border border-black-200" >
            <ScrollView showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled" // or "always"
              >
            <View className="flex flex-row items-center justify-between my-2">

            <Text className="text-xl font-bold ">{category ? 'Update Category' : 'Add Category'}</Text>
                <TouchableOpacity onPress={handleClose} className="py-1 px-3 rounded-lg border border-red-500 ">
                    <Text className="text-red-500">X</Text>
                </TouchableOpacity>
        </View>

            <CustomInput
              label='Category Name'
              className="border border-gray-300 rounded-lg p-2 mb-3"
              placeholder="Enter Category name"
              value={name}
              onChangeText={setName}
            />
          {!loading ? (
          <View className="flex-row items-end justify-end my-4">
            
            <TouchableOpacity onPress={handleAdd} 
            className="bg-green-700 py-2 px-5 rounded-lg">
              <Text className="text-white">{category ? 'Update' : 'Add'}</Text>
            </TouchableOpacity>
          </View>) : (
            <View className='flex-row items-center justify-center mb-4'>
           
          <ActivityIndicator size={20} color="#0000ff" />
          </View>
          
          
          )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ManageCategoryModal;