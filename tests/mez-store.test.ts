import { describe, expect, it } from "vitest";
import { getPersonSummaries, getSettlements, type Budget } from "../lib/mez-store";

const budget: Budget = {
  id: "b1", name: "اختبار", startedAt: "2026-01-01T00:00:00.000Z", status: "open",
  people: [{ id: "a", name: "أحمد", avatar: "أ" }, { id: "b", name: "سارة", avatar: "س" }, { id: "c", name: "علي", avatar: "ع" }],
  payments: [{ id: "p1", personId: "a", amount: 90, date: "2026-01-01T00:00:00.000Z" }],
  purchases: [{ id: "x1", name: "غداء", category: "بقالة", amount: 60, paidById: "a", paidFrom: "personal", date: "2026-01-01T00:00:00.000Z" }, { id: "x2", name: "مشروبات", category: "مشروبات", amount: 30, paidById: "b", paidFrom: "personal", date: "2026-01-01T00:00:00.000Z" }],
};

describe("منطق ميز", () => {
  it("يقسم المصروفات بالتساوي ويحدد له وعليه", () => {
    const summaries = getPersonSummaries(budget);
    expect(summaries.map((item) => item.share)).toEqual([30, 30, 30]);
    expect(summaries[0].status).toBe("له");
    expect(summaries[1].status).toBe("متساوي");
    expect(summaries[2].status).toBe("عليه");
  });
  it("ينتج تحويلًا واحدًا من المدين إلى الدائن", () => {
    const settlements = getSettlements(budget);
    expect(settlements).toHaveLength(1);
    expect(settlements[0]).toMatchObject({ fromId: "c", toId: "a", amount: 30 });
  });
});
