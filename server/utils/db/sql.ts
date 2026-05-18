import { drizzle } from "drizzle-orm/libsql";

let _drizzle: ReturnType<typeof drizzle>;

export function useDrizzle() {
	const url = useRuntimeConfig().db.url;

	if (!_drizzle) {
		_drizzle = drizzle({
			connection: {
				url: url,
			},
		});
	}

	return _drizzle;
}
