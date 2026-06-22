import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { itens } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  const url = new URL(req.url);
  const id = parseInt(url.searchParams.get("id") || "0");

  if (req.method === "GET") {
    const all = await db.select().from(itens).orderBy(itens.id);
    return Response.json(all);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const [item] = await db
      .insert(itens)
      .values({
        nome: body.nome,
        tipo: body.tipo ?? "toner",
        qty: body.qty ?? 0,
        min_qty: body.min ?? 2,
        ref: body.ref ?? "",
      })
      .returning();
    return Response.json(item, { status: 201 });
  }

  if (req.method === "PUT") {
    if (!id) return new Response("Missing id", { status: 400 });
    const body = await req.json();
    const [updated] = await db
      .update(itens)
      .set({
        nome: body.nome,
        tipo: body.tipo,
        qty: body.qty,
        min_qty: body.min,
        ref: body.ref,
      })
      .where(eq(itens.id, id))
      .returning();
    if (!updated) return new Response("Not found", { status: 404 });
    return Response.json(updated);
  }

  if (req.method === "DELETE") {
    if (!id) return new Response("Missing id", { status: 400 });
    await db.delete(itens).where(eq(itens.id, id));
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/itens" };
