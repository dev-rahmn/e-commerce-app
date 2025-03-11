import { View, Text } from 'react-native'
import React from 'react'
import SkeletonLoader from '@/components/CustomSkeleton'

export const SkeletonOrderCard = ({ className }: { className: string }) => {
    return (
      <View className={className}>
        <View className="flex-row items-center gap-4 ">
          {/* Image Skeleton */}
          <SkeletonLoader
            style={{ height: 60, width: 60, borderRadius: 10 }}
          
          />
  
          {/* Name and Mobile Number Skeletons */}
          <View className="flex-1 gap-2 ">
            <SkeletonLoader
              style={{ height: 20, width: "100%", borderRadius: 4, marginBottom: 8 }}
            />
            <View className='flex-row items-center justify-between gap-2'>
            <SkeletonLoader
              style={{ height: 15, width: "40%", borderRadius: 4 }}
            />
            <SkeletonLoader
              style={{ height: 15, width: "20%", borderRadius: 4 }}
            />

            </View>
          </View>
        </View>
      </View>
    );
  };

  // npm create vite@latest noon-react-app -- --template react
  // cd my-react-app
  // npm install
  
  export const SkeletonOrderDetailCard = ({ className }: { className: string }) => {
    return (
      <View className={className}>

          <View className='mx-2 my-3 rounded-lg items-center justify-start'>

          <SkeletonLoader
            style={{ height: 120, width: "100%", borderRadius: 10 }}/>
          </View>
            <View className='mx-2 my-3 rounded-lg items-center justify-start'>
            <SkeletonLoader
            style={{ height: 50, width: "100%", borderRadius: 10 }}/>
            </View> 

            <View className='mx-2 my-3 rounded-lg items-start justify-start'>
            <SkeletonLoader
            style={{ height: 30, width: "60%", borderRadius: 10 }}/>
            </View> 


            <View className='flex flex-col mx-2 my-3 mt-12 rounded-lg items-start justify-start'>
                  <View style={{ marginVertical: 24 }} className='flex flex-row items-center justify-start gap-2'>
                    <SkeletonLoader style={{ height: 35, width: 35, borderRadius: 50 }} />
                    <SkeletonLoader style={{ marginLeft: 30, height: 15, width: "20%", borderRadius: 4 }} />
                  </View>

                  <View style={{ marginVertical: 24 }} className='flex flex-row items-center justify-start gap-2'>
                    <SkeletonLoader style={{ height: 35, width: 35,  borderRadius: 50 }} />
                    <SkeletonLoader style={{ marginLeft: 30, height: 15, width: "20%", borderRadius: 4 }} />
                  </View>

                  <View style={{ marginVertical: 24 }} className='flex flex-row items-center justify-start gap-2'>
                    <SkeletonLoader style={{ height: 35, width: 35,  borderRadius: 50 }} />
                    <SkeletonLoader style={{ marginLeft: 30, height: 15, width: "20%", borderRadius: 4 }} />
                  </View>

                  <View style={{ marginVertical: 24 }} className='flex flex-row items-center justify-start gap-2'>
                    <SkeletonLoader style={{ height: 35, width: 35,  borderRadius: 50 }} />
                    <SkeletonLoader style={{ marginLeft: 30, height: 15, width: "20%", borderRadius: 4 }} />
                  </View>

                  <View style={{ marginVertical: 24 }} className='flex flex-row items-center justify-start gap-2'>
                    <SkeletonLoader style={{ height: 35, width: 35,  borderRadius: 50 }} />
                    <SkeletonLoader style={{ marginLeft: 30, height: 15, width: "20%", borderRadius: 4 }} />
                  </View>

                  
                </View>

  
      </View>
    );
  };