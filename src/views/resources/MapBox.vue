<script setup>
  import {ref} from "vue"
  import { geoJson } from "leaflet"
  import SiteMap from "@/views/resources/MapSite.vue"
  const props = defineProps(['title'])
  let zoom = ref(5);
  let center = geoJson(JSON.parse(props.title.site.geography))
</script>

<template>
<div v-if="props.title.site">
    <h2>{{props.title.site.sitename}}</h2>
    <h3>{{props.title.site.datasets[0].datasettype}} -- {{props.title.site.datasets[0].database}}</h3>
    <h4>Site Description</h4>: 
    {{props.title.site.sitedescription}}
    <h4>Site Notes</h4>:
    {{props.title.site.sitenotes}}
    <!--<SiteMap :location="center" />-->
    </div>
</template>
