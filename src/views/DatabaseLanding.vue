<script setup>
import { defineAsyncComponent } from 'vue';

const AboutDB = defineAsyncComponent(() =>
  import('@/views/resources/databaseelements/AboutDB.vue')
)

const TempExtent = defineAsyncComponent(() =>
  import('@/views/resources/databaseelements/TempExtent.vue')
)

const DatabaseMap2 = defineAsyncComponent(() =>
  import('@/views/resources/databaseelements/DatabaseMap2.vue')
)

const UploadsTime = defineAsyncComponent(() =>
  import('@/views/resources/databaseelements/UploadsTime.vue')
)

const PITable = defineAsyncComponent(() =>
  import('@/views/resources/databaseelements/PITable.vue')
)

import Panel from 'primevue/panel'
</script>



<template>
  <AboutDB />
  <Panel toggleable>
    <template #header>
      <h2>Spatial and Temporal Extent</h2>
    </template>
    <h3>Spatial Extent</h3>
    <DatabaseMap2 />
    <h3>Temporal Extent</h3>
    <TempExtent />
  </Panel>
  <UploadsTime />
  <PITable />
</template>
