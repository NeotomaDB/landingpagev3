<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue'
import OSM from 'ol/source/OSM.js';
import Panel from 'primevue/panel';
import Avatar from 'primevue/avatar';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner'
import { Map, View } from 'ol';
import XYZ from 'ol/source/XYZ';
import Tile from 'ol/layer/Tile.js';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
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
const map = ref(null);
const hasFeatures = ref(null);
var ids = ref([]);
var features = ref([]);
var info = ref([]);
var link = ref([]);
var visible = ref(false);
const vectorSource2 = ref(null);
const loadingnat = ref(true);

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
  
function getColor(source) {
  var length = source.length
  var color = null;
  var colorList = ['#D94120','#92bb20','#20BB82', '#484D5C']
 for (var i = 0; i < length; i++) {
  color = colorList[i];
 }
 return color;
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
    width: 1 // Specify the border width for the polygon
  })
});



  vectorSource2.value = new VectorSource();
  const vectorLayer2 = new VectorLayer({
    source: vectorSource2.value,
    style: function(feature) {
      return new Style({
        fill: new Fill({
          color: feature.getProperties().fillColor}),
        stroke: new Stroke({
          color: 'rgba(92, 84, 80, 0)',
          width: 0 }),
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
          //offsetX: 0,
          //offsetY: -10,
          overflow: true,
          textAlign: 'center',
          textBaseline: 'middle',
         // placement: 'point',
         placement: 'line',
          maxAngle: Math.PI /4

        })
      })
    }});
  natland.value.forEach((elem,index) => {
    if (elem.geometry.coordinates.flat().length != 1) {
      var polygonGeometry = new Polygon([elem.geometry.coordinates.flat().map(coord => fromLonLat(coord))]);
      var choices = ['rgba(227, 181, 0, 0.7)', 'rgba(90, 253, 101, 0.7)','rgba(134, 192, 253, 0.7)', 'rgba(255, 0, 185, 0.5)','rgba(0, 0, 10, 0.5)']
      //, , , , , 
      var fillColor = choices[(index % 5)] 
      const polygonFeature = new Feature({
        fillColor: fillColor,
        geometry: polygonGeometry,
        name: elem.properties.Name,
        slug: elem.properties.Slug,
        url: 'https://native-land.ca/maps/territories/' + elem.properties.Slug});
      vectorSource2.value.addFeature(polygonFeature);}
    else {
      elem.geometry.coordinates.flat().forEach((pol) => {
        var polygonGeometry = new Polygon([pol.map(coord => fromLonLat(coord))]);
        const polygonFeature = new Feature({
          geometry: polygonGeometry,
          name: elem.properties.Name,
          slug: elem.properties.Slug,
          url: 'https://native-land.ca/maps/territories/' + elem.properties.Slug});
        vectorSource2.value.addFeature(polygonFeature);})}
      });
  console.log("features: " + vectorSource2.value.getFeatures().length)
  if (vectorSource2.value.getFeatures().length > 0) {
    hasFeatures.value = true
  }
  else {
    hasFeatures.value = false
  }
  console.log("has features: " + hasFeatures.value)
  var myMap2 = new Map({
    layers: [
      new Tile({
        source: new XYZ({
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        }),}),
      vectorLayer2, vectorLayer],
    target: 'map2',
    style: undefined,
    view: new View({
    center: centerMap(location),
    zoom: 10,}),});

  if (hasFeatures.value) {
  const extent = vectorSource2.value.getExtent();
  myMap2.getView().fit(extent)

}
 // myMap2.getView().setZoom(5)       

 console.log("check: " + hasFeatures.value)
 if (!hasFeatures.value) {
  console.log('there is none')
  const extent = vectorSource.getExtent();
  myMap2.getView().fit(extent)
  myMap2.getView().setZoom(5)


 } 

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



    const popupContainer = document.createElement('div');
popupContainer.className = 'popup';
document.body.appendChild(popupContainer);

// Create an overlay with the popup container
const popupOverlay = new Overlay({
    element: popupContainer,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -15] // Offset to position the popup above the pointer
});
myMap2.addOverlay(popupOverlay);
    // Add a pointermove event listener to the map
myMap2.on('pointermove', function(event) {
    // Get the pixel coordinates of the pointer from the event
    const pixel = myMap2.getEventPixel(event.originalEvent);
    const featureInfo = [];

    // Perform an action when hovering over a feature
    myMap2.forEachFeatureAtPixel(pixel, function(feature, layer) {
        // Check if the feature exists
        if (feature) {
            // Do something when hovering over the feature
            const featureProperties = feature.getProperties();
            const text = featureProperties.name || 'Feature';
            if (layer == vectorLayer2) {
            featureInfo.push(text)}

        }
    });
    if (featureInfo.length > 0) {
        popupContainer.innerHTML = featureInfo.join('<br>'); // Separate feature information with line breaks
        const coordinate = myMap2.getEventCoordinate(event.originalEvent);
        popupOverlay.setPosition(coordinate);
        popupOverlay.setMap(myMap2);
    } else {
        // If no feature is found, hide the popup overlay
        popupOverlay.setMap(null);
    }

});
   
}

onMounted(() => {
  nativeland();

})



loadingnat.value=false
</script>


<style>
.map {
  width: 100%;
  height: 395px; /* Adjust the height as needed */
}

.popup {
  background-color: white;
  padding: 3px;
}

.custom .p-panel-header {
  background-color:gray;
}
.norm .p-panel-header {
}
</style>


<template>
  <div v-if="!loadingnat">
    <Panel id='nativeland' :class="{custom: !hasFeatures, norm: hasFeatures}" toggleable collapsed>
        <template #header>
          <div class="flex align-items-center gap-2">
            
            <img src="https://149613070.v2.pressablecdn.com/wp-content/themes/NLD-2021/assets/nld-logo.png" height=40 />
            <span><h3>Native Land Digital Data</h3></span>
          </div>
        </template>
        <div id="griddiv_nlm" style="display:grid;grid-template-columns:1fr 1fr;">
        <div style="height:400px;width:450px;margin-left:0%;margin-right:auto;border:3px solid rgb(92,84,80);">
          <div id="map2" class="map" ref="map">
        </div>
 
      </div> 
      <div v-if="!hasFeatures">
            <p>This site does not intersect any Indigenous territorries currently mapped by the Native Land project.
            </p>
          </div>

      <div v-if="hasFeatures" style="font-size:13px;">
        <br>
        <span>This site intersects Indigenous lands. It is part of the territory of the </span>
      <span v-for="(feat, index) in vectorSource2.getFeatures()">
        <span v-if="(index +1) != vectorSource2.getFeatures().length && (index + 2) != vectorSource2.getFeatures().length">
 <a :href="feat.values_.url" target="_blank">{{feat.values_.name}}</a>
      <span>, </span>
    </span>
          <span v-if="(index + 2) == vectorSource2.getFeatures().length">
         <a :href='feat.values_.url' target="_blank">{{ feat.values_.name }}</a>
      <span> and </span>
          </span>
    <span v-if="(index +1) == vectorSource2.getFeatures().length">
  <a :href="feat.values_.url" target="_blank">{{ feat.values_.name}}</a> 
    </span>
  </span>
  <span>, according to the <a href="https://native-land.ca/" target="_blank">Native Land</a> mapping project.</span>
  <p>Neotoma’s stewards and users come from all over the world. Wherever we are and wherever we collect and curate data, 
    we acknowledge that we are on Indigenous land. </p>

<p>Naming the ways that Neotoma’s 
  data have been and are now entangled with the violences of 
  settler-colonialism is a necessary component of 
  ethical data stewardship. We acknowledge that Neotoma’s archive 
  has resulted in part from a process of colonial extraction, 
  by which scientists exploit 
  the natural and cultural wealth of Indigenous nations 
  without consultation or provision of reciprocal benefit. 
  As well, we acknowledge that Neotoma's data model 
  can objectify the sacred kin of Indigenous peoples.
</p>
   <p>We respect the sovereign status of the Indigenous peoples from whose lands our data derive, 
    and we hold ourselves accountable to those peoples.
    Neotoma is cataloging the Indigenous cultural affiliation of 
    its data records and exploring new ways to represent those records as an element of its participation in the 
    <a href="https://eos-rcn.github.io/web/home" target="_blank">Ethical Open Science research coordination network</a>,
    in order to work toward more ethical stewardship of Indigenous data. </p>
    <p>This language has been borrowed in part from <a target="_blank" href="https://localcontexts.org/">Local Contexts</a>.</p>
    </div>
  </div>
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
        <a :href="link[index]" target="_blank">{{ info[index] }}</a>
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
        <a :href="link[index]" target="_blank">{{ info[index] }}</a>
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
  name: 'NativeMap',
  data() {
    return {
      msg: 'Native Lands map element has rendered.'
    }
  }
}
</script>