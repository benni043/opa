<script setup lang="ts">
const route = useRoute();
const { data: country } = await useFetch<Country>(
  `/api/country/${route.params.country}`,
);

onMounted(() => {
  console.log(route.params.country);
  console.log(country.value);
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-center mb-6">Land bearbeiten</h1>
    <CountryForm v-if="country" :initial-data="country" />
  </div>
</template>
