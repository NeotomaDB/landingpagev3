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
  let loading = ref(true)
  let contactinfo = ref(null)
  let userdatasets = ref(null)

  // Initialize on mount
  onMounted(async () => {
    contactinfo.value = route.params.contactid;
  });

</script>

<template>
  <ContactDetails :title="contactinfo" />
  <ContactPublications :title="contactinfo" />
</template>

<script>
  export default {
    name: 'UserPage',
    data () {
      return {}
      }
    }
</script>
