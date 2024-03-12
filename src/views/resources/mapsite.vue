<script setup>
import { ref } from 'vue'

let props = defineProps(['location'])
var location = JSON.parse(props.location)
delete location.crs
const projection = ref('EPSG:4326')
const zoom = ref(9)
const currentZoom = ref(9)
const rotation = ref(0)

function centerMap(location) {
  if (Array.isArray(location.coordinates.flat()[0])) {
    return location.coordinates.flat()[0]
  } else {
    return location.coordinates
  }
}

function resolutionChanged(event) {
  currentZoom.value = event.target.getZoom();
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
                  <ol-style-fill color="rgba(255,0,0,0.2)"></ol-style-fill>
                  <ol-style-stroke color="rgba(0,0,0,0.8)" width="6"></ol-style-stroke>
                </ol-style-circle>
              </ol-style>
            </ol-feature>
            </ol-source-vector>
            <ol-source-vector v-else>
            <ol-feature>
              <ol-geom-point :coordinates="location.coordinates[0]"></ol-geom-point>
              <ol-style>
                <ol-style-circle radius="12">
                  <ol-style-fill color="rgba(255,0,0,0.2)"></ol-style-fill>
                  <ol-style-stroke color="rgba(0,0,0,0.8)" width="6"></ol-style-stroke>
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
