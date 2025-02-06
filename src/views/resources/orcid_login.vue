<script setup>
  import Button from 'primevue/button';
  import { ref, onMounted, computed } from 'vue'
  // import { useORCIDStore } from '../../stores/stores'

</script>

<template>
    <div>
    <a
      id="orcidAuthButton"
      href="https://orcid.org/oauth/authorize?response_type=token&redirect_uri=https://data.neotomadb.org/&client_id=APP-OKAEGWFY7MEOK4HE&scope=openid"
    >
      <Button id="loginorcid-1"
              variant="warning"
              pill
              v-tooltip="'Use ORCiD to manage your authentication on the Neotoma Landing pages.'">
        Log Into ORCID
      </Button>
    </a>
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
