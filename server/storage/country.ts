import { eq } from "drizzle-orm";
import type { NuxtError } from "nuxt/app";
import {
	countries,
	countryLanguages,
	countryOrganizations,
	languages,
	organizations,
} from "#server/database/schema";
import { useDrizzle } from "#server/utils/db/sql";
import type {
	Country,
	CountryListItem,
	CountryRow,
	Language,
	Organization,
} from "#shared/types/types";

function mapCountry(rows: CountryRow[]) {
	if (!rows.length) return null;

	const first = rows[0];

	const languagesMap = new Map<number, Language>();
	const orgsMap = new Map<number, Organization>();

	for (const r of rows) {
		// languages
		if (r.languageId) {
			languagesMap.set(r.languageId, {
				name: r.languageName!,
				speakers: r.speakers!,
			});
		}

		// organizations
		if (r.organizationId) {
			orgsMap.set(r.organizationId, {
				name: r.organizationName!,
			});
		}
	}

	return {
		country: first!.country,
		countryCode: first!.countryCode,
		languageType: first!.languageType,
		capital: first!.capital,
		currency: first!.currency,
		domain: first!.domain,
		traffic: first!.traffic,
		deathPenalty: first!.deathPenalty,
		gdpPerCapita: first!.gdpPerCapita,

		languages: [...languagesMap.values()],
		organizations: [...orgsMap.values()],
	};
}

export const Countries = {
	async exists(countryCode: string): Promise<boolean | NuxtError> {
		try {
			const result = await useDrizzle()
				.select({
					id: countries.id,
				})
				.from(countries)
				.where(eq(countries.countryCode, countryCode))
				.limit(1);

			return result.length > 0;
		} catch (e) {
			console.error(e);

			throw createError({
				statusCode: 500,
				statusMessage: "Internal database error",
			});
		}
	},
	async getAll(): Promise<CountryListItem[] | NuxtError> {
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

		let countryDb: CountryRow[] | undefined;

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

		let countryDb: CountryListItem[] | undefined;

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
		try {
			await useDrizzle().transaction(async (tx) => {
				// create country
				const [countryDb] = await tx
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

				if (country.languages.length > 0) {
					// create missing languagess
					await tx
						.insert(languages)
						.values(
							country.languages.map((l) => ({
								name: l.name,
							})),
						)
						.onConflictDoNothing();

					// get language ids
					const languageDb = await tx
						.select({
							id: languages.id,
							name: languages.name,
						})
						.from(languages);

					const languageMap = new Map(languageDb.map((l) => [l.name, l.id]));

					// create country-language relations
					await tx
						.insert(countryLanguages)
						.values(
							country.languages.map((l) => ({
								countryId: countryDb!.id,
								languageId: languageMap.get(l.name)!,
								speakers: l.speakers,
							})),
						)
						.onConflictDoNothing();
				}

				if (country.organizations.length > 0) {
					// create missing organizations
					await tx
						.insert(organizations)
						.values(
							country.organizations.map((o) => ({
								name: o.name,
							})),
						)
						.onConflictDoNothing();

					// get organization ids
					const organizationDb = await tx
						.select({
							id: organizations.id,
							name: organizations.name,
						})
						.from(organizations);

					const organizationMap = new Map(
						organizationDb.map((o) => [o.name, o.id]),
					);

					// create country-organization relations
					await tx
						.insert(countryOrganizations)
						.values(
							country.organizations.map((o) => ({
								countryId: countryDb!.id,
								organizationId: organizationMap.get(o.name)!,
							})),
						)
						.onConflictDoNothing();
				}
			});

			return country;
		} catch (error) {
			console.log(error);

			if (error.cause.rawCode === 2067) {
				throw createError({
					statusCode: 400,
					statusMessage: "country code already exists",
				});
			}

			throw createError({
				statusCode: 500,
				statusMessage: "Internal database error",
			});
		}
	},
	async update(country: Country): Promise<Country | NuxtError> {
		if (!(await Countries.exists(country.countryCode))) {
			throw createError({
				statusCode: 400,
				statusMessage: "country does not exist",
			});
		}

		try {
			await useDrizzle().transaction(async (tx) => {
				// UPSERT country
				const [countryDb] = await tx
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
					.onConflictDoUpdate({
						target: countries.countryCode,
						set: {
							country: country.country,
							languageType: country.languageType,
							capital: country.capital,
							currency: country.currency,
							domain: country.domain,
							traffic: country.traffic,
							deathPenalty: country.deathPenalty,
							gdpPerCapita: country.gdpPerCapita,
						},
					})
					.returning({ id: countries.id });

				const countryId = countryDb!.id;

				// UPSERT languages
				if (country.languages.length > 0) {
					await tx
						.insert(languages)
						.values(
							country.languages.map((l) => ({
								name: l.name,
							})),
						)
						.onConflictDoNothing();
				}

				// UPSERT organizations
				if (country.organizations.length > 0) {
					await tx
						.insert(organizations)
						.values(
							country.organizations.map((o) => ({
								name: o.name,
							})),
						)
						.onConflictDoNothing();
				}

				// fetch IDs (needed for pivot rebuild)
				const languageDb = await tx
					.select({
						id: languages.id,
						name: languages.name,
					})
					.from(languages);

				const languageMap = new Map(languageDb.map((l) => [l.name, l.id]));

				const organizationDb = await tx
					.select({
						id: organizations.id,
						name: organizations.name,
					})
					.from(organizations);

				const organizationMap = new Map(
					organizationDb.map((o) => [o.name, o.id]),
				);

				// RECREATE pivot: country_languages
				await tx
					.delete(countryLanguages)
					.where(eq(countryLanguages.countryId, countryId));

				if (country.languages.length > 0) {
					await tx.insert(countryLanguages).values(
						country.languages.map((l) => ({
							countryId: countryId,
							languageId: languageMap.get(l.name)!,
							speakers: l.speakers,
						})),
					);
				}

				// RECREATE pivot: country_organizations
				await tx
					.delete(countryOrganizations)
					.where(eq(countryOrganizations.countryId, countryId));

				if (country.organizations.length > 0) {
					await tx.insert(countryOrganizations).values(
						country.organizations.map((o) => ({
							countryId: countryId,
							organizationId: organizationMap.get(o.name)!,
						})),
					);
				}
			});

			return country;
		} catch (e) {
			console.log(3);
			console.error(e);

			throw createError({
				statusCode: 500,
				statusMessage: "Internal database error",
			});
		}
	},
};
