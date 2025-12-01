<script setup>
import { defineAsyncComponent } from 'vue'
import Card from 'primevue/card';
import Menubar from 'primevue/menubar';

const OrcidLogin = defineAsyncComponent(() =>
  import('./headercomponents/OrcidLogin.vue')
)

const menuitems = [{ label: 'Home', url: '/', icon: 'pi pi-home' },
{ label: 'Datasets', url: '/datasets', icon: 'pi pi-image' },
{ label: 'Taxa', url: '/taxa', icon: 'pi pi-sitemap' },
{ label: 'Users', url: '/users', icon: 'pi pi-user' },
{ label: 'Constituent Databases', url: '/databases', icon: 'pi pi-database' },
{ label: 'Resource Status', url: '/status', icon: 'pi pi-server' }]

</script>


<template>
  <Card role="banner">
    <template #content>
      <div class="header-container">
        <div class="header-logo">
          <img src="@/assets/packrat.png" width="185" height="130" alt="Neotoma logo, a packrat">
        </div>
        <div class="header-info">
          <h1>Neotoma Paleoecology Database</h1>
          <p class="header-subtitle">Dataset Archiving</p>
          <a href="https://data.neotomadb.org" class="header-link">
            https://data.neotomadb.org
          </a>
        </div>
      </div>
      <div class="header-login">
        <OrcidLogin />
      </div>
    </template>
  </Card>
  <Menubar :model="menuitems" class="main-menu" />
</template>

<style scoped>
.header-container {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: center;
}

.header-logo {
  display: flex;
  align-items: center;
}

.header-info {
  text-align: right;
}

.header-info h1 {
  margin: 0 0 0.5rem 0;
}

.header-subtitle {
  margin: 0.25rem 0;
}

.header-link {
  color: var(--primary-color);
  text-decoration: none;
}

.header-link:hover {
  text-decoration: underline;
}

.header-login {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.main-menu {
  border-radius: 5px;
  margin-top: 0.5rem;
}
</style>