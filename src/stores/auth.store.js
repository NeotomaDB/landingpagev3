'use-strict';

/* We want to be able to provide support to log in, and return to the same session. */
/* We have state variables across all components that help us do that:
  access_token: The token passed to us from the ORCID OAuth that we then send through the
                Neotoma API for validation.
  user: The user information passed back from Neotoma, via the ORCID API.
  error: An error message to let us know what's happening.

  This module works with the orcid_login.vue component. There a user clicks the button.
  That user is redirected to the OAuth, where they login. That redirects to a login page
  in the app, which is then parsed and the user is passed to a "user" page.
  Every time the button is loaded (it is on the header for each page) it either:
  1. Checks if there is a 'neotoma_user' in the local storage, or
  2. gets the access_token and passes it to the Neotoma API.

  */

import { reactive, toRefs, computed } from "vue";

const state = reactive({
    access_token: null,
    user: null,
    error: null
});

export default function useTokens() {
    
    const fetchTokens = async () => {
        try {
            const storedTokens = localStorage.getItem("neotoma_orcid");
            const userValidation = localStorage.getItem("orcid_user");
            
            if (storedTokens) {
                state.access_token = JSON.parse(storedTokens);
                console.log('Token loaded from localStorage');
            } else {
                console.log('No ORCID access token.');
                state.access_token = null;
            }
            if (userValidation) {
                state.user = JSON.parse(userValidation);
                console.log('User loaded from localStorage');
            } else {
                console.log('No ORCID user info')
                state.user = null;
            }
        } catch (error) {
            console.error('Error parsing stored tokens:', error);
            state.access_token = null;
            state.user = null;
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
        console.log(state)
        if (state.access_token == null && state.user == null) {
            console.log('we are in here.')
            return false;
        }
        
        // Check if token has required properties
        // if (!state.access_token.access_token) return false;
        
        // Check if token is expired
        if (state.user) {
            if (state.user.expires_at){
                console.log('testing time.')
                const isExpired = Date.now() >= state.access_token.expires_at;
                if (isExpired) {
                    console.log('Token has expired');
                    logoutTokens()
                    return false;
                }
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