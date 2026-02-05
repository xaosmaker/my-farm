<script setup lang="ts">
const { locale } = useI18n();
const lang = computed(() => locale.value || "en");
useHead({
  titleTemplate: "My Farm - %s",
  htmlAttrs: {
    lang: lang,
    dir: "ltr",
  },
});
</script>

<template>
  <main>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </main>
</template>
