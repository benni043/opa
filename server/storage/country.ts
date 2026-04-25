import type { NuxtError } from "nuxt/app";
import type { Country } from "#shared/types/types";
import { prisma } from "~~/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

function mapCountry(c: any): Country {
  return {
    country: c.country,
    countryCode: c.countryCode,
    languageType: c.languageType,

    languages: c.languages.map((l: any) => ({
      name: l.language.name,
      speakers: l.speakers,
    })),

    organizations: c.organizations.map((o: any) => o.organization.name),

    capital: c.capital,
    currency: c.currency,
    domain: c.domain,
    traffic: c.traffic,
    deathPenalty: c.deathPenalty,
    gdpPerCapita: c.gdpPerCapita,
  };
}

export const Countries = {
  async getAll(): Promise<{ country: string; countryCode: string }[]> {
    try {
      return await prisma.country.findMany({
        select: {
          country: true,
          countryCode: true,
        },
      });
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
  async getByCountryCode(countryCode: string): Promise<Country | NuxtError> {
    let countryDb;

    try {
      countryDb = await prisma.country.findUnique({
        where: {
          countryCode,
        },
        include: {
          languages: {
            include: { language: true },
          },
          organizations: {
            include: { organization: true },
          },
        },
      });
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

    if (!countryDb) {
      throw createError({
        statusCode: 404,
        statusMessage: "Country not found",
      });
    }

    return mapCountry(countryDb);
  },
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
