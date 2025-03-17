import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useTheme } from '@/contaxtapis/ThemeContext'

interface FilterProps {
  items: {id: string, name: string}[]
}
const Filters = ({items} : FilterProps) => {
    const { theme, bgColor, textColor } = useTheme();
    const params = useLocalSearchParams<{filter?: string}>();
    const [ selectCategory, setSelectCategory ] = useState(params.filter || 'All');

    const handleCategory = (text: string) => {
        if(text === selectCategory) {
            setSelectCategory('All')
            router.setParams({filter: 'All'})
            return;
        }
        setSelectCategory(text)
        router.setParams({filter: text})
    }
    const btnColor = theme === 'dark' ? 'bg-accent-100' : 'bg-primary-100';
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}  className='mt-3 mb-2'>
       {items.map((item, index) => (
           <TouchableOpacity key={index} onPress={() => handleCategory(item.id)}
           className={`flex flex-row items-start gap-2 px-4 mr-4 py-2 rounded-lg
            ${selectCategory === item.id ? 'bg-primary-300' : `${btnColor}`}`}    
           >
            <Text className={`${textColor} text-sm ${selectCategory === item.id ? ' font-rubik-bold mt-0.5' : ' font-rubik'} `}>{item.name}</Text>
           </TouchableOpacity>
       ))

       }
    </ScrollView >
  )
}

export default Filters