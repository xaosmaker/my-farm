<script setup>
const { locales, setLocale } = useI18n();
</script>

<template>
  <div>
    <Button v-for="locale in locales" :key="locale" @click="setLocale(locale.code)">
      {{ locale.name }}
    </Button>
  </div>
</template>
