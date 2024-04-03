<script setup>
import {ref, onMounted} from 'vue';
import Panel from 'primevue/panel'
import Card from 'primevue/card'
const databasekeys = ref(null);
const deluxe = ref(null);
const visible = ref(false);
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
      const constDBinfo = json1.data
      
   
      uniqueDBsites.value = new Set();
      constDBinfo.forEach(obj => uniqueDBsites.value.add(obj['siteid']));
      uniqueDBsites.value = uniqueDBsites.value.size

      uniqueDBsets.value = new Set();
      constDBinfo.value.forEach(obj => uniqueDBsets.value.add(obj['datasetid']));
      uniqueDBsets.value = uniqueDBsets.value.size
      datasettypes.value = constDBinfo.value.reduce((acc, obj) => {
          const type = obj.datasettype;
          acc[type] = (acc[type] || 0) + 1;
          return acc;}, {});
   //   console.log(datasettypes.value)

  datasettypes.value = Object.entries(datasettypes.value).map(([datasettype,value]) => ({datasettype,value}));
  loading_ab.value=false
})
}

async function loadSummary(id) {
    return fetch(neotomaapi + "/v2.0/apps/constdb/datasets?dbid=" + id,)
    .then(async res => {
        const json = await res.json()
        return json
    })
    .then(async js => {
        const dbdats = await js.data
    
    console.log(dbdats.length)
        return dbdats.length
    })
    .then(it => {
        visible.value =true
        return it
    })
}


loadDatabases();
//console.log(deluxe.value[0])
</script>

<template>
    <h1>Neotoma Constituent Databases !!!</h1>
    <div v-for="el in databasekeys">
        <Panel toggleable collapsed>
            <template #header>
                <h2><a :href="'database/' + el.databaseid" target="_blank">{{ el.databasename }}</a></h2>
            </template>
            <Card header="Summary Info"
             v-model:visible="visible"
            modal 
            :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <strong>Site Names:</strong>
            </Card>
            <p>{{el.contactid}}</p>
            <div v-show="visible">
           <p>{{loadSummary(el.databaseid) }}</p>
            </div>
            <p>text about {{ el.databasename }} from somewhere somehow?</p>
    </Panel>
    </div>
  

</template>