import { drizzle } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { openDatabaseSync, useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";

export default function Main() {
  const router = useRouter();

  const expoDB = openDatabaseSync("tasks.db", { enableChangeListener: true });
  const db = drizzle(expoDB);
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (success) router.replace("/tasks");
    if (error) Alert.alert("Error", error.message);
  }, [success, error]);

  return (
    <View className="flex-1 items-center justify-center bg-slate-800">
      <ActivityIndicator size={"large"} color={"white"} />
      <Text className="mt-4 text-zinc-300">Loading...</Text>
    </View>
  );
}
