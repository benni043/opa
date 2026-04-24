import { Country } from "#shared/types/types";
import { Countries } from "#server/storage/country";

export default defineEventHandler(async (event) => {
  const newCountry = await readValidatedBody<Country>(event, (data) => {
    return Country.parse(data);
  });

  const country = await Countries.create(newCountry);
  if (country instanceof Error) throw country;

  return country;
});
