<script setup>
import { onMounted, ref } from 'vue'
import Panel from 'primevue/panel'
import ProgressSpinner from 'primevue/progressspinner'
import { useRouter } from 'vue-router'
import { authedFetch } from '@/functions/apicalls'

const router = useRouter()
const props = defineProps(['title'])
const contactinfo = ref(null)
const loading = ref(true)
const error = ref(null)

function getInstitution(address) {
    if (!address) {
        return ''
    }

    const normalizedAddress = address.replace(/\s+/g, ' ').trim()
    const streetAddressStart = normalizedAddress.search(/\b(?:\d+[A-Za-z-]*|P\.?\s*O\.?\s*Box)\b/i)

    if (streetAddressStart === -1) {
        return normalizedAddress
    }

    return normalizedAddress.slice(0, streetAddressStart).trim().replace(/[,\s]+$/, '')
}

async function get_contact(contactid) {
    const res = await authedFetch(`/v2.0/data/contacts/${contactid}`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' }
    })

    if (!res.ok) {
        throw new Error(res.statusText)
    }

    const json = await res.json()
    return json.data[0]
}

onMounted(async () => {
    await router.isReady()

    try {
        contactinfo.value = await get_contact(props.title)
    } catch (err) {
        error.value = err
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div v-if="loading">
        <ProgressSpinner class="flex-grow-1 w-max" />
    </div>
    <div v-else-if="contactinfo">
        <Panel>
            <template #header>
                <h4>{{ contactinfo.contactname }}</h4>
            </template>
            <p>
                <b>Institution:</b> {{ getInstitution(contactinfo.address) }} <br><br>
                <b>Neotoma ID:</b> {{ props.title }}
            </p>
        </Panel>
    </div>
    <div v-else>
        <Panel>
            <template #header>
                <h4>{{ props.title }}</h4>
            </template>
            <p>Unable to load contact details.</p>
        </Panel>
    </div>
</template>
