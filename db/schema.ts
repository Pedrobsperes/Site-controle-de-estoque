import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const itens = pgTable("itens", {
  id: serial().primaryKey(),
  nome: text().notNull(),
  tipo: text().notNull().default("toner"),
  qty: integer().notNull().default(0),
  min_qty: integer("min_qty").notNull().default(2),
  ref: text().notNull().default(""),
  created_at: timestamp("created_at").defaultNow(),
});

export const lojas = pgTable("lojas", {
  id: serial().primaryKey(),
  nome: text().notNull(),
  cod: text().notNull().default(""),
  endereco: text().notNull().default(""),
  responsavel: text().notNull().default(""),
  created_at: timestamp("created_at").defaultNow(),
});

export const saidas = pgTable("saidas", {
  id: serial().primaryKey(),
  loja_id: integer("loja_id").notNull().references(() => lojas.id),
  item_id: integer("item_id").notNull().references(() => itens.id),
  qty: integer().notNull(),
  obs: text().notNull().default(""),
  created_at: timestamp("created_at").defaultNow(),
});
