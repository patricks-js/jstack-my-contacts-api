CREATE TABLE IF NOT EXISTS "categories" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "contacts" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "category_id" TEXT,
  CONSTRAINT "fk_category" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE SET NULL
);
