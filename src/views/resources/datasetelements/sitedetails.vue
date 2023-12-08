<script setup>
  // import SiteMap from "@/views/resources/mapsite.vue"
  import Panel from 'primevue/panel';
  const props = defineProps(['title'])
</script>

<template>
  <Panel>
    <template #header>
      <h2>Site Details</h2>
    </template>
    <div v-if="props.title.site">
    <strong>Site Name:</strong> {{ props.title.site.sitename }}<br>
    <strong>Description: </strong>
    <span v-if="props.title.site.sitedescription">
      <em>{{props.title.site.sitedescription}}</em>
    </span>
    <span v-else> None</span>
    <br>
    <strong>Notes: </strong>
    <span v-if="props.title.site.sitenotes">
      <em> {{props.title.site.sitenotes}}</em>
    </span>
    <span v-else> None</span>
    <!--<SiteMap :location="props.title.site.geography" />-->
  </div>
  </Panel>
  
</template>

<script>
  export default {
    name: 'SiteDetails',
    data () {
      return {
        msg: 'Mapbox element has rendered.'
      }
    }
  }
</script>
