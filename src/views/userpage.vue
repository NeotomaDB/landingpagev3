<script setup>
  import { onMounted, ref } from 'vue'
  import Panel from 'primevue/panel'
  import Badge  from 'primevue/badge'
  import { useRoute, useRouter } from 'vue-router'
  import ProgressSpinner from 'primevue/progressspinner';
  import ContactDetails from '@/views/resources/contactelements/contactdetails.vue'
  import ContactPublications from '@/views/resources/contactelements/contactlinkedpublications.vue'
  import ContactDatasets from '@/views/resources/contactelements/contactlinkeddatasets.vue'

  const route = useRoute();
  const router = useRouter();

  const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT
  let loading = ref(true)
  let contactinfo = ref(null)
  let userdatasets = ref(null)

  async function findContact(orcid) {
    const userid = await fetch(neotomaapi + '/v2.0/apps/landing/orcid', {
      method: "GET",
      headers: {
                "Content-Type": "application/json",
            },
    })
    
  }

  // Initialize on mount
  onMounted(async () => {
    await router.isReady()
    contactinfo.value = route.params.contactid;
    if (!contactinfo) {
      const userValidation = localStorage.getItem("orcid_user");
      if (userValidation) {
        const userOrcid = URLSearchParams({orcid:userValidation['data']['user']['id']})
        const response = await fetch(neotomaapi + `/v2.0/apps/landing/orcids/orcid?{userOrcid}`, {
          method: 'GET',
        }
        )
        if (!response.ok) {
          loading.value = false
          console.log('Issue with the API call.')
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        contactinfo.value = json['data']
      }
    }
  });

</script>

<template>
  <div v-if="contactinfo">
   <ContactDetails :title="contactinfo" />
   <ContactDatasets :title="contactinfo" />
    <ContactPublications :title="contactinfo" />
  </div>
  <div else>
    <Panel header="Neotoma Contacts">
      This page is intended as a landing page for Neotoma contacts. This includes authors, stewards, data contributors, analysts and others.
    </Panel>
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
