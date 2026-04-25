<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const languageSchema = z.object({
  name: z.string().min(1, "Name erforderlich"),
  speakers: z.number("Zahl erforderlich"),
});

const schema = z.object({
  country: z.string().min(1, "Land erforderlich"),
  countryCode: z.string().min(1, "Kürzel erforderlich"),

  languageType: z.string().min(1, "Sprachtyp erforderlich"),

  languages: z.array(languageSchema),

  organizations: z.array(z.string()),

  capital: z.string().min(1, "Haupstadt erforderlich"),
  currency: z.string().min(1, "Währung erforderlich"),

  domain: z.string().regex(/^\.[a-z]{2}$/, "Ungültige Domain"),

  traffic: z.string().min(1, "Verkehr auswählen"),

  deathPenalty: z.boolean(),

  gdpPerCapita: z.number("Zahl erforderlich"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  country: "",
  countryCode: "",
  languageType: "",
  languages: [{ name: "", speakers: 0 }],
  organizations: [""],
  capital: "",
  currency: "",
  domain: "",
  traffic: "right",
  deathPenalty: false,
  gdpPerCapita: 0,
});

function addLanguage() {
  state.languages.push({ name: "", speakers: 0 });
}

function removeLanguage(i: number) {
  state.languages.splice(i, 1);
}

function addOrganization() {
  state.organizations.push("");
}

function removeOrganization(i: number) {
  state.organizations.splice(i, 1);
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await $fetch("/api/country", {
    method: "POST",
    body: event.data,
  });

  console.log(event.data);
}
</script>

<template>
  <div class="flex justify-center min-h-screen p-6">
    <div class="w-full max-w-4xl">
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <div class="grid grid-cols-2 gap-8">
          <!-- LEFT -->
          <div class="space-y-4">
            <UKbd>Wichtiges</UKbd>

            <div class="flex gap-2">
              <UFormField name="country" label="Land">
                <UInput v-model="state.country" placeholder="Land" />
              </UFormField>

              <UFormField name="countryCode" label="Kürzel">
                <UInput v-model="state.countryCode" placeholder="Kürzel" />
              </UFormField>
            </div>

            <div class="flex gap-2">
              <UFormField name="capital" label="Hauptstadt">
                <UInput v-model="state.capital" placeholder="Hauptstadt" />
              </UFormField>

              <UFormField name="domain" label="Domain">
                <UInput v-model="state.domain" placeholder="Domain" />
              </UFormField>
            </div>

            <UKbd>Allgemeines</UKbd>

            <UFormField name="currency" label="Währung">
              <UInput v-model="state.currency" placeholder="Währung" />
            </UFormField>

            <UFormField name="traffic" label="Verkehrsseite">
              <USelect
                v-model="state.traffic"
                :items="[
                  { label: 'Rechtsverkehr', value: 'right' },
                  { label: 'Linksverkehr', value: 'left' },
                ]"
              />
            </UFormField>

            <UFormField name="deathPenalty" label="Todesstrafe">
              <USwitch v-model="state.deathPenalty" />
            </UFormField>

            <UFormField name="gdpPerCapita" label="BIP pro Kopf">
              <UInput v-model.number="state.gdpPerCapita" type="number" />
            </UFormField>
          </div>

          <!-- RIGHT -->
          <div class="space-y-4">
            <UKbd>Sprachen</UKbd>

            <UFormField name="languageType" label="Sprachtyp">
              <UInput v-model="state.languageType" placeholder="Sprachtyp" />
            </UFormField>

            <div>
              <div>
                <label>Sprachen</label>
              </div>

              <UButton size="xs" class="mt-2" @click="addLanguage">
                + Sprache
              </UButton>

              <div class="max-h-60 overflow-y-auto">
                <div
                  v-for="(lang, i) in state.languages"
                  :key="i"
                  class="flex gap-2 mt-2"
                >
                  <UInput v-model="lang.name" placeholder="Name" />

                  <UInput
                    v-model.number="lang.speakers"
                    type="number"
                    placeholder="Anzahl"
                  />

                  <UButton size="xs" color="error" @click="removeLanguage(i)">
                    X
                  </UButton>
                </div>
              </div>
            </div>

            <UKbd>Organisationen</UKbd>

            <div>
              <div>
                <label>Organisationen</label>
              </div>

              <UButton size="xs" class="mt-2" @click="addOrganization">
                + Organisation
              </UButton>

              <div class="max-h-60 overflow-y-auto">
                <div
                  v-for="(_, i) in state.organizations"
                  :key="i"
                  class="flex gap-2 mt-2"
                >
                  <UInput
                    v-model="state.organizations[i]"
                    :placeholder="'Organisation ' + (i + 1)"
                  />

                  <UButton
                    size="xs"
                    color="error"
                    @click="removeOrganization(i)"
                  >
                    X
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <UButton size="lg" type="submit" class="mt-6"> Bestätigen </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>
