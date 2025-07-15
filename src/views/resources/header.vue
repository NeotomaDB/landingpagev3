<script setup>
  import Card from 'primevue/card';
  import Menubar from 'primevue/menubar';

  const menuitems = [{label: 'Home', url: './', icon:'pi pi-home'},
                     {label: 'Datasets', url: './datasets', icon: 'pi pi-image'},
                     {label: 'Taxa', url: './taxa', icon: 'pi pi-sitemap'},
                     {label: 'Users', url: './users', icon: 'pi pi-user'},
                     {label: 'Constituent Databases', url: './databases', icon: 'pi pi-database'}]
</script>

<template>
  <Card>
    <template #content>
    <div class="grid">
      <div class="col-2">
        <div class="headermouse"><img src="@/assets/packrat.png" width=185 height=130 alt="Neotoma logo, a packrat."></div>
      </div>
      <div class="col-10">
        <div class="headername" style="text-align:right;">
          <h1>Neotoma Paleoecology Database</h1>
          Dataset Archiving
          <br><a href="https://data.neotomadb.org">https://data.neotomadb.org</a>
        </div>
      </div>
    </div>
  </template>
  </Card>
  <Menubar :model="menuitems" style="border-radius:5px;">
  </Menubar>
</template>

<script>
  export default {
    name: 'LandingPageHeader',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>
