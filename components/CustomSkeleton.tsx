import React, { useEffect, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// Wrap LinearGradient in an Animated component
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const SkeletonLoader = ({ style }: any) => {
  const shimmerTranslate = useSharedValue(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Capture container width so our animation adapts to it
  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  useEffect(() => {
    if (containerWidth > 0) {
      // Animate the shimmer from 0 to -containerWidth continuously.
      // Since our gradient is double the container's width,
      // translating it by -containerWidth makes the second pattern slide in seamlessly.
      shimmerTranslate.value = withRepeat(
        withTiming(-containerWidth, { duration: 800 }),
        -1,
        false
      );
    }
  }, [containerWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: shimmerTranslate.value,
      },
    ],
  }));

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      {containerWidth > 0 && (
        <AnimatedLinearGradient 
          // Duplicated gradient stops for seamless repetition:
          // first three for the initial pattern, next three for the repeat.
          colors={[
            'transparent',
            'rgba(44, 43, 51, 0.8)',
            'transparent',
            'transparent',
            'rgba(44, 43, 51, 0.8)',
            'transparent',
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[
            styles.gradient,
            animatedStyle,
            { width: containerWidth * 2 }, // double the width for repeating pattern
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e9ee',
    overflow: 'hidden',
    borderRadius: 4,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default SkeletonLoader;
