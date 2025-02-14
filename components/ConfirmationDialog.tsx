import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

interface Props {
  /** Controls the modal visibility */
  visible: boolean;
  /** Title displayed at the top of the modal */
  title: string;
  /** Optional message shown below the title */
  message?: string;
  /**
   * Callback executed with a boolean result:
   * - `true` when Confirm is pressed.
   * - `false` when Cancel is pressed or the modal is dismissed.
   */
  onResult: (result: boolean) => void;
}

const ConfirmationDialog = ({visible,title,message,onResult} : Props) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={() => onResult(false)} // Handles Android back button
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-6/6 h/5 bg-white rounded-lg p-6">
          <Text className="text-lg font-bold text-center mb-4">{title}</Text>
          {message && <Text className="text-base text-center mb-4">{message}</Text>}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => onResult(false)}
              className="flex-1 bg-gray-300 rounded-lg py-2 mx-1"
            >
              <Text className="text-black font-bold text-center">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onResult(true)}
              className="flex-1 bg-blue-500 rounded-lg py-2 mx-1"
            >
              <Text className="text-white font-bold text-center">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationDialog;
