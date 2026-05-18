<script setup lang="ts">
	import type { Country } from "#shared/types/types";
	import Field from "~/components/Field.vue";

	const route = useRoute();

	const country: Ref<Country | undefined> = ref(undefined);

	const trafficLabel = computed(() => {
		if (!country.value) return "";
		return country.value.traffic === "right" ? "Rechtsverkehr" : "Linksverkehr";
	});

	onMounted(async () => {
		const countryCode = route.params.country;

		try {
			country.value = await $fetch(
				`/api/country/${countryCode!.toString().toUpperCase()}`,
			);
		} catch (e) {
			console.error(e);

			navigateTo("/");
		}
	});
</script>

<template>
	<div>
		<h1 class="text-3xl font-bold text-center mb-6">Detailansicht</h1>

		<div v-if="country" class="flex justify-center">
			<div class="w-full max-w-4xl">
				<div class="grid grid-cols-2 gap-8">
					<!-- LEFT -->
					<div class="space-y-4">
						<UKbd>Wichtiges</UKbd>

						<div class="flex gap-2">
							<Field label="Land" :value="country.country" />
							<Field label="Kürzel" :value="country.countryCode" />
						</div>

						<div class="flex gap-2">
							<Field label="Hauptstadt" :value="country.capital" />
							<Field label="Domain" :value="country.domain" />
						</div>

						<UKbd>Allgemeines</UKbd>

						<Field label="Währung" :value="country.currency" />
						<Field label="Verkehr" :value="trafficLabel" />
						<Field
							label="Todesstrafe"
							:value="country.deathPenalty ? 'Ja' : 'Nein'"
						/>
						<Field label="BIP/Kopf" :value="country.gdpPerCapita" />
					</div>

					<!-- RIGHT -->
					<div class="space-y-4">
						<UKbd>Sprachen</UKbd>

						<Field label="Sprachtyp" :value="country.languageType" />

						<Field label="Sprachen" />

						<div class="max-h-60 overflow-y-auto space-y-2 mt-2">
							<div
								v-for="(lang, i) in country.languages"
								:key="i"
								class="flex gap-2"
							>
								<Field :value="lang.name" />
								<Field :value="lang.speakers.toLocaleString()" />
							</div>
						</div>

						<UKbd>Organisationen</UKbd>

						<Field label="Organisationen" />

						<div class="max-h-60 overflow-y-auto space-y-2">
							<div
								v-for="(org, i) in country.organizations"
								:key="i"
								class="flex gap-2"
							>
								<Field :value="org" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
