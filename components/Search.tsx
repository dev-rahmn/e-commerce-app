import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import icons from '@/constants/icons'
import { router, useLocalSearchParams, usePathname } from 'expo-router'
import { useDebouncedCallback } from 'use-debounce';

const Search = () => {
    const path = usePathname()
    const params = useLocalSearchParams<{query?: string}>()
    const [search, setSearch] = useState(params.query);
    const debounceSearch = useDebouncedCallback((text: string) => router.setParams({query: text}), 200);

const handleSearch = (text: string) => {
  setSearch(text)
  debounceSearch(text)
}
  return (
    <View className="mt-5 py-1 px-4 flex flex-row items-center justify-between w-full border border-primary-100 rounded-lg bg-accent-100 ">
      <View className="flex-1 flex flex-row items-center justify-start z-50">
        <Image source={icons.search} className="size-5" />
        <TextInput 
        value={search}
        placeholder='Search for anything'
        onChangeText={handleSearch}
        className='ml-2 text-base font-rubik text-black-300'
        />
      </View>
      <TouchableOpacity>
        <Image source={icons.filter} className="size-5" />
      </TouchableOpacity>
    </View>
  )
}

export default Search