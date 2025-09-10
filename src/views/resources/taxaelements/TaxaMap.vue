<script setup>
import { Map, View } from 'ol';
import { ref,onMounted} from 'vue';
import {useRoute} from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import XYZ from 'ol/source/XYZ';
import {boundingExtent} from 'ol/extent.js';
import Cluster from 'ol/source/Cluster';
import Tile from 'ol/layer/Tile.js';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import {fromLonLat} from 'ol/proj';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import Feature from "ol/Feature";
import {Style} from 'ol/style';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';
import Panel from 'primevue/panel';
const route = useRoute()
const datasets = ref([]);
const dataindexer = ref([]);
const firstreturn = ref(null);
var names = ref([]);
var ids = ref([]);
var coords = ref([]);
var descrips = ref([]);
var uniquenames = ref([]);
var uniqueids = ref([]);
var siteids = ref([]);
var idxlist = ref([]);
var link = ref([]);
const name = ref(null);
const datatypes = ref([]);
const myMap = ref(null);
const loading2 = ref(true)
const threshold = 70;
const numresults = ref(null);

const vectorSource = new VectorSource();

const visible = ref(false);
const taxonreturn = ref(null);
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'
        
function loadtaxon() {
  //https://api.neotomadb.org/v2.0/data/sites?taxa=Betulaceae 
  //v2.0/data/taxa/12... gives relationship between taxonid and taxonname
  return  fetch(neotomaapi + "/v2.0/data/taxa/" + route.params.taxonid,
    {method: "GET", headers: {'content-type': 'application/json'}})
    .then(res0 => {
      return res0.json()
    })
    .then(json0 => {
      firstreturn.value = json0.data;
      return name.value = firstreturn.value[0].taxonname
    })
    .then(name => {
 return fetch(neotomaapi + "/v2.0/data/sites?taxa=" + name + "&limit=999999",
      { method: "GET", headers: {'content-type': 'application/json'}})})
    .then(res1 => {
      return res1.json()}
    )
    .then(json1 => {
      taxonreturn.value = json1.data
      console.log(taxonreturn.value);
      numresults.value = taxonreturn.value.length
      return taxonreturn.value})
  .then(values => {
    let ids = [];
        values.forEach((pointfull => {
            let site = JSON.parse(pointfull.geography);
            let siteid = pointfull.siteid;
            let sitename = pointfull.sitename;
          if (site && site.coordinates !== null) { 
            if (!ids.includes(siteid)) {
                  var geom = site.coordinates;
                  let geometry;
                  if (Array.isArray(geom[0][0])) {
                    let transformedCoordinates = geom.map(ring => 
                        ring.map(coord => fromLonLat(coord))
                         );

                    geometry = new Polygon([transformedCoordinates]);
                    const flatco = geometry.getFlatCoordinates();
                    const centroid = [
                        (flatco[0][0] + flatco[1][0]) / 2,  // X centroid
                        (flatco[0][1] + flatco[2][1]) / 2   // Y centroid
                    ];
                    geometry = new Point(centroid);
                  } else {
                    geometry = new Point(fromLonLat(geom));
                  }
                  var feature = new Feature({
                      geometry: geometry,
                      name: sitename,
                      id: siteid,
              })
                ids.push(siteid)
                vectorSource.addFeature(feature);
            }
          }
        }))
        console.log(vectorSource.getFeatures())
        console.log(ids)
    return vectorSource;})
  .then(source => {
    const clusterSource = new Cluster({
      distance: 15,
      minDistance: 15,
      source:source});

    const styleCache = {};

    const clusters = new VectorLayer ({
      source: clusterSource,
      style: function (feature) {
        const size = feature.get('features').length;
        let style = styleCache[size];
        if (!style) {
          if (size == 1) {
            style = new Style({
              image: new Circle({
                radius: (5),
                fill: new Fill({
                  color: 'rgba(251,205,188,1)',  }),
                stroke: new Stroke({
                  color: 'rgba(92,84,80,1)',
                  width: (2/3*4),}), 
                }),
              })
            } else {
              style = new Style({
                image: new Circle({
                  radius: 8,
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
                  font: 'bold ' + (size**(1/6.35)/3.5 + 8) + 'px Helvetica',
                }),
              })
            };
            styleCache[size] = style;
          }
          return style;
        },
      })
    return clusters;
  })
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


    myMap.value.on('click', (e) => {
      vl.getFeatures(e.pixel)
        .then((clickedFeatures) => {
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
      })
      .catch(err => {
        console.log(err)
      });
    });  
  })
  .catch(err => {
    console.log(err)
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
    await loadtaxon();
    var extent2 = vectorSource.getExtent()
    var padding = ((extent2[2]-extent2[0])+(extent2[3]-extent2[1]))/20
    var paddedExtent = [extent2[0] - padding, extent2[1] - padding,
  extent2[2] + padding, extent2[3] + padding];
    myMap.value.getView().fit(paddedExtent);
 
var displayFeatureInfo = function(pixel) {
    var features2 = [];
    names.value = [];
    ids.value = [];
    coords.value = [];
    uniquenames.value = [];
    uniqueids.value = [];
    link.value = [];
    datasets.value = [];
    datatypes.value = [];
    myMap.value.forEachFeatureAtPixel(pixel, function(feature) {
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
                //console.log(inter)
            return inter

            })
            .then(int => {
                var all = int.data
                var fullsets = all.flatMap(site => site.site.datasets).map(on => on);
                siteids.value = [];
                idxlist.value = [];
                var idx = 0;
                all.forEach(function(site) {
                  
                  site.site.datasets.forEach(function() {
                    idx = idx + 1
                    siteids.value.push({name: site.site.sitename, index: idx})
                    idxlist.value.push(idx)
                  })
                })

                dataindexer.value = {};

                siteids.value.forEach(item => {
    // Extract name and index from each item
                  const { name, index } = item;
    
    // If the name doesn't exist in the result object, initialize it with an empty array
                   if (!dataindexer.value[name]) {
                  dataindexer.value[name] = [];
                    }
    
    // Push the index into the array corresponding to the name
                      dataindexer.value[name].push(index);
                });
                fullsets.forEach(entry => {
                    datatypes.value.push(entry.datasettype)
                    datasets.value.push(entry.datasetid)
                    link.value.push(("https://data.neotomadb.org/datasets/" + entry.datasetid))
                })
                return datasets.value
                
            })
          .catch(err => {
            console.log(err)
          })

        }

        if (areAllIdentical(coords.value) && uniquenames.value.length >= threshold) {
          visible.value = true;
        }
} 
};

myMap.value.on('click', async function(evt) {
  console.log(uniquenames.value)

  var coordinate = evt.coordinate;
  displayFeatureInfo(evt.pixel, coordinate); })

  loading2.value =false
})

</script>

<style>
  .map {
    width: 100%;
    height: 395px; /* Adjust the height as needed */
  }
</style>

<template>
    <Panel toggleable>
        <template #header>
            <h2>{{name}} Sites</h2>
        </template>
<div>
    <div style="width:750px;margin-left:auto;margin-right:auto;border:3px solid rgb(92,84,80);">
        <div v-if="numresults ==0">
            <p>There are currently no sites in Neotoma with this taxon present.</p>
        </div>
      <div v-else-if="loading2" class="flex flex-wrap justify-content-center align-items-center">
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
                <span><a :href="link[index]" target="_blank">{{ datasets[index] }}</a> ({{ datatypes[index] }})</span>
            </div>
            <p>{{ descrips[0] }}</p>
        </Dialog>
    </div>
    <div v-if="uniquenames.length > 1 && uniquenames.length < threshold">
        <Dialog header="Multiple sites with same location"
            v-model:visible="visible"
            modal 
            :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <strong>Sites and Datasets</strong>
            <div v-for="(site,index) in Object.keys(dataindexer)">
              <p><i>{{ site }}:</i></p>
              <span v-for="el in dataindexer[site]">
                <span> <a :href="link[(el-1)]" target="_blank">{{ datasets[(el-1)] }}</a> ({{ datatypes[(el-1)] }}), </span>
              </span>
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
                <p><i>{{site}}</i></p>
            </div>
        </Dialog>
    </div>
</div>
</Panel>
</template>