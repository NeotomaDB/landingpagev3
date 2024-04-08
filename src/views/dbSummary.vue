<script setup>
import {ref, computed} from 'vue';
import Panel from 'primevue/panel'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import textobj from '@/views/dbdescrips.json'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button';
import InputText from 'primevue/inputtext'
const databasekeys = ref(null);
const visible = ref(false);
const contact = ref(0)
const contactinfo = ref(0)
const uniqueSites = ref(null);
const uniqueDBsets = ref(null);
const datasettypes = ref(null);
const thisOneActive = ref(null);
const textDB = ref(null);
const dbkey2 = ref(null);
const htmlString = ref(null);
const name = ref(null);
const globalFilter = ref('')
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'

function loadDatabases() {
    return  fetch(neotomaapi + "/v2.0/data/dbtables/constituentdatabases?count=false&limit=5000&offset=0",
      { method: "GET", headers: {'content-type': 'application/json'}})
    .then(res1 => {
      return res1.json()})
    .then(json1 => {
      databasekeys.value = json1.data  
      return databasekeys.value
    })
    //.then(keys => {
     //   deluxe.value = keys.map(obj => ({...obj, length: fetch(neotomaapi + "/v2.0/apps/constdb/datasets?dbid=" + obj.databaseid).json().data.length}))
    //})

    }


  async function loadContact(contactid) {
  return await fetch(neotomaapi + "/v1.5/data/contacts/" +contactid,
  { method: "GET", headers: {'content-type': 'application/json'}})
  .then(async res => {
    if (!res.ok) {
      const error = new Error(res.statusText)
      error.json = {'error': res.json(), 'databaseid':route.params.databaseid}
      throw error;}
    return await res.json()})
  .then(async json => {
    contactinfo.value = await json.data  
    return contactinfo.value})}



async function loadSumSites(id) {
      if (textobj.filter(a => a.dbID == id.databaseid).length != 0) {
      let texttry = textobj.filter(a => a.dbID == id.databaseid)[0].dbDescrip
      textDB.value = texttry}
      else {
        textDB.value = ""
      }
      htmlString.value = textDB.value
      let itsall = await fetch(neotomaapi + "/v2.0/apps/constdb/datasets?dbid=" + id.databaseid)
      name.value = id.databasename
      if (id.contactid) {
        let con = await fetch(neotomaapi + "/v1.5/data/contacts/" +id.contactid)
        con = await con.json();
        con = await con.data;
        contact.value = con.flatMap(con => con.contactname);
        contact.value = contact.value[0]}
      else {
        contact.value = "No Contact"
      }

      itsall = await itsall.json()
      itsall = await itsall.data
      let uniques = new Set()
      itsall.forEach(obj => uniques.add(obj['siteid']));
      uniques = uniques.size
      console.log(id.databaseid)
      uniqueSites.value = uniques
      uniqueDBsets.value = new Set();
      itsall.forEach(obj => uniqueDBsets.value.add(obj['datasetid']));
      uniqueDBsets.value = uniqueDBsets.value.size
      datasettypes.value = itsall.reduce((acc, obj) => {
          const type = obj.datasettype;
          acc[type] = (acc[type] || 0) + 1;
          return acc;}, {});

      datasettypes.value = Object.entries(datasettypes.value).map(([datasettype,value]) => ({datasettype,value}));
      thisOneActive.value = id.databaseid
      thisOneActive.value = id.databaseid
      visible.value=true
}



loadDatabases();

 
const filteredDBs = computed(() => {
  if (databasekeys.value) {
    return databasekeys.value.filter(car => {
      return Object.values(car).some(value => {
        // Check if the value is not null before converting to string
        if (value !== null) {
          return value.toString().toLowerCase().includes(globalFilter.value.toLowerCase());
        }
        return false; // Skip null values
      });
    });
  } else {
    return [];
  }
});


</script>

<template>
    <h1>Constituent Databases Landing Pages</h1>
    <p>These are the landing pages for Neotoma's constituent databases. 
      These pages provide database-specific information on dataset types,
    spatial and temporal coverage, upload history, and data contributors.</p>
    <div class="flex justify-content-end">
                <InputText v-model="globalFilter" placeholder="Search Databases" />
        </div>
    <div v-for="(el,index) in filteredDBs">
        <Card>
            <template #title>
                <h2><a :href="'https://data.neotomadb.org/database/' + el.databaseid" target="_blank">{{ el.databasename }}</a></h2>
            </template>
            <template #content>
            <Button @click="loadSumSites(el)">Summary Information</Button>
            <div>
      
            </div>
          </template>
          </Card>
          <Dialog v-model:visible="visible"
              modal
              :header = 'name'
              :style="{ width: '50rem' }"
              :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
              <div id="about" v-html="htmlString">
            </div>
            <p>Database Contact: {{ contact }}</p>
            <p>{{name}} currently contains {{uniqueSites}} unique sites, associated with {{ uniqueDBsets }}
          unique datasets. See below for a summary of the kinds of datasets {{ el.databasename }} contains. </p>

    
           <DataTable paginator :rows="5" :value="datasettypes" :sort-field="'value'" :sort-order="-1" tableStyle="min-width: 20rem">
           <Column field="datasettype" header="Dataset Type"></Column>
           <Column field="value" header="Number" sortable></Column>
         </DataTable>
        </Dialog>
    </div>
  

</template>