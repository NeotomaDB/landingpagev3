import { createRouter, createWebHistory } from 'vue-router'

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

function removeORCIDHash(to) {
    try {
        console.log('🔑 Router guard processing hash:', to.hash);
        
        if (!to.hash || !to.hash.includes('access_token')) {
            console.warn('⚠️ No ORCID token found in hash');
            return { path: '/users', query: to.query, hash: '' };
        }

        let hash = to.hash.replace(/#/g, '').split('&');
        let hash_return = {};
        
        hash.forEach((item) => {
            const [key, value] = item.split('=');
            if (key && value) {
                hash_return[key] = decodeURIComponent(value);
            }
        });
        
        if (!hash_return.access_token) {
            console.error('💥 No access_token found in ORCID response');
            return { path: '/users', query: to.query, hash: '' };
        }
        
        // Add expiration timestamp
        if (hash_return.expires_in) {
            hash_return.expires_at = Date.now() + (parseInt(hash_return.expires_in) * 1000);
        }
        
        // Store the token object
        let hash_object = JSON.stringify(hash_return);
        localStorage.setItem('neotoma_orcid', hash_object);
        
        console.log('✅ ORCID tokens stored successfully');
        console.log('📦 Stored data:', hash_object);
        
        return { path: '/users', query: to.query, hash: '' };
        
    } catch (error) {
        console.error('💥 Error processing ORCID hash:', error);
        return { path: '/users', query: to.query, hash: '' };
    }
}