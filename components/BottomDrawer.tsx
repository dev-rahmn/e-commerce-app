// BottomDrawer.tsx
import { useTheme } from "@/contaxtapis/ThemeContext";
import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Modal,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  Dimensions,
  PanResponder,
} from "react-native";

export interface BottomDrawerRef {
  open: () => void;
  close: () => void;
}

interface Props {
  header: React.ReactNode;
  children: React.ReactNode;
  onClose?: () => void;
}

const BottomDrawer = forwardRef<BottomDrawerRef, Props>(
  ({ header, children, onClose }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const slideAnim = useRef(
      new Animated.Value(Dimensions.get("window").height)
    ).current;

    const {bgColor} = useTheme()
    // PanResponder for handling the drag down gesture on the header
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dy) > 5, // start when vertical movement is detected
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) {
            slideAnim.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 100) {
            closeModal();
          } else {
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }
        },
      })
    ).current;

    // Open the bottom drawer with an animation
    const openModal = () => {
      setIsVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,  // Adjust friction for the "bounciness"
        tension: 40,  // Adjust tension to control speed
        useNativeDriver: true,
      }).start();
    };

    // Close the bottom drawer with an animation
    const closeModal = () => {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get("window").height,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
        if (onClose) onClose();
      });
    };

    // Expose open and close methods via ref
    useImperativeHandle(ref, () => ({
      open: openModal,
      close: closeModal,
    }));

    return (
      <View>
        {/* Tapping the header opens the drawer */}
        <TouchableOpacity onPress={openModal} activeOpacity={0.8}>
          {header}
        </TouchableOpacity>

        {/* Bottom Drawer Modal */}
        <Modal
          visible={isVisible}
          transparent
          animationType="none"
          onRequestClose={closeModal}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeModal}
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "flex-end",
            }}
          >
            <TouchableWithoutFeedback>
              <Animated.View
                style={{
                  transform: [{ translateY: slideAnim }],
                  height: "80%",
                  backgroundColor: "white",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                {/* Sticky header with drag gesture */}
                <View
                  style={{
                    position: "absolute",
                    top: -8,
                    left: 0,
                    right: 0,
                    padding: 16,
                    zIndex: 10,
                  }}
                  {...panResponder.panHandlers}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View 
                      style={{ 
                        width: 100,
                        height: 6,
                        backgroundColor: "#ccc",
                        borderRadius: 5,
                      }}
                    />
                  </View>
                </View>

                {/* Scrollable content */}
                <ScrollView
                 showsVerticalScrollIndicator={false}
                 keyboardShouldPersistTaps="handled" // or "always"
                className="pt-10 " style={{ backgroundColor: bgColor }}
               contentContainerStyle={{ paddingBottom: 10 }}
            >
                  {children}
                </ScrollView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
);

export default BottomDrawer;
