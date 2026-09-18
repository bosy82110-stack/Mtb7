import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { AppHeader, IconButton, MealCard, palette, SectionTitle } from "@/components/meal-ui";
import { useColors } from "@/hooks/use-colors";
import { MEAL_SLOTS, useMealStore, WEEK_DAYS, type DayKey } from "@/lib/meals-store";

export default function HomeScreen() {
  const colors = useColors();
  const { dishes, plan, userName } = useMealStore();
  const todayIndex = (new Date().getDay() + 1) % 7;
  const today = WEEK_DAYS[todayIndex] as DayKey;
  const todayPlan = plan[today];
  const todayLabel = new Intl.DateTimeFormat("ar-EG", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

  const counts = useMemo(() => ({
    planned: Object.values(todayPlan).filter((ids) => ids.length > 0).length,
    total: Object.values(plan).reduce((sum, day) => sum + Object.values(day).filter((ids) => ids.length > 0).length, 0),
  }), [plan, todayPlan]);

  return (
    <ScreenContainer className="px-5 pt-4" containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppHeader
          title={`أهلاً ${userName}`}
          subtitle={todayLabel}
          right={<IconButton icon="bell" badge />}
        />

        <View style={[styles.hero, { backgroundColor: palette.terracotta }]}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>خطة اليوم</Text>
            <Text style={styles.heroTitle}>خلّي يومك ألذ</Text>
            <Text style={styles.heroSubtitle}>رتّب وجباتك وخلّي المطبخ أسهل</Text>
            <Pressable onPress={() => router.push("/(tabs)/plan")} style={({ pressed }) => [styles.heroButton, pressed && { opacity: 0.8 }]}>
              <Text style={styles.heroButtonText}>شوف الخطة</Text>
              <Text style={styles.heroArrow}>←</Text>
            </Pressable>
          </View>
          <View style={styles.heroArt}><Text style={styles.heroEmoji}>🍲</Text><Text style={styles.heroLeaves}>✦</Text></View>
        </View>

        <View style={styles.weekStrip}>
          {WEEK_DAYS.map((day, index) => {
            const date = new Date();
            date.setDate(date.getDate() + index - todayIndex);
            const active = index === todayIndex;
            return (
              <Pressable key={day} onPress={() => router.push("/(tabs)/plan")} style={[styles.dayItem, active && styles.dayItemActive]}>
                <Text style={[styles.dayName, { color: active ? "#FFF" : colors.muted }]}>{day.slice(0, 3)}</Text>
                <Text style={[styles.dayNumber, { color: active ? "#FFF" : colors.foreground }]}>{date.getDate()}</Text>
                {plan[day].فطار.length + plan[day].غداء.length + plan[day].عشاء.length > 0 ? <View style={[styles.dayDot, { backgroundColor: active ? "#FFF" : palette.terracotta }]} /> : null}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}><Text style={styles.statEmoji}>🍴</Text><View><Text style={[styles.statValue, { color: colors.foreground }]}>{counts.planned}/3</Text><Text style={[styles.statLabel, { color: colors.muted }]}>وجبات اليوم</Text></View></View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}><Text style={styles.statEmoji}>📅</Text><View><Text style={[styles.statValue, { color: colors.foreground }]}>{counts.total}</Text><Text style={[styles.statLabel, { color: colors.muted }]}>مخططة هذا الأسبوع</Text></View></View>
        </View>

        <SectionTitle title="وجبات اليوم" action="تعديل الخطة" onAction={() => router.push("/(tabs)/plan")} />
        {MEAL_SLOTS.map((slot) => {
          const mealDishes = todayPlan[slot].map((id) => dishes.find((dish) => dish.id === id)).filter(Boolean) as typeof dishes;
          return <MealCard key={slot} slot={slot} dishes={mealDishes} onPress={() => router.push("/(tabs)/plan")} />;
        })}

        <Pressable onPress={() => router.push("/(tabs)/dishes")} style={({ pressed }) => [styles.quickAdd, { borderColor: colors.border }, pressed && { opacity: 0.7 }]}>
          <View style={styles.quickAddIcon}><Text style={{ fontSize: 22 }}>＋</Text></View>
          <View style={{ flex: 1, alignItems: "flex-end" }}><Text style={[styles.quickAddTitle, { color: colors.foreground }]}>أضف أكلة جديدة</Text><Text style={[styles.quickAddSub, { color: colors.muted }]}>احفظ وصفاتك المفضلة في مكان واحد</Text></View>
          <Text style={{ color: palette.terracotta, fontSize: 24 }}>←</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 32 },
  hero: { minHeight: 174, borderRadius: 26, padding: 20, flexDirection: "row-reverse", overflow: "hidden", marginBottom: 18 },
  heroCopy: { flex: 1, alignItems: "flex-end", zIndex: 1 },
  heroEyebrow: { color: "#FFE3D1", fontSize: 12, fontWeight: "700", marginBottom: 5 },
  heroTitle: { color: "#FFF", fontSize: 25, fontWeight: "900", lineHeight: 34 },
  heroSubtitle: { color: "#FFEDE4", fontSize: 12, marginTop: 4 },
  heroButton: { flexDirection: "row-reverse", alignItems: "center", gap: 8, alignSelf: "flex-end", backgroundColor: "#FFF", borderRadius: 14, paddingHorizontal: 13, paddingVertical: 9, marginTop: 15 },
  heroButtonText: { color: palette.terracotta, fontSize: 12, fontWeight: "800" },
  heroArrow: { color: palette.terracotta, fontSize: 16 },
  heroArt: { width: 104, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-10deg" }] },
  heroEmoji: { fontSize: 78 },
  heroLeaves: { color: "#F9D6B8", fontSize: 34, position: "absolute", right: 2, top: 17 },
  weekStrip: { flexDirection: "row-reverse", justifyContent: "space-between", marginBottom: 18 },
  dayItem: { alignItems: "center", justifyContent: "center", width: 40, height: 62, borderRadius: 16 },
  dayItemActive: { backgroundColor: palette.terracotta },
  dayName: { fontSize: 10, fontWeight: "700", marginBottom: 5 },
  dayNumber: { fontSize: 17, fontWeight: "900" },
  dayDot: { width: 4, height: 4, borderRadius: 2, marginTop: 5 },
  statsRow: { flexDirection: "row-reverse", gap: 10, marginBottom: 21 },
  statCard: { flex: 1, borderRadius: 18, padding: 14, flexDirection: "row-reverse", alignItems: "center", gap: 9 },
  statEmoji: { fontSize: 24 },
  statValue: { fontSize: 18, fontWeight: "900", textAlign: "right" },
  statLabel: { fontSize: 10, marginTop: 2, textAlign: "right" },
  quickAdd: { marginTop: 6, borderWidth: 1, borderStyle: "dashed", borderRadius: 18, padding: 13, flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  quickAddIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#F7E7DC", alignItems: "center", justifyContent: "center" },
  quickAddTitle: { fontSize: 14, fontWeight: "800" },
  quickAddSub: { fontSize: 11, marginTop: 3 },
});
