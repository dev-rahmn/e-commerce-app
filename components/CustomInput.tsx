import { View, Text, TextInput, TextInputProps } from 'react-native'
import React from 'react'
import { useTheme } from '@/contaxtapis/ThemeContext';

interface CustomInputProps extends TextInputProps {
  label?: string;
  labelColor?: string;
  error?: string;
  required?: boolean;
}

const CustomInput = ({ label, labelColor, error,required, ...props }: CustomInputProps) => {

  return (
    <View className="mb-4">
      { label && <Text className={`${labelColor ? `text-${labelColor}` : 'text-white'} font-rubik-medium mb-2`}>{label} {required &&
      <Text className="text-red-500">*</Text>
       }</Text>}
      <TextInput 
        className={`bg-white/50 backdrop-blur-md rounded-xl px-4 py-3 ${labelColor ? `text-${labelColor} border border-${labelColor}` : 'text-white'} font-rubik
          ${error ? 'border-2 border-red-500' : ''}`}
        placeholderTextColor={`${labelColor}/50`}
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1 font-rubik">{error}</Text>
      )}
    </View>
  )
}

export default CustomInput
