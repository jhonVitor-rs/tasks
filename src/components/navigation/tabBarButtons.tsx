import { useEffect } from "react";
import { Pressable, PressableProps } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

interface Props extends PressableProps {
  isFocused: boolean;
  label: string;
  routeName: string;
  color: string;
}

const icons = {
  Tasks: (props: any) => <FontAwesome5 name="tasks" size={24} {...props} />,
  Calendar: (props: any) => <AntDesign name="calendar" size={24} {...props} />,
};

export function TabBarButtom(props: Props) {
  const { isFocused, label, routeName, color } = props;
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4]);
    const top = interpolate(scale.value, [0, 1], [0, 8]);

    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      opacity,
    };
  });

  return (
    <Pressable {...props} className="flex-1 justify-center items-center gap-4">
      <Animated.View style={[animatedIconStyle]}>
        {icons[label as keyof typeof icons]?.({ color })}
      </Animated.View>
      <Animated.Text style={[{ color, fontSize: 11 }, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}
