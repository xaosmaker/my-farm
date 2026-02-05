<script setup lang="ts">
import DropdownMenu from "./ui/dropdown-menu/DropdownMenu.vue";
import DropdownMenuContent from "./ui/dropdown-menu/DropdownMenuContent.vue";
import DropdownMenuLabel from "./ui/dropdown-menu/DropdownMenuLabel.vue";
import DropdownMenuTrigger from "./ui/dropdown-menu/DropdownMenuTrigger.vue";

const { locales, setLocale } = useI18n();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger> Set Locale </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Language</DropdownMenuLabel>
    </DropdownMenuContent>
    <div>
      <Button v-for="locale in locales" :key="locale.code || 'en'" @click="setLocale(locale.code)">
        {{ $t(`Language.${locale.code}`) }}
      </Button>
    </div>
  </DropdownMenu>
</template>
