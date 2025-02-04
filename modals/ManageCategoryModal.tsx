import { useEffect, useState } from 'react';
import { View, Text, Modal,TouchableOpacity, ScrollView } from 'react-native';

import CustomInput from '@/components/CustomInput';

const ManageCategoryModal = ({ visible, onClose, category } : any) => {
  const [name, setName] = useState('');

  const hadleAdd = () => {
    console.log( name );
    // onClose();
  };

  useEffect(() =>{
    console.log('category', category)
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
            <ScrollView showsVerticalScrollIndicator={false}>
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

          <View className="flex-row items-end justify-end my-4">
            
            <TouchableOpacity onPress={hadleAdd} 
            className="bg-green-700 py-2 px-5 rounded-lg">
              <Text className="text-white">{category ? 'Update' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ManageCategoryModal;