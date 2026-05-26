<script setup>
import { onMounted, ref, computed, defineAsyncComponent } from 'vue'
import Panel from 'primevue/panel'
import Card from 'primevue/card'
import { useRoute, useRouter } from 'vue-router'
import VueCookies from 'vue-cookies'
import { authedFetch } from '@/functions/apicalls'
import useTokens from '@/stores/auth.store'

const ContactDetails = defineAsyncComponent(() => import('@/views/resources/contactelements/ContactDetails.vue'))
const ContactPublications = defineAsyncComponent(
    () => import('@/views/resources/contactelements/ContactLinkedPublications.vue')
)

const ContactDatasets = defineAsyncComponent(
    () => import('@/views/resources/contactelements/ContactLinkedDatasets.vue')
)

const ContactSearch = defineAsyncComponent(
    () => import('@/views/resources/contactelements/ContactSearch.vue')
)

const { user } = useTokens()
const userName = computed(() => user.value?.data?.orcid?.name ?? null)

const route = useRoute()
const router = useRouter()

let loading = ref(true)
let contactinfo = ref(null)

// Initialize on mount
onMounted(async () => {
    await router.isReady()
    contactinfo.value = route.params.contactid
    if (!contactinfo.value) {
        const userValidation = VueCookies.get('orcid_user')
        if (userValidation) {
            const userOrcid = userValidation?.data?.user?.sub
            if (!userOrcid) {
            console.warn('orcid_user cookie present but has no ORCID identifier')
            loading.value = false
            return
        }
        try {
            const response = await authedFetch(
                `/v2.0/apps/landing/orcids/orcid?orcid=${userOrcid}`,
                { method: 'GET' }
            )
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`)
            }
            const json = await response.json()
            contactinfo.value = json.data
        } catch (err) {
            console.error('Failed to look up user by ORCID:', err)
            loading.value = false
            }
        }
    }
})
</script>

<template>
    <div v-if="contactinfo">
        <ContactDetails :title="contactinfo" />
        <ContactDatasets :title="contactinfo" />
        <ContactPublications :title="contactinfo" />
    </div>
    <div v-else>
        <Panel>
            <template #header>
                <h1>Neotoma Contacts</h1>
            </template>
            <p>
                This page is intended as a landing page for Neotoma contacts. This includes authors, stewards, data
                contributors, analysts and others.
            </p>

            <p>
                Neotoma is the product of thousands of contributors working as sample analysts, sample collectors,
                authors, data modellers and stewards, among other activities.
            </p>

            <p>
                Individual contributions are difficult to encapsulate into simple statistics, but we hope that these
                summaries can help showcase the work individuals have put into the database.
            </p>
            <Card>
                <template #title>Contact Search</template>
                <template #content>
                    <ContactSearch />
                </template>
            </Card>
        </Panel>
    </div>
</template>
