<script setup>
  import { onMounted, ref } from 'vue'
  import Panel from 'primevue/panel'
  import Badge  from 'primevue/badge'
  import { useRoute } from 'vue-router'
  import ProgressSpinner from 'primevue/progressspinner';
  import ContactDetails from '@/views/resources/contactelements/contactdetails.vue'
  import ContactPublications from '@/views/resources/contactelements/contactlinkedpublications.vue'

  const route = useRoute()

  const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT
  let loading = ref(false)
  let contactinfo = route.params.contactid
  let userdatasets = ref(null)

</script>

<template>
    <div v-if="!loading"> 
      <ContactDetails :title="contactinfo" />
      <ContactPublications :title="contactinfo" />
    </div>
    <div v-else class="flex flex-wrap justify-content-center align-items-center">
      <ProgressSpinner class="flex-grow-1 w-max" />
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
