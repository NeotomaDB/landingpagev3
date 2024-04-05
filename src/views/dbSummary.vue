<script setup>
import {ref, onMounted} from 'vue';
import Panel from 'primevue/panel'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import textobj from '@/views/dbdescrips.json'
const databasekeys = ref(null);
const visible = ref(false);
const contact = ref(0)
const contactinfo = ref(0)
const uniqueSites = ref(null);
const loading_ab = ref(true);
const databasename = ref(null)
const currentDB = ref(null)
const uniqueDBsites = ref(null);
const uniqueDBsets = ref(null);
const datasettypes = ref(null);
const thisOneActive = ref(null);
const textDB = ref(null);
const dbkey2 = ref(null);
const htmlString = ref(null);
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'

function loadDatabases() {
    return  fetch(neotomaapi + "/v2.0/data/dbtables/constituentdatabases?count=false&limit=5000&offset=0",
      { method: "GET", headers: {'content-type': 'application/json'}})
    .then(res1 => {
      return res1.json()})
    .then(json1 => {
      databasekeys.value = json1.data  
  //    const lengths = fetch(neotomaapi + "/v2.0/apps/constdb/datasets?dbid=" + databasekeys.)
     // currentDB.value = databasekeys.value.find(element => element.databaseid === Number(route.params.databaseid))
         
    //  databasename.value = currentDB.value.databasename
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
      console.log(textobj.filter(a => a.dbID == id.databaseid).length == 0)
      console.log(textobj.filter(a => a.dbID == id.databaseid))
      if (textobj.filter(a => a.dbID == id.databaseid).length != 0) {
      let texttry = textobj.filter(a => a.dbID == id.databaseid)[0].dbDescrip
      textDB.value = texttry}
      else {
        textDB.value = ""
      }
      htmlString.value = textDB.value
      let itsall = await fetch(neotomaapi + "/v2.0/apps/constdb/datasets?dbid=" + id.databaseid)
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
}




function collapser(id) {
  if (id == thisOneActive.value) {
    return false
  }

  if (id != thisOneActive.value) {
    return true
  }

}


onMounted(async () => {
  
await loadDatabases();
})

</script>

<template>
    <h1>Constituent Databases Landing Pages</h1>
    <p>These are the landing pages for Neotoma's constituent databases. 
      These pages provide database-specific information on dataset types,
    spatial and temporal coverage, upload history, and data contributors.</p>
    <div v-for="(el,index) in databasekeys">
        <Panel @click="loadSumSites(el)" toggleable :collapsed=collapser(el.databaseid)>
            <template #header>
                <h2><a :href="'database/' + el.databaseid" target="_blank">{{ el.databasename }}</a></h2>
            </template>
            <div>
              <div id="about" v-html="htmlString">
            </div>
            <p>Database Contact: {{ contact }}</p>
            <p>{{el.databasename}} currently contains {{uniqueSites}} unique sites, associated with {{ uniqueDBsets }}
          unique datasets. See below for a summary of the kinds of datasets {{ el.databasename }} contains. </p>

    
           <DataTable paginator :rows="5" :value="datasettypes" :sort-field="'value'" :sort-order="-1" tableStyle="min-width: 20rem">
           <Column field="datasettype" header="Dataset Type"></Column>
           <Column field="value" header="Number" sortable></Column>
         </DataTable>
            </div>

    </Panel>
    </div>
  

</template>