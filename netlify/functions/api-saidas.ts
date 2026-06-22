import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { saidas, itens } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method === "GET") {
    const all = await db.select().from(saidas).orderBy(saidas.id);
    return Response.json(all);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { loja_id, item_id, qty, obs } = body;

    if (!loja_id || !item_id || !qty) {
      return new Response("Campos obrigatórios ausentes", { status: 400 });
    }

    try {
      const result = await db.transaction(async (tx) => {
        const [item] = await tx.select().from(itens).where(eq(itens.id, item_id));
        if (!item) throw new Error("Item não encontrado");
        if (item.qty < qty) {
          throw new Error(`Estoque insuficiente (${item.qty} disponível${item.qty !== 1 ? "is" : ""})`);
        }

        const [updatedItem] = await tx
          .update(itens)
          .set({ qty: item.qty - qty })
          .where(eq(itens.id, item_id))
          .returning();

        const [saida] = await tx
          .insert(saidas)
          .values({ loja_id, item_id, qty, obs: obs ?? "" })
          .returning();

        return { saida, item: updatedItem };
      });

      return Response.json(result, { status: 201 });
    } catch (e: any) {
      return new Response(e.message || "Erro interno", { status: 400 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/saidas" };
