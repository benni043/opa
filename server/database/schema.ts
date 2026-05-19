import {
	integer,
	primaryKey,
	real,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const countries = sqliteTable(
	"countries",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),

		country: text("country").notNull(),
		countryCode: text("country_code").notNull(),

		languageType: text("language_type").notNull(),

		capital: text("capital").notNull(),
		currency: text("currency").notNull(),
		domain: text("domain").notNull(),
		traffic: text("traffic").notNull(),

		deathPenalty: integer("death_penalty", { mode: "boolean" }).notNull(),

		gdpPerCapita: real("gdp_per_capita").notNull(),
	},
	(t) => [
		uniqueIndex("countries_country_unique").on(t.country),
		uniqueIndex("countries_country_code_unique").on(t.countryCode),
	],
);

export const languages = sqliteTable(
	"languages",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		name: text("name").notNull(),
	},
	(t) => [uniqueIndex("languages_name_unique").on(t.name)],
);

export const countryLanguages = sqliteTable(
	"country_languages",
	{
		countryId: integer("country_id")
			.notNull()
			.references(() => countries.id),

		languageId: integer("language_id")
			.notNull()
			.references(() => languages.id),

		speakers: integer("speakers").notNull(),
	},
	(t) => [primaryKey({ columns: [t.countryId, t.languageId] })],
);

export const organizations = sqliteTable(
	"organizations",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		name: text("name").notNull(),
	},
	(t) => [uniqueIndex("organizations_name_unique").on(t.name)],
);

export const countryOrganizations = sqliteTable(
	"country_organizations",
	{
		countryId: integer("country_id")
			.notNull()
			.references(() => countries.id),

		organizationId: integer("organization_id")
			.notNull()
			.references(() => organizations.id),
	},
	(t) => [primaryKey({ columns: [t.countryId, t.organizationId] })],
);
