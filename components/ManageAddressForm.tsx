import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  TextInput,
  Modal,ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import icons from '@/constants/icons';
import { useTheme } from '@/contaxtapis/ThemeContext';
import CustomInput from './CustomInput';

interface ManageAddressFormProps {
  onSubmit: (data: any) => void;
  address?: any;
  onClose: () => void;
}

const ManageAddressForm = ({ onSubmit, address, onClose }: ManageAddressFormProps) => {
  // Form field states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  // Renamed "state" to "stateValue" to avoid conflicts with the JS keyword.
  const [stateValue, setStateValue] = useState('');
  const [city, setCity] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [roadName, setRoadName] = useState('');
  const [selectedType, setSelectedType] = useState('home');

  // Location modal and API response state
  const [modalVisible, setModalVisible] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationInfo, setLocationInfo] = useState<any>(null);

    const {bgColor, textColor} = useTheme()
      
  const showToast = () => {
    ToastAndroid.showWithGravityAndOffset(
      'It take while, you may fill your Name and Phone No',
      ToastAndroid.LONG,    // Duration
      ToastAndroid.TOP,  // Position
      50,                   // X Offset
      50,                   // Y Offset
    );
  };
    // Animated value for opacity
    
    
  // Populate fields if an address is provided
  useEffect(() => {
    if (address) {
      setName(address.name || '');
      setPhone(address.phone || '');
      setPincode(address.pincode || '');
      setStateValue(address.state || '');
      setCity(address.city || '');
      setBuildingName(address.buildingName || '');
      setRoadName(address.roadName || '');
      setSelectedType(address.type || 'home');
    }
  }, [address]);

  const resetFields = () => {
    setName('');
    setPhone('');
    setPincode('');
    setStateValue('');
    setCity('');
    setBuildingName('');
    setRoadName('');
    setSelectedType('home');
  };

  const handleManageAddress = () => {
    if (!name.trim()) return alert('Full Name is required');
    if (!phone.trim() || phone.length !== 10)
      return alert('Enter a valid 10-digit phone number');
    if (!pincode.trim() || pincode.length !== 6)
      return alert('Enter a valid 6-digit pincode');
    if (!stateValue.trim()) return alert('State is required');
    if (!city.trim()) return alert('City is required');
    if (!buildingName.trim()) return alert('Building Name is required');
    if (!roadName.trim()) return alert('Road Name is required');

    const newAddress = {
      id: address?.id || null,
      name,
      phone,
      pincode,
      state: stateValue,
      city,
      buildingName,
      roadName,
      type: selectedType,
    };

    resetFields();
    onSubmit(newAddress);
  };

  const closeHandler = () => {
    onClose();
  };

  // Function to get location and show the modal
  const getUserLocation = async () => {
    setLocationInfo(null)
    // Open the modal and start the loading indicator
    showToast()
    setLocationLoading(true);

    // Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      setLocationLoading(false);
      return;
    }

    try {
      // Get the current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Fetch additional address details using the OpenCage API
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=1c691fc6e3f94761b93e96943e0d18dc`
      );
      const userLocation = await response.json();
      
      setLocationInfo(userLocation);
      setModalVisible(true);
      setLocationLoading(false);
    } catch (error) {
      console.error('Error fetching location:', error);
      setLocationLoading(false);
    }
  };

  // When the user confirms the location from the modal,
  // extract address components and update the form fields.
  const confirmLocation = () => {
    if (locationInfo && locationInfo.results && locationInfo.results.length > 0) {
      const components = locationInfo.results[0].components;
      const combinedRoadName = `${components.state_district || ''} , ${components.road || ''}`.trim();
      setRoadName(combinedRoadName);
      // Sometimes the API returns city, town, or village
      setCity(components.city || '');
      setStateValue(components.state || '');
      setPincode(components.postcode || '');
    }
    setModalVisible(false);
  };

  // Cancel updating location and simply close the modal
  const cancelLocation = () => {
    setModalVisible(false);
  };

  return (
  <SafeAreaView className='flex-1 h-full' style={{ backgroundColor: bgColor }}>

              <ScrollView 
                contentContainerStyle={{ justifyContent: 'center' }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View className='px-1 mt-3'>
                  <View className="flex flex-row px-2 items-center justify-between">
                      <Text className="text-xl font-bold my-4" style={{color: textColor}}>
                        {address ? 'Update' : 'Add'} Delivery Address
                      </Text>
                      <TouchableOpacity
                        className="items-center py-1 px-2 justify-center border border-red-500 rounded-lg"
                        onPress={closeHandler}
                      >
                        <Text className="text-red-600">X</Text>
                      </TouchableOpacity>
                    </View>
                </View>

      <View className="px-2">
        {/* Full Name */}
        <CustomInput required labelColor={textColor}
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter Full Name"
        />

        {/* Phone Number */}
         <CustomInput required labelColor={textColor}
          label="Phone Number"
          placeholder="Enter Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        {/* Pincode & State */}
        <View className="flex-row gap-2 justify-between mr-2">
          <View className="w-1/2">
            <CustomInput required labelColor={textColor}
            label='Pincode'
              placeholder="Enter Pincode"
              value={pincode}
              onChangeText={setPincode}
            />
          </View>
          <View className="w-1/2">
          <CustomInput required labelColor={textColor} label='State' 
              placeholder="Enter State"
              value={stateValue}
              onChangeText={setStateValue}
            />
          </View>
        </View>

        {/* City & Location */}
        <View className="flex-row gap-2 justify-between mr-2">
          <View className="w-1/2">
          <CustomInput labelColor={textColor} required label='City'
              placeholder="Enter City" 
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View className="w-1/2">
            <Text className={`text-${textColor}  font-rubik-medium mb-2`}>Location</Text>
            <TouchableOpacity
              className={`${locationLoading ? 'bg-gray-200 border border-blue-600' : 'bg-blue-600'}  p-3 rounded-md mb-3`}
              onPress={getUserLocation}
              disabled = {locationLoading}
            >
              {locationLoading ? (
                <View className='flex flex-row items-center justify-start'>
                <ActivityIndicator size="small" color='blue'/>
                <Text className='text-blue-600'> Getting Location </Text>
                
                </View>
              ) : (
                <Text className="text-white text-center">Use Current Location</Text>
              )}
              
            </TouchableOpacity>
          </View>
        </View>

        {/* Address Details */}
    
        <CustomInput labelColor={textColor} required label='House No., Building Name'
        placeholder='Enter House No., Building Name'
          value={buildingName}
          onChangeText={setBuildingName}
        />
        <CustomInput labelColor={textColor} required label='Road name, Area, Colony'
        placeholder='Enter Road name, Area, Colony'
          value={roadName}
          onChangeText={setRoadName}
        />

        {/* Address Type Selection */}
        <Text className={`text-${textColor}  font-rubik-medium mb-1`}>Type of Address :</Text>
        <View className="flex-row gap-2 my-2 w-1/2">
          <TouchableOpacity
            className={`flex-1 py-1 px-4 border-2 rounded-lg ${
              selectedType === 'home' ? 'border-blue-600 ' : `border-${textColor}`
            }`}
            onPress={() => setSelectedType('home')}
          >
            <View className="flex-row items-center gap-2 justify-center">
              <Animated.Image
                source={icons.home}
                tintColor={selectedType === 'home' ? '#0061FF' : '#666876'}
                className="w-6 h-6"
              />
              <Text
                className={`${
                  selectedType === 'home' ? 'text-blue-600' : `text-${textColor}`
                } text-center font-rubik-semibold`}
              >
                Home
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-1 px-4 border-2  rounded-lg ${
              selectedType === 'work' ? 'border-blue-600 ' : `border-${textColor}`
            }`}
            onPress={() => setSelectedType('work')}
          >
            <View className="flex-row items-center gap-2 justify-center">
              <Animated.Image
                source={icons.work}
                tintColor={selectedType === 'work' ? '#0061FF' : '#666876'}
                className="w-6 h-6"
              />
              <Text
                className={`${
                  selectedType === 'work' ? 'text-blue-600' : `text-${textColor}`
                } text-center font-rubik-semibold`}
              >
                Work
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
     
        <View className="flex flex-row gap-4 py-4 px-2 pb-14">
          <TouchableOpacity
            className="bg-orange-500 py-3 rounded-lg flex-1"
            onPress={handleManageAddress}
          >
            <Text className="text-white text-center font-bold">
              {address ? 'Update' : '+ Add'} Address
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-500 py-3 rounded-lg flex-1"
            onPress={closeHandler}
          >
            <Text className="text-white text-center font-bold">Cancel</Text>
          </TouchableOpacity>
        </View>
     

      {/* Modal for location confirmation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
            { locationInfo && locationInfo.results && locationInfo.results.length > 0 ? (
              <>
                <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Location Detected:</Text>
                <Text style={{ marginBottom: 10 }}>
                  {locationInfo.results[0].formatted}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                  <TouchableOpacity
                    onPress={confirmLocation}
                    style={{ backgroundColor: '#0061FF', padding: 10, borderRadius: 5 }}
                  >
                    <Text style={{ color: 'white' }}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={cancelLocation}
                    style={{ backgroundColor: 'gray', padding: 10, borderRadius: 5 }}
                  >
                    <Text style={{ color: 'white' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
                <View className='flex flex-col items-center'>

                    <Text className='text-lg font-rubik-semibold text-black-300'>No location data available</Text>
                    <TouchableOpacity
                    onPress={cancelLocation} className='bg-gray-500 my-4 px-3 py-2 rounded-lg'
                  
                  >
                    <Text className='text-white text-center font-rubik-bold'>Cancel</Text>
                  </TouchableOpacity>
                    </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  </SafeAreaView>
  );
};

export default ManageAddressForm;
