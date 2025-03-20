import Header, { Title } from "@/components/ui/header";
import { tasks } from "@/db/schemas/task";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { Text, View } from "react-native";

export default function Tasks() {
  const expoDB = useSQLiteContext();
  const db = drizzle(expoDB);
  const { data, error } = useLiveQuery(db.select().from(tasks));

  const [];

  return (
    <View className="flex flex-col w-full min-h-screen bg-zinc-500">
      <Header>
        <Title title="Tasks" />
      </Header>
      <View className="p-2"></View>
    </View>
  );
}
