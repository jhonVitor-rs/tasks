import { cn } from "@/utils/cn";
import { ReactNode, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface DrawerBottonProps {
  open: boolean;
  className?: string;
  setHide: () => void;
  children: ReactNode;
}

export function DrawerBotton({
  open,
  className = "",
  setHide,
  children,
}: DrawerBottonProps) {
  const { height } = Dimensions.get("window");

  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (open) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [open, height]);

  return (
    <Modal
      transparent
      visible={open}
      animationType="none"
      onRequestClose={setHide}
    >
      <View className="flex-1 bg-black/80">
        <TouchableWithoutFeedback onPress={setHide}>
          <View className="flex-1" />
        </TouchableWithoutFeedback>

        <Animated.View
          style={{ transform: [{ translateY: slideAnim }] }}
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-zinc-900 rounded-t-2xl pb-5 shadow-black/20 border-t border-r border-l border-zinc-600",
            className
          )}
        >
          <View className="w-full items-center pb-5">
            <View className="w-16 h-1 bg-zinc-400 rounded-full mt-2" />
          </View>

          <View className="flex-1 px-4 pt-2">{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}
