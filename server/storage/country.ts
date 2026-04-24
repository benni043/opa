import type { NuxtError } from "nuxt/app";
import type { Country } from "#shared/types/types";
import { prisma } from "~~/lib/prisma";

export const Countries = {
  async create(country: Country): Promise<Country | NuxtError> {
    await prisma.country.create({
      data: {
        country: country.country,
        countryCode: country.countryCode,
        languageType: country.languageType,
        languages: {
          create: country.languages.map((l) => ({
            speakers: l.speakers,
            language: {
              connectOrCreate: {
                where: { name: l.name },
                create: { name: l.name },
              },
            },
          })),
        },

        organizations: {
          create: country.organizations.map((o) => ({
            organization: {
              connectOrCreate: {
                where: { name: o },
                create: { name: o },
              },
            },
          })),
        },
        capital: country.capital,
        currency: country.currency,
        domain: country.domain,
        traffic: country.traffic,
        deathPenalty: country.deathPenalty,
        gdpPerCapita: country.gdpPerCapita,
      },
    });

    return country;
  },
};
