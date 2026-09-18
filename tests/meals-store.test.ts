import { describe, expect, it } from "vitest";

import { countPlannedMeals, createEmptyPlan, formatArabicDate, WEEK_DAYS } from "../lib/meals-store";

describe("meal planning helpers", () => {
  it("creates an empty plan for all seven Arabic days", () => {
    const plan = createEmptyPlan();
    expect(Object.keys(plan)).toHaveLength(7);
    expect(Object.keys(plan)).toEqual(WEEK_DAYS);
    expect(plan["السبت"].فطار).toEqual([]);
    expect(plan["الجمعة"].عشاء).toEqual([]);
  });

  it("counts planned meal slots, not individual dishes", () => {
    const plan = createEmptyPlan();
    plan["السبت"].فطار = ["dish-1", "dish-2"];
    plan["السبت"].غداء = ["dish-3"];
    plan["الأحد"].عشاء = ["dish-5"];
    expect(countPlannedMeals(plan)).toBe(3);
  });

  it("formats a date using Arabic month names", () => {
    const formatted = formatArabicDate(new Date(2026, 0, 15));
    expect(formatted).toContain("يناير");
  });
});
