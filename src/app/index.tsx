import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Main() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/tasks");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <ActivityIndicator size={"large"} color={"white"} />
      <Text className="mt-4 text-zinc-300">Loading...</Text>
    </View>
  );
}
