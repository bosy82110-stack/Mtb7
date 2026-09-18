import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AppHeader, IconButton, palette } from "@/components/meal-ui";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useMealStore } from "@/lib/meals-store";
import { useThemeContext } from "@/lib/theme-provider";

export default function SettingsScreen() {
  const colors = useColors();
  const { userName, isDark, notifications, setUserName, setIsDark, setNotifications } = useMealStore();
  const { setColorScheme } = useThemeContext();
  const [name, setName] = useState(userName);

  useEffect(() => { setColorScheme(isDark ? "dark" : "light"); }, [isDark, setColorScheme]);

  const toggleDark = (value: boolean) => { setIsDark(value); setColorScheme(value ? "dark" : "light"); };
  const saveName = () => { if (name.trim()) setUserName(name.trim()); };

  return (
    <ScreenContainer className="px-5 pt-4" containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <AppHeader title="الإعدادات" subtitle="خصّص تجربتك في المطبخ" right={<IconButton icon="gearshape.fill" />} />
        <View style={styles.profileHero}><View style={styles.avatar}><Text style={styles.avatarText}>{(userName || "أ").slice(0, 1)}</Text></View><View style={styles.profileCopy}><Text style={styles.profileEyebrow}>مرحبًا بك في</Text><Text style={styles.profileName}>{userName}</Text><Text style={styles.profileSub}>خلّي كل وجبة على مزاجك</Text></View></View>

        <Text style={[styles.groupTitle, { color: colors.muted }]}>الحساب</Text>
        <View style={[styles.group, { backgroundColor: colors.surface }]}><View style={styles.settingRow}><View style={styles.rowIcon}><IconSymbol name="person" size={20} color={palette.terracotta} /></View><View style={styles.settingCopy}><Text style={[styles.settingTitle, { color: colors.foreground }]}>اسم المستخدم</Text><Text style={[styles.settingHint, { color: colors.muted }]}>يظهر في الصفحة الرئيسية</Text></View></View><View style={styles.nameEdit}><TextInput value={name} onChangeText={setName} onBlur={saveName} onSubmitEditing={saveName} returnKeyType="done" style={[styles.nameInput, { color: colors.foreground, borderColor: colors.border }]} textAlign="right"/><Pressable onPress={saveName} style={styles.nameSave}><Text style={styles.nameSaveText}>حفظ</Text></Pressable></View></View>

        <Text style={[styles.groupTitle, { color: colors.muted }]}>التفضيلات</Text>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <SettingToggle icon="moon" title="الوضع الليلي" hint="راحة أكثر للعين في المساء" value={isDark} onChange={toggleDark} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingToggle icon="notifications" title="الإشعارات" hint="تذكيرات الوجبات والخطة" value={notifications} onChange={setNotifications} colors={colors} />
        </View>

        <Text style={[styles.groupTitle, { color: colors.muted }]}>عن التطبيق</Text>
        <View style={[styles.group, { backgroundColor: colors.surface }]}><View style={styles.infoRow}><Text style={[styles.infoText, { color: colors.muted }]}>الإصدار 1.0.0</Text><Text style={[styles.settingTitle, { color: colors.foreground }]}>المطبخ</Text></View><View style={[styles.divider, { backgroundColor: colors.border }]} /><View style={styles.infoRow}><Text style={[styles.infoText, { color: colors.muted }]}>تنظيم الأكلات وتخطيط الوجبات</Text><Text style={[styles.settingTitle, { color: colors.foreground }]}>عن التطبيق</Text></View></View>
        <Text style={[styles.footerText, { color: colors.muted }]}>صُمّم بحب لعشاق الأكل المنظّم 🍲</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

function SettingToggle({ icon, title, hint, value, onChange, colors }: { icon: "moon" | "notifications"; title: string; hint: string; value: boolean; onChange: (value: boolean) => void; colors: ReturnType<typeof useColors> }) {
  return <View style={styles.settingRow}><View style={styles.rowIcon}><IconSymbol name={icon} size={20} color={palette.terracotta} /></View><View style={styles.settingCopy}><Text style={[styles.settingTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.settingHint, { color: colors.muted }]}>{hint}</Text></View><Switch value={value} onValueChange={onChange} trackColor={{ false: "#D6CDC5", true: "#E8A18A" }} thumbColor={value ? palette.terracotta : "#FFF"} /></View>;
}

const styles = StyleSheet.create({
  content: { paddingBottom: 32 },
  profileHero: { flexDirection: "row-reverse", alignItems: "center", padding: 18, borderRadius: 22, backgroundColor: palette.terracotta, marginBottom: 23 },
  avatar: { width: 62, height: 62, borderRadius: 22, backgroundColor: "#F9D7C4", alignItems: "center", justifyContent: "center", marginLeft: 14 },
  avatarText: { color: palette.terracotta, fontSize: 27, fontWeight: "900" },
  profileCopy: { flex: 1, alignItems: "flex-end" },
  profileEyebrow: { color: "#FFE9DE", fontSize: 12 },
  profileName: { color: "#FFF", fontSize: 22, fontWeight: "900", marginTop: 2 },
  profileSub: { color: "#FFE9DE", fontSize: 11, marginTop: 2 },
  groupTitle: { textAlign: "right", fontSize: 12, fontWeight: "800", marginBottom: 8, marginRight: 3 },
  group: { borderRadius: 19, padding: 15, marginBottom: 19 },
  settingRow: { flexDirection: "row-reverse", alignItems: "center", minHeight: 48 },
  rowIcon: { width: 37, height: 37, borderRadius: 12, backgroundColor: "#F8E7DD", alignItems: "center", justifyContent: "center", marginLeft: 11 },
  settingCopy: { flex: 1, alignItems: "flex-end" },
  settingTitle: { fontSize: 14, fontWeight: "800" },
  settingHint: { fontSize: 11, marginTop: 3 },
  divider: { height: 1, marginVertical: 13 },
  nameEdit: { flexDirection: "row-reverse", gap: 8, alignItems: "center", marginTop: 12 },
  nameInput: { flex: 1, height: 42, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, fontSize: 13 },
  nameSave: { height: 42, paddingHorizontal: 15, borderRadius: 12, backgroundColor: palette.terracotta, alignItems: "center", justifyContent: "center" },
  nameSaveText: { color: "#FFF", fontSize: 12, fontWeight: "800" },
  infoRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", minHeight: 35 },
  infoText: { fontSize: 11 },
  footerText: { textAlign: "center", fontSize: 11, marginTop: 4 },
});
