<script setup>
  import {ref} from "vue"
  import { geoJson } from "leaflet"
  import { LMap, LGeoJson, LTileLayer } from "@vue-leaflet/vue-leaflet";
  const props = defineProps(['location'])
  let object = JSON.parse(props.location)
  let zoom = 10
  let center = geoJson({ "type": "Polygon", "coordinates": [ [ -112.14744, 36.3709 ], [ -112.14691, 36.3709 ], [ -112.14691, 36.37135 ], [ -112.14744, 36.37135 ], [ -112.14744, 36.3709 ] ] } )

</script>

<template>
    <div v-if="props.location">
        {{ center }}
      <div id="sitemap" style="height:30vh; width:30vh">
        <l-map ref="map" 
                v-model:zoom="zoom"
                :useGlobalLeaflet="false"
                v-model:center="center">
          <l-tile-layer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        layer-type="base"
                        name="Stadia Maps Basemap"></l-tile-layer>
          <l-geo-json :geojson="center"></l-geo-json>
        </l-map>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'SiteMap',
    data () {
      return {
        msg: 'Sitemap element has rendered.'
      }
    }
  }
</script>
