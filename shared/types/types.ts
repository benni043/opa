import { z } from "zod";

const languageSchema = z.object({
  name: z.string().min(1),
  speakers: z.number(),
});

const organizationSchema = z.object({
  name: z.string().min(1),
});

export const Country = z.object({
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

export type Country = z.infer<typeof Country>;

export const CountryListItem = Country.pick({
  country: true,
  countryCode: true,
});

export type CountryListItem = z.infer<typeof CountryListItem>;
