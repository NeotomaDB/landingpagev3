<script setup>
import SiteMapAll from '@/views/resources/mapsite_all.vue'
import Panel from 'primevue/panel'
    const props = defineProps(['title'])

</script>

<template>
    <Panel>
        <template #header>
            <h2>{{props.title[0].site.datasets[0].database}} Details</h2>
        </template>
        <p>{{props.title[0].site.datasets[0].database}}</p>
  
        <div class="col" style="max-height:200px">
            <SiteMapAll :location="props.title[0].site.geography" />
        </div>
        <div v-if="props.title.site">

            <div class="grid">
                <div class="col-8">
                    <strong>Site Name:</strong> <br />
                    <strong>Description: </strong>
                    <span v-if="props.title.site.sitedescription">
                        <em>hello </em>

                    </span>
                    <span v-else> None</span>
                    <br />
                    <strong>Notes: </strong>
                    <span v-if="props.title.site.sitenotes">
                        <em> howdy</em>
                    </span>
                    <span v-else> None</span>
                </div>

            </div>
        </div>
    </Panel>
</template>

<script>
export default {
  name: 'SiteDetails',
  data() {
    return {
      msg: 'Mapbox element has rendered.'
    }
  }
}
</script>
