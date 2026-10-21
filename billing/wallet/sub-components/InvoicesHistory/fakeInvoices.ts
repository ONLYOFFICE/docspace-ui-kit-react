import type { TInvoice } from "../../../types";

export const FAKE_INVOICES: TInvoice[] = [
  {
    id: "in_4",
    date: "2026-10-12T12:07:00",
    amount: 200,
    currency: "USD",
    url: "https://example.com/invoices/in_4",
  },
  {
    id: "in_3",
    date: "2026-09-17T10:54:00",
    amount: 200,
    currency: "USD",
    url: "https://example.com/invoices/in_3",
  },
  {
    id: "in_2",
    date: "2026-07-20T13:43:00",
    amount: 200,
    currency: "USD",
    url: "https://example.com/invoices/in_2",
  },
  {
    id: "in_1",
    date: "2026-03-27T17:34:00",
    amount: 100,
    currency: "USD",
    url: "https://example.com/invoices/in_1",
  },
];
