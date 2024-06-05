<script setup>
  import TempExtent from '@/views/resources/databaseelements/TempExtent.vue';
  import DatabaseMap2 from '@/views/resources/databaseelements/DatabaseMap2.vue';
  import UploadsTime from '@/views/resources/databaseelements/UploadsTime.vue';
  import AboutDB from '@/views/resources/databaseelements/AboutDB.vue';
  import PITable from '@/views/resources/databaseelements/PITable.vue';
  
  import Panel from 'primevue/panel'
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
