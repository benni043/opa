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
    <button @click="add()">Land hinzufügen</button>

    <div v-if="countries">
      <div v-for="country of countries" :key="country.countryCode">
        <button @click="moreInfo(country.countryCode)">
          {{ country.country }}
          {{ country.countryCode }}
        </button>
      </div>
    </div>
  </div>
</template>
