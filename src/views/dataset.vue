<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import ProgressSpinner from 'primevue/progressspinner';
  import SiteDetails from "@/views/resources/datasetelements/sitedetails.vue"
  import DatasetDetails from "@/views/resources/datasetelements/datasetdetails.vue"

  const route = useRoute()

  const datasetinfo = ref(null)
  const loading = ref(true)
  const error = ref(null)
  
  function loadDataset() {
    return fetch(import.meta.env.VUE_APP_API_ENDPOINT + "/v2.0/data/datasets/" + route.params.datasetid, 
      { method: "GET", headers: {'content-type': 'application/json'}})
        .then(res => {
          if (!res.ok) {
            const error = new Error(res.statusText)
            error.json = res.json()
            throw error;
          }
          return res.json()
        })
        .then(json => {
          datasetinfo.value = json.data[0]
          loading.value = false;
        })
        .catch(err => {
          error.value = err
          if(err.json) {
            return err.json.then(json => {
            // set the JSON response message
            error.value.message = json.message;
            });
          }
        })
  }

onMounted(() => {
  loadDataset()
})
</script>

<template>
    <div v-if="!loading"> 
      <SiteDetails :title="datasetinfo" />
      <DatasetDetails :title="datasetinfo" />
    </div>
    <div v-else class="flex flex-wrap justify-content-center align-items-center">
      <ProgressSpinner class="flex-grow-1 w-max" />
    </div>
</template>

<script>
export default {
  data() {
    return {
      datasetinfo: "",
    };
  },
}
</script>