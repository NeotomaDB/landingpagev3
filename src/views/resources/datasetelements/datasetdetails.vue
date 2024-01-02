<script setup>
  import Panel from 'primevue/panel';
  import Card from 'primevue/card';
  import ChronDetails from "@/views/resources/datasetelements/chronologydetails.vue"
  import TaxaDetails from "@/views/resources/datasetelements/taxaLoad.vue"
  import PublicationsDetails from "@/views/resources/datasetelements/publicationdetails.vue"
  import OtherDetails from "@/views/resources/datasetelements/otherdatasetdetails.vue"
  const props = defineProps(['title'])
  let dstype = props.title.site.datasets[0].datasettype[0].toUpperCase() +
    props.title.site.datasets[0].datasettype.slice(1)

</script>

<template>
    <Panel toggleable>
      <template #header>
        <h2>{{ dstype }} Dataset Details</h2>
      </template>
        <div v-if="props.title.site">
          <strong>Constituent Database: </strong>
          <span v-if="props.title.site.datasets[0].database" class="m-0">
              {{ props.title.site.datasets[0].database }}
          </span>
          <span v-else>None Reported</span>
        <br><strong>Dataset Notes: </strong>
        <span v-if="props.title.site.datasets[0].datasetnotes">
          <em>{{props.title.site.datasets[0].datasetnotes}}</em>
        </span>
        <span v-else>None Reported</span>
        <h3>Dataset PIs</h3>    
        <div v-if="props.title.site.datasets[0].datasetpi">
          <div class="grid">
            <div class="flex flex-row flex-wrap">
              <div v-for="name in props.title.site.datasets[0].datasetpi">
                <Card>
                  <template #content>{{ name.contactname }}</template>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <div v-else>None Reported</div>
      </div>
      <TaxaDetails />
    </Panel>  
    
    <ChronDetails :datasetid="props.title.site.datasets[0].datasetid"/>
    <PublicationsDetails :datasetid="props.title.site.datasets[0].datasetid"/>
    <OtherDetails :siteid="props.title.site.siteid"/>
</template>

<script>
  export default {
    name: 'DatasetDetails',
    data () {
      return {
        msg: 'Mapbox element has rendered.'
      }
    }
  }
</script>
