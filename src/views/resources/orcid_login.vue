<script setup>
  import { ref, onMounted } from 'vue';
  import Button from 'primevue/button';
  import useTokens from '@/stores/auth.store.js'
  
  const baseUrl = import.meta.env.VITE_APP_ORCID_LOGIN;

  let buttontype = ref("login")
  const {fetchTokens, access_token, logoutTokens} = useTokens()

  onMounted(() => {
    fetchTokens()
    if (!!access_token) {
      buttontype.value = "logout"
    }
  })
    
  function logout() {
    logoutTokens()
    buttontype.value = "login"
  }

</script>

<template>
    <div v-if='buttontype=="login"'>
      <Button id="loginorcid-1"
              as="a"
              :href="baseUrl"
              rounded
              v-tooltip="'Use ORCiD to manage your authentication on the Neotoma Landing pages.'">
        Log Into ORCID
      </Button>
  </div>
  <div v-else-if='buttontype=="logout"'>
    <Button id="loginorcid-1"
              variant="outlined"
              rounded
              v-tooltip="'Use ORCiD to manage your authentication on the Neotoma Landing pages.'"
              @click="logout">
        Log Out of ORCID
      </Button>
  </div>
</template>


<script>
  export default {
    name: 'OrcidLogin',
    data () {
      return {
        msg: 'Just a little box thing to login to ORCID with.'
      }
    }
  }
</script>
