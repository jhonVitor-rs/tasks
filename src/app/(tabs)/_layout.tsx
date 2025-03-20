import { Tabs } from "expo-router";
import { TabBar } from "@/components/navigation/tabBar";

export default function TabsLayout() {
  return (
    <Tabs initialRouteName="tasks" tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
