<script setup>
  import { ref } from 'vue'
  import Panel from 'primevue/panel'

  let username = ref(null)
  let loading = ref(null)

  let user_storage = JSON.parse(localStorage.getItem('neotoma_orcid'))

  fetch('https://orcid.org/oauth/userinfo', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + user_storage['access_token'],
  }
})
  .then((response) => response.json())
  .then((data) => (username.value = data))
  .catch((err) => {
    rawstats.value = 'error'
    loaderror.value = {
      uri: neotomaapi + '/v2.0/data/summary/rawbymonth?end=999999',
      error: err
    }
  })
</script>

<template>
      <panel>
        <template #header>
          <h1>{{ username['name'] }}</h1>
        </template>
        <h2>User ORCID Information</h2>
        Registered Name:  {{ username['name'] }}
        ORCID ID: {{ username['id'] }}
          <h2>User Neotoma Information</h2>
      </panel>
</template>

<script>
  export default {
    name: 'UserPage',
    data () {
      return {}
      }
    }
</script>
