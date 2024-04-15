<script setup>
  import TempExtent from '@/views/TempExtent.vue';
  import DatabaseMap2 from '@/views/DatabaseMap2.vue';
  import UploadsTime from '@/views/UploadsTime.vue';
  import Panel from 'primevue/panel'
  import AboutDB from '@/views/AboutDB.vue';
  import PITable from '@/views/PITable.vue';
</script>



<template>
    <AboutDB/>
    <Panel toggleable>
      <template #header>
        <h2>Spatial and Temporal Extent</h2>
      </template>
      <h3>Spatial Extent</h3>
        <DatabaseMap2 />
      <h3>Temporal Extent</h3>
          <TempExtent/>
    </Panel>
    <UploadsTime/>
    <PITable />
</template>
