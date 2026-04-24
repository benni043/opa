import { Countries } from "#server/storage/country";

export default defineEventHandler(async () => {
  return Countries.getAll();
});
