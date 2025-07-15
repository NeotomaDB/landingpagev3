<script setup>
  import { ref, onMounted } from 'vue'
  import Badge from 'primevue/badge';
  const props = defineProps(['contactid'])
  let orcid = ref(null)
  let loading = ref(true)
  const error = ref(null)

const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'

  function load_contact() {
    return fetch(neotomaapi + "/v2.0/apps/orcids?contactid=" + props.contactid, 
      { method: "GET", headers: {'content-type': 'application/json'}})
        .then(res => {
          if (!res.ok) {
            const error = new Error(res.statusText)
            error.json = res.json()
            orcid.value = false;
            loading.value = false;
            throw error;
          }
          return res.json()
        })
        .then(json => {
          if (json['data'][0]) {
            orcid.value = json['data'][0]['identifier']
            loading.value = false;
          } else {
            loading.value = false;
            orcid.value = false;
          }
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
  load_contact()
})
</script>

<template>
      <div v-if="!loading">
        <div v-if="orcid">
          <a :href="orcid">
            <Badge size="small" value="Orcid" severity="success" />
          </a>
        </div>
        <div v-else>
            <Badge size="small" severity="secondary" />
        </div>
      </div>
</template>

<script>
  export default {
    name: 'ContactDetails',
    data () {
      return {
        msg: 'We have obtained an ORCID.'
      }
    }
  }
</script>
