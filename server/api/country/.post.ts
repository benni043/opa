import { Countries } from "#server/storage/country";
import { Country } from "#shared/types/types";

export default defineEventHandler(async (event) => {
  const newCountry = await readValidatedBody<Country>(event, (data) => {
    console.log(data);

    return Country.parse(data);
  });

  console.log(2);
  console.log(newCountry);

  const country = await Countries.create(newCountry);
  if (country instanceof Error) throw country;

  return country;
});
