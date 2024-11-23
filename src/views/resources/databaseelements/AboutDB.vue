<script setup>
import Panel from 'primevue/panel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import textobj from '@/views/resources/databaseelements/dbdescrips.json'
import { ref, onMounted } from 'vue'
import {useRoute} from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'

const contact = ref(null);
const email = ref(null);
const databaseurl = ref(null);
const uniqueSites = ref(null);
const loading_ab = ref(true);
const databasekeys = ref(null)
const databasename = ref("Constituent Database")
const currentDB = ref(null)
const route = useRoute();
const uniqueDBsites = ref(null);
const uniqueDBdatasets = ref(null);
const datasettypes = ref(null);
const textDB = ref(null);
const htmlString = ref(null);
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'


uniqueSites.value = new Set();

function loadConstDB() {
  return  fetch(neotomaapi + "/v2.0/apps/constdb?dbid=" + route.params.databaseid,
    { method: "GET",
    headers: {'content-type': 'application/json'}})
    .then(res1 => {
      console.log(res1)
      return res1.json()
    })
    .then(json1 => {
      databasekeys.value = json1.data[0]
      
      currentDB.value = route.params.databaseid
      contact.value = databasekeys.value.database['contact']
      email.value = databasekeys.value.database['email'] || 'no email provided'
      databaseurl.value = databasekeys.value.database['url'] || 'no URL provided'
      databasename.value = databasekeys.value.database['databasename']
      uniqueDBsites.value = databasekeys.value.sitecount
      datasettypes.value = databasekeys.value.datasettypes
      loading_ab.value = false
    })
}

onMounted(() => {
    loadConstDB()
    if (textobj.filter(a => a.dbID == route.params.databaseid).length != 0) {
      let texttry = textobj.filter(a => a.dbID == route.params.databaseid)[0].dbDescrip
      textDB.value = texttry}
      else {
        textDB.value = "There is no description provided for this constituent database. "
      }
      htmlString.value = textDB.value
    
})


</script>


<template>
  <Panel toggleable>
    <template #header>
      <h2>About the {{ databasename }}</h2>
    </template>
    <div v-if="!loading_ab">
    <h3>Constituent Database Description</h3>
      <div v-html="htmlString"></div>
      
    <h3>Constituent Database Metadata</h3>
    <ul>
      <li>Database Contact : {{ contact }} [{{email}}]</li>
      <li>Database URL : {{ databaseurl }}</li>
    </ul>
    <h3>Sites and Datasets</h3>      
      <p>There are {{uniqueDBsites}} distinct sites in {{ databasename }}.</p>
      <DataTable paginator :rows="5" :value="datasettypes" :sort-field="'datasets'" :sort-order="-1" tableStyle="min-width: 20rem">
        <Column field="datasettype" header="Dataset Type"></Column>
        <Column field="datasets" header="Number of Datasets" sortable></Column>
      </DataTable>
    </div>
    <div v-else class="flex flex-wrap justify-content-center align-items-center">
      <ProgressSpinner class="flex-grow-1 w-max" />
    </div>
  </Panel>
         
       
</template>