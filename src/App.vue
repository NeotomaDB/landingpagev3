<script setup>
import { RouterView } from 'vue-router'
import LandingPageHeader from "@/views/pagedecorators/PageHeader.vue"
import LandingPageFooter from "@/views/pagedecorators/PageFooter.vue"
</script>

<template>
  <LandingPageHeader></LandingPageHeader>
  <RouterView />
  <LandingPageFooter />
</template>
