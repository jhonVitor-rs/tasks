import "./global.css";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

function App() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="tasks.db">
      <App />
    </SQLiteProvider>
  );
}
