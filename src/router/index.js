import { createRouter, createWebHistory } from 'vue-router'

import EmptyPage from "@/views/emptypage.vue"
import Taxa from "@/views/taxa.vue"
import TaxaWelcome from "@/views/taxawelcome.vue"
import Dataset from "@/views/dataset.vue"
import Database from "@/views/database.vue"
import DatabaseSelect from "@/views/dbSummary.vue"
import UserPage from "@/views/userpage.vue"

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
      path: "/database/:databaseid",
      name: "Database",
      component: Database,
  },
  {
    path: "/database",
    name: "DatabaseSelect",
    component: DatabaseSelect,
  },
  { 
    path: "/user/:contactid",
    component: UserPage,
    name: "User Profile",
  },
  { 
    path: "/login",
    component: EmptyPage,
    name: "Login redirect from Orcid.",
    beforeEnter: [removeORCIDHash],
  },
  ]
  }, 
)

function removeORCIDHash(to) {
  let hash = to.hash.replace(/#/g, '').split('&')
  let hash_return = {}
  hash.forEach((item => {
    hash_return[item.split('=')[0]] = item.split('=')[1] 
  }))
  // Note: I need to actually make sure we're getting an ORCID thing.
  let hash_object = JSON.stringify(hash_return)
  localStorage.setItem('neotoma_orcid', hash_object)
  return { path: '/user', query: to.query, hash: '' }
}