<script setup>
  import Card from 'primevue/card';
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
