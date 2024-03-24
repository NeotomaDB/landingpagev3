<script setup>
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
</script>
<template>
  <Card>
    <template #content>
      <div class="grid" style="justify-content:space-between;">
        <div class="col-5 flex" style="justify-content:space-evenly;">
        <div style="text-align:left;">
          <img src="@/assets/nsf.png" width="100" height="100" alt="National Science Foundation logo">
        </div>
        <div >
        <!--  <Card class="align-middle" style="text-align:left;padding: left 5px;"> 
            <template #content> 
              <Avatar image="../nsf.png" /> -->
            <br><a href=https://www.nsf.gov/>National Science Foundation</a>
            <br>Directorate for Geosciences
            <br>Division of Earth Sciences
         <!--    </template>
         </Card> -->
        </div>
      </div>
      <div class="col-5 flex" style="justify-content:space-evenly;align-items:center;">
        <div style="text-align:right;">
          <a href=https://earthcube.org>EarthCube</a><br>Integrative Activities<br>National Science Foundation
        </div>
        <div style="text-align:left;">
          <img src="@/assets/logo_earthcube_cube-only_SMALL.png" style="margin-top:10px" width=100 height=100 alt="EarthCube logo.">
        </div>
      </div>
      </div>
    </template>
  </Card>
</template>

<script>
  export default {
    name: 'LandingPageFooter',
    data () {
      return {
        msg: 'Exporting the webpage footer.'
      }
    }
  }
</script>
