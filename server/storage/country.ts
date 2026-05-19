import { eq, or } from "drizzle-orm";
import type { NuxtError } from "nuxt/app";
import {
  countries,
  countryLanguages,
  countryOrganizations,
  languages,
  organizations,
} from "#server/database/schema";
import { useDrizzle } from "#server/utils/db/sql";
import type { Country, CountryListItem } from "#shared/types/types";

function mapCountry(rows: any[]) {
  if (!rows.length) return null;

  const first = rows[0];

  const languagesMap = new Map<number, any>();
  const orgsMap = new Map<number, any>();

  for (const r of rows) {
    // languages
    if (r.languageId) {
      languagesMap.set(r.languageId, {
        name: r.languageName,
        speakers: r.speakers,
      });
    }

    // organizations
    if (r.organizationId) {
      orgsMap.set(r.organizationId, {
        name: r.organizationName,
      });
    }
  }

  return {
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

    return mapCountry(countryDb)!;
  },
  async getAllByLanguage(
    language: string,
  ): Promise<CountryListItem[] | NuxtError> {
    if (!language) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing language",
      });
    }

    let countryDb;

    try {
      countryDb = await useDrizzle()
        .select({
          country: countries.country,
          countryCode: countries.countryCode,
        })
        .from(countries)
        .leftJoin(
          countryLanguages,
          eq(countryLanguages.countryId, countries.id),
        )
        .leftJoin(languages, eq(languages.id, countryLanguages.languageId))
        .where(eq(languages.name, language));
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

    return countryDb;
  },
  async create(country: Country): Promise<Country | NuxtError> {
    console.log(3);
    console.log(country);
    try {
      await useDrizzle().transaction(async (tx) => {
        console.log(4);
        const countryDb = await tx
          .insert(countries)
          .values({
            country: country.country,
            countryCode: country.countryCode,
            languageType: country.languageType,
            capital: country.capital,
            currency: country.currency,
            domain: country.domain,
            traffic: country.traffic,
            deathPenalty: country.deathPenalty,
            gdpPerCapita: country.gdpPerCapita,
          })
          .returning({ id: countries.id });
        console.log(5);

        const languageDb = await tx
          .insert(languages)
          .values(
            country.languages.map((l) => ({
              name: l.name,
              speakers: l.speakers,
            })),
          )
          .onConflictDoNothing()
          .returning({ id: languages.id });
        console.log(6);

        const organizationDb = await tx
          .insert(organizations)
          .values(
            country.organizations.map((o) => ({
              name: o.name,
            })),
          )
          .onConflictDoNothing()
          .returning({ id: organizations.id });
        console.log(7);

        const countryLanguagesDb = await tx
          .insert(countryLanguages)
          .values(
            languageDb.map((l) => ({
              countryId: countryDb[0]!.id,
              languageId: l.id,
              speakers: 0,
            })),
          )
          .onConflictDoNothing();
        console.log(8);

        const countryOrganizationsDb = await tx
          .insert(countryOrganizations)
          .values(
            organizationDb.map((o) => ({
              countryId: countryDb[0]!.id,
              organizationId: o.id,
            })),
          )
          .onConflictDoNothing();
      });
      console.log(9);

      return country;
    } catch (e) {
      console.error(e);

      throw createError({
        statusCode: 500,
        statusMessage: "Internal database error",
      });
    }
  },
};
