import { Countries } from "#server/storage/country";
import { type Country, countrySchema } from "#shared/types/types";

export default defineEventHandler(async (event) => {
  const newCountry = await readValidatedBody<Country>(event, (data) => {
    return countrySchema.parse(data);
  });

  const country = await Countries.create(newCountry);
  if (country instanceof Error) throw country;

  return country;
});
