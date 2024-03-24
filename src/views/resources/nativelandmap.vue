<script setup>
import { ref, onMounted } from 'vue'
import Panel from 'primevue/panel';
import Dialog from 'primevue/dialog';
import { Map, View } from 'ol';
import XYZ from 'ol/source/XYZ';
import Tile from 'ol/layer/Tile.js';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/vector';
import {fromLonLat} from 'ol/proj';
import Point from 'ol/geom/Point';
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import {Style} from 'ol/style';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';
import Overlay from 'ol/Overlay';



let props = defineProps(['location'])
var location = JSON.parse(props.location)
delete location.crs
const projection = ref('EPSG:4326')
const zoom = ref(9)
const rotation = ref(0)
const newlong = ref(0)
const newlat = ref(0)
const natland = ref(null)
var names = ref([]);
var ids = ref([]);
var descrips = ref([]);
var uniquenames = ref([]);
var uniquedescrips = ref([]);
var features = ref([]);
var info = ref([]);
var uniqueids = ref([]);
var link = ref([]);
var visible = ref(false);

function centerMap(location) {
  if (Array.isArray(location.coordinates.flat()[0])) {
    return location.coordinates.flat()[0]
  } else {
    return location.coordinates
  }
}


if(Array.isArray(location.coordinates.flat()[0])) {
  newlat.value = (location.coordinates.flat()[0][1] + location.coordinates.flat()[2][1])/2
  newlong.value = (location.coordinates.flat()[1][0] + location.coordinates.flat()[0][0])/2
}
  

async function nativeland() {
  if(Array.isArray(location.coordinates.flat()[0])) {
  const waiting = await fetch("https://native-land.ca/api/index.php?maps=territories&position=" + newlat.value + ',' + newlong.value)
  natland.value = await waiting.json();
}
else {
  const waiting = await fetch("https://native-land.ca/api/index.php?maps=territories&position="
   + location.coordinates.flat()[1] + ',' + location.coordinates.flat()[0] );
   natland.value = await waiting.json();
}

  
const vectorSource = new VectorSource();
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
    style: vectorStyle});

  if(Array.isArray(location.coordinates.flat()[0])) {
    console.log("true poly")
        const lonLat = fromLonLat([newlong.value,newlat.value]);
        var feature = new Feature({
          geometry: new Point(lonLat) })
        vectorSource.addFeature(feature); }

  else {
        const lonLat = fromLonLat(location.coordinates.flat());
        var feature = new Feature({
          geometry: new Point(lonLat) })
        vectorSource.addFeature(feature); }

  const polygonStyle = new Style({
  fill: new Fill({
    color: 'rgba(232,229, 222, 0.5)' // Specify the fill color for the polygon
  }),
  stroke: new Stroke({
    color: 'rgba(92, 84, 80, 1)', // Specify the border color for the polygon
    width: 3 // Specify the border width for the polygon
  })
});

  const vectorSource2 = new VectorSource();
  const vectorLayer2 = new VectorLayer({
    source: vectorSource2,
    style: function(feature) {
      return new Style({
        fill: new Fill({
          color: 'rgba(232,229, 222, 0.5)'}),
        stroke: new Stroke({
          color: 'rgba(92, 84, 80, 1)',
          width: 3 }),
        text: new Text({
          text: feature.get('name'),
          font: '20px Calibri,sans-serif',
          fill: new Fill({
            color: '#000'
          }),
          stroke: new Stroke({
            color: 'rgba(92, 84, 80, 1)',
            width: 1
          }),
          offsetX: 0,
          offsetY: -10,
          textAlign: 'center',
          textBaseline: 'middle',
          placement: 'point',
          maxAngle: Math.PI /4

        })
      })
    }});
  natland.value.forEach((elem) => {
    if (elem.geometry.coordinates.flat().length != 1) {
      var polygonGeometry = new Polygon([elem.geometry.coordinates.flat().map(coord => fromLonLat(coord))]);
      const polygonFeature = new Feature({
        geometry: polygonGeometry,
        name: elem.properties.Name,
        slug: elem.properties.Slug});
      vectorSource2.addFeature(polygonFeature);}
    else {
      elem.geometry.coordinates.flat().forEach((pol) => {
        var polygonGeometry = new Polygon([pol.map(coord => fromLonLat(coord))]);
        const polygonFeature = new Feature({
          geometry: polygonGeometry,
          name: elem.properties.Name});
        vectorSource2.addFeature(polygonFeature);})}});
  var myMap2 = new Map({
    layers: [
      new Tile({
        source: new XYZ({
            url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png'
        }),}),
      vectorLayer2, vectorLayer],
    target: 'map2',
    style: undefined,
    view: new View({
    center: centerMap(location),
    zoom: 10,}),});
  const extent = vectorSource2.getExtent();
  myMap2.getView().fit(extent)
 // myMap2.getView().setZoom(5)       

  var displayFeatureInfo = function(pixel, coordinate) {
    features.value = [];
    info.value = [];
    ids.value = [];
    link.value = [];
    myMap2.forEachFeatureAtPixel(pixel, function(feature, layer) {
      if (layer === vectorLayer2) {
        features.value.push(feature); }});
        if (features.value.length > 0) {
          for (var i = 0, ii = features.value.length; i < ii; ++i) {
            info.value.push(features.value[i].get('name'));
            ids.value.push(features.value[i].get('slug'));
            link.value.push(("https://native-land.ca/maps/territories/" + features.value[i].get('slug')));
          }} };

  myMap2.on('click', function(evt) {
    visible.value = true;
    var coordinate = evt.coordinate;
    displayFeatureInfo(evt.pixel, coordinate);});
}

onMounted(() => {
  nativeland();
})

</script>


<style>
.map {
  width: 100%;
  height: 400px; /* Adjust the height as needed */
}
</style>


<template>
  <div v-if="location">
    <Panel toggleable>
        <template #header>
            <h3>Native Lands</h3>
        </template>
    <div id="map2" class="map" style="width:500px;"></div>
    </Panel>
    <div v-if="features.length == 1">
    <Dialog
        v-model:visible="visible"
        modal
        :header="info[0]"
        :style="{ width: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      >
      <p>Native Land links:</p>
      <div v-for="(el,index) in link">
        <a :href="link[index]">{{ info[index] }}</a>
        </div>
 
      </Dialog>
    </div>
    <div v-if="features.length > 1">
    <Dialog header="Multiple Lands"
    v-model:visible="visible"
        modal 
        :style="{ width: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <strong>Territories:</strong>
        <div v-for="(el,index) in link">
        <a :href="link[index]">{{ info[index] }}</a>
        </div>
 
    </Dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NativeMap',
  data() {
    return {
      msg: 'Native Lands map element has rendered.'
    }
  }
}
</script>