import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect, Slot } from 'expo-router'
import { KeyboardAvoidingView, Platform } from "react-native";
import { UIActivityIndicator } from 'react-native-indicators';

const AppLayout = () => {

const loading = false
const isLoggedIn = true 

if(loading){
    return(

        <SafeAreaView className='bg-white h-full flex justify-center items-center'>
            <UIActivityIndicator color='#0061FF' size={50} />            
        </SafeAreaView>

    )
}
if(!isLoggedIn) return <Redirect href='/sign-in'/>

  return <Slot />
}

export default AppLayout