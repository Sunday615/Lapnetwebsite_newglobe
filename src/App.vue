<template>
  <router-view v-slot="{ Component, route }">
    <component :is="Component" :key="getRouteViewKey(route)" />
  </router-view>
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from "vue-router";

function getRouteViewKey(route: RouteLocationNormalizedLoaded) {
  if (route.path.startsWith("/products_service/crossborder")) {
    return "products-crossborder";
  }

  return route.fullPath;
}
</script>

<style scoped>
:global(html, body, #app) {
  min-height: 100%;
}

:global(body) {
  margin: 0;
}
</style>
