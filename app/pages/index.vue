<script setup lang="ts">
import type { CountryListItem, LanguageCount } from "#shared/types/types";

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

function edit(countryCode: string) {
  navigateTo(`/${countryCode}/edit`);
}

async function getByLanguage() {
  const lang = prompt("Sprache eingeben:");

  countries.value = await $fetch(`/api/country/getByLanguage/${lang}`, {
    method: "GET",
  });
}

async function getLanguageCount() {
  const lang = prompt("Sprache eingeben:");

  const response = await $fetch<LanguageCount>(`/api/language/${lang}`, {
    method: "GET",
  });

  alert(`Sprachanzahl für ${response.language}: ${response.totalSpeakers}`);
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
        @click="getByLanguage()"
      >
        Filter nach Land
      </UButton>

      <UButton
        variant="outline"
        color="secondary"
        class="w-80 mx-auto"
        @click="getLanguageCount()"
      >
        Sprachanzahl von Land
      </UButton>
    </div>

    <div v-if="countries" class="space-y-4">
      <div
        v-for="country of countries"
        :key="country.countryCode"
        class="flex justify-center"
      >
        <UButton
          variant="outline"
          color="neutral"
          class="w-80 flex justify-between"
          @click="moreInfo(country.countryCode)"
        >
          <span>{{ country.country }}</span>
          <span class="opacity-60">{{ country.countryCode }}</span>
        </UButton>
        <UButton
          variant="ghost"
          @click="edit(country.countryCode)"
          class="w-min"
          >✏️</UButton
        >
      </div>
    </div>
  </div>
</template>
