<script setup>
import { Map, View } from 'ol';
import { ref,onMounted, computed } from 'vue';
import {useRoute} from 'vue-router'
import Panel from 'primevue/panel';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import XYZ from 'ol/source/XYZ';
import Tile from 'ol/layer/Tile.js';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/vector';
import {fromLonLat} from 'ol/proj';
import Point from 'ol/geom/Point';
import Feature from "ol/Feature";
import {Style} from 'ol/style';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Overlay from 'ol/Overlay';
const route = useRoute()
const props = defineProps(['title'])
const datasets = ref([]);
var names = ref([]);
var ids = ref([]);
var descrips = ref([]);
var uniquenames = ref([]);
var uniquedescrips = ref([]);
var uniqueids = ref([]);
var link = ref([]);
const myMap = ref(null);
const loading2 = ref(true)
const vectorSource = new VectorSource();
const visible = ref(false);
const databaseinfo = ref(null)
const databasekeys = ref(null)
const databasename = ref(null)
const currentDB = ref(null)
const constDBinfo = ref(null);
  const uniqueDBsites = ref(null);
  const uniqueDBsets = ref(null);
  const datasettypes = ref(null);
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'
const vectorStyle = new Style({
  image: new Circle({
    radius: 12,
    fill: new Fill({
      color: 'rgba(251,205,188,1)',  }),
    stroke: new Stroke({
      color: 'rgba(92,84,80,1)',
      width: 6,}), }),});
            
const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: vectorStyle,});


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
  loading2.value=false
  return constDBinfo.value})
  .then(values => {
        values.forEach((pointfull) => {
    if (pointfull.coords !== null) { 
          //  var point_par = JSON.parse(pointfull.coords)
          //  console.log(pointfull)        
         //   delete point_par.crs
            var point = pointfull.coords
        //    console.log(point)
            const lonLat = fromLonLat(point);
        //    console.log(lonLat)
            var feature = new Feature({
                geometry: new Point(lonLat),
                name: pointfull.sitename,
                id: pointfull.siteid,
         //       descrip: pointfull.site.sitedescription,
        })
                
            vectorSource.addFeature(feature);

    }})})
}



onMounted(() => {
    loadconstDB();
    
    myMap.value = new Map({
    layers: [
        new Tile({
            source: new XYZ({
            url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png'
        }),}),
        vectorLayer,],
    target: 'map',
    view: new View({
        center: [0,0],
        zoom: 2,}),
});


var displayFeatureInfo = function(pixel, coordinate) {
    var features2 = [];
    names.value = [];
    ids.value = [];
    descrips.value = [];
    uniquenames.value = [];
    uniquedescrips.value = [];
    uniqueids.value = [];
    link.value = [];
    datasets.value = [];
    myMap.value.forEachFeatureAtPixel(pixel, function(feature, layer) {
        features2.push(feature); });
    if (features2.length > 0) {

        for (var i = 0, ii = features2.length; i < ii; ++i) {
            names.value.push(features2[i].get('name'));
            ids.value.push(features2[i].get('id'));
            descrips.value.push(features2[i].get('descrip'));}
        uniquenames.value = [... new Set(names.value.map(item => item))];
        uniquedescrips.value = [... new Set(descrips.value.map(item => item))];
        uniqueids.value = [... new Set(ids.value.map(item => item))];
        if (uniquenames.value.length == 1) {
            var sets = fetch('https://api.neotomadb.org/v2.0/data/sites/' + uniqueids.value[0] + '/datasets')
            .then(res =>{
                var inter = res.json()
                console.log(inter)
            return inter

            })
            .then(int => {
                var all = int.data
                var fullsets = all[0].site.datasets
                fullsets.forEach(entry => {
                    datasets.value.push(entry.datasetid)
                    link.value.push(("https://data.neotomadb.org/datasets/" + entry.datasetid))
                })
                return datasets.value
                
            })
            console.log(sets)
        }
} 
};

myMap.value.on('click', function(evt) {
    visible.value=true
    console.log("hello?")
    var coordinate = evt.coordinate;
    displayFeatureInfo(evt.pixel, coordinate); })


const extent = computed(() => {
  if (vectorSource.getExtent()) {
    myMap.value.getView().fit(vectorSource.getExtent())
    return vectorSource.getExtent();
  } else {
    return [];
  }
});
//console.log(extent)

//console.log(myMap.value.getView().projection_.extent_)

myMap.value.on('moveend', function() {
    var zoom = myMap.value.getView().getZoom()
 //   console.log(zoom)
    const newStyle = new Style({
  image: new Circle({
    radius: (5/4*zoom+1),
    fill: new Fill({
      color: 'rgba(251,205,188,1)',  }),
    stroke: new Stroke({
      color: 'rgba(92,84,80,1)',
      width: (2/3*zoom),}), }),});;

      vectorLayer.setStyle(newStyle);


    })




})


loading2.value =false
</script>



<style>
.map {
  width: 100%;
  height: 400px; /* Adjust the height as needed */
}

</style>


<template>
<div v-if="!loading2">

    <h3>Spatial Extent</h3>
    <div style="width:750px;margin-left:auto;margin-right:auto;border:3px solid rgb(92,84,80);">
        <div id='map' class="map"> </div>
    </div>  
    <div v-if="uniquenames.length == 1">
        <Dialog
            v-model:visible="visible"
            modal
            :header="names[0]"
            :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        >
            <p>Site ID: {{ ids[0] }}</p>
            <p>Dataset ID links:</p>
            <div v-for="(el,index) in link">
                <a :href="link[index]">{{ datasets[index] }}</a>
            </div>
            <p>{{ descrips[0] }}</p>
        </Dialog>
    </div>
    <div v-if="uniquenames.length > 1">
        <Dialog header="Multiple Sites"
            v-model:visible="visible"
            modal 
            :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <strong>Site Names:</strong>
            <div v-for="site in uniquenames">
                <p>{{site}}</p>
            </div>
        </Dialog>
    </div>
</div>
<div v-else class="flex flex-wrap justify-content-center align-items-center">
    <ProgressSpinner class="flex-grow-1 w-max" />
</div>

</template>

<script>

export default {
  name: 'DatabaseMap',

};
</script>
