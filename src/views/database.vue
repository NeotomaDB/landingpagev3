<script setup>
  import TempExtent from '@/views/TempExtent.vue';
  import DatabaseMap from '@/views/DatabaseMap.vue';
  import UploadsTime from '@/views/UploadsTime.vue';
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import ProgressSpinner from 'primevue/progressspinner'
  import Panel from 'primevue/panel'
  import DataTable from 'primevue/datatable';
  import InputText from 'primevue/inputtext';
  import Column from 'primevue/column';


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

  loadDatabase()
  loadContact()
  
})


</script>



<template>
  <div v-if="!loading">
    <Panel toggleable>
      <template #header>
        <h2>About {{databasename}}</h2>
      </template>
      <p> There are {{uniqueSites}} distinct sites in {{ databasename }}, associated with
        {{datasets_array.reduce((total,obj) => total + obj['value'], 0) }} datasets. </p>
      <DataTable paginator :rows="5" :value="datasets_array" :sort-field="'value'" :sort-order="-1" tableStyle="min-width: 20rem">
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
          
        <p>{{databasename}} text here (call some text from somewhere somehow?)</p>
      </Panel>

      <Panel toggleable>
        <template #header>
          <h2>Spatial and Temporal Extent</h2>
        </template>
          <Panel toggleable collapsed>
            <template #header>
              <h3>Spatial Extent</h3>
            </template>
          <DatabaseMap :title="databaseinfo"/>
        </Panel>
        <Panel toggleable collapsed>
          <template #header>
            <h3>Temporal Extent</h3>
        </template>
        <TempExtent :title="databaseinfo"/>
      </Panel>

      </Panel>

      <Panel toggleable collapsed>
        <template #header>
          <h2>Datasets</h2>
        </template>
        <UploadsTime :title="datasetids" />
        <DataTable  v-model:globalFilter="filters.name.value" 
        :globalFilterFields="['name']"
        :value="pis_array" paginator :rows="5" :sort-field="'value'" :sort-order="-1" tableStyle="min-width: 20rem">
        <template #header>
        <div class="flex justify-content-end">
                <InputText v-model="filters.name.name" placeholder="Keyword Search" />
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
      

    </div>
    

    <div v-else class="flex flex-wrap justify-content-center align-items-center">
        <ProgressSpinner class="flex-grow-1 w-max" />

    </div>

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