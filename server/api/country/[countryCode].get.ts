import { Countries } from "#server/storage/country";

export default defineEventHandler(async (event) => {
	const countryCode: string | undefined = getRouterParam(event, "countryCode");

	if (!countryCode)
		throw createError({
			status: 400,
			statusMessage: "Bad Request",
			message: `no countryCode set - countryCode:'${countryCode}'`,
		});

	return Countries.getByCountryCode(countryCode);
});
