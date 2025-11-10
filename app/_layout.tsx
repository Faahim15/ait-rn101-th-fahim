import { useAuthStore } from "@/src/store/authStore";
import { Stack } from "expo-router";

export default function RootLayout() {
  const { user } = useAuthStore();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}
