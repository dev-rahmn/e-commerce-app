import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import React from "react";

interface DeleteModalProps {
  visible: boolean;
  onClose: (deleteConfirmed: boolean) => void; // Pass boolean to parent
}

const DeleteModal = ({ visible, onClose }: DeleteModalProps) => {
  const handleDelete = () => {
    onClose(true); // Pass true when delete is confirmed
  };

  const handleCancel = () => {
    onClose(false); // Pass false when canceled
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      {/* Dismiss modal when clicking outside */}
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View className="flex-1 justify-center items-center bg-black/50">
          {/* Prevents click inside from closing modal */}
          <View
            className="px-4 py-4 rounded-lg w-11/12 bg-white border border-gray-300"
            onStartShouldSetResponder={() => true} // Ensures tap inside won't close modal
          >
            <Text className="text-xl font-bold text-center text-gray-800 mb-4 py-4">
              Are you sure you want to delete?
            </Text>
            <Text className="text-center text-red-500 font-medium mb-6 py-3">
              This action cannot be undone.
            </Text>

            <View className="flex flex-row justify-center items-center gap-4 py-4">
              <TouchableOpacity onPress={handleDelete} className="bg-red-600 py-2 px-6 rounded-lg shadow">
                <Text className="text-white font-semibold">Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} className="bg-primary-300 py-2 px-6 rounded-lg shadow">
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DeleteModal;
