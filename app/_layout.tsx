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

const queryClient = new QueryClient();

export default function RootLayout() {
  let colorScheme = useColorScheme();

  return (
    <PaperProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <QueryClientProvider client={queryClient}>
          <StatusBar backgroundColor="blue" style="dark" />
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
            </Stack>
          </SafeAreaView>{" "}
        </QueryClientProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
