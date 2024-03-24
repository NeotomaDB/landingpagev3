<script setup>
 import { ref, onMounted } from 'vue';
 import { useRoute } from 'vue-router';
 import DatabaseMap from '@/views/DatabaseMap.vue';

 
  const route = useRoute()
  const databaseinfo = ref(null)
  const datasets = ref(null)
  const pis = ref(null)
  const pis_array = ref(null)
  const datasets_array = ref(null)
  const uniqueSites = ref(null)

  const loading = ref(true)
  const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'

console.log('anything?');

 function loadDatabase() {
    return fetch("https://api.neotomadb.org/v2.0/data/datasets/db?limit=10000&offset=0&database=FAUNMAP",
      { method: "GET", headers: {'content-type': 'application/json'}})
        .then(res => {
          if (!res.ok) {
            const error = new Error(res.statusText)
            error.json = {'error': res.json(), 'databaseid':route.params.databaseid}
            throw error;
          }
          else {
            console.log("hell???")
            return res.json()   }
        })
        .then(json => {
          databaseinfo.value = json.data

          uniqueSites.value = new Set();
          databaseinfo.value.forEach(obj => uniqueSites.value.add(obj.site['siteid']));
          uniqueSites.value = uniqueSites.value.size

          datasets.value = databaseinfo.value.reduce((acc, obj) => {
            obj.site.datasets.forEach(dataset => {
              const type = dataset.datasettype;
              acc[type] = (acc[type] || 0) + 1;
            })
            return acc;
          }, {});
          pis.value = databaseinfo.value.reduce((acc, obj) => {
            obj.site.datasets.forEach(dataset => {
              dataset.datasetpi.forEach(pi => {
                const type = pi.contactname;
                acc[type] = (acc[type] || 0) + 1;

              })
              
            })
            return acc;
          }, {});

          datasets_array.value = Object.entries(datasets.value).map(([datasettype,value]) => ({datasettype,value}));
          pis_array.value = Object.entries(pis.value).map(([name,value]) => ({name,value}));
          pis_array.value = pis_array.value.filter(obj => obj.name !== 'null')
          loading.value = false
       

          return databaseinfo.value
        
        })}


 loadDatabase();

</script>

<style>
.map {
  width: 100%;
  height: 400px; /* Adjust the height as needed */
}
</style>

<template>

   <div>
  <!--  <p>{{ databaseinfo }}</p> -->
          <DatabaseMap :title="databaseinfo"/> 
   </div>

</template>


<script>




export default {
  data() {
    return {
      datasetinfo: "",
    };
  },
}
</script>
