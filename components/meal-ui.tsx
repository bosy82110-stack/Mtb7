import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { Dish, MealSlot } from "@/lib/meals-store";

export { IconSymbol } from "@/components/ui/icon-symbol";

export const palette = {
  terracotta: "#C45A3B",
  terracottaDark: "#9F442D",
  cream: "#FBF8F3",
  ink: "#2B2622",
  muted: "#8B8179",
  sand: "#EFE7DE",
  olive: "#75856B",
  gold: "#E0A458",
};

export function AppHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{title}</Text>
        {subtitle ? <Text style={[styles.headerSubtitle, { color: colors.muted }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function IconButton({ icon, onPress, badge }: { icon: "bell" | "plus" | "search" | "close" | "chevron.left" | "chevron.right" | "heart" | "gearshape.fill"; onPress?: () => void; badge?: boolean }) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.surface }, pressed && { opacity: 0.7, transform: [{ scale: 0.96 }] }]}>
      <IconSymbol name={icon} size={22} color={colors.foreground} />
      {badge ? <View style={styles.badge} /> : null}
    </Pressable>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      {action ? <Pressable onPress={onAction}><Text style={[styles.sectionAction, { color: palette.terracotta }]}>{action}</Text></Pressable> : null}
    </View>
  );
}

export function MealCard({ slot, dishes, onPress }: { slot: MealSlot; dishes: Dish[]; onPress?: () => void }) {
  const colors = useColors();
  const slotEmoji: Record<MealSlot, string> = { فطار: "☀️", غداء: "🍲", عشاء: "🌙" };
  const slotTime: Record<MealSlot, string> = { فطار: "08:00 ص", غداء: "02:00 م", عشاء: "08:00 م" };
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.mealCard, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && { opacity: 0.75 }]}>
      <View style={styles.mealIcon}><Text style={styles.emoji}>{slotEmoji[slot]}</Text></View>
      <View style={styles.mealDetails}>
        <View style={styles.mealTopLine}>
          <Text style={[styles.mealSlot, { color: colors.muted }]}>{slot}</Text>
          <Text style={[styles.mealTime, { color: colors.muted }]}>{slotTime[slot]}</Text>
        </View>
        <Text style={[styles.mealName, { color: colors.foreground }]} numberOfLines={1}>
          {dishes.length ? dishes.map((dish) => dish.name).join(" + ") : "لم تخطط لهذه الوجبة بعد"}
        </Text>
        <Text style={[styles.mealMeta, { color: colors.muted }]}>{dishes.length ? `${dishes.length} ${dishes.length === 1 ? "صنف" : "أصناف"}` : "اضغط للإضافة"}</Text>
      </View>
      <IconSymbol name="chevron.left" size={20} color={colors.muted} />
    </Pressable>
  );
}

export function EmptyState({ title, subtitle, icon = "🍽️" }: { title: string; subtitle: string; icon?: string }) {
  const colors = useColors();
  return (
    <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={styles.emptyEmoji}>{icon}</Text>
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.emptySubtitle, { color: colors.muted }]}>{subtitle}</Text>
    </View>
  );
}

export function CategoryPill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} style={[styles.pill, { backgroundColor: active ? palette.terracotta : colors.surface, borderColor: active ? palette.terracotta : colors.border }]}>
      <Text style={[styles.pillText, { color: active ? "#FFF" : colors.muted }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginBottom: 22 },
  headerCopy: { alignItems: "flex-end", flex: 1 },
  headerTitle: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5, lineHeight: 36 },
  headerSubtitle: { fontSize: 13, marginTop: 2, lineHeight: 20 },
  iconButton: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center", marginLeft: 10, position: "relative" },
  badge: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.terracotta, position: "absolute", top: 10, right: 10 },
  sectionTitleRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginTop: 4, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  sectionAction: { fontSize: 13, fontWeight: "700" },
  mealCard: { flexDirection: "row-reverse", alignItems: "center", borderRadius: 19, borderWidth: 1, padding: 13, marginBottom: 10, minHeight: 82 },
  mealIcon: { width: 55, height: 55, borderRadius: 17, backgroundColor: "#F6EBDD", alignItems: "center", justifyContent: "center", marginLeft: 12 },
  emoji: { fontSize: 27 },
  mealDetails: { flex: 1, alignItems: "flex-end" },
  mealTopLine: { width: "100%", flexDirection: "row-reverse", justifyContent: "space-between", marginBottom: 5 },
  mealSlot: { fontSize: 12, fontWeight: "700" },
  mealTime: { fontSize: 11 },
  mealName: { width: "100%", textAlign: "right", fontSize: 15, fontWeight: "800", lineHeight: 22 },
  mealMeta: { width: "100%", textAlign: "right", fontSize: 11, marginTop: 2 },
  emptyState: { borderRadius: 22, borderWidth: 1, borderStyle: "dashed", alignItems: "center", padding: 28, marginTop: 8 },
  emptyEmoji: { fontSize: 35, marginBottom: 10 },
  emptyTitle: { fontSize: 16, fontWeight: "800", marginBottom: 5 },
  emptySubtitle: { textAlign: "center", fontSize: 13, lineHeight: 20 },
  pill: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 9, marginLeft: 8 },
  pillText: { fontSize: 12, fontWeight: "700" },
});
