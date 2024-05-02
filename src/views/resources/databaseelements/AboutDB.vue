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
const dbkeys2 = ref(null)
const databasename = ref(null)
const currentDB = ref(null)
const currentDB2 = ref(null)
const route = useRoute();
const constDBinfo = ref(null);
const uniqueDBsites = ref(null);
const uniqueDBsets = ref(null);
const datasettypes = ref(null);
const email = ref(null);
const url = ref(null);
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
    return currentDB.value.databasename})
  .then(val => fetch(neotomaapi + "/v2.0/apps/constdb/",
  { method: "GET", headers: {'content-type': 'application/json'}}))
  .then(res => {
    if (!res.ok) {
      const error = new Error(res.statusText)
      error.json = {'error': res.json(), 'databaseid':route.params.databaseid}
      throw error;}
    return res.json()})
  .then(json => {
    dbkeys2.value = json.data 
    currentDB2.value = dbkeys2.value.find(element => element.databasename == currentDB.value.databasename)
    contactinfo.value = currentDB2.value.contactname
    databasename.value = currentDB2.value.databasename
    url.value = currentDB2.value.url
    email.value = 'mailto:' + currentDB2.value.email
    return contact.value     })}


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
         <div v-if="url != null">
        <span><strong>Website:</strong> {{ url }}</span></div>
         <div v-if="email != 'mailto:null' && contactinfo != null">
         <span><strong>Database Contact: </strong><a :href='email'>{{ contactinfo }}</a></span>
        </div>
        <div v-if="email == 'mailto:null' && contactinfo != null">
          <span><strong>Database Contact: </strong>{{ contactinfo }}</span>
        </div>
         <p> There are {{uniqueDBsites}} distinct sites in {{ databasename }}, associated with {{ uniqueDBsets }} datasets.</p>
         <DataTable paginator :rows="5" :value="datasettypes" :sort-field="'value'" :sort-order="-1" tableStyle="min-width: 20rem">
           <Column field="datasettype" header="Dataset Type"></Column>
           <Column field="value" header="Number" sortable></Column>
         </DataTable>
  
         <div v-for="(value, name, index) in contactinfo" :key="name.id">

             </div>
            
         </Panel>
         </div>
         
       <div v-else class="flex flex-wrap justify-content-center align-items-center">
           <ProgressSpinner class="flex-grow-1 w-max" />
       </div>
</template>