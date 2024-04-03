<script setup>
  import TempExtent from '@/views/TempExtent.vue';
  import DatabaseMap from '@/views/DatabaseMap.vue';
  import UploadsTime from '@/views/UploadsTime.vue';
  import { ref, onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import ProgressSpinner from 'primevue/progressspinner'
  import Panel from 'primevue/panel'
  import DataTable from 'primevue/datatable';
  import InputText from 'primevue/inputtext';
  import Column from 'primevue/column';
  import AboutDB from '@/views/AboutDB.vue';
  import TabView from 'primevue/tabview';
  import TabPanel from 'primevue/tabpanel';
  import PITable from '@/views/PITable.vue';

  const datasetids = ref(0)
  const route = useRoute()
  const contact = ref(0)
  const contactinfo = ref(0)
  const filters = ref({name: { value: '', keys: ['name'] }});
  const databaseinfo = ref(null)
  const datasets = ref(null)
  const pis = ref(null)
  const pis_array = ref(null)
  const datasets_array = ref(null)
  const uniqueSites = ref(null)
  const databasekeys = ref(null)
  const databasename = ref(null)
  const currentDB = ref(null)
  const loading = ref(true)
  const loading2 = ref(true)
  const loading3 = ref(true)
  const loading4 = ref(true)
  const loading5 = ref(true)
  const constDBinfo = ref(null);
  const uniqueDBsites = ref(null);
  const uniqueDBsets = ref(null);
  const datasettypes = ref(null);
  const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'


onMounted(() => {

 // loadDatabase()
 // loadContact()
 // loadconstDB();
  
})


</script>



<template>
    <AboutDB/>
    <Panel toggleable>
      <template #header>
        <h2>Spatial and Temporal Extent</h2>
      </template>
      <h3>Spatial Extent</h3>
        <DatabaseMap />

      <h3>Temporal Extent</h3>
          <TempExtent/>

    </Panel>
      <UploadsTime/>
      <PITable />

</template>

<script>
export default {
  components: {
    TempExtent,
    DatabaseMap,
    UploadsTime
  }
};
</script>