<script setup lang="ts">
	import type { CountryListItem } from "#shared/types/types";

	const countries: Ref<CountryListItem[] | undefined> = ref(undefined);

	onMounted(async () => {
		try {
			countries.value = await $fetch("/api/country/getAll", {
				method: "GET",
			});
		} catch (e) {
			console.error(e);
		}
	});

	function moreInfo(countryCode: string) {
		navigateTo(`/${countryCode}`);
	}

	function add() {
		navigateTo("/create");
	}

	async function getByLanguage(language: string) {
		countries.value = await $fetch(`/api/country/getByLanguage/${language}`, {
			method: "GET",
		});
	}

	async function reset() {
		countries.value = await $fetch("/api/country/getAll", {
			method: "GET",
		});
	}
</script>

<template>
	<div>
		<h1 class="text-center text-xl h-8 m-5 p-1.5">Übersicht</h1>

		<div class="flex justify-center flex-col gap-2 mb-10">
			<UButton variant="outline" class="mb-5 w-80 mx-auto" @click="add()">
				Land hinzufügen
			</UButton>

			<UButton
				variant="outline"
				color="error"
				class="w-80 mx-auto"
				@click="reset()"
			>
				Filter zurücksetzten
			</UButton>

			<UButton
				variant="outline"
				color="secondary"
				class="w-80 mx-auto"
				@click="getByLanguage('deutsch')"
			>
				Filter nach Land
			</UButton>
		</div>

		<div v-if="countries" class="space-y-4">
			<div
				v-for="country of countries"
				:key="country.countryCode"
				class="flex justify-center flex-col"
			>
				<UButton
					variant="outline"
					color="neutral"
					class="w-80 mx-auto flex justify-between"
					@click="moreInfo(country.countryCode)"
				>
					<span>{{ country.country }}</span>
					<span class="opacity-60">{{ country.countryCode }}</span>
				</UButton>
			</div>
		</div>
	</div>
</template>
