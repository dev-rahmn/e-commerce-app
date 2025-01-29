import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'

const DeleteModal = ({ visible, onClose }: any) => {


    const handleClose = () =>{
        onClose()
      }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50 border border-gray-200">
      <View className="px-2 py-4 rounded-lg w-11/12 bg-white border border-black-200" >
          
          <Text className="text-xl font-bold text-center text-gray-800 mb-4">
            Are you sure you want to delete?</Text>
          <Text className="text-center text-red-500 font-base mb-8">
            This action cannot be undone.</Text>


          <View className="flex flex-row justify-center items-center gap-4 py-4">
            <TouchableOpacity //onPress={onDelete} 
              className="bg-red-600 py-2 px-6 rounded-lg shadow">
              <Text className="text-white font-semibold">Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClose} 
              className="bg-primary-300 py-2 px-6 rounded-lg shadow">
              <Text className="text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View> 
        </View>
      </View>
    </Modal>
  )
}

export default DeleteModal


 