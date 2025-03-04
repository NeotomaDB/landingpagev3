import { createRouter, createWebHistory } from 'vue-router'
import EmptyPage from "@/views/emptypage.vue"
import PageNotFound from "@/views/pagenotfound.vue"
import Taxa from "@/views/taxa.vue"
import Dataset from "@/views/dataset.vue"
import Database from "@/views/database.vue"
import DatabaseSelect from "@/views/dbSummary.vue"

const routes = [
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
        path: "/database/:databaseid",
        name: "Database",
        component: Database,
    },
    {
      path: "/database",
      name: "DatabaseSelect",
      component: DatabaseSelect,
  }, 
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
