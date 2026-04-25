import { prisma } from "./lib/prisma";

async function main() {
  // const germany = {
  //   country: "Deutschland",
  //   countryCode: "DE",
  //
  //   languageType: "Indoeuropäisch",
  //
  //   languages: [
  //     {
  //       name: "Deutsch",
  //       speakers: 83000000,
  //     },
  //     {
  //       name: "Englisch",
  //       speakers: 12000000,
  //     },
  //     {
  //       name: "Türkisch",
  //       speakers: 3000000,
  //     },
  //   ],
  //
  //   organizations: ["EU", "UNO", "NATO", "G7"],
  //
  //   capital: "Berlin",
  //   currency: "Euro",
  //
  //   domain: ".de",
  //
  //   traffic: "right",
  //
  //   deathPenalty: false,
  //
  //   gdpPerCapita: 51000,
  // };

  const country = await prisma.country.create({
    data: {
      country: "Österreich",
      countryCode: "AT",
      languageType: "ka",

      languages: {
        create: [
          {
            language: {
              connectOrCreate: {
                where: { name: "Deutsch" },
                create: { name: "Deutsch" },
              },
            },
            speakers: 9_000_000,
          },
          {
            language: {
              connectOrCreate: {
                where: { name: "Englisch" },
                create: { name: "Englisch" },
              },
            },
            speakers: 500_000,
          },
        ],
      },

      organizations: {
        create: [
          {
            organization: {
              connectOrCreate: {
                where: { name: "EU" },
                create: { name: "EU" },
              },
            },
          },
          {
            organization: {
              connectOrCreate: {
                where: { name: "UNO" },
                create: { name: "UNO" },
              },
            },
          },
        ],
      },

      capital: "Wien",
      currency: "Euro",
      domain: ".at",
      traffic: "right",
      deathPenalty: false,
      gdpPerCapita: 55000,
    },

    include: {
      languages: {
        include: {
          language: true,
        },
      },
      organizations: {
        include: {
          organization: true,
        },
      },
    },
  });

  console.log("Created country:", JSON.stringify(country, null, 2));

  const allCountries = await prisma.country.findMany({
    include: {
      languages: {
        include: { language: true },
      },
      organizations: {
        include: { organization: true },
      },
    },
  });

  console.log(JSON.stringify(allCountries, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
