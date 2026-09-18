import { useMemo, useState } from "react";
import { FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AppHeader, CategoryPill, EmptyState, IconButton, palette } from "@/components/meal-ui";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useMealStore, type Dish, type MealCategory } from "@/lib/meals-store";

const categories: Array<MealCategory | "الكل"> = ["الكل", "فطار", "غداء", "عشاء", "أخرى"];
const emojis = ["🍲", "🍳", "🍗", "🍝", "🥗", "🥣", "🥪", "🍚"];

export default function DishesScreen() {
  const colors = useColors();
  const { dishes, addDish, updateDish, deleteDish, toggleFavorite } = useMealStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MealCategory | "الكل">("الكل");
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Dish | null>(null);
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>("غداء");
  const [emoji, setEmoji] = useState("🍲");
  const [image, setImage] = useState("");

  const filtered = useMemo(() => dishes.filter((dish) => {
    const matchesQuery = dish.name.includes(query.trim());
    const matchesCategory = category === "الكل" || dish.category === category;
    return matchesQuery && matchesCategory;
  }), [dishes, query, category]);

  const openCreate = () => {
    setEditing(null); setName(""); setSelectedCategory("غداء"); setEmoji("🍲"); setImage(""); setModalVisible(true);
  };
  const openEdit = (dish: Dish) => {
    setEditing(dish); setName(dish.name); setSelectedCategory(dish.category); setEmoji(dish.emoji); setImage(dish.image ?? ""); setModalVisible(true);
  };
  const saveDish = () => {
    if (!name.trim()) return;
    if (editing) updateDish(editing.id, { name: name.trim(), category: selectedCategory, emoji, image: image.trim() || undefined });
    else addDish({ name: name.trim(), category: selectedCategory, emoji, image: image.trim() || undefined });
    setModalVisible(false);
  };

  return (
    <ScreenContainer className="px-5 pt-4" containerClassName="bg-background">
      <AppHeader title="أكلاتي" subtitle={`${dishes.length} أكلات محفوظة`} right={<IconButton icon="plus" onPress={openCreate} />} />
      <View style={[styles.searchBox, { backgroundColor: colors.surface }]}>
        <IconSymbol name="search" size={20} color={colors.muted} />
        <TextInput value={query} onChangeText={setQuery} placeholder="ابحث عن أكلة..." placeholderTextColor={colors.muted} style={[styles.searchInput, { color: colors.foreground }]} textAlign="right" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow} style={{ transform: [{ scaleX: -1 }] }}>
        <View style={{ flexDirection: "row", transform: [{ scaleX: -1 }] }}>
          {categories.map((item) => <CategoryPill key={item} label={item} active={category === item} onPress={() => setCategory(item)} />)}
        </View>
      </ScrollView>

      {filtered.length ? <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <DishCard dish={item} onEdit={() => openEdit(item)} onDelete={() => deleteDish(item.id)} onFavorite={() => toggleFavorite(item.id)} />}
      /> : <EmptyState title="لا توجد أكلات هنا" subtitle="أضف أول أكلة إلى مجموعتك وابدأ التخطيط" icon="🍽️" />}

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modal, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: colors.foreground }]}>{editing ? "تعديل الأكلة" : "أكلة جديدة"}</Text><Pressable onPress={() => setModalVisible(false)}><IconSymbol name="close" size={24} color={colors.muted} /></Pressable></View>
            <Text style={[styles.inputLabel, { color: colors.foreground }]}>اسم الأكلة</Text>
            <TextInput value={name} onChangeText={setName} placeholder="مثال: مكرونة بالبشاميل" placeholderTextColor={colors.muted} style={[styles.field, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} textAlign="right" />
            <Text style={[styles.inputLabel, { color: colors.foreground }]}>التصنيف</Text>
            <View style={styles.modalPills}>{categories.slice(1).map((item) => <CategoryPill key={item} label={item} active={selectedCategory === item} onPress={() => setSelectedCategory(item as MealCategory)} />)}</View>
            <Text style={[styles.inputLabel, { color: colors.foreground }]}>اختَر رمزًا</Text>
            <View style={styles.emojiRow}>{emojis.map((item) => <Pressable key={item} onPress={() => setEmoji(item)} style={[styles.emojiChoice, selectedEmoji(emoji, item) && { borderColor: palette.terracotta, backgroundColor: "#F7E7DC" }]}><Text style={{ fontSize: 24 }}>{item}</Text></Pressable>)}</View>
            <Text style={[styles.inputLabel, { color: colors.foreground }]}>رابط صورة اختياري</Text>
            <TextInput value={image} onChangeText={setImage} placeholder="https://..." placeholderTextColor={colors.muted} style={[styles.field, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.surface }]} autoCapitalize="none" textAlign="right" />
            <Pressable onPress={saveDish} style={({ pressed }) => [styles.saveButton, pressed && { opacity: 0.8 }]}><Text style={styles.saveButtonText}>{editing ? "حفظ التعديلات" : "إضافة الأكلة"}</Text></Pressable>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function selectedEmoji(current: string, item: string) { return current === item; }

function DishCard({ dish, onEdit, onDelete, onFavorite }: { dish: Dish; onEdit: () => void; onDelete: () => void; onFavorite: () => void }) {
  const colors = useColors();
  return (
    <View style={[styles.dishCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.dishImageWrap}>{dish.image ? <Image source={{ uri: dish.image }} style={styles.dishImage} /> : <Text style={styles.dishEmoji}>{dish.emoji}</Text>}<Pressable onPress={onFavorite} style={styles.favoriteButton}><IconSymbol name="star.fill" size={18} color={dish.favorite ? palette.gold : "#B9B0A8"} /></Pressable></View>
      <Text style={[styles.dishName, { color: colors.foreground }]} numberOfLines={1}>{dish.name}</Text>
      <Text style={[styles.dishCategory, { color: colors.muted }]}>{dish.category}</Text>
      <View style={styles.cardActions}><Pressable onPress={onDelete}><IconSymbol name="delete" size={18} color={colors.muted} /></Pressable><Pressable onPress={onEdit}><IconSymbol name="edit" size={18} color={palette.terracotta} /></Pressable></View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: { flexDirection: "row-reverse", alignItems: "center", height: 48, borderRadius: 15, paddingHorizontal: 14, gap: 9, marginBottom: 13 },
  searchInput: { flex: 1, fontSize: 13, height: 48 },
  categoryRow: { paddingBottom: 16 },
  gridRow: { gap: 11, marginBottom: 11 },
  listContent: { paddingBottom: 28 },
  dishCard: { flex: 1, borderRadius: 19, borderWidth: 1, padding: 10, minWidth: 0 },
  dishImageWrap: { height: 108, borderRadius: 15, backgroundColor: "#F7EBDD", alignItems: "center", justifyContent: "center", marginBottom: 10, overflow: "hidden", position: "relative" },
  dishImage: { width: "100%", height: "100%" },
  dishEmoji: { fontSize: 47 },
  favoriteButton: { position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center" },
  dishName: { textAlign: "right", fontSize: 14, fontWeight: "800" },
  dishCategory: { textAlign: "right", fontSize: 11, marginTop: 4 },
  cardActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, paddingHorizontal: 2 },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(35,28,23,0.45)" },
  modal: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 21, paddingBottom: 30 },
  modalHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 21, fontWeight: "900" },
  inputLabel: { textAlign: "right", fontSize: 13, fontWeight: "800", marginBottom: 8, marginTop: 10 },
  field: { height: 48, borderWidth: 1, borderRadius: 14, paddingHorizontal: 13, fontSize: 13 },
  modalPills: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 5 },
  emojiRow: { flexDirection: "row-reverse", gap: 8, marginBottom: 2 },
  emojiChoice: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, borderColor: "transparent", backgroundColor: "#F7F1EA", alignItems: "center", justifyContent: "center" },
  saveButton: { marginTop: 22, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: palette.terracotta },
  saveButtonText: { color: "#FFF", fontSize: 15, fontWeight: "800" },
});
