import { Countries } from "#server/storage/country";

export default defineEventHandler(async (event) => {
  const language: string | undefined = getRouterParam(event, "language");

  if (!language)
    throw createError({
      status: 400,
      statusMessage: "Bad Request",
      message: `no language set - language:'${language}'`,
    });

  return Countries.getAllByLanguage(language);
});
