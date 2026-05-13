<script setup>
import { onMounted, ref } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import { useRouter } from 'vue-router'
import { authedFetch } from '@/functions/apicalls'

const router = useRouter()
const props = defineProps(['title'])
const publications = ref([])
const loading = ref(true)
const error = ref(null)

async function get_contactpubs(contactid) {
    try {
        const res = await authedFetch(`/v2.0/data/contacts/${contactid}/publications`, {
            method: 'GET',
            headers: { 'content-type': 'application/json' }
        })

        if (!res.ok) {
            const requestError = new Error(res.statusText)
            requestError.json = res.json()
            throw requestError
        }

        const json = await res.json()
        publications.value = json.data
    } catch (err) {
        error.value = err
        if (err.json) {
            const json = await err.json
            error.value.message = json.message
        }
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await router.isReady()
    await get_contactpubs(props.title)
})
</script>

<template>
    <div v-if="loading">
        <ProgressSpinner class="flex-grow-1 w-max" />
    </div>
    <div v-else-if="publications.length">
        <div v-for="item in publications">
            {{ item.citation }}
        </div>
    </div>
    <div v-else></div>
</template>

<script>
export default {
    name: 'ContactPublications',
    data() {
        return {
            msg: 'We have rendered the publications for the author.'
        }
    }
}
</script>
