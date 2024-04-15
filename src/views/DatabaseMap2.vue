<script setup>
import { Map, View } from 'ol';
import { ref,onMounted} from 'vue';
import {useRoute} from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import {boundingExtent} from 'ol/extent.js';
import Cluster from 'ol/source/Cluster';
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
import Text from 'ol/style/Text';
const route = useRoute()
const datasets = ref([]);
var names = ref([]);
var ids = ref([]);
var coords = ref([]);
var descrips = ref([]);
var uniquenames = ref([]);
var uniqueids = ref([]);
var siteids = ref([]);
var link = ref([]);
const myMap = ref(null);
const loading2 = ref(true)
const threshold = 70;


const vectorSource = new VectorSource();


const visible = ref(false);
const constDBinfo = ref(null);
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'




const vectorStyle = new Style({
  image: new Circle({
    radius: 12,
    fill: new Fill({
      color: 'rgba(251,205,188,1)',  }),
    stroke: new Stroke({
      color: 'rgba(92,84,80,1)',
      width: 6,}), }),});
            
    function loadconstDB() {
    return  fetch(neotomaapi + "/v2.0/apps/constdb/datasets?dbid=" + route.params.databaseid,
      { method: "GET", headers: {'content-type': 'application/json'}})
    .then(res1 => {
      return res1.json()})
    .then(json1 => {
      constDBinfo.value = json1.data
  return constDBinfo.value})
  .then(values => {
    let ids = [];
        values.forEach((pointfull) => {
    if (pointfull.coords !== null) { 
      if (!ids.includes(pointfull.siteid)) {
            var point = pointfull.coords
            const lonLat = fromLonLat(point);
            var feature = new Feature({
                geometry: new Point(lonLat),
                name: pointfull.sitename,
                id: pointfull.siteid,
        })
          ids.push(pointfull.siteid)
                
            vectorSource.addFeature(feature);

    }}
})

return vectorSource;})
.then(source => {

const clusterSource = new Cluster({
  distance: 18,
  minDistance: 8,
  source:source});

  const styleCache = {};

  const clusters = new VectorLayer ({
    source:clusterSource,
    style: function (feature) {
      const size = feature.get('features').length;
      let style = styleCache[size];
      if (!style) {
        if (size==1) {
          style = new Style({
  image: new Circle({
    radius: (5/4*4+1),
    fill: new Fill({
      color: 'rgba(251,205,188,1)',  }),
    stroke: new Stroke({
      color: 'rgba(92,84,80,1)',
      width: (2/3*4),}), }),})
        }
        else {
        style = new Style({
          image: new Circle({
            radius: size**(1/5.35)+5,
            stroke: new Stroke({
              color: 'rgb(60,50,40)',
            }),
            fill: new Fill({
              color: 'rgb(221,205,188)',
            }),
          }),
          text: new Text({
            text: size.toString(),
            fill: new Fill({
              color: 'rgb(60,50,40)',
            }),
            font: 'bold ' + (size**(1/12.35)/3.5 + 7) + 'px Helvetica',
          }),
        })};
        styleCache[size] = style;
      }
      return style;
    },
  })

return clusters})
.then(vl => {
  myMap.value = new Map({
    layers: [
        new Tile({
            source: new XYZ({
            url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png'
        }),}),
        vl,],
    target: 'map2',
    view: new View({
        center: [0,0],
        zoom: 2,}),
})


myMap.value.on('moveend', function() {
    var zoom = myMap.value.getView().getZoom()
    console.log(zoom)
    const newStyle = new Style({
  image: new Circle({
    radius: (5/4*zoom+1),
    fill: new Fill({
      color: 'rgba(251,205,188,1)',  }),
    stroke: new Stroke({
      color: 'rgba(92,84,80,1)',
      width: (2/3*zoom),}), }),});;

    //  vl.setStyle(newStyle);


    });

myMap.value.on('click', (e) => {
  vl.getFeatures(e.pixel).then((clickedFeatures) => {
    if (clickedFeatures.length) {
      // Get clustered Coordinates
      const features = clickedFeatures[0].get('features');
      if (features.length > 1) {
        const extent = boundingExtent(
          features.map((r) => r.getGeometry().getCoordinates()),
        );
        myMap.value.getView().fit(extent, {duration: 1000, padding: [50, 50, 50, 50]});
      }
    }
  });
});
  
})
}

function areObjectsIdentical(obj1, obj2) {
    // Get the keys of the objects
    var keys1 = Object.keys(obj1);
    var keys2 = Object.keys(obj2);

    // Check if the number of keys is the same
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Check if all keys and values are the same
    for (var key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
}

function areAllIdentical(array) {
    if (array.length === 0) {
        return true;
    }

    var firstElement = array[0];

    for (var i = 1; i < array.length; i++) {
        if (!areObjectsIdentical(firstElement, array[i])) {
            return false;
        }
    }

    return true;
}


onMounted(async () => {
    await loadconstDB();
    var extent2 = vectorSource.getExtent()
    //console.log(((extent2[2]-extent2[0])+(extent2[3]-extent2[1]))/2)
    var padding = ((extent2[2]-extent2[0])+(extent2[3]-extent2[1]))/20
    var paddedExtent = [extent2[0] - padding, extent2[1] - padding,
  extent2[2] + padding, extent2[3] + padding];
    myMap.value.getView().fit(paddedExtent);
 
var displayFeatureInfo = function(pixel, coordinate) {
    var features2 = [];
    names.value = [];
    ids.value = [];
    coords.value = [];
    uniquenames.value = [];
    uniqueids.value = [];
    link.value = [];
    datasets.value = [];
    myMap.value.forEachFeatureAtPixel(pixel, function(feature, layer) {
        console.log(feature);
        feature.values_.features.forEach(el => {
          features2.push(el); });});
    
    if (features2.length > 0) {
      console.log('true')

        for (var i = 0, ii = features2.length; i < ii; ++i) {
            coords.value.push(features2[i].getGeometry().getCoordinates());
            names.value.push(features2[i].get('name'));
            ids.value.push(features2[i].get('id'));}
        console.log(coords.value)
        uniquenames.value = [... new Set(names.value.map(item => item))];
        uniqueids.value = [... new Set(ids.value.map(item => item))];
  

        if (areAllIdentical(coords.value) && uniqueids.value.length < threshold) {
          console.log('yes ident')
          var stringIDs = uniqueids.value.join(",");
          visible.value=true
          console.log(stringIDs)
          var sets = fetch('https://api.neotomadb.org/v2.0/data/sites/' +stringIDs + '/datasets?limit=2000')
            .then(res =>{
                var inter = res.json()
                console.log(inter)
            return inter

            })
            .then(int => {
                var all = int.data
                var fullsets = all.flatMap(site => site.site.datasets).map(on => on);
                siteids.value = [];
                all.forEach(function(site) {
                  site.site.datasets.forEach(function(dataset) {
                    siteids.value.push(site.site.sitename)
                  })
                })
                console.log(fullsets)
                console.log(siteids)
                console.log(all)
                fullsets.forEach(entry => {
                    datasets.value.push(entry.datasetid)
                    link.value.push(("https://data.neotomadb.org/datasets/" + entry.datasetid))
                })
                return datasets.value
                
            })

        }

        if (areAllIdentical(coords.value) && uniquenames.value.length >= threshold) {
          visible.value = true;
        }
} 
};

myMap.value.on('click', async function(evt) {
  console.log(await uniquenames.value)

    var coordinate = evt.coordinate;
    displayFeatureInfo(evt.pixel, coordinate); })



loading2.value =false



})


</script>



<style>
.map {
  width: 100%;
  height: 400px; /* Adjust the height as needed */
}

</style>


<template>
<div>
    <div style="width:750px;margin-left:auto;margin-right:auto;border:3px solid rgb(92,84,80);">
      <div v-if="loading2" class="flex flex-wrap justify-content-center align-items-center">
         <ProgressSpinner class="flex-grow-1 w-max" />
       </div>
      <div id='map2' class="map"> </div>
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
                <a :href="link[index]" target="_blank">{{ datasets[index] }}</a>
            </div>
            <p>{{ descrips[0] }}</p>
        </Dialog>
    </div>
    <div v-if="uniquenames.length > 1 && uniquenames.length < threshold">
        <Dialog header="Multiple Sites with same location"
            v-model:visible="visible"
            modal 
            :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <strong>Sites and Datasets</strong>
            <div v-for="(site,index) in siteids">
                <span>{{site}}: <a :href="link[index]" target="_blank">{{ datasets[index] }}</a></span>
            </div>
        </Dialog>
    </div>
    <div v-if="uniquenames.length >= threshold ">
        <Dialog header="Many many sites with same coordinates"
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


</template>
