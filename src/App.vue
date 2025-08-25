<script setup>
import { RouterView } from 'vue-router'
import LandingPageHeader from "@/views/pagedecorators/header.vue"
import LandingPageFooter from "@/views/pagedecorators/footer.vue"
</script>

<template>
  <LandingPageHeader></LandingPageHeader>
  <RouterView />
  <LandingPageFooter />
</template>
