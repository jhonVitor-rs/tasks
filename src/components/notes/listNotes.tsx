import { notes } from "@/db/schemas/notes";
import { asc } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";

export function ListNotes() {
  const router = useRouter();
  const expoDB = useSQLiteContext();
  const db = drizzle(expoDB);

  const { data } = useLiveQuery(
    db.select().from(notes).orderBy(asc(notes.title))
  );

  return (
    <View className="flex flex-col w-full p-4">
      <Text className="text-zinc-200 font-semibold text-3xl">All Notes</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.navigate(`../note/${item.id}`)}
            className="bg-slate-800 w-full rounded-lg p-2 my-2 shadow-black flex items-center justify-center"
          >
            <View className="flex flex-row justify-between items-end w-full">
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
