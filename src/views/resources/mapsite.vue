<script setup>
import { ref, onMounted } from 'vue'
import { Map, View } from 'ol';
import OSM from 'ol/source/OSM.js';
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
import Overlay from 'ol/Overlay';


let props = defineProps(['location'])
var location = JSON.parse(props.location)
delete location.crs
const projection = ref('EPSG:4326')
const zoom = ref(9)
const currentZoom = ref(9)
const rotation = ref(0)
const newlong = ref(0)
const newlat = ref(0)
const natland = ref(null)

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
  
</script>




<template>
  <div v-if="location">
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
          @change:resolution="resolutionChanged"
        />
        <ol-tile-layer>
          <ol-source-xyz url="https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </ol-tile-layer>
        <ol-vector-layer>
          <ol-source-vector v-if="Array.isArray(location.coordinates.flat()[0]) && currentZoom > 9">
            <ol-feature >
              <ol-geom-polygon :coordinates="location.coordinates"></ol-geom-polygon>
              <ol-style>
                <ol-style-stroke color="rgba(0,0,0,0.8)" width="2"></ol-style-stroke>
                <ol-style-fill color="rgba(255,0,0,0.2)"></ol-style-fill>
              </ol-style>
            </ol-feature>
            </ol-source-vector>
            <ol-source-vector v-else-if="Array.isArray(location.coordinates.flat()[0]) && currentZoom <= 9">
              <ol-feature>
              <ol-geom-point :coordinates="location.coordinates[0][0]"></ol-geom-point>
              <ol-style>
                <ol-style-circle radius="12">
                  <ol-style-fill color="rgba(251,205,188,0.8)"></ol-style-fill>
                  <ol-style-stroke color="rgba(92,84,80,1)" width="6"></ol-style-stroke>
                </ol-style-circle>
              </ol-style>
            </ol-feature>
            </ol-source-vector>
            <ol-source-vector v-else>
            <ol-feature>
              <ol-geom-point :coordinates="location.coordinates[0]"></ol-geom-point>
              <ol-style>
                <ol-style-circle radius="12">
                  <ol-style-fill color="rgba(251,205,188,0.8)"></ol-style-fill>
                  <ol-style-stroke color="rgba(92,84,80,1)" width="6"></ol-style-stroke>
                </ol-style-circle>
              </ol-style>
            </ol-feature>
          </ol-source-vector>
        </ol-vector-layer>
      </ol-map>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SiteMap',
  data() {
    return {
      msg: 'Sitemap element has rendered.'
    }
  }
}
</script>
