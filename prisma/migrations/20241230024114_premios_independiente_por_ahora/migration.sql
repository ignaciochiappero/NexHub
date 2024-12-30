/*
  Warnings:

  - You are about to drop the column `logroId` on the `Premio` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Premio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL
);
INSERT INTO "new_Premio" ("descripcion", "id", "titulo") SELECT "descripcion", "id", "titulo" FROM "Premio";
DROP TABLE "Premio";
ALTER TABLE "new_Premio" RENAME TO "Premio";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
