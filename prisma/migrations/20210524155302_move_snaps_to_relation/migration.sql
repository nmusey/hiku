/*
  Warnings:

  - You are about to drop the column `snapIds` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `registered` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Snap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Snap" DROP CONSTRAINT "Snap_snappedPostId_fkey";

-- DropForeignKey
ALTER TABLE "Snap" DROP CONSTRAINT "Snap_snapperId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "snapIds";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "registered",
ADD COLUMN     "registeredDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Snap";

-- CreateTable
CREATE TABLE "_Snap" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Snap_AB_unique" ON "_Snap"("A", "B");

-- CreateIndex
CREATE INDEX "_Snap_B_index" ON "_Snap"("B");

-- AddForeignKey
ALTER TABLE "_Snap" ADD FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Snap" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
