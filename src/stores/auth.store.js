'use-strict'

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

import { reactive, toRefs, computed } from 'vue'
import VueCookies from 'vue-cookies'
// Note: apicalls.js also imports useTokens — circular dep is safe here because
// authedFetchJson is only referenced inside function bodies, never at module init time.
import { authedFetchJson } from '@/functions/apicalls'

const apiLocation = import.meta.env.VITE_APP_API_ENDPOINT || 'https://api.neotomadb.org'
const userValidation = `${apiLocation}/v2.0/apps/orcids/validate`

const state = reactive({
    access_token: null,
    user: null,
    error: null,
    consent: null,
    isValidating: false
})

export default function useTokens() {
    const fetchTokens = async () => {
        try {
            // Passed from ORCID
            const storedTokens = VueCookies.get('orcid_token')
            // Passed from Neotoma
            const userValidation = VueCookies.get('orcid_user')

            if (storedTokens) {
                state.access_token = storedTokens
                let nothing = await validateUser()
            } else {
                state.access_token = null
            }

            if (userValidation) {
                // Keep the full API response shape ({status, data, message}) — every
                // consumer reads through `.data` (UserPage, refreshSession), so
                // unwrapping it here left `state.user` shaped differently after a
                // reload than after a fresh login.
                state.user = userValidation
            } else {
                state.user = null
            }
        } catch (error) {
            console.error('Error parsing stored tokens:', error)
            state.access_token = null
            state.user = null
            VueCookies.remove('neotoma_orcid')
        }
    }

    const logoutTokens = () => {
        state.access_token = null
        state.user = null
        state.error = null
        VueCookies.remove('orcid_token')
        VueCookies.remove('orcid_user')
    }

    // Validate user with backend
    async function validateUser() {
        // All we need to exchange is an ORCID token. Gating this on hasValidTokens
        // used to mean a stale expired session blocked a fresh login, and could
        // clear access_token out from under the fetch below.
        if (!state.access_token?.access_token) {
            return
        }

        // Guard against re-entry: if a validation request is already in flight,
        // don't start a second one (otherwise we create duplicate sessions
        // in ap.orcidlogins).
        if (state.isValidating) {
            return
        }

        state.isValidating = true

        try {
            const response = await fetch(userValidation, {
                //userValidation is not in the scope
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: state.access_token.access_token
                })
            })

            if (response.status !== 200) {
                // Read the reason before discarding the response. The API sends a
                // human-readable `message` for the cases a person can act on — a
                // 403 for "not a steward", a 401 for a dead ORCID token — and
                // without this the login button just appeared to do nothing.
                const body = await response.json().catch(() => null)
                console.log('Token validation failed, logging out')
                // logoutTokens() resets state.error, so set the message after it.
                logoutTokens()
                state.error = body?.message || 'Login failed. Please try again.'
                return
            }

            // The API returns the session's own expiry in data.neotoken.expiresat,
            // so there's nothing to graft on here. (We used to copy the ORCID
            // token's expiry, which was both undefined and the wrong clock.)
            const userData = await response.json()
            VueCookies.set('orcid_user', userData)
            VueCookies.remove('orcid_token')
            state.user = userData
            console.log('✅ User validated and stored:', state.user)
        } catch (error) {
            console.error('❌ validateUser error:', error)
            logoutTokens()
        } finally {
            state.isValidating = false
        }
    }

    /**
     * When the Neotoma session expires, in epoch ms, or null if we don't know.
     *
     * Postgres hands `expiresat` back as an ISO string, so it has to be parsed
     * before comparing against Date.now(). Read it from the session it belongs
     * to — never from state.access_token, which is null on every page load after
     * login (the orcid_token cookie is dropped once validated).
     */
    const sessionExpiry = () => {
        const raw = state.user?.data?.neotoken?.expiresat
        if (!raw) return null
        const parsed = Date.parse(raw)
        return Number.isNaN(parsed) ? null : parsed
    }

    const hasValidTokens = computed(() => {
        if (state.access_token == null && state.user == null) {
            return false
        }

        // The API enforces expiry on every request; this is the local check so the
        // header doesn't advertise a session that's already dead. Sessions minted
        // before the API returned expiresat have no expiry here — those fall back
        // to being caught by the first 401.
        const expiresAt = sessionExpiry()
        if (expiresAt !== null && Date.now() >= expiresAt) {
            console.log('Neotoma session has expired')
            logoutTokens()
            return false
        }

        return true
    })

    const refreshSession = async () => {
        // Skip if there's no active session — nothing to verify
        if (!state.user?.data?.neotoken?.sessionuuid) return null

        try {
            const json = await authedFetchJson('/v2.0/apps/orcids/steward')
            // Update in-memory user state with fresh data from the server
            state.user = {
                ...state.user,
                data: {
                    ...state.user.data,
                    orcid: { name: json.data.name, orcid: json.data.orcid },
                    contactid: json.data.contactid,
                    // /orcids/steward reports the session's current expiry; keep it in
                    // sync so hasValidTokens is checking the server's number.
                    neotoken: { ...state.user.data.neotoken, expiresat: json.data.expiresat },
                },
            }
            return json.data
        } catch (err) {
            // Most likely a 401 — authedFetchJson already cleared the cookie
            console.warn('Session check failed; user logged out.', err.message)
            return null
        }
    }

    return {
        ...toRefs(state),
        fetchTokens,
        logoutTokens,
        hasValidTokens,
        refreshSession,
    }
}
