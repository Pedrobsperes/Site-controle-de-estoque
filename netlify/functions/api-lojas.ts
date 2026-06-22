import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { lojas } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  const url = new URL(req.url);
  const id = parseInt(url.searchParams.get("id") || "0");

  if (req.method === "GET") {
    const all = await db.select().from(lojas).orderBy(lojas.id);
    return Response.json(all);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const [loja] = await db
      .insert(lojas)
      .values({
        nome: body.nome,
        cod: body.cod ?? "",
        endereco: body.end ?? "",
        responsavel: body.resp ?? "",
      })
      .returning();
    return Response.json(loja, { status: 201 });
  }

  if (req.method === "PUT") {
    if (!id) return new Response("Missing id", { status: 400 });
    const body = await req.json();
    const [updated] = await db
      .update(lojas)
      .set({
        nome: body.nome,
        cod: body.cod,
        endereco: body.end,
        responsavel: body.resp,
      })
      .where(eq(lojas.id, id))
      .returning();
    if (!updated) return new Response("Not found", { status: 404 });
    return Response.json(updated);
  }

  if (req.method === "DELETE") {
    if (!id) return new Response("Missing id", { status: 400 });
    await db.delete(lojas).where(eq(lojas.id, id));
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/lojas" };
