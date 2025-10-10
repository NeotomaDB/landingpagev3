<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Button from 'primevue/button';
import useTokens from '@/stores/auth.store.js';
import { useRoute } from 'vue-router';
import VueCookies from 'vue-cookies'

const route = useRoute();

const apiLocation = import.meta.env.VITE_APP_API_URL || 'https://api.neotomadb.org';
const baseUrl = import.meta.env.VITE_APP_ORCID_LOGIN || 'https://orcid.org/oauth/authorize?response_type=token&redirect_uri=https://data.neotomadb.org/login&client_id=APP-OKAEGWFY7MEOK4HE&scope=openid';
const userValidation = apiLocation + '/v2.0/apps/orcids/validate';

const user = ref(null);
const isValidating = ref(false);

// Get the store functions and state:
const { access_token, fetchTokens, logoutTokens, hasValidTokens } = useTokens();

// Computed property for button state:
const buttonType = computed(() => {
    return hasValidTokens.value ? 'logout' : 'login';
});


// Watch for route changes (like when redirected from OAuth)
watch(() => route.fullPath, (newPath) => {
    // Refetch tokens when route changes
    fetchTokens()
        .then(() => {
            console.log(hasValidTokens.value)
            if (hasValidTokens.value) {
                user.value = VueCookies.get('orcid_user')
            }
        });
}, { immediate: true });


// Initialize on mount
onMounted(async () => {
    // Load tokens from localStorage
    await fetchTokens();
});

function handleLogin() {
    window.location.href = baseUrl;
}

function handleLogout() {
    logoutTokens();
    user.value = null;
}
</script>

<template>
    <div class="orcid-auth">
        <!-- Login State -->
        <div v-if="buttonType === 'login'">
            <Button id="orcid-login-btn" @click="handleLogin" rounded
                v-tooltip="'Use ORCiD to manage your authentication on the Neotoma Landing pages.'"
                aria-label="Login to ORCID">
                <i class="pi pi-sign-in"></i>
                Log Into ORCID
            </Button>
        </div>

        <!-- Logout State -->
        <div v-else-if="buttonType === 'logout'">
            <div class="user-info" v-if="user">
                <span>Welcome, {{ user['data']['user']['name'] || 'ORCID User' }}</span>
            </div>

            <Button id="orcid-logout-btn" @click="handleLogout" outlined rounded :disabled="isValidating"
                aria-label="Logout from ORCID">
                <i class="pi pi-sign-out"></i>
                {{ isValidating ? 'Validating...' : 'Log Out of ORCID' }}
            </Button>
        </div>
    </div>
</template>