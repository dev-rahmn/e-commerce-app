import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect, Slot } from 'expo-router'
import { KeyboardAvoidingView, Platform } from "react-native";
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { RootState } from '@/redux/store/store';
import { getAllAddresses } from '@/redux/slices/addressSlice';
import { isAdminUser } from '@/constants/utils';
import { getCategories } from '@/redux/slices/categorySlice';


const AppLayout = () => {
    const dispatch = useAppDispatch();
    const { loading, token } = useAppSelector((state: RootState) => state.auth);
    const profile = useAppSelector((state) => state.auth.userProfile);
  
    const isAdmin = useMemo(() => token ? isAdminUser(token) : false, [token]); // Handle null token
  
    useEffect(() => {
      if (profile && !isAdmin && token) { // Check for token here as well
        dispatch(getAllAddresses(profile?.userId));
      }
      dispatch(getCategories())
    }, [profile, isAdmin, dispatch, token]); // Add token to the dependency array
  
    if (!token) {
      return <Redirect href='/sign-in' />;
    }
  
    if (loading) {
      return (
        <SafeAreaView className='bg-white h-full flex justify-center items-center'>
          <ActivityIndicator color='#0061FF' size={50} />
        </SafeAreaView>
      );
    }
  
    return <Slot />;
  };
export default AppLayout