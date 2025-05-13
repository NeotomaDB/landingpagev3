<script setup>
import { ref,onMounted} from 'vue';
import {useRoute} from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import Panel from 'primevue/panel';
const route = useRoute()
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'
const taxon = ref(null);
const name = ref(null);
const hightaxon = ref(null);
const loading_ab = ref(false);
const high1 = ref(null);
const highname = ref(null);
const highid = ref(null);
const author = ref(null);
const status = ref(null);
const pub = ref(null);
const ecolgroups = ref(null);
const ecolgroup = ref(null);
const ecolgroupname = ref(null);
const link = ref(null);
const externals = ref(null);

function loadAbout() {
    return  fetch(neotomaapi + "/v2.0/data/taxa/" + route.params.taxonid,
      { method: "GET", headers: {'content-type': 'application/json'}})
    .then(res1 => {
      return res1.json()}
    )
    .then(json1 => {
      taxon.value = json1.data
      high1.value = taxon.value[0].highertaxonid;
      link.value = "https://data.neotomadb.org/taxa/" + high1.value
      name.value = taxon.value[0].taxonname;
      author.value = taxon.value[0].author;
      pub.value = taxon.value[0].publication;
      status.value = taxon.value[0].status;
      return high1.value})
      .then(high => {
       return fetch(neotomaapi + "/v2.0/data/taxa/" + high,
      { method: "GET", headers: {'content-type': 'application/json'}})
      })
      .then(res2 => {
      return res2.json()}
    )
    .then(json2 => {
      hightaxon.value = json2.data
      ecolgroup.value = hightaxon.value[0].ecolgroup
      highname.value = hightaxon.value[0].taxonname;
      loading_ab.value = true;
    return hightaxon.value[0].ecolgroup })
 

}


function loadEcol() {
 return fetch(neotomaapi + '/v2.0/data/dbtables/ecolgrouptypes?count=false&limit=9999',
      { method: "GET", headers: {'content-type': 'application/json'}})
      .then(res3 => {
        return res3.json()
      })
      .then(json3 => {
        console.log(ecolgroup.value)
        ecolgroups.value = json3.data.find(item => item.ecolgroupid == ecolgroup.value);
        ecolgroupname.value = ecolgroups.value.ecolgroup
      })
}


function loadExternal() {
  return fetch(neotomaapi + '/v2.0/apps/exttax?taxonid=' + route.params.taxonid,
    {method: "GET", headers: {'content-type': 'application/json'}} )
    .then(res4 => {
      return res4.json()

    })
    .then(json4 => {
      externals.value = json4.data
    })
}


onMounted(async () => {
    await loadAbout();
    await loadEcol();
    await loadExternal();
})

</script>

<style>
h3 {
  padding-left: 10px;
}
</style>

<template>

<Panel toggleable>
  <template #header>
      <h2>About {{ name}}</h2>
    </template>
    <div v-if="loading_ab">
    <h3>Taxon Summary</h3>
    <ul>
      <li>Authority: {{author}}</li>
      <li>Publication: {{pub}}</li>
      <li>Higher Taxon: <a :href='link'>{{ highname }} </a></li>
      <li>Status: {{status}}</li>
      <li> Ecological Group: {{ecolgroupname}}</li>
      <div v-for="item in externals">
        <div v-if="item.extdatabasename == 'GBIF Backbone Taxonomy'">
          <li>{{item.extdatabasename}}: <a :href="'https://www.gbif.org/species/' + item.exttaxonid">{{ item.exttaxonid }}</a></li>
        </div>
        <div v-else-if="item.extdatabasename == 'NCBI Taxonomy Database'">
          <li>{{item.extdatabasename}}: <a :href="'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=' + item.exttaxonid">{{ item.exttaxonid }}</a></li>
        </div>
        <div v-else-if="item.extdatabasename != null">
          <li>{{item.extdatabasename}}: {{ item.exttaxonid }}</li>
        </div>
      </div>
    </ul>
    </div>
    <div v-else class="flex flex-wrap justify-content-center align-items-center">
      <ProgressSpinner class="flex-grow-1 w-max" />
    </div>
</Panel>
</template>