-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Premio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "logroId" INTEGER NOT NULL,
    CONSTRAINT "Premio_logroId_fkey" FOREIGN KEY ("logroId") REFERENCES "Logro" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Premio" ("descripcion", "id", "logroId", "titulo") SELECT "descripcion", "id", "logroId", "titulo" FROM "Premio";
DROP TABLE "Premio";
ALTER TABLE "new_Premio" RENAME TO "Premio";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
