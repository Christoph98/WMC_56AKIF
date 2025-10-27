-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "bio" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_User" ("bio", "email", "id", "passwordHash", "points", "profileImageUrl", "username") SELECT "bio", "email", "id", "passwordHash", "points", "profileImageUrl", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
