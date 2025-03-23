import { ReactNode, useEffect, useRef } from "react";
import { Animated } from "react-native";

interface ListProps {
  children: ReactNode;
  isOpen: boolean;
  heigth?: number;
}

export function List({ children, isOpen, heigth = 1 }: ListProps) {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      if (isOpen) {
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    });

    if (!isOpen) {
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  const maxHeight = heigth * 60;
  const containerHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxHeight],
  });

  return (
    <Animated.View
      style={{
        height: containerHeight,
        backgroundColor: "#1e293b",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <Animated.ScrollView
        style={{ opacity: contentOpacity }}
        contentContainerStyle={{ padding: 10 }}
      >
        {children}
      </Animated.ScrollView>
    </Animated.View>
  );
}
