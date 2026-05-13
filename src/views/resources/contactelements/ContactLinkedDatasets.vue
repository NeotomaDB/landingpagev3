<script setup>
import { onMounted, ref } from 'vue'
import Panel from 'primevue/panel'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import { useRouter } from 'vue-router'
import { authedFetch } from '@/functions/apicalls'

const router = useRouter()
const props = defineProps(['title'])
const datasets = ref([])
const countsums = ref([])
const loading = ref(true)
const error = ref(null)

function groupRoles(datasets) {
    const counts = datasets.reduce((p, c) => {
        const roles = c.roles
        roles.forEach((role) => {
            if (!Object.prototype.hasOwnProperty.call(p, role)) {
                p[role] = 0
            }
            p[role]++
        })
        return p
    }, {})

    return counts
}

async function get_contactdatasets(contactid) {
    try {
        const res = await authedFetch(`/v2.0/apps/contacts/${contactid}/datasets`, {
            method: 'GET',
            headers: { 'content-type': 'application/json' }
        })

        if (!res.ok) {
            const requestError = new Error(res.statusText)
            requestError.json = res.json()
            throw requestError
        }

        const json = await res.json()
        datasets.value = json.data
        countsums.value = groupRoles(datasets.value)
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
    await get_contactdatasets(props.title)
})
</script>

<template>
    <div v-if="loading">
        <ProgressSpinner class="flex-grow-1 w-max" />
    </div>
    <div v-else>
        <Panel>
            <template #header>
                <h4>User Submission Summary</h4>
            </template>
            <div v-for="(role, index) in countsums">
                <Button :badge="role" :label="index" aria-lable="User Submission Counts" />
            </div>
        </Panel>
    </div>
</template>
