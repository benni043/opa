/*
  Warnings:

  - You are about to drop the column `organizations` on the `Country` table. All the data in the column will be lost.
  - You are about to drop the column `speakers` on the `Language` table. All the data in the column will be lost.
  - You are about to drop the `_CountryToLanguage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CountryToLanguage" DROP CONSTRAINT "_CountryToLanguage_A_fkey";

-- DropForeignKey
ALTER TABLE "_CountryToLanguage" DROP CONSTRAINT "_CountryToLanguage_B_fkey";

-- AlterTable
ALTER TABLE "Country" DROP COLUMN "organizations";

-- AlterTable
ALTER TABLE "Language" DROP COLUMN "speakers";

-- DropTable
DROP TABLE "_CountryToLanguage";

-- CreateTable
CREATE TABLE "CountryLanguage" (
    "countryId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "speakers" INTEGER NOT NULL,

    CONSTRAINT "CountryLanguage_pkey" PRIMARY KEY ("countryId","languageId")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryOrganization" (
    "countryId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "CountryOrganization_pkey" PRIMARY KEY ("countryId","organizationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- AddForeignKey
ALTER TABLE "CountryLanguage" ADD CONSTRAINT "CountryLanguage_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryLanguage" ADD CONSTRAINT "CountryLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryOrganization" ADD CONSTRAINT "CountryOrganization_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryOrganization" ADD CONSTRAINT "CountryOrganization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
