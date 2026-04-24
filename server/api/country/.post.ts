import { Country } from "#shared/types/types";
import { Countries } from "#server/storage/country";

export default defineEventHandler(async (event) => {
  const newCountry = await readValidatedBody<Country>(event, (data) => {
    return Country.parse(data);
  });

  return await Countries.create(newCountry);
});
