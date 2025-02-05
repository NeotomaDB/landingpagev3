<script setup>
  import Button from 'primevue/button';
  import { ref, onMounted, computed } from 'vue'
  import { useORCIDStore } from '../../stores/stores'

  const orcidStore = useORCIDStore();
  const { logOut } = orcidStore;

</script>

<template>
  <div v-if="orcidStore(  ) == null ">
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
  <div v-else>
    <Button variant="success" pill @click="logOut()" id="loginorcid-2" v-tooltip="'Click to logout and remove ORCiD-related cookies.'">
      Logged Into ORCiD
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
