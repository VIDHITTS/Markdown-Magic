/*
  Warnings:

  - You are about to drop the column `cssContent` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `htmlContent` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `jsContent` on the `projects` table. All the data in the column will be lost.
  - Added the required column `cssCode` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `htmlCode` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jsCode` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `projects` DROP COLUMN `cssContent`,
    DROP COLUMN `htmlContent`,
    DROP COLUMN `jsContent`,
    ADD COLUMN `cssCode` LONGTEXT NOT NULL,
    ADD COLUMN `htmlCode` LONGTEXT NOT NULL,
    ADD COLUMN `jsCode` LONGTEXT NOT NULL;
