<script setup>
import { ref, computed } from 'vue';
import {useRoute} from 'vue-router';
import Panel from 'primevue/panel'
import ProgressSpinner from 'primevue/progressspinner';
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const loading_some = ref(true);
const globalFilter = ref('');
const uniqueSites = ref(null);
const datasets = ref(null);
const datasets_array = ref(null);
const databaseinfo = ref(null)
const databasekeys = ref(null)
const databasename = ref(null)
const currentDB = ref(null)
const route = useRoute();
const pis = ref(null)
const pis_array1 = ref(null)
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'


 function loadDatabase() {
    return  fetch(neotomaapi + "/v2.0/data/dbtables/constituentdatabases?count=false&limit=5000&offset=0",
      { method: "GET", headers: {'content-type': 'application/json'}})
    .then(res1 => {
      return res1.json()})
    .then(json1 => {
      databasekeys.value = json1.data  
      currentDB.value = databasekeys.value.find(element => element.databaseid === Number(route.params.databaseid))
         
      databasename.value = currentDB.value.databasename
      return databasename.value})
      .then(val => fetch("https://api.neotomadb.org/v2.0/data/datasets/db?limit=10000&offset=0&database=" + val,
      { method: "GET", headers: {'content-type': 'application/json'}}))
    .then(res => {
          if (!res.ok) {
            const error = new Error(res.statusText)
            error.json = {'error': res.json(), 'databaseid':route.params.databaseid}
            throw error;
          }
          else {
            return res.json()   }
        })
        .then(json => {
          databaseinfo.value = json.data
          pis.value = databaseinfo.value.reduce((acc, obj) => {
            obj.site.datasets.forEach(dataset => {
              dataset.datasetpi.forEach(pi => {
                const type = pi.contactname;
                acc[type] = (acc[type] || 0) + 1;

              })
              
            })
            return acc;
          }, {});
          pis_array1.value = Object.entries(pis.value).map(([name,value]) => ({name,value}));
          pis_array1.value = pis_array1.value.filter(obj => obj.name !== 'null')


        })}


 loadDatabase();

 const filteredPIs = computed(() => {
  if (pis_array1.value) {
    return pis_array1.value.filter(car => {
      return Object.values(car).some(value =>
        value.toString().toLowerCase().includes(globalFilter.value.toLowerCase())
      );
    });
  } else {
    return [];
  }
});
loading_some.value = false

</script>

<template>
<div v-if="!loading_some">
    <Panel toggleable collapsed>
        <template #header>
            <h3>Datasets by PI</h3>
        </template>
    <DataTable  v-model="globalFilter"
        :value="filteredPIs" paginator :rows="5" :sort-field="'value'" :sort-order="-1" tableStyle="min-width: 20rem">
        <template #header>
        <div class="flex justify-content-end">
                <InputText v-model="globalFilter" placeholder="Search PIs" />
        </div>
    </template>
          <Column field="name" header="PI Name" :filter="true">
            <template #body="{ data }">
            {{ data.name }}
        </template>
 
      </Column>
          <Column field="value" header="Number Datasets Uploaded" sortable></Column>
        </DataTable>
    </Panel>
        <div>
      
  </div> 
  </div>
 <div v-else class="flex flex-wrap justify-content-center align-items-center">
        <ProgressSpinner class="flex-grow-1 w-max" />

    </div>
</template>
