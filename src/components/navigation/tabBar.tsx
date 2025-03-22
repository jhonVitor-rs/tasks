import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { TabBarButtom } from "./tabBarButtons";

const excludeRoutes = ["_sitemap", "+not-found"];

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const primaryColor = "#6366f1";
  const secondaryColor = "#e4e4e7";

  const currentRouteName = state.routes[state.index].name;
  const shouldHideTabBar = excludeRoutes.includes(currentRouteName);

  return (
    <View
      style={{
        display: shouldHideTabBar ? "none" : "flex",
      }}
      className="absolute bottom-0 py-2 flex-row rounded-t-2xl justify-between items-center bg-slate-900 shadow-black/10"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        if (excludeRoutes.includes(route.name)) return null;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButtom
            key={index}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? primaryColor : secondaryColor}
            label={label}
          />
        );
      })}
    </View>
  );
}
