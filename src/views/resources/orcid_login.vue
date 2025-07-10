<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Button from 'primevue/button';
import useTokens from '@/stores/auth.store.js';
import { useRoute } from 'vue-router';

const route = useRoute();

const baseUrl = import.meta.env.VITE_APP_ORCID_LOGIN;
const userValidation = import.meta.env.VITE_APP_API_URL + '/v2.0/apps/orcids/validate';

const user = ref(null);
const isValidating = ref(false);

// Get the store functions and state
const { access_token, fetchTokens, logoutTokens, hasValidTokens } = useTokens();

// Computed property for button state
const buttonType = computed(() => {
    return hasValidTokens.value ? 'logout' : 'login';
});

// Validate user with backend
async function validateUser() {
    if (!hasValidTokens.value) return;
    
    isValidating.value = true;
    
    try {
        const response = await fetch(userValidation, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                token: access_token.value.access_token 
            })
        });

        if (response.status !== 200) {
            console.log('Token validation failed, logging out');
            logoutTokens();
            return;
        }

        const userData = await response.json();
        localStorage.setItem('orcid_user', JSON.stringify(userData));
        user.value = userData;
        console.log('User validated successfully');
        
    } catch (error) {
        console.error('Validation error:', error);
        logoutTokens();
    } finally {
        isValidating.value = false;
    }
}


// Watch for route changes (like when redirected from OAuth)
watch(() => route.fullPath, (newPath) => {
    console.log('🔄 Route changed to:', newPath);
    
    // Refetch tokens when route changes
    fetchTokens();
    
    if (hasValidTokens.value) {
        validateUser();
    }
}, { immediate: true });


// Initialize on mount
onMounted(async () => {
    console.log('OrcidLogin component mounted');

    // Load tokens from localStorage
    fetchTokens();
    
    // If we have tokens, validate them
    if (hasValidTokens.value) {
        console.log('Valid tokens found, validating user');
        await validateUser();
    } else {
        console.log('No valid tokens found');
    }
});

function handleLogin() {
    console.log('Redirecting to ORCID OAuth');
    window.location.href = baseUrl;
}

function handleLogout() {
    console.log('Logging out user');
    logoutTokens();
    user.value = null;
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
            >
                <i class="pi pi-sign-out"></i>
                {{ isValidating ? 'Validating...' : 'Log Out of ORCID' }}
            </Button>
        </div>
    </div>
</template>