<script setup>
  import { ref, onMounted } from 'vue';
  import Button from 'primevue/button';
  import { useRouter } from 'vue-router';
  
  const baseUrl = import.meta.env.VITE_APP_ORCID_LOGIN;

  let buttontype = ref(null)
  let orcid_state = ref(null)

  onMounted(() => {
    if(localStorage.hasOwnProperty("neotoma_orcid")){
      orcid_state = localStorage.getItem("neotoma_orcid")
      buttontype = "Logout"
    } else {
      buttontype = "Login"
    }
  })
  
  function logout() {
    localStorage.removeItem("neotoma_orcid");
    orcid_state = null;
  }

</script>

<template>
    <div v-if='buttontype=="Login"'>
      <Button id="loginorcid-1"
              as="a"
              :href="baseUrl"
              rounded
              v-tooltip="'Use ORCiD to manage your authentication on the Neotoma Landing pages.'">
        Log Into ORCID
      </Button>
  </div>
  <div v-else-if='buttontype=="Logout"'>
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
