<script setup lang="ts">
import type { ToasterProps } from "@nuxt/ui";

const toaster: ToasterProps = { position: "top-right" };

function back() {
  navigateTo("/");
}
</script>

<template>
  <div>
    <button @click="back()">Zurück</button>

    <main>
      <UApp :toaster="toaster">
        <NuxtPage />
      </UApp>
    </main>
  </div>
</template>

<style scoped></style>
