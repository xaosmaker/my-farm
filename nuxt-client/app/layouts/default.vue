<template>
  <header class="h-screen">
    <div class="mx-10 flex h-20 items-center justify-between">
      <p class="text-4xl">My farm</p>
      <LocaleSwitcher />
      <ModeToggle />
    </div>

    <slot />
  </header>
</template>
