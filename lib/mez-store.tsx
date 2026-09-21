import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type BudgetStatus = "open" | "closed";
export type Payment = { id: string; personId: string; amount: number; date: string; note?: string };
export type PurchaseCategory = "خضار" | "لحوم" | "دواجن" | "خبز" | "مشروبات" | "ألبان" | "بقالة" | "منظفات" | "أخرى";
export type Purchase = {
  id: string;
  name: string;
  category: PurchaseCategory;
  amount: number;
  paidById: string;
  paidFrom: "wallet" | "personal";
  date: string;
  note?: string;
};
export type Person = { id: string; name: string; avatar: string };
export type Budget = {
  id: string;
  name: string;
  startedAt: string;
  closedAt?: string;
  status: BudgetStatus;
  people: Person[];
  payments: Payment[];
  purchases: Purchase[];
};
export type PersonSummary = Person & {
  paid: number;
  share: number;
  balance: number;
  status: "له" | "عليه" | "متساوي";
};
export type Settlement = { fromId: string; toId: string; amount: number };

type StoreState = { current: Budget | null; history: Budget[]; currency: string; isDark: boolean; notifications: boolean };
type MezStore = StoreState & {
  hydrated: boolean;
  createBudget: (name: string, names: string[]) => void;
  updateBudgetName: (name: string) => void;
  addPerson: (name: string) => void;
  removePerson: (id: string) => void;
  addPayment: (data: Omit<Payment, "id" | "date"> & { date?: string }) => void;
  addPurchase: (data: Omit<Purchase, "id" | "date"> & { date?: string }) => void;
  deletePayment: (id: string) => void;
  deletePurchase: (id: string) => void;
  closeBudget: () => void;
  reopenBudget: (id: string) => void;
  setCurrency: (currency: string) => void;
  setIsDark: (value: boolean) => void;
  setNotifications: (value: boolean) => void;
};

const STORAGE_KEY = "mez-state-v1";
const CATEGORIES: PurchaseCategory[] = ["خضار", "لحوم", "دواجن", "خبز", "مشروبات", "ألبان", "بقالة", "منظفات", "أخرى"];
const defaultState: StoreState = { current: null, history: [], currency: "ر.س", isDark: false, notifications: true };
const StoreContext = createContext<MezStore | null>(null);
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const avatarFor = (name: string) => Array.from(name.trim())[0] || "؟";
const normalizeNames = (names: string[]) => names.map((name) => name.trim()).filter(Boolean).slice(0, 10);

export function MezStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          try { setState({ ...defaultState, ...JSON.parse(stored) }); } catch { setState(defaultState); }
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => { if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state, hydrated]);

  const value = useMemo<MezStore>(() => ({
    ...state,
    hydrated,
    createBudget: (name, names) => {
      const cleanNames = normalizeNames(names);
      setState((prev) => ({ ...prev, current: { id: makeId("budget"), name: name.trim() || "ميز جديد", startedAt: new Date().toISOString(), status: "open", people: cleanNames.map((personName) => ({ id: makeId("person"), name: personName, avatar: avatarFor(personName) })), payments: [], purchases: [] } }));
    },
    updateBudgetName: (name) => setState((prev) => prev.current ? { ...prev, current: { ...prev.current, name: name.trim() || prev.current.name } } : prev),
    addPerson: (name) => setState((prev) => {
      if (!prev.current || prev.current.people.length >= 10 || !name.trim()) return prev;
      const person = { id: makeId("person"), name: name.trim(), avatar: avatarFor(name) };
      return { ...prev, current: { ...prev.current, people: [...prev.current.people, person] } };
    }),
    removePerson: (id) => setState((prev) => prev.current ? { ...prev, current: { ...prev.current, people: prev.current.people.filter((person) => person.id !== id) } } : prev),
    addPayment: (data) => setState((prev) => prev.current ? { ...prev, current: { ...prev.current, payments: [{ ...data, id: makeId("payment"), date: data.date || new Date().toISOString() }, ...prev.current.payments] } } : prev),
    addPurchase: (data) => setState((prev) => prev.current ? { ...prev, current: { ...prev.current, purchases: [{ ...data, id: makeId("purchase"), date: data.date || new Date().toISOString() }, ...prev.current.purchases] } } : prev),
    deletePayment: (id) => setState((prev) => prev.current ? { ...prev, current: { ...prev.current, payments: prev.current.payments.filter((item) => item.id !== id) } } : prev),
    deletePurchase: (id) => setState((prev) => prev.current ? { ...prev, current: { ...prev.current, purchases: prev.current.purchases.filter((item) => item.id !== id) } } : prev),
    closeBudget: () => setState((prev) => {
      if (!prev.current) return prev;
      const closed = { ...prev.current, status: "closed" as const, closedAt: new Date().toISOString() };
      return { ...prev, current: null, history: [closed, ...prev.history] };
    }),
    reopenBudget: (id) => setState((prev) => {
      if (prev.current) return prev;
      const selected = prev.history.find((item) => item.id === id);
      if (!selected) return prev;
      return { ...prev, current: { ...selected, status: "open", closedAt: undefined }, history: prev.history.filter((item) => item.id !== id) };
    }),
    setCurrency: (currency) => setState((prev) => ({ ...prev, currency })),
    setIsDark: (isDark) => setState((prev) => ({ ...prev, isDark })),
    setNotifications: (notifications) => setState((prev) => ({ ...prev, notifications })),
  }), [state, hydrated]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useMezStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useMezStore must be used inside MezStoreProvider");
  return context;
}

export const PURCHASE_CATEGORIES = CATEGORIES;
export const formatMoney = (value: number, currency = "ر.س") => `${new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 2 }).format(Math.max(0, value))} ${currency}`;
export const formatDate = (value: string) => new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "short" }).format(new Date(value));
export const getTotalPayments = (budget: Budget) => budget.payments.reduce((sum, item) => sum + item.amount, 0);
export const getTotalExpenses = (budget: Budget) => budget.purchases.reduce((sum, item) => sum + item.amount, 0);
export const getWalletExpenses = (budget: Budget) => budget.purchases.filter((item) => item.paidFrom === "wallet").reduce((sum, item) => sum + item.amount, 0);
export const getWalletBalance = (budget: Budget) => Math.max(0, getTotalPayments(budget) - getWalletExpenses(budget));

export function getPersonSummaries(budget: Budget): PersonSummary[] {
  const expenses = getTotalExpenses(budget);
  const share = budget.people.length ? expenses / budget.people.length : 0;
  const paymentsByPerson = new Map(budget.people.map((person) => [person.id, budget.payments.filter((item) => item.personId === person.id).reduce((sum, item) => sum + item.amount, 0)]));
  const personalPurchasesByPerson = new Map(budget.people.map((person) => [person.id, budget.purchases.filter((item) => item.paidById === person.id && item.paidFrom === "personal").reduce((sum, item) => sum + item.amount, 0)]));
  const paymentTotal = getTotalPayments(budget);
  const walletRefund = getWalletBalance(budget);
  return budget.people.map((person) => {
    const deposit = paymentsByPerson.get(person.id) || 0;
    const paid = deposit + (personalPurchasesByPerson.get(person.id) || 0);
    const refund = paymentTotal ? walletRefund * (deposit / paymentTotal) : 0;
    const balance = paid - share - refund;
    return { ...person, paid, share, balance, status: balance > 0.01 ? "له" : balance < -0.01 ? "عليه" : "متساوي" };
  });
}

export function getSettlements(budget: Budget): Settlement[] {
  const summaries = getPersonSummaries(budget).map((item) => ({ id: item.id, balance: Math.round(item.balance * 100) / 100 }));
  const creditors = summaries.filter((item) => item.balance > 0.01).map((item) => ({ ...item }));
  const debtors = summaries.filter((item) => item.balance < -0.01).map((item) => ({ ...item, balance: Math.abs(item.balance) }));
  const settlements: Settlement[] = [];
  let i = 0; let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].balance, creditors[j].balance);
    settlements.push({ fromId: debtors[i].id, toId: creditors[j].id, amount: Math.round(amount * 100) / 100 });
    debtors[i].balance -= amount; creditors[j].balance -= amount;
    if (debtors[i].balance < 0.01) i++;
    if (creditors[j].balance < 0.01) j++;
  }
  return settlements;
}
