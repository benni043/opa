<script setup lang="ts">
const germany = {
  country: "Deutschland",
  countryCode: "DE",

  languageType: "Indoeuropäisch",

  languages: [
    {
      name: "Deutsch",
      speakers: 83000000,
    },
    {
      name: "Englisch",
      speakers: 12000000,
    },
    {
      name: "Türkisch",
      speakers: 3000000,
    },
  ],

  organizations: ["EU", "UNO", "NATO", "G7"],

  capital: "Berlin",
  currency: "Euro",

  domain: ".de",

  traffic: "right",

  deathPenalty: false,

  gdpPerCapita: 51000,
};

async function x() {
  await $fetch("/api/country", {
    method: "POST",
    body: germany,
  });
}

onMounted(async () => {
  const x = await $fetch("/api/country", {
    method: "GET",
  });

  console.log(x);
});
</script>

<template>
  <div>
    <button @click="x()">hi</button>
  </div>
</template>
