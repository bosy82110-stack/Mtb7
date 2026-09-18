import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AppHeader, IconSymbol, MealCard, palette, SectionTitle } from "@/components/meal-ui";
import { useColors } from "@/hooks/use-colors";
import { MEAL_SLOTS, useMealStore, WEEK_DAYS, type DayKey, type MealSlot } from "@/lib/meals-store";

export default function PlanScreen() {
  const colors = useColors();
  const { dishes, plan, setPlanItems } = useMealStore();
  const todayIndex = (new Date().getDay() + 1) % 7;
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayIndex);
  const [editingSlot, setEditingSlot] = useState<MealSlot | null>(null);
  const selectedDay = WEEK_DAYS[selectedDayIndex] as DayKey;
  const dayPlan = plan[selectedDay];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - todayIndex);

  const dayDates = useMemo(() => WEEK_DAYS.map((day, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return { day, date };
  }), [weekStart.getTime()]);

  return (
    <ScreenContainer className="px-5 pt-4" containerClassName="bg-background">
      <AppHeader title="الخطة الأسبوعية" subtitle="رتّب أسبوعك من الآن" />
      <View style={styles.monthRow}><Text style={[styles.monthText, { color: colors.foreground }]}>{new Intl.DateTimeFormat("ar-EG", { month: "long", year: "numeric" }).format(dayDates[0].date)}</Text><Text style={[styles.monthHint, { color: colors.muted }]}>هذا الأسبوع</Text></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow} style={[styles.dayScroll, { transform: [{ scaleX: -1 }] }]}>
        <View style={{ flexDirection: "row", transform: [{ scaleX: -1 }] }}>
          {dayDates.map(({ day, date }, index) => {
            const active = index === selectedDayIndex;
            const plannedCount = Object.values(plan[day]).filter((items) => items.length).length;
            return <Pressable key={day} onPress={() => setSelectedDayIndex(index)} style={[styles.dayCard, { backgroundColor: colors.surface, borderColor: colors.border }, active && styles.dayCardActive]}><Text style={[styles.dayCardName, { color: active ? "#FFE9DE" : colors.muted }]}>{day.slice(0, 3)}</Text><Text style={[styles.dayCardNumber, { color: active ? "#FFF" : colors.foreground }]}>{date.getDate()}</Text><View style={[styles.dayProgress, { backgroundColor: active ? "#F5B99D" : colors.border }]}><View style={[styles.dayProgressFill, { width: `${(plannedCount / 3) * 100}%`, backgroundColor: active ? "#FFF" : palette.terracotta }]} /></View></Pressable>;
          })}
        </View>
      </ScrollView>

      <View style={styles.selectedDayHeader}><Text style={[styles.selectedDayTitle, { color: colors.foreground }]}>وجبات {selectedDay}</Text><Text style={[styles.selectedDayHint, { color: colors.muted }]}>اضغط على وجبة لتعديل أصنافها</Text></View>
      {MEAL_SLOTS.map((slot) => {
        const mealDishes = dayPlan[slot].map((id) => dishes.find((dish) => dish.id === id)).filter(Boolean) as typeof dishes;
        return <MealCard key={slot} slot={slot} dishes={mealDishes} onPress={() => setEditingSlot(slot)} />;
      })}
      <View style={[styles.tipCard, { backgroundColor: "#F6EBDD" }]}><Text style={styles.tipIcon}>💡</Text><View style={{ flex: 1, alignItems: "flex-end" }}><Text style={[styles.tipTitle, { color: colors.foreground }]}>نصيحة صغيرة</Text><Text style={[styles.tipText, { color: colors.muted }]}>أضف أكثر من صنف للوجبة الواحدة لتجهّز سفرتك كاملة.</Text></View></View>

      <Modal visible={editingSlot !== null} transparent animationType="slide" onRequestClose={() => setEditingSlot(null)}>
        <View style={styles.modalBackdrop}><View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}><View><Text style={[styles.modalTitle, { color: colors.foreground }]}>اختَر أصناف الوجبة</Text><Text style={[styles.modalSubtitle, { color: colors.muted }]}>{editingSlot} · {selectedDay}</Text></View><Pressable onPress={() => setEditingSlot(null)}><IconSymbol name="close" size={24} color={colors.muted} /></Pressable></View>
          <FlatList data={dishes} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingBottom: 12 }} renderItem={({ item }) => {
            const selected = editingSlot ? dayPlan[editingSlot].includes(item.id) : false;
            return <Pressable onPress={() => { if (!editingSlot) return; const next = selected ? dayPlan[editingSlot].filter((id) => id !== item.id) : [...dayPlan[editingSlot], item.id]; setPlanItems(selectedDay, editingSlot, next); }} style={[styles.optionRow, { borderColor: colors.border, backgroundColor: colors.surface }]}><View style={[styles.checkCircle, selected && { backgroundColor: palette.terracotta, borderColor: palette.terracotta }]}>{selected ? <IconSymbol name="check" size={15} color="#FFF" /> : null}</View><Text style={{ fontSize: 24 }}>{item.emoji}</Text><View style={{ flex: 1, alignItems: "flex-end" }}><Text style={[styles.optionName, { color: colors.foreground }]}>{item.name}</Text><Text style={[styles.optionCategory, { color: colors.muted }]}>{item.category}</Text></View></Pressable>;
          }} />
          <Pressable onPress={() => setEditingSlot(null)} style={styles.doneButton}><Text style={styles.doneText}>تم</Text></Pressable>
        </View></View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  monthRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 13 },
  monthText: { fontSize: 16, fontWeight: "900" },
  monthHint: { fontSize: 12 },
  daysRow: { paddingBottom: 22 },
  dayScroll: { flexGrow: 0, height: 110 },
  dayCard: { width: 58, height: 88, borderRadius: 17, borderWidth: 1, alignItems: "center", justifyContent: "center", marginLeft: 8 },
  dayCardActive: { backgroundColor: palette.terracotta, borderColor: palette.terracotta, transform: [{ translateY: -3 }] },
  dayCardName: { fontSize: 11, fontWeight: "700", marginBottom: 6 },
  dayCardNumber: { fontSize: 21, fontWeight: "900" },
  dayProgress: { width: 30, height: 3, borderRadius: 2, marginTop: 8, overflow: "hidden" },
  dayProgressFill: { height: 3, borderRadius: 2 },
  selectedDayHeader: { alignItems: "flex-end", marginBottom: 11 },
  selectedDayTitle: { fontSize: 19, fontWeight: "900" },
  selectedDayHint: { fontSize: 11, marginTop: 4 },
  tipCard: { borderRadius: 18, padding: 14, flexDirection: "row-reverse", alignItems: "center", gap: 11, marginTop: 7 },
  tipIcon: { fontSize: 26 },
  tipTitle: { fontSize: 13, fontWeight: "800" },
  tipText: { textAlign: "right", fontSize: 11, marginTop: 3, lineHeight: 17 },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(35,28,23,0.45)" },
  modal: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 21, paddingBottom: 30, maxHeight: "82%" },
  modalHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 17 },
  modalTitle: { fontSize: 20, fontWeight: "900", textAlign: "right" },
  modalSubtitle: { fontSize: 12, marginTop: 3, textAlign: "right" },
  optionRow: { minHeight: 64, borderRadius: 16, borderWidth: 1, marginBottom: 8, padding: 10, flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  checkCircle: { width: 25, height: 25, borderRadius: 13, borderWidth: 1.5, borderColor: "#CFC6BD", alignItems: "center", justifyContent: "center" },
  optionName: { fontSize: 14, fontWeight: "800" },
  optionCategory: { fontSize: 11, marginTop: 3 },
  doneButton: { height: 50, borderRadius: 15, backgroundColor: palette.terracotta, alignItems: "center", justifyContent: "center", marginTop: 8 },
  doneText: { color: "#FFF", fontWeight: "800", fontSize: 15 },
});
