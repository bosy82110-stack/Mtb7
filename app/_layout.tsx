import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { I18nManager } from "react-native";

import { MezStoreProvider } from "@/lib/mez-store";
import { ThemeProvider } from "@/lib/theme-provider";

I18nManager.allowRTL(true);

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MezStoreProvider>
        <ThemeProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </MezStoreProvider>
    </GestureHandlerRootView>
  );
}
