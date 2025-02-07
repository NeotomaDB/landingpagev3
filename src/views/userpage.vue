<script setup>
  import { onMounted, ref } from 'vue'
  import Panel from 'primevue/panel'

  let username = ref({'name': null, 'id': null})
  let loading = ref(false)
  let contactinfo = ref(null)

  onMounted(() => {
    if(localStorage.hasOwnProperty("neotoma_orcid")) {
        let user_storage = JSON.parse(localStorage.getItem('neotoma_orcid'))

        fetch('https://orcid.org/oauth/userinfo', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user_storage['access_token'],
            }
        })
        .then((response) => response.json())
        .then((data) => {
            username.value = data
            loading.value = true
        })
        .catch((err) => {
            username.value = {'name': 'Error', 'id': 'Error'}
            loading.value = true
        })
    } else {
        loading.value = true
        username.value = {'name': '---', 'id': '---'}
    }
})
  
</script>

<template>
      <div v-if="loading">
        <panel>
            <template #header>
            <h1>{{ username['name'] }}</h1>
            </template>
            <h2>User ORCID Information</h2>
            Registered Name:  {{ username['name'] }}
            ORCID ID: {{ username['id'] }}
            <h2>User Neotoma Information</h2>
        </panel>
        <panel>
            <template #header>
                Datasets
            </template>
            As PI
            Analyst
            Submitter
        </panel>
        <panel>
            Steward
        </panel>
    </div>
</template>

<script>
  export default {
    name: 'UserPage',
    data () {
      return {}
      }
    }
</script>
