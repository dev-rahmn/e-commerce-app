import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, Text, View, Animated } from "react-native";
import { useEffect, useRef } from "react";
import icons from "@/constants/icons";
import { useTheme } from "@/contaxtapis/ThemeContext";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

const { bgColor, textColor, theme} = useTheme()

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  return (
    <View className="flex-1 mt-3 flex flex-col items-center">
      <Animated.Image
        source={icon}
        tintColor={focused ?  theme === "light" ? "#0061FF" :"#0aa205" : `${textColor}`}
        resizeMode="contain"
        style={{
          width: 24,
          height: 24,
          transform: [{ scale: scaleAnim }],
        }}
      />
      <Text
        className={`${  //"text-primary-300 font-rubik-medium"
          focused
            ? theme === "light" ? "text-primary-300 font-rubik-medium" : 'text-green-600 font-rubik-medium'
            : `font-rubik-light text-${textColor}`
        } text-xs w-full text-center mt-1`}
      >
        {title}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const { bgColor, textColor, theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: `${bgColor}`,
          position: "absolute",
          borderTopColor: "#0061FF1A",
          borderTopWidth: 1,
          minHeight: 60,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          title: "Product",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.product} title="Product" />
          ),
        }}
      />
      <Tabs.Screen 
        name="category"
        options={{
          title: "Category",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.category} title="Category" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
