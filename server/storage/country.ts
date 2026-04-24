import type { NuxtError } from "nuxt/app";
import type { Country } from "#shared/types/types";
import { prisma } from "~~/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export const Countries = {
  async create(country: Country): Promise<Country | NuxtError> {
    try {
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
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw createError({
          statusCode: 400,
          statusMessage: "Database constraint error",
          data: e.code,
        });
      }

      throw createError({
        statusCode: 500,
        statusMessage: "Internal database error",
      });
    }
  },
};
