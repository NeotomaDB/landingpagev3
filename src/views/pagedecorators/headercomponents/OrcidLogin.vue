<script setup>
import { ref, computed, watch } from 'vue'
import Button from 'primevue/button'
import useTokens from '@/stores/auth.store.js'
import { useRoute } from 'vue-router'
import VueCookies from 'vue-cookies'
import { authedFetch } from '@/functions/apicalls'

const route = useRoute()

const { VITE_APP_API_ENDPOINT, VITE_APP_ORCID_BASE, VITE_APP_ORCID_REDIRECT_URI, VITE_APP_ORCID_CLIENT_ID } =
    import.meta.env

// const apiLocation = VITE_APP_API_ENDPOINT || 'https://api.neotomadb.org';
const baseUrl = `${VITE_APP_ORCID_BASE}/oauth/authorize?response_type=token&redirect_uri=${VITE_APP_ORCID_REDIRECT_URI}&client_id=${VITE_APP_ORCID_CLIENT_ID}&scope=openid`
// const userValidation = apiLocation + '/v2.0/apps/orcids/validate';

const user = ref(null)
const isValidating = ref(false)

// Get the store functions and state:
const { access_token, fetchTokens, logoutTokens, hasValidTokens } = useTokens()

// Computed property for button state:
const buttonType = computed(() => {
    return hasValidTokens.value ? 'logout' : 'login'
})

// Watch for route changes (like when redirected from OAuth)
watch(
    () => route.fullPath,
    (newPath) => {
        // Refetch tokens when route changes
        fetchTokens().then(() => {
            console.log(hasValidTokens.value)
            if (hasValidTokens.value) {
                user.value = VueCookies.get('orcid_user')
            }
        })
    },
    { immediate: true }
)

function handleLogin() {
    window.location.href = baseUrl
}

async function handleLogout() {
    try {
        // Read the session UUID from the cookie *before* we wipe it
        const orcidUser = VueCookies.get('orcid_user')
        const sessionuuid = orcidUser?.data?.neotoken?.sessionuuid

        if (sessionuuid) {
            await fetch(`${VITE_APP_API_ENDPOINT}/v2.0/apps/logout`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${sessionuuid}` }
            })
        }
    } catch (err) {
        // If the API call fails, still clear local state.
        // Otherwise the user is stuck "logged in" on the frontend.
        console.error('API logout failed, clearing local state anyway:', err)
    }
    logoutTokens()
    user.value = null
}
</script>

<template>
    <div class="orcid-auth">
        <!-- Login State -->
        <div v-if="buttonType === 'login'">
            <Button
                id="orcid-login-btn"
                @click="handleLogin"
                rounded
                v-tooltip="'Use ORCiD to manage your authentication on the Neotoma Landing pages.'"
                aria-label="Log into ORCID"
            >
                <i class="pi pi-sign-in"></i>
                Log Into ORCID
            </Button>
        </div>

        <!-- Logout State -->
        <div v-else-if="buttonType === 'logout'">
            <div class="user-info" v-if="user">
                <span>Welcome, {{ user['data']['user']['name'] || 'ORCID User' }}</span>
            </div>

            <Button
                id="orcid-logout-btn"
                @click="handleLogout"
                outlined
                rounded
                :disabled="isValidating"
                aria-label="Logout from ORCID"
            >
                <i class="pi pi-sign-out"></i>
                {{ isValidating ? 'Validating...' : 'Log Out of ORCID' }}
            </Button>
        </div>
    </div>
</template>
