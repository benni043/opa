-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "languageType" TEXT NOT NULL,
    "organizations" TEXT[],
    "capital" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "traffic" TEXT NOT NULL,
    "deathPenalty" BOOLEAN NOT NULL,
    "gdpPerCapita" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "speakers" INTEGER NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CountryToLanguage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CountryToLanguage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_country_key" ON "Country"("country");

-- CreateIndex
CREATE UNIQUE INDEX "Country_countryCode_key" ON "Country"("countryCode");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE INDEX "_CountryToLanguage_B_index" ON "_CountryToLanguage"("B");

-- AddForeignKey
ALTER TABLE "_CountryToLanguage" ADD CONSTRAINT "_CountryToLanguage_A_fkey" FOREIGN KEY ("A") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountryToLanguage" ADD CONSTRAINT "_CountryToLanguage_B_fkey" FOREIGN KEY ("B") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
