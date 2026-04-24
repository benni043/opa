import { prisma } from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
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

  console.log(allCountries);
});
