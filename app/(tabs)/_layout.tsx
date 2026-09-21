import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarButton: HapticTab, tabBarStyle: { height: 68 + bottomPadding, paddingTop: 8, paddingBottom: bottomPadding, backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1 }, tabBarLabelStyle: { fontSize: 10, fontWeight: "700" } }}>
      <Tabs.Screen name="index" options={{ title: "الرئيسية", tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={23} color={color} /> }} />
      <Tabs.Screen name="operations" options={{ title: "العمليات", tabBarIcon: ({ color }) => <IconSymbol name="receipt" size={23} color={color} /> }} />
      <Tabs.Screen name="settlement" options={{ title: "التسوية", tabBarIcon: ({ color }) => <IconSymbol name="swap" size={23} color={color} /> }} />
      <Tabs.Screen name="history" options={{ title: "السجل", tabBarIcon: ({ color }) => <IconSymbol name="history" size={23} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: "الإعدادات", tabBarIcon: ({ color }) => <IconSymbol name="gearshape.fill" size={23} color={color} /> }} />
      <Tabs.Screen name="dishes" options={{ href: null }} />
      <Tabs.Screen name="plan" options={{ href: null }} />
      <Tabs.Screen name="favorites" options={{ href: null }} />
    </Tabs>
  );
}
