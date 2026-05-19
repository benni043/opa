import type { NuxtError } from "nuxt/app";
import { useDrizzle } from "#server/utils/db/sql";
import { eq } from "drizzle-orm";
import type { Country, CountryListItem } from "#shared/types/types";
import {
  countries,
  languages,
  countryLanguages,
  organizations,
  countryOrganizations,
} from "#server/database/schema";

function mapCountry(rows: any[]) {
  if (!rows.length) return null;

  const first = rows[0];

  const languagesMap = new Map<number, any>();
  const orgsMap = new Map<number, any>();

  for (const r of rows) {
    // languages
    if (r.languageId) {
      languagesMap.set(r.languageId, {
        id: r.languageId,
        name: r.languageName,
        speakers: r.speakers,
      });
    }

    // organizations
    if (r.organizationId) {
      orgsMap.set(r.organizationId, {
        id: r.organizationId,
        name: r.organizationName,
      });
    }
  }

  return {
    id: first.id,
    country: first.country,
    countryCode: first.countryCode,
    languageType: first.languageType,
    capital: first.capital,
    currency: first.currency,
    domain: first.domain,
    traffic: first.traffic,
    deathPenalty: first.deathPenalty,
    gdpPerCapita: first.gdpPerCapita,

    languages: [...languagesMap.values()],
    organizations: [...orgsMap.values()],
  };
}

export const Countries = {
  async getAll(): Promise<CountryListItem[]> {
    try {
      return useDrizzle()
        .select({
          country: countries.country,
          countryCode: countries.countryCode,
        })
        .from(countries);
    } catch (e) {
      console.error(e);

      throw createError({
        statusCode: 500,
        statusMessage: "Internal database error",
      });
    }
  },
  async getByCountryCode(countryCode: string): Promise<Country | NuxtError> {
    if (!countryCode) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing country code",
      });
    }

    let countryDb;

    try {
      countryDb = await useDrizzle()
        .select({
          // country
          id: countries.id,
          country: countries.country,
          countryCode: countries.countryCode,
          languageType: countries.languageType,
          capital: countries.capital,
          currency: countries.currency,
          domain: countries.domain,
          traffic: countries.traffic,
          deathPenalty: countries.deathPenalty,
          gdpPerCapita: countries.gdpPerCapita,

          // language
          languageId: languages.id,
          languageName: languages.name,
          speakers: countryLanguages.speakers,

          // organization
          organizationId: organizations.id,
          organizationName: organizations.name,
        })
        .from(countries)
        .leftJoin(
          countryLanguages,
          eq(countryLanguages.countryId, countries.id),
        )
        .leftJoin(languages, eq(languages.id, countryLanguages.languageId))
        .leftJoin(
          countryOrganizations,
          eq(countryOrganizations.countryId, countries.id),
        )
        .leftJoin(
          organizations,
          eq(organizations.id, countryOrganizations.organizationId),
        )
        .where(eq(countries.countryCode, countryCode));
    } catch (e) {
      console.error(e);

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

    console.log(countryDb);

    return mapCountry(countryDb);
  },
  async getAllByLanguage(
    language: string,
  ): Promise<CountryListItem[] | NuxtError> {
    let countryDb;

    try {
      // countryDb = await prisma.country.findMany({
      //   where: {
      //     languages: {
      //       some: {
      //         language: {
      //           name: {
      //             equals: language,
      //             mode: "insensitive",
      //           },
      //         },
      //       },
      //     },
      //   },
      //   select: {
      //     country: true,
      //     countryCode: true,
      //   },
      // });
    } catch (e) {
      console.error(e);

      // if (e instanceof PrismaClientKnownRequestError) {
      //   throw createError({
      //     statusCode: 400,
      //     statusMessage: "Database constraint error",
      //     data: e.code,
      //   });
      // }

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

    return countryDb;
  },
  async create(data: Country): Promise<Country | NuxtError> {
    try {
      // await prisma.country.create({
      //   data: {
      //     country: country.country,
      //     countryCode: country.countryCode,
      //     languageType: country.languageType,
      //     languages: {
      //       create: country.languages.map((l) => ({
      //         speakers: l.speakers,
      //         language: {
      //           connectOrCreate: {
      //             where: { name: l.name },
      //             create: { name: l.name },
      //           },
      //         },
      //       })),
      //     },

      //     organizations: {
      //       create: country.organizations.map((o) => ({
      //         organization: {
      //           connectOrCreate: {
      //             where: { name: o },
      //             create: { name: o },
      //           },
      //         },
      //       })),
      //     },
      //     capital: country.capital,
      //     currency: country.currency,
      //     domain: country.domain,
      //     traffic: country.traffic,
      //     deathPenalty: country.deathPenalty,
      //     gdpPerCapita: country.gdpPerCapita,
      //   },
      // });

      // return country;
      //
      return await useDrizzle().transaction(async (tx: any) => {
        // 1. Country insert
        const [country] = await tx
          .insert(countries)
          .values({
            country: data.country,
            countryCode: data.countryCode,
            languageType: data.languageType,
            capital: data.capital,
            currency: data.currency,
            domain: data.domain,
            traffic: data.traffic,
            deathPenalty: data.deathPenalty,
            gdpPerCapita: data.gdpPerCapita,
          })
          .returning();

        // 2. Languages
        const languageLinks = [];

        for (const lang of data.languages) {
          // find or create language
          let language = await tx.query.languages.findFirst({
            where: eq(languages.name, lang.name),
          });

          if (!language) {
            const [created] = await tx
              .insert(languages)
              .values({ name: lang.name })
              .returning();
            language = created;
          }

          languageLinks.push({
            countryId: country.id,
            languageId: language.id,
            speakers: lang.speakers,
          });
        }

        if (languageLinks.length) {
          await tx.insert(countryLanguages).values(languageLinks);
        }

        // 3. Organizations
        const orgLinks = [];

        for (const orgName of data.organizations) {
          let org = await tx.query.organizations.findFirst({
            where: eq(organizations.name, orgName),
          });

          if (!org) {
            const [created] = await tx
              .insert(organizations)
              .values({ name: orgName })
              .returning();
            org = created;
          }

          orgLinks.push({
            countryId: country.id,
            organizationId: org.id,
          });
        }

        if (orgLinks.length) {
          await tx.insert(countryOrganizations).values(orgLinks);
        }

        return country;
      });
    } catch (e) {
      console.error(e);

      // if (e instanceof PrismaClientKnownRequestError) {
      //   throw createError({
      //     statusCode: 400,
      //     statusMessage: "Database constraint error",
      //   });
      // }

      throw createError({
        statusCode: 500,
        statusMessage: "Internal database error",
      });
    }
  },
};
