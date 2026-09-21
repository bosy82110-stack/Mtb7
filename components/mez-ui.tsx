import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { PersonSummary } from "@/lib/mez-store";

export function Header({ title, subtitle, onBack, action }: { title: string; subtitle?: string; onBack?: () => void; action?: ReactNode }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
      </View>
      {onBack ? <Pressable onPress={onBack} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}><IconSymbol name="chevron.right" size={23} color="#17343A" /></Pressable> : action}
    </View>
  );
}

export function SectionTitle({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {
  return <View style={styles.sectionRow}><Text style={styles.sectionTitle}>{title}</Text>{action ? <Pressable onPress={onPress} hitSlop={8}><Text style={styles.sectionAction}>{action}</Text></Pressable> : null}</View>;
}

export function StatCard({ label, value, icon, tone = "primary", compact = false }: { label: string; value: string; icon: "wallet" | "receipt" | "people" | "insights"; tone?: "primary" | "warning" | "success" | "neutral"; compact?: boolean }) {
  const colors = { primary: ["#E3F3ED", "#2B927F"], warning: ["#FFF0DB", "#C7792E"], success: ["#E1F2E5", "#408A5A"], neutral: ["#EEF1F0", "#647579"] } as const;
  const [bg, tint] = colors[tone];
  return <View style={[styles.statCard, compact && styles.statCompact]}><View style={[styles.statIcon, { backgroundColor: bg }]}><IconSymbol name={icon} size={20} color={tint} /></View><Text style={styles.statLabel}>{label}</Text><Text style={[styles.statValue, compact && styles.statValueCompact]}>{value}</Text></View>;
}

export function PersonCard({ person, currency, onPress }: { person: PersonSummary; currency: string; onPress?: () => void }) {
  const tone = person.status === "له" ? "success" : person.status === "عليه" ? "warning" : "neutral";
  const color = tone === "success" ? "#2B927F" : tone === "warning" ? "#C7792E" : "#718287";
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.personCard, pressed && styles.pressed]}><View style={styles.avatar}><Text style={styles.avatarText}>{person.avatar}</Text></View><View style={styles.personMain}><Text style={styles.personName}>{person.name}</Text><Text style={styles.personMeta}>نصيبه {person.share.toFixed(2)} {currency}</Text></View><View style={styles.personBalance}><Text style={[styles.personStatus, { color }]}>{person.status}</Text><Text style={[styles.personAmount, { color }]}>{Math.abs(person.balance).toFixed(2)} {currency}</Text></View></Pressable>;
}

export function EmptyState({ icon = "receipt", title, description, action, onPress }: { icon?: "receipt" | "people" | "wallet" | "history" | "swap"; title: string; description: string; action?: string; onPress?: () => void }) {
  return <View style={styles.empty}><View style={styles.emptyIcon}><IconSymbol name={icon} size={28} color="#2B927F" /></View><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyText}>{description}</Text>{action ? <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}><IconSymbol name="plus" size={19} color="#FFFFFF" /><Text style={styles.primaryButtonText}>{action}</Text></Pressable> : null}</View>;
}

export function PrimaryButton({ title, onPress, icon = "plus", variant = "primary" }: { title: string; onPress: () => void; icon?: "plus" | "check" | "arrow" | "lock" | "restart"; variant?: "primary" | "outline" | "danger" }) {
  const style = variant === "outline" ? styles.outlineButton : variant === "danger" ? styles.dangerButton : styles.primaryButton;
  const tint = variant === "outline" ? "#2B927F" : "#FFFFFF";
  return <Pressable onPress={onPress} style={({ pressed }) => [style, pressed && styles.pressed]}><IconSymbol name={icon} size={19} color={tint} /><Text style={[styles.primaryButtonText, variant === "outline" && styles.outlineButtonText]}>{title}</Text></Pressable>;
}

export const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  headerText: { alignItems: "flex-end", flex: 1 }, headerTitle: { fontSize: 26, lineHeight: 34, fontWeight: "800", color: "#17343A", textAlign: "right" }, headerSubtitle: { color: "#718287", fontSize: 13, marginTop: 3, textAlign: "right" },
  iconButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#E6E1D8" },
  sectionRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }, sectionTitle: { fontSize: 17, fontWeight: "800", color: "#17343A", textAlign: "right" }, sectionAction: { color: "#2B927F", fontWeight: "700", fontSize: 13 },
  statCard: { width: "48%", backgroundColor: "#FFFFFF", borderRadius: 20, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: "#E6E1D8" }, statCompact: { padding: 12 }, statIcon: { width: 36, height: 36, borderRadius: 13, alignItems: "center", justifyContent: "center", marginBottom: 10, alignSelf: "flex-end" }, statLabel: { color: "#718287", fontSize: 12, textAlign: "right", marginBottom: 3 }, statValue: { color: "#17343A", fontSize: 19, fontWeight: "800", textAlign: "right" }, statValueCompact: { fontSize: 16 },
  personCard: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 13, marginBottom: 9, borderWidth: 1, borderColor: "#E6E1D8", flexDirection: "row-reverse", alignItems: "center" }, avatar: { width: 42, height: 42, borderRadius: 15, backgroundColor: "#DDF1EA", alignItems: "center", justifyContent: "center", marginLeft: 11 }, avatarText: { fontSize: 18, fontWeight: "800", color: "#2B927F" }, personMain: { flex: 1, alignItems: "flex-end" }, personName: { color: "#17343A", fontWeight: "800", fontSize: 15 }, personMeta: { color: "#718287", fontSize: 11, marginTop: 4 }, personBalance: { alignItems: "flex-start", minWidth: 80 }, personStatus: { fontWeight: "800", fontSize: 12 }, personAmount: { fontWeight: "800", fontSize: 13, marginTop: 3 },
  empty: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 22, borderWidth: 1, borderColor: "#E6E1D8", padding: 26, marginTop: 10 }, emptyIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: "#E3F3ED", alignItems: "center", justifyContent: "center", marginBottom: 12 }, emptyTitle: { color: "#17343A", fontSize: 18, fontWeight: "800", textAlign: "center" }, emptyText: { color: "#718287", fontSize: 13, lineHeight: 21, textAlign: "center", marginTop: 6, maxWidth: 290 },
  primaryButton: { minHeight: 47, borderRadius: 15, backgroundColor: "#2B927F", paddingHorizontal: 17, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8 }, primaryButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" }, outlineButton: { minHeight: 47, borderRadius: 15, paddingHorizontal: 17, borderWidth: 1, borderColor: "#2B927F", backgroundColor: "#FFFFFF", flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8 }, outlineButtonText: { color: "#2B927F" }, dangerButton: { minHeight: 47, borderRadius: 15, paddingHorizontal: 17, backgroundColor: "#C85B58", flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8 }, pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});
