'use-strict';

import { reactive, toRefs, computed } from "vue";

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

const state = reactive({
    access_token: null,
    user: null,
    isLoading: false,
    error: null
});

export default function useTokens() {
    
    const fetchTokens = () => {
        console.log('***** Fetching tokens:')
        try {
            const storedTokens = localStorage.getItem("neotoma_orcid");
            console.log('Raw token:' + storedTokens)
            
            if (storedTokens) {
                state.access_token = JSON.parse(storedTokens);
                console.log('Tokens loaded from localStorage');
            } else {
                state.access_token = null;
            }
        } catch (error) {
            console.error('Error parsing stored tokens:', error);
            state.access_token = null;
            localStorage.removeItem('neotoma_orcid');
        }
    };

    const logoutTokens = () => {
        state.access_token = null;
        state.user = null;
        state.error = null;
        localStorage.removeItem('neotoma_orcid');
        localStorage.removeItem('orcid_user');
        console.log('Tokens cleared');
    };

    const hasValidTokens = computed(() => {
        if (!state.access_token) return false;
        
        // Check if token has required properties
        if (!state.access_token.access_token) return false;
        
        // Check if token is expired
        if (state.access_token.expires_at) {
            const isExpired = Date.now() >= state.access_token.expires_at;
            if (isExpired) {
                console.log('Token has expired');
                return false;
            }
        }
        
        return true;
    });

    return {
        ...toRefs(state),
        fetchTokens,
        logoutTokens,
        hasValidTokens
    };
}