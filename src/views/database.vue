<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import ProgressSpinner from 'primevue/progressspinner'
  import Panel from 'primevue/panel'
  import Card from 'primevue/card'
  const route = useRoute()
  const projection = ref('EPSG:4326')
  const zoom = ref(2)
  const rotation = ref(0)


  const databaseinfo = ref(null)
  const databasekeys = ref(null)
  const databasename = ref(null)
  const currentDB = ref(null)
  const modinfo = new Array()
  const removeEmptyValues = new Array()
  var location = ref(null)

  const loading = ref(true)
  const error = ref(null)
  const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'

  function loadDatabase() {
    return  fetch(neotomaapi + "/v1.5/dbtables/constituentdatabases/",
      { method: "GET", headers: {'content-type': 'application/json'}})
      .then(res1 => {
        return res1.json()
      })
      .then(json1 => {
          databasekeys.value = json1.data  
          currentDB.value = databasekeys.value.find(element => element.databaseid === Number(route.params.databaseid))
          databasename.value = currentDB.value.databasename
          return databasename.value
      })
      .then(val => fetch(neotomaapi + "/v2.0/data/datasets/db?limit=10000&offset=0&database=" +val,
      { method: "GET", headers: {'content-type': 'application/json'}}))
        .then(res => {
          if (!res.ok) {
            const error = new Error(res.statusText)
            error.json = {'error': res.json(), 'databaseid':route.params.databaseid}
            throw error;
          }
          return res.json()
        })
        .then(json => {
          databaseinfo.value = json.data
          loading.value = false
          location.value = databaseinfo.value[0].site.geography
          location.value = JSON.parse(location.value)
          delete location.value.crs
          for (let i = 0; i < databaseinfo.value.length; i++) {
            if (databaseinfo.value[i].site.geography !== null) {
              var x = databaseinfo.value[i].site.geography;
              x = JSON.parse(x);
              delete x.crs;
              modinfo[i] = x;
          
          }};
          
        
        })
        .catch(err => {
          error.value = err
          if(err.json) {
            return err.json.then(json => {
            // set the JSON response message
            error.value.message = json.message;
            });
          }
        })
  }

  
function centerMap(location) {
  if (Array.isArray(location.coordinates.flat()[0])) {
    return location.coordinates.flat()[0]
  } else {
    return location.coordinates
  }
}
 
    
onMounted(() => {

    loadDatabase()
    
  
})
</script>

<template>
    <div v-if="!loading">

      <!--<div v-for="(loc, index) in databaseinfo" v-bind:key="loc.id">

      <p>{{index}}{{ loc }}</p>
    </div> -->
      <p>{{ modinfo.filter(e => e).length}}</p><br>
      <Panel toggleable collapsed>
      <template #header>
        <h2>About {{databasename}}</h2>
      </template>
        <p> There are {{databaseinfo.length}} sites returned by the original call. Not all of them are distinct, I think...</p>
        <div v-for="(value, name, index) in currentDB" :key="name.id">
          <p> {{ name }}: {{ value }}</p>
        </div>
        <p>{{databasename}} text here (call some text from somewhere somehow?)</p>
      </Panel>

      <Panel toggleable collapsed>
        <template #header>
          <h2>Spatial and Temporal Extent</h2>
        </template>
        <p>
            This is where the map and agerange plot could go eventually.
            It would be interesting to somehow combine those plots, to show how ageranges are distributed in space.
        </p>
        
   <div id="sitemap" style="outline-width: 1px">
        <ol-map
          :loadTilesWhileAnimating="true"
          :loadTilesWhileInteracting="true"
          style="height: 200px"
        >
          <ol-view
            ref="view"
            :center="centerMap(location)"
            :rotation="rotation"
            :zoom="zoom"
            :projection="projection"
          />
          <ol-tile-layer>
            <ol-source-stadia-maps layer="stamen_terrain" />
          </ol-tile-layer>
            <div v-for="location in modinfo.filter(e => e)" :key = "location.value">
              <ol-vector-layer>
                <ol-source-vector v-if="Array.isArray(location.coordinates.flat()[0])">
                  <ol-feature >
                    <ol-geom-polygon :coordinates="location.coordinates"></ol-geom-polygon>
                    <ol-style>
                      <ol-style-stroke color="rgba(0,0,0,0.8)" width="2"></ol-style-stroke>
                      <ol-style-fill color="rgba(255,0,0,0.2)"></ol-style-fill>
                    </ol-style>
                  </ol-feature>
                  </ol-source-vector>
                  <ol-source-vector v-else>
                  <ol-feature>
                    <ol-geom-point :coordinates="location.coordinates"></ol-geom-point>
                    <ol-style>
                      <ol-style-circle radius="12">
                        <ol-style-fill color="rgba(255,0,0,0.2)"></ol-style-fill>
                        <ol-style-stroke color="rgba(0,0,0,0.8)" width="6"></ol-style-stroke>
                      </ol-style-circle>
                    </ol-style>
                  </ol-feature>
                </ol-source-vector>
              </ol-vector-layer>
            </div>
        </ol-map>
      </div> 

        <Card>
          <template #header>
            <h3>{{databasename + ' Map'}}</h3>
          </template>
          <template #content>    
            <div class="grid" style="grid-auto-rows: 1fr;">
              <div v-if="databasename == 'FAUNMAP'" >
                <p>Pretend FAUNMAP map:</p>
                <img src='../assets/maps/FAUNMAPmap.JPG' style="max-width:30vw;"> 
              </div>
              <div v-if="databasename == 'North American Pollen Database'" >
                <p>Pretend NAPD map:</p>
                <img src='../assets/maps/North_American_Pollen_Databasemap.JPG' style="max-width:30vw;"> 
              </div>   
            </div>
          </template>
        </Card>
      </Panel>

      <Panel toggleable collapsed>
        <template #header>
          <h2>Datasets</h2>
        </template>
        <p>Here is where the information about uploads over time would go and datasettype.</p>
      </Panel>
      
      <Panel toggleable collapsed>
        <template #header>
          <h2>Native Lands</h2>
        </template>
        <p>functions here would use the native-land API</p>
      </Panel>

    </div>
    

    <div v-else class="flex flex-wrap justify-content-center align-items-center">
        <ProgressSpinner class="flex-grow-1 w-max" />

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