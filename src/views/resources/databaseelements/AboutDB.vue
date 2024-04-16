<script setup>
import Panel from 'primevue/panel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import textobj from '@/views/resources/databaseelements/dbdescrips.json'
import { ref, onMounted } from 'vue'
import {useRoute} from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'

const contact = ref(0)
const contactinfo = ref(0)
const uniqueSites = ref(null);
const loading_ab = ref(true);
const databasekeys = ref(null)
const databasename = ref(null)
const currentDB = ref(null)
const route = useRoute();
const constDBinfo = ref(null);
const uniqueDBsites = ref(null);
const uniqueDBsets = ref(null);
const datasettypes = ref(null);
const textDB = ref(null);
const htmlString = ref(null);
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'


uniqueSites.value = new Set();

function loadContact() {
  return  fetch(neotomaapi + "/v2.0/data/dbtables/constituentdatabases?count=false&limit=5000&offset=0",
  { method: "GET", headers: {'content-type': 'application/json'}})
  .then(res1 => {
    return res1.json()})
  .then(json1 => {
    databasekeys.value = json1.data  
    currentDB.value = databasekeys.value.find(element => element.databaseid === Number(route.params.databaseid))
    contact.value = currentDB.value.contactid
    databasename.value = currentDB.value.databasename
    return contact.value})
  .then(val => fetch(neotomaapi + "/v1.5/data/contacts/" +val,
  { method: "GET", headers: {'content-type': 'application/json'}}))
  .then(res => {
    if (!res.ok) {
      const error = new Error(res.statusText)
      error.json = {'error': res.json(), 'databaseid':route.params.databaseid}
      throw error;}
    return res.json()})
  .then(json => {
    contactinfo.value = json.data      })}


function loadconstDB() {
    return  fetch(neotomaapi + "/v2.0/apps/constdb/datasets?dbid=" + route.params.databaseid,
      { method: "GET", headers: {'content-type': 'application/json'}})
    .then(res1 => {
      return res1.json()})
    .then(json1 => {
      constDBinfo.value = json1.data
      
   
      uniqueDBsites.value = new Set();
      constDBinfo.value.forEach(obj => uniqueDBsites.value.add(obj['siteid']));
      uniqueDBsites.value = uniqueDBsites.value.size

      uniqueDBsets.value = new Set();
      constDBinfo.value.forEach(obj => uniqueDBsets.value.add(obj['datasetid']));
      uniqueDBsets.value = uniqueDBsets.value.size
      datasettypes.value = constDBinfo.value.reduce((acc, obj) => {
          const type = obj.datasettype;
          acc[type] = (acc[type] || 0) + 1;
          return acc;}, {});

  datasettypes.value = Object.entries(datasettypes.value).map(([datasettype,value]) => ({datasettype,value}));
  loading_ab.value=false
})
}


onMounted(() => {
    loadContact()
    loadconstDB()
    if (textobj.filter(a => a.dbID == route.params.databaseid).length != 0) {
      let texttry = textobj.filter(a => a.dbID == route.params.databaseid)[0].dbDescrip
      textDB.value = texttry}
      else {
        textDB.value = ""
      }
      htmlString.value = textDB.value
    
})


</script>


<template>
    <div v-if="!loading_ab">  
       <Panel toggleable>
         <template #header>
          <h2>About {{ databasename }}</h2>
         </template>
         <div v-html="htmlString"></div>
         <p> There are {{uniqueDBsites}} distinct sites in {{ databasename }}, associated with {{ uniqueDBsets }} datasets.</p>
         <DataTable paginator :rows="5" :value="datasettypes" :sort-field="'value'" :sort-order="-1" tableStyle="min-width: 20rem">
           <Column field="datasettype" header="Dataset Type"></Column>
           <Column field="value" header="Number" sortable></Column>
         </DataTable>
           
         <div v-for="(value, name, index) in contactinfo" :key="name.id">
           <div v-if="value.url !== null">
             <p> <span> <strong> Database Contact</strong>: <a :href='value.url'> {{ value.givennames}} {{ value.familyname }} </a> </span></p>
           </div>
           <div v-else>
               <p> <span> <strong> Database Contact</strong>: <p> {{ value.givennames}} {{ value.familyname }} </p> </span></p>
             </div>
             </div>
            
         </Panel>
         </div>
         
       <div v-else class="flex flex-wrap justify-content-center align-items-center">
           <ProgressSpinner class="flex-grow-1 w-max" />
       </div>
</template>