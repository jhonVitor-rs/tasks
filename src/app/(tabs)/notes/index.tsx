import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Notes() {
  const router = useRouter();

  return (
    <View className="relative flex flex-col w-full min-h-screen bg-slate-700">
      <Text>Notes</Text>
      <TouchableOpacity onPress={() => router.navigate("../note/123")}>
        <Text>Navegar para a nota</Text>
      </TouchableOpacity>
    </View>
  );
}
