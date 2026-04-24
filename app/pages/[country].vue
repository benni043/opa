<script setup lang="ts">
const route = useRoute();

onMounted(async () => {
  const countryCode = route.params.country;

  const x = await $fetch(`/api/country/${countryCode}`, {
    method: "GET",
  });

  console.log(x);
});
</script>

<template>
  <div>
    <h1>Land</h1>
  </div>
</template>
