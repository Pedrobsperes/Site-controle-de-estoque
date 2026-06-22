CREATE TABLE "itens" (
	"id" serial PRIMARY KEY,
	"nome" text NOT NULL,
	"tipo" text DEFAULT 'toner' NOT NULL,
	"qty" integer DEFAULT 0 NOT NULL,
	"min_qty" integer DEFAULT 2 NOT NULL,
	"ref" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lojas" (
	"id" serial PRIMARY KEY,
	"nome" text NOT NULL,
	"cod" text DEFAULT '' NOT NULL,
	"endereco" text DEFAULT '' NOT NULL,
	"responsavel" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saidas" (
	"id" serial PRIMARY KEY,
	"loja_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"qty" integer NOT NULL,
	"obs" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "saidas" ADD CONSTRAINT "saidas_loja_id_lojas_id_fkey" FOREIGN KEY ("loja_id") REFERENCES "lojas"("id");--> statement-breakpoint
ALTER TABLE "saidas" ADD CONSTRAINT "saidas_item_id_itens_id_fkey" FOREIGN KEY ("item_id") REFERENCES "itens"("id");