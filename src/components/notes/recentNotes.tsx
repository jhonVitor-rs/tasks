import { notes } from "@/db/schemas/notes";
import { desc } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export function RecentNotes() {
  const router = useRouter();
  const expoDB = useSQLiteContext();
  const db = drizzle(expoDB);

  const { data } = useLiveQuery(
    db.select().from(notes).orderBy(desc(notes.updatedAt)).limit(5)
  );

  return (
    <View className="flex flex-col w-full py-4">
      <Text className="text-zinc-200 font-semibold text-3xl px-4">
        Recent Notes
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.navigate(`../note/${item.id}`)}
            className="bg-slate-800 w-40 h-40 rounded-md p-4 m-4 shadow-black flex items-center justify-center"
          >
            <View className="flex flex-col justify-center w-full">
              <Text className="text-zinc-200 font-medium text-2xl">
                {item.title}
              </Text>
              <Text className="text-zinc-200 font-light text-base">
                Seen in {item.updatedAt.toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
