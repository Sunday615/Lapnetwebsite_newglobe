<template>
  <section>
    <atmmockup  
  
  hubLogo="/logolapnet/fullcircle.png"
  hubName="Lapnet"
  :hubLat="18"
  :hubLon="103"
  :cycleSeconds="30"
  :minSeparationDeg="26"
  :minNodeToHubDeg="40"
  />
  </section>
</template>

<script setup lang="ts">
import atmmockup from './globe.vue';
</script>
