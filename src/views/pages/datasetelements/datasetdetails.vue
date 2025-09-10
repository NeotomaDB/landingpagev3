<script setup>
  import Panel from 'primevue/panel';
  import SelectButton from 'primevue/selectbutton';
  import Button from 'primevue/button';
  import download from 'downloadjs';

  import ChronDetails from "@/views/pages/datasetelements/chronologydetails.vue"
  import ContactDetails from "@/views/pages/datasetelements/contact_details.vue"
  import TaxaDetails from "@/views/pages/datasetelements/taxaLoad.vue"
  import PublicationsDetails from "@/views/pages/datasetelements/publicationdetails.vue"
  import OtherDetails from "@/views/pages/datasetelements/otherdatasetdetails.vue"
  import { ref, onMounted, watch } from 'vue';

  const citation = ref(null)
  const styles = ref(['apa', 'bibtex', 'ieee', 'vancouver'])
  const style = defineModel()

  const props = defineProps(['title'])
  let dstype = props.title.site.datasets[0].datasettype[0].toUpperCase() +
    props.title.site.datasets[0].datasettype.slice(1)

  const calljson = () => {
    let datasetid = props.title.site.datasets[0].datasetid
    let url = 'https://api.neotomadb.org/v2.0/data/downloads/' + datasetid
    fetch(url, 
      { method: 'GET', 
        headers: {'content-type': 'application/json'}})
    .then(res => {
      return res.json()
    })
    .then(data => {
      download(JSON.stringify(data.data), 'neotoma_dataset_' + datasetid + '.json', 'text/plain');
    })
  }

  async function getdatacitecitation(doi, style) {
    let sty = style.value;
    if (!sty) {
      sty = 'apa'
    }
    const citation_format = await fetch(`https://citation.doi.org/format?doi=${doi}&style=${sty}&lang=en-US`, {
      method: 'GET'});
    if (citation_format.ok) {
      citation.value = await citation_format.text()
    } else {
      citation.value = 'Just junk';
    }
  };

watch(style, async() => {
  getdatacitecitation(props.title.site.datasets[0].doi[0], style)
});

onMounted(async() => {
  style.value = 'apa'
  getdatacitecitation(props.title.site.datasets[0].doi[0], style)
})

</script>

<template>
    <Panel toggleable>
      <template #header>
        <h2>{{ dstype }} dataset details</h2>
      </template>
        <h3>Dataset Citation</h3>
        <SelectButton default-value='apa' v-model="style" :options="styles"></SelectButton>
        <p>{{ citation }}</p>
      <hr/>
      <div class="grid">
        <div class="col">
        <Button @click="calljson()" label="Download Raw JSON Data" style="margin:10px;width:100%" rounded />
      </div>
      <div class="col">
        <Button as="a" 
          label="View Data in Neotoma Explorer" 
          :href="'https://apps.neotomadb.org/explorer/?datasetids=' + props.title.site.datasets[0].datasetid"
          target="_blank"
          rel="noopener" style="margin:10px;text-decoration: none;width:100%" rounded />
        </div>
        </div>
        <div v-if="props.title.site">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <h3>Constituent Database: </h3>
            <span v-if="props.title.site.datasets[0].database" class="m-0">
              {{ props.title.site.datasets[0].database }}
            </span>
            <span v-else>None Reported</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <h3>Dataset Notes: </h3>
            <span v-if="props.title.site.datasets[0].datasetnotes" class="m-0">
              <em>{{props.title.site.datasets[0].datasetnotes}}</em>
            </span>
            <span v-else>None Reported</span>
          </div>
        <h3>Dataset PIs</h3>    
        <div v-if="props.title.site.datasets[0].datasetpi">
          <div class="grid">
            <div v-for="name in props.title.site.datasets[0].datasetpi" class="col-6">
              <div class="text-center p-3 border-round-sm surface-ground hover:surface-500 font-bold">
                <ContactDetails :contactid="name.contactid" style="float:left" /> {{ name.contactname }}</div> 
            </div>
          </div>
        </div>
        <div v-else>None Reported</div>
      </div>
      <TaxaDetails />
      <ChronDetails :datasetid="props.title.site.datasets[0].datasetid"/>
      <PublicationsDetails :datasetid="props.title.site.datasets[0].datasetid"/>
      <OtherDetails :siteid="props.title.site.siteid" :datasetid="props.title.site.datasets[0].datasetid"/>
    </Panel>
</template>

<script>
  export default {
    name: 'DatasetDetails',
    data () {
      return {
        msg: 'Dataset elements have rendered.'
      }
    }
  }
</script>
