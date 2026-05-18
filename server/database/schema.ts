import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  doublePrecision,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

export const countries = pgTable(
  "countries",
  {
    id: serial("id").primaryKey(),

    country: text("country").notNull(),
    countryCode: text("country_code").notNull(),

    languageType: text("language_type").notNull(),

    capital: text("capital").notNull(),
    currency: text("currency").notNull(),
    domain: text("domain").notNull(),
    traffic: text("traffic").notNull(),

    deathPenalty: boolean("death_penalty").notNull(),

    gdpPerCapita: doublePrecision("gdp_per_capita").notNull(),
  },
  (t) => ({
    countryUnique: uniqueIndex("countries_country_unique").on(t.country),
    countryCodeUnique: uniqueIndex("countries_country_code_unique").on(
      t.countryCode,
    ),
  }),
);

export const languages = pgTable(
  "languages",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
  },
  (t) => ({
    nameUnique: uniqueIndex("languages_name_unique").on(t.name),
  }),
);

export const countryLanguages = pgTable(
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
  (t) => ({
    pk: primaryKey({ columns: [t.countryId, t.languageId] }),
  }),
);

export const organizations = pgTable(
  "organizations",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
  },
  (t) => ({
    nameUnique: uniqueIndex("organizations_name_unique").on(t.name),
  }),
);

export const countryOrganizations = pgTable(
  "country_organizations",
  {
    countryId: integer("country_id")
      .notNull()
      .references(() => countries.id),

    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizations.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.countryId, t.organizationId] }),
  }),
);
