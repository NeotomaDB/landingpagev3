<script setup>
  import { onMounted, ref } from 'vue'
  import Panel from 'primevue/panel'
  import Badge  from 'primevue/badge'
  import ProgressSpinner from 'primevue/progressspinner';

  const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT
  const props = defineProps(['title'])
  const publications = ref({})
  const loading = ref(true)
  const error = ref(null)

  function get_contactpubs(contactid) {
    return fetch(neotomaapi + "/v2.0/data/contacts/" + contactid + '/publications', 
      { method: "GET", headers: {'content-type': 'application/json'}})
        .then(res => {
          if (!res.ok) {
            const error = new Error(res.statusText)
            error.json = { 'error': res.json(), 'contactid': contactid }
            throw error;
          }
          return res.json()
        })
        .then(json => {
          publications.value = json.data[0]
          loading.value = false;
        })
        .catch(err => {
          error.value = err
          if(err.json) {
            return err.json
          }
        })
  }
  onMounted(() => {
    get_contactpubs(props.title)
  })
</script>

<template>
    <div v-if="loading">
        <ProgressSpinner class="flex-grow-1 w-max" />
    </div>
    <div v-else>
        {{ publications }}
        <div v-for="item in publications">
            {{ item.citation }}
        </div>
    </div>
</template>

<script>
export default {
  name: 'ContactPublications',
  data() {
    return {
      msg: 'We have rendered the publications for the author.'
    }
  }
}
</script>
