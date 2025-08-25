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
import VueCookies from 'vue-cookies'

const state = reactive({
    access_token: null,
    user: null,
    error: null,
    consent: null
});

// Validate user with backend
async function validateUser() {

    if (!hasValidTokens.value) {
        return;
    }
    
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
        userData['data']['user']['expires_at'] = access_token.value.expires_at;
        VueCookies.set('orcid_user', userData);
        VueCookies.remove('orcid_token');
        user.value = userData;
        
    } catch (error) {
        logoutTokens();
    } finally {
        isValidating.value = false;
    }
}

export default function useTokens() {
    
    const fetchTokens = async () => {
        try {
            // Passed from ORCID
            const storedTokens = VueCookies.get("orcid_token");
            // Passed from Neotoma
            const userValidation = VueCookies.get("orcid_user");
            
            if (storedTokens) {
                state.access_token = storedTokens;
                let nothing = await validateUser()
            } else {
                state.access_token = null;
            }

            if (userValidation) {
                state.user = userValidation;
                state.user = state.user['data']
            } else {
                state.user = null;
            }
        } catch (error) {
            console.error('Error parsing stored tokens:', error);
            state.access_token = null;
            state.user = null;
            VueCookies.remove('neotoma_orcid');
        }
    };

    const logoutTokens = () => {
        state.access_token = null;
        state.user = null;
        state.error = null;
        VueCookies.remove('orcid_token');
        VueCookies.remove('orcid_user');
    };

    const hasValidTokens = computed(() => {
        console.log(state)
        if (state.access_token == null && state.user == null) {
            return false;
        }
        
        // Check if token has required properties
        // if (!state.access_token.access_token) return false;
        
        // Check if token is expired
        if (state.user) {
            // This should post back to the API to check.
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