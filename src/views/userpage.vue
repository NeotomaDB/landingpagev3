<script setup>
  import { onMounted, ref } from 'vue'
  import Panel from 'primevue/panel'
  import Card  from 'primevue/card'
  import { useRoute, useRouter } from 'vue-router'
  import ContactDetails from '@/views/resources/contactelements/contactdetails.vue'
  import ContactPublications from '@/views/resources/contactelements/contactlinkedpublications.vue'
  import ContactDatasets from '@/views/resources/contactelements/contactlinkeddatasets.vue'

  const route = useRoute();
  const router = useRouter();

  const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT
  let loading = ref(true)
  let contactinfo = ref(null)

  // Initialize on mount
  onMounted(async () => {
    await router.isReady()
    contactinfo.value = route.params.contactid;
    if (!contactinfo.value) {
      const userValidation = localStorage.getItem("orcid_user");
      if (userValidation) {
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
    <Panel>
      <template #header><h1>Neotoma Contacts</h1></template>
      <p>This page is intended as a landing page for Neotoma contacts. This includes authors, stewards, data contributors, analysts and others.</p>

      <p>Neotoma is the product of thousands of contributors working as sample analysts, sample collectors, authors, data modellers and stewards, among other activities.</p>

      <p>Individual contributions are difficult to encapsulate into simple statistics, but we hope that these summaries can help showcase the work individuals have put into the database.</p>
      <Card>
        <template #content>
          User Search coming soon.
        </template>
      </Card>

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
