import { Link, Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Text } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  let colorScheme = useColorScheme();

  
  return (
    <PaperProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <SafeAreaView style={{ flex: 1 }}>
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: true,
                  headerTitle: () => (
                    <Link
                      href={"/"}
                      className="text-blue-500 text-2xl font-bold"
                    >
                      Trendecho
                    </Link>
                  ),
                }}
              />
              <Stack.Screen
                name="[id]"
                options={{
                  headerShown: true,
                  headerTitle: "Back",
                  headerBackTitle: "Back",
                  headerRight: () => (
                    <Text
                      style={{ fontSize: 16, fontWeight: "bold" }}
                      className="text-blue-500"
                    >
                      Trendecho
                    </Text>
                  ),
                }}
              />
            </Stack>
          </SafeAreaView>
        </QueryClientProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
