import { createRouter, createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies'

import EmptyPage from "@/views/emptypage.vue"
import Taxa from "@/views/pages/taxa.vue"
import TaxaWelcome from "@/views/taxawelcome.vue"
import Dataset from "@/views/pages/dataset.vue"
import Database from "@/views/database.vue"
import DatabaseSelect from "@/views/dbSummary.vue"
import UserPage from "@/views/userpage.vue"
import landingStatus from "@/views/pages/landingstatus.vue"

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    {
      path: "/",
      name: "EmptyPage",
      component: EmptyPage,
    },
    {
      path: '/taxa/:taxonid',
      name: "Taxa",
      component: Taxa,
    },
    {
      path: '/datasets/:datasetid',
      name: "DatasetFull",
      component: Dataset,
    },
    {
      path: '/:datasetid',
      name: "Dataset",
      component: Dataset,
  },
  {
    path: '/taxa',
    name: "TaxaWelcome",
    component: TaxaWelcome,
  },
  {
      path: "/databases/:databaseid",
      name: "Database",
      component: Database,
  },
  {
    path: "/databases",
    name: "DatabaseSelect",
    component: DatabaseSelect,
  },
  { 
    path: "/users/:contactid",
    component: UserPage,
    name: "Specific User Profile",
  },
  {
    path: "/users",
    component: UserPage,
    name: "User Profile",
  },
  { 
    path: "/login",
    component: EmptyPage,
    name: "Login redirect from Orcid.",
    beforeEnter: [removeORCIDHash],
  },
  {
    path: "/status",
    component: landingStatus,
    name: "Web Services Status",
  },  
  ]
  }, 
)


/**
 * Remove the terminating hash on return from ORCID Login.
 * 
 * @description This function takes in the router information from the URL and processes it
 * so that we get the `access_token` passed by ORCID. This access token is made up of
 * several components that are URL encoded. These include:
 * [access_token, token_type, expires_in, tokenVersion, persistent, id_token, tokenId]
 * If it is a bearer token (it should be), we can then pass the token to the Neotoma API
 * for validation.  The validation should then pass back a Neotoma token that is stored
 * as a local cookie and can be repeatedly checked by the Neotoma API.
 * 
 * @param {any} to
 * @returns {any}
 */

function removeORCIDHash(to) {
  try {
        console.log('🔑 Router guard processing hash:', to.hash);
        
        if (!to.hash || !to.hash.includes('access_token')) {
            // The hash in the URL is improperly formed, or does not exist.
            console.warn('⚠️ No ORCID token found in hash');
            VueCookies.remove("orcid_token")

            return { path: '/users', query: to.query, hash: '' };
        }

        let hash = to.hash.replace(/#/g, '').split('&');
        let hash_return = {};
        
        // Take the array and fill the `hash_return` object so we have a key:value set.
        hash.forEach((item) => {
            const [key, value] = item.split('=');
            if (key && value) {
                hash_return[key] = decodeURIComponent(value);
            }
        });
        
        // Checking again that we do indeed have the access_token. This is backup
        // for the initial `if` statement, just incase the `forEach()` causes an error.
        if (!hash_return.access_token) {
            console.error('💥 No access_token found in ORCID response');
            VueCookies.remove("orcid_token")
            return { path: '/users', query: to.query, hash: '' };
        }
        
        // Store the token object
        let hash_object = JSON.stringify(hash_return);
        VueCookies.set("orcid_token", hash_object)
        VueCookies.set('orcid_bearer_token', hash_object);
        
        console.log('✅ ORCID tokens stored successfully');
        console.log('📦 Stored data:', hash_object);
        
        return { path: '/users', query: to.query, hash: '' };
        
    } catch (error) {
        console.error('💥 Error processing ORCID hash:', error);
        VueCookies.remove("orcid_token")
        return { path: '/users', query: to.query, hash: '' };
    }
}