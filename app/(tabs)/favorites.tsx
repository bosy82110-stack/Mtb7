import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useMemo } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { AppHeader, EmptyState, IconButton, palette } from "@/components/meal-ui";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useMealStore } from "@/lib/meals-store";

export default function FavoritesScreen() {
  const colors = useColors();
  const { dishes, toggleFavorite } = useMealStore();
  const favorites = useMemo(() => dishes.filter((dish) => dish.favorite), [dishes]);
  return (
    <ScreenContainer className="px-5 pt-4" containerClassName="bg-background">
      <AppHeader title="المفضلة" subtitle="أكلاتك التي تحبها دائمًا" right={<IconButton icon="heart" />} />
      {favorites.length ? <FlatList data={favorites} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} contentContainerStyle={styles.list} renderItem={({ item }) => <Pressable style={({ pressed }) => [styles.favoriteCard, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && { opacity: 0.75 }]}><View style={styles.foodImage}><Text style={{ fontSize: 33 }}>{item.emoji}</Text></View><View style={styles.cardCopy}><Text style={[styles.name, { color: colors.foreground }]}>{item.name}</Text><Text style={[styles.category, { color: colors.muted }]}>{item.category} · وصفة محفوظة</Text><View style={styles.ratingRow}><Text style={{ color: palette.gold, fontSize: 14 }}>★★★★★</Text><Text style={[styles.quickLabel, { color: colors.muted }]}>مفضلة</Text></View></View><Pressable onPress={() => toggleFavorite(item.id)} style={styles.starButton}><IconSymbol name="star.fill" size={19} color={palette.gold} /></Pressable></Pressable>} /> : <EmptyState title="لم تضف مفضلات بعد" subtitle="اضغط على النجمة في أي أكلة لتظهر هنا بسرعة" icon="⭐" />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 26 },
  favoriteCard: { borderRadius: 19, borderWidth: 1, padding: 12, marginBottom: 10, flexDirection: "row-reverse", alignItems: "center" },
  foodImage: { width: 65, height: 65, borderRadius: 17, backgroundColor: "#F7EBDD", alignItems: "center", justifyContent: "center", marginLeft: 12 },
  cardCopy: { flex: 1, alignItems: "flex-end" },
  name: { fontSize: 15, fontWeight: "900" },
  category: { fontSize: 11, marginTop: 3 },
  ratingRow: { flexDirection: "row-reverse", alignItems: "center", gap: 7, marginTop: 6 },
  quickLabel: { fontSize: 10 },
  starButton: { padding: 5, alignSelf: "flex-start" },
});
