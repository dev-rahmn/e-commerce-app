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


  export const SkeletonOrderDetailCard = ({ className }: { className: string }) => {
    return (
      <View className={className}>
        <View className="flex-row items-center gap-4 ">
          {/* Image Skeleton */}
          <View className='px-4 rounded-lg items-center justify-start'>
                
          </View>
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