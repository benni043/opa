import { z } from "zod";

const languageSchema = z.object({
	name: z.string().min(1),
	speakers: z.number(),
});

export type Language = z.infer<typeof languageSchema>;

const organizationSchema = z.object({
	name: z.string().min(1),
});

export type Organization = z.infer<typeof organizationSchema>;

export const countrySchema = z.object({
	country: z.string().min(1),
	countryCode: z.string().min(1),

	languageType: z.string().min(1),

	languages: z.array(languageSchema),

	organizations: z.array(organizationSchema),

	capital: z.string().min(1),
	currency: z.string().min(1),

	domain: z.string().regex(/^\.[a-z]{2}$/),

	traffic: z.string().min(1),

	deathPenalty: z.boolean(),

	gdpPerCapita: z.number(),
});

export type Country = z.infer<typeof countrySchema>;

export type CountryRow = {
	id: number;

	country: string;
	countryCode: string;
	languageType: string;

	capital: string;
	currency: string;
	domain: string;
	traffic: string;

	deathPenalty: boolean;
	gdpPerCapita: number;

	languageId: number | null;
	languageName: string | null;
	speakers: number | null;

	organizationId: number | null;
	organizationName: string | null;
};

export const CountryListItem = countrySchema.pick({
	country: true,
	countryCode: true,
});

export type CountryListItem = z.infer<typeof CountryListItem>;

export type LanguageCount = {
	language: string;
	totalSpeakers: number;
};
