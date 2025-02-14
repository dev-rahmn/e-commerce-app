import { View, Text, TextInput, TextInputProps } from 'react-native'
import React from 'react'

interface CustomInputProps extends TextInputProps {
  label?: string;
  labelColor?: string;
  error?: string;
}

const CustomInput = ({ label, labelColor, error, ...props }: CustomInputProps) => {
  return (
    <View className="mb-4">
      { label && <Text className={`${labelColor ? `text-${labelColor}` : 'text-black'} font-rubik-medium mb-2`}>{label}</Text>}
      <TextInput 
        className={`bg-white/50 backdrop-blur-md rounded-xl px-4 py-3 ${labelColor ? `text-${labelColor}` : 'text-black'} font-rubik
          ${error ? 'border-2 border-red-500' : ''}`}
        placeholderTextColor="primary-100"
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1 font-rubik">{error}</Text>
      )}
    </View>
  )
}

export default CustomInput
