import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type MealCategory = "فطار" | "غداء" | "عشاء" | "أخرى";
export type MealSlot = "فطار" | "غداء" | "عشاء";
export type DayKey = "السبت" | "الأحد" | "الإثنين" | "الثلاثاء" | "الأربعاء" | "الخميس" | "الجمعة";

export type Dish = {
  id: string;
  name: string;
  category: MealCategory;
  image?: string;
  emoji: string;
  favorite: boolean;
};

type WeeklyPlan = Record<DayKey, Record<MealSlot, string[]>>;

type StoreState = {
  dishes: Dish[];
  plan: WeeklyPlan;
  userName: string;
  isDark: boolean;
  notifications: boolean;
};

type MealStore = StoreState & {
  hydrated: boolean;
  addDish: (dish: Omit<Dish, "id" | "favorite">) => void;
  updateDish: (id: string, dish: Partial<Omit<Dish, "id" | "favorite">>) => void;
  deleteDish: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setPlanItems: (day: DayKey, slot: MealSlot, ids: string[]) => void;
  setUserName: (name: string) => void;
  setIsDark: (value: boolean) => void;
  setNotifications: (value: boolean) => void;
};

const STORAGE_KEY = "almatbakh-state-v1";
const DAYS: DayKey[] = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const SLOTS: MealSlot[] = ["فطار", "غداء", "عشاء"];

export const createEmptyPlan = (): WeeklyPlan =>
  DAYS.reduce((acc, day) => {
    acc[day] = { فطار: [], غداء: [], عشاء: [] };
    return acc;
  }, {} as WeeklyPlan);

const initialDishes: Dish[] = [
  { id: "dish-1", name: "فول بالزيت الحار", category: "فطار", emoji: "🥣", favorite: true },
  { id: "dish-2", name: "بيض وجبنة ومخلل", category: "فطار", emoji: "🍳", favorite: true },
  { id: "dish-3", name: "كبسة دجاج", category: "غداء", emoji: "🍗", favorite: false },
  { id: "dish-4", name: "مكرونة بالبشاميل", category: "غداء", emoji: "🍝", favorite: true },
  { id: "dish-5", name: "شوربة عدس", category: "عشاء", emoji: "🍲", favorite: false },
  { id: "dish-6", name: "سلطة خضراء", category: "أخرى", emoji: "🥗", favorite: false },
];

const defaultState: StoreState = {
  dishes: initialDishes,
  plan: {
    ...createEmptyPlan(),
    السبت: { فطار: ["dish-1", "dish-2"], غداء: ["dish-3"], عشاء: ["dish-5"] },
    الأحد: { فطار: ["dish-2"], غداء: ["dish-4"], عشاء: ["dish-6"] },
  },
  userName: "أحمد",
  isDark: false,
  notifications: true,
};

const MealStoreContext = createContext<MealStore | null>(null);

export function MealStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          try {
            setState({ ...defaultState, ...JSON.parse(stored) });
          } catch {
            setState(defaultState);
          }
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const value = useMemo<MealStore>(() => ({
    ...state,
    hydrated,
    addDish: (dish) => setState((prev) => ({ ...prev, dishes: [{ ...dish, id: `dish-${Date.now()}`, favorite: false }, ...prev.dishes] })),
    updateDish: (id, dish) => setState((prev) => ({ ...prev, dishes: prev.dishes.map((item) => item.id === id ? { ...item, ...dish } : item) })),
    deleteDish: (id) => setState((prev) => ({
      ...prev,
      dishes: prev.dishes.filter((dish) => dish.id !== id),
      plan: DAYS.reduce((plan, day) => {
        plan[day] = SLOTS.reduce((dayPlan, slot) => {
          dayPlan[slot] = prev.plan[day][slot].filter((dishId) => dishId !== id);
          return dayPlan;
        }, {} as Record<MealSlot, string[]>);
        return plan;
      }, {} as WeeklyPlan),
    })),
    toggleFavorite: (id) => setState((prev) => ({ ...prev, dishes: prev.dishes.map((dish) => dish.id === id ? { ...dish, favorite: !dish.favorite } : dish) })),
    setPlanItems: (day, slot, ids) => setState((prev) => ({ ...prev, plan: { ...prev.plan, [day]: { ...prev.plan[day], [slot]: ids } } })),
    setUserName: (userName) => setState((prev) => ({ ...prev, userName })),
    setIsDark: (isDark) => setState((prev) => ({ ...prev, isDark })),
    setNotifications: (notifications) => setState((prev) => ({ ...prev, notifications })),
  }), [state, hydrated]);

  return <MealStoreContext.Provider value={value}>{children}</MealStoreContext.Provider>;
}

export function useMealStore() {
  const context = useContext(MealStoreContext);
  if (!context) throw new Error("useMealStore must be used inside MealStoreProvider");
  return context;
}

export const WEEK_DAYS = DAYS;
export const MEAL_SLOTS = SLOTS;

export function countPlannedMeals(plan: WeeklyPlan) {
  return WEEK_DAYS.reduce((total, day) => total + MEAL_SLOTS.filter((slot) => plan[day][slot].length > 0).length, 0);
}

export function getStartOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const saturdayOffset = day === 6 ? 0 : -(day + 1);
  const start = new Date(now);
  start.setDate(now.getDate() + saturdayOffset);
  return start;
}

export function formatArabicDate(date: Date) {
  return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "long" }).format(date);
}
