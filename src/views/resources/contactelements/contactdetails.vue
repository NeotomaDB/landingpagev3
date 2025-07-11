<script setup>
  import { onMounted, ref } from 'vue'
  import Panel from 'primevue/panel'
  import Badge  from 'primevue/badge'
  import ProgressSpinner from 'primevue/progressspinner';

  const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT
  const props = async () => { defineProps(['title']) }
  const contactinfo = ref({})
  const loading = ref(true)
  const error = ref(null)
  function get_contact(contactid) {  
    return fetch(neotomaapi + "/v2.0/data/contacts/" + contactid,
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
          contactinfo.value = json.data[0]
          loading.value = false;
        })
        .catch(err => {
          error.value = err
          if(err.json) {
            return err.json
          }
        })
  }
  onMounted(async () => {
    console.log(props.title)
    get_contact(props.title)
  })
</script>

<template>
    <div v-if="loading">
        <ProgressSpinner class="flex-grow-1 w-max" />
    </div>
    <div v-else>
        <Panel :header="contactinfo['contactname']">
            email:{{ contactinfo['email'] }}
        </Panel>
    </div>
</template>

<script>
export default {
  name: 'ContactDetails',
  data() {
    return {
      msg: 'We have rendered the contact info.'
    }
  }
}
</script>
