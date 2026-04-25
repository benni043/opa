<script setup lang="ts">
import type { ToasterProps } from "@nuxt/ui";

const toaster: ToasterProps = { position: "top-right" };
const route = useRoute();

function back() {
  navigateTo("/");
}
</script>

<template>
  <div>
    <UButton
      v-if="route.path !== '/'"
      class="m-5 h-8"
      color="secondary"
      @click="back()"
    >
      Zurück
    </UButton>

    <main>
      <UApp :toaster="toaster">
        <NuxtPage />
      </UApp>
    </main>
  </div>
</template>

<style scoped></style>
