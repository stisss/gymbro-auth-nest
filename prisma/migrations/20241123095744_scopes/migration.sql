/*
  Warnings:

  - The `scopes` column on the `Client` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Scope" AS ENUM ('EMAIL', 'LOGIN');

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "scopes",
ADD COLUMN     "scopes" "Scope"[];
