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


  function loadconstDB() {
    if (route.params.databaseid) {
      console.log(route.params.databaseid)
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
    //  console.log(datasettypes.value)

  datasettypes.value = Object.entries(datasettypes.value).map(([datasettype,value]) => ({datasettype,value}));
}) }
else {
  console.log("hmmm")
}
}

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
    .then(val => fetch(neotomaapi + "/v2.0/data/datasets/db?limit=10000&offset=0&database=" +val,
      { method: "GET", headers: {'content-type': 'application/json'}}))
    .then(res => {
      if (!res.ok) {
        const error = new Error(res.statusText)
        error.json = {'error': res.json(), 'databaseid':route.params.databaseid}
        throw error;}
      return res.json()})
    .then(json => {
      databaseinfo.value = json.data
      uniqueSites.value = new Set();
      databaseinfo.value.forEach(obj => uniqueSites.value.add(obj.site['siteid']));
      uniqueSites.value = uniqueSites.value.size


      datasetids.value = databaseinfo.value.flatMap(site =>
          site.site.datasets.flatMap(dataset => dataset.datasetid))

      datasets.value = databaseinfo.value.reduce((acc, obj) => {
        obj.site.datasets.forEach(dataset => {
          const type = dataset.datasettype;
          acc[type] = (acc[type] || 0) + 1;})
          return acc;}, {});
      pis.value = databaseinfo.value.reduce((acc, obj) => {
        obj.site.datasets.forEach(dataset => {
          dataset.datasetpi.forEach(pi => {
            const type = pi.contactname;
            acc[type] = (acc[type] || 0) + 1;}) })
        return acc;}, {});

      datasets_array.value = Object.entries(datasets.value).map(([datasettype,value]) => ({datasettype,value}));
      pis_array.value = Object.entries(pis.value).map(([name,value]) => ({name,value}));
      pis_array.value = pis_array.value.filter(obj => obj.name !== 'null')
      loading.value = false

      return databaseinfo.value})
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

    
onMounted(() => {

 // loadDatabase()
  loadContact()
  loadconstDB();
  
})


</script>



<template>
    <AboutDB/>
    <Panel toggleable>
      <template #header>
        <h2>Spatial and Temporal Extent</h2>
      </template>
      <TabView>
        <TabPanel header="Spatial Extent">
        <DatabaseMap />
      </TabPanel>
      <TabPanel header="Temporal Extent">
          <TempExtent/>
      </TabPanel>
    </TabView>
    </Panel>
      <UploadsTime/>

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