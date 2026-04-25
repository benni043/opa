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
</script>

<template>
  <div>
    <h1 class="text-center text-xl h-8 m-5 p-1.5">Übersicht</h1>

    <div class="flex justify-center flex-col">
      <UButton variant="outline" class="mb-10 w-80 mx-auto" @click="add()">
        Land hinzufügen
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
