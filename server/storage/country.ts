import type { NuxtError } from "nuxt/app";
import { countries } from "#server/database/schema";
import { useDrizzle } from "#server/utils/db/sql";
import type { Country, CountryListItem } from "#shared/types/types";

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
	},
	async getByCountryCode(countryCode: string): Promise<Country | NuxtError> {
		let countryDb;

		try {
			// countryDb = await prisma.country.findUnique({
			//   where: {
			//     countryCode,
			//   },
			//   include: {
			//     languages: {
			//       include: { language: true },
			//     },
			//     organizations: {
			//       include: { organization: true },
			//     },
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
	async create(country: Country): Promise<Country | NuxtError> {
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

			return country;
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
