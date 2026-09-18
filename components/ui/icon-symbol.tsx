import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconName =
  | "house.fill"
  | "fork.knife"
  | "calendar"
  | "star.fill"
  | "gearshape.fill"
  | "plus"
  | "search"
  | "bell"
  | "chevron.left"
  | "chevron.right"
  | "edit"
  | "delete"
  | "heart"
  | "check"
  | "close"
  | "moon"
  | "notifications"
  | "person"
  | "add-circle";

const MAPPING: Record<IconName, ComponentProps<typeof MaterialIcons>["name"]> = {
  "house.fill": "home",
  "fork.knife": "restaurant",
  calendar: "calendar-today",
  "star.fill": "star",
  "gearshape.fill": "settings",
  plus: "add",
  search: "search",
  bell: "notifications-none",
  "chevron.left": "chevron-left",
  "chevron.right": "chevron-right",
  edit: "edit",
  delete: "delete-outline",
  heart: "favorite-border",
  check: "check",
  close: "close",
  moon: "dark-mode",
  notifications: "notifications",
  person: "person-outline",
  "add-circle": "add-circle-outline",
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: unknown;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
