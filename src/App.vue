<template>
  <router-view v-slot="{ Component, route }">
    <component :is="Component" :key="route.fullPath" />
  </router-view>
</template>

<script setup lang="ts">
// App shell intentionally stays minimal.
// Global bootstrap logic lives in main.ts.
// Route masking / analytics / visitor tracking live in router/index.ts.
</script>

<style scoped>
:global(html, body, #app) {
  min-height: 100%;
}

:global(body) {
  margin: 0;
}
</style>